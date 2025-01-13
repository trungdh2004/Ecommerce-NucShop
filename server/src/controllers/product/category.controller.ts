import { Response } from "express";
import { RequestModel } from "../../interface/models";
import STATUS from "../../utils/status";
import { categoryValidation } from "../../validation/product.validation";
import { formatDataPaging } from "../../common/pagingData";
import CategoryModel from "../../models/products/Category.schema";
import ProductModel from "../../models/products/Product.schema";
import { IAttribute, IColor, IProduct } from "../../interface/product";

interface RowIColor {
  colorId: string;
  colorName: string;
  colorCode: string;
}

class categoryController {
  async addCategory(req: RequestModel, res: Response) {
    try {
      const { error } = categoryValidation.validate(req.body);
      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }
      const { name, description,thumbnail } = req.body;

      const newCategory = await CategoryModel.create({
        name,
        description,
        thumbnail
      });
      return res.status(STATUS.OK).json({
        message: "Tạo loại thành công",
        data: newCategory,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async pagingCategory(req: RequestModel, res: Response) {
    try {
      const { pageIndex = 1, pageSize, keyword, tab = 1 } = req.body;

      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;

      let pipeline: any[] = [];
      // search
      if (keyword) {
        pipeline.push({
          $match: {
            name: { $regex: keyword, $options: "i" },
          },
        });
      }

      if (tab === 1) {
        pipeline.push({
          $match: {
            deleted: false,
          },
        });
      } else if (tab === 2) {
        pipeline.push({
          $match: {
            deleted: true,
          },
        });
      }

      const dataCategory = await CategoryModel.aggregate(pipeline)
        .collation({
          locale: "en_US",
          strength: 1,
        })
        .skip(skip)
        .limit(limit);

      const countCategory = await CategoryModel.aggregate([
        ...pipeline,
        {
          $count: "total",
        },
      ]);

      const result = formatDataPaging({
        limit,
        pageIndex,
        data: dataCategory,
        count: countCategory[0]?.total || 0,
      });

      return res.status(STATUS.OK).json(result);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getAllCategory(req: RequestModel, res: Response) {
    try {
      const { tab = 1 } = req.body;

      const allCategory = await CategoryModel.find({
        deleted: tab === 1 ? false : true,
      });
      return res.status(STATUS.OK).json({
        message: "Lấy giá trị thành công",
        data: allCategory,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getCategoryById(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn Brand",
        });
      }

      const CategoryData = await CategoryModel.findById(id);

      if (!CategoryData) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có loại sản phẩm thỏa mãn",
        });
      }

      return res.status(STATUS.OK).json({
        message: "Lấy giá trị thành công",
        data: CategoryData,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async deleteById(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn loại sản phẩm",
        });
      }

      const CategoryData = await CategoryModel.findById(id);

      if (!CategoryData) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có loại sản phẩm thỏa mãn",
        });
      }

      await CategoryModel.findByIdAndUpdate(
        id,
        {
          deleted: true,
        },
        { new: true }
      );

      return res.status(STATUS.OK).json({
        message: "Xóa thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async updateCategory(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      const { error } = categoryValidation.validate(req.body);

      const {name,description,thumbnail} = req.body;

      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }
      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn Category",
        });
      }

      const CategoryData = await CategoryModel.findById(id);

      if (!CategoryData) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có Category thỏa mãn",
        });
      }

      const newCategory = await CategoryModel.findByIdAndUpdate(id, {
        name,
        description,
        thumbnail
      }, {
        new: true,
      });

      return res.status(STATUS.OK).json({
        message: "Thay đổi thành công",
        data: newCategory,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getCategoryBySlug(req: RequestModel, res: Response) {
    try {
      const { slug } = req.params;

      if (!slug) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn Brand",
        });
      }

      const CategoryData = await CategoryModel.findOne({ slug: slug });

      if (!CategoryData) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có loại sản phẩm thỏa mãn",
        });
      }

      return res.status(STATUS.OK).json({
        message: "Lấy giá trị thành công",
        data: CategoryData,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async unDeleteCategory(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn loại sản phẩm",
        });
      }

      const CategoryData = await CategoryModel.findById(id);

      if (!CategoryData) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có loại sản phẩm thỏa mãn",
        });
      }

      const newCate = await CategoryModel.findByIdAndUpdate(
        id,
        {
          deleted: false,
        },
        { new: true }
      );

      return res.status(STATUS.OK).json({
        message: "Khôi phục thành công",
        data: newCate,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async deleteMany(req: RequestModel, res: Response) {
    try {
      const { listId, type } = req.body;

      if (!listId || listId.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn loại sản phẩm",
        });
      }

      await CategoryModel.find({ _id: { $in: listId } }).select("_id");

      const CategoryData = await CategoryModel.updateMany(
        { _id: { $in: listId } },
        { $set: { deleted: true } },
        { new: true }
      );

      return res.status(STATUS.OK).json({
        message: "Xóa thành công",
      });
    } catch (error: any) {
      console.log("error", error.kind);

      return res.status(STATUS.INTERNAL).json({
        message: error.kind
          ? "Có một sản phẩm không có trong dữ liệu"
          : error.message,
      });
    }
  }

  async unDeleteMany(req: RequestModel, res: Response) {
    try {
      const { listId } = req.body;

      if (!listId || listId.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn loại sản phẩm",
        });
      }

      await CategoryModel.find({ _id: { $in: listId } }).select("_id");

      const CategoryData = await CategoryModel.updateMany(
        { _id: { $in: listId } },
        { $set: { deleted: false } },
        { new: true }
      );

      return res.status(STATUS.OK).json({
        message: "Khôi phục thành công",
      });
    } catch (error: any) {
      console.log("error", error.kind);

      return res.status(STATUS.INTERNAL).json({
        message: error.kind
          ? "Có một sản phẩm không có trong dữ liệu"
          : error.message,
      });
    }
  }

  async getProductByCategory(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const { size = 4 } = req.body;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn loại sản phẩm",
        });
      }

      const existingCategory = await CategoryModel.findById(id);

      if (!existingCategory)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có loại sản phẩm",
        });

      const listProduct = await ProductModel.find<IProduct>({
        category: id,
      })
        .sort({ quantitySold: -1 })
        .limit(size)
        .populate({
          path: "attributes",
          populate: [
            {
              path: "color",
              model: "Color",
            },
            {
              path: "size",
              model: "Size",
            },
          ],
        })
        .lean();

      const listProductAndColor = listProduct?.map((product) => {
        const listColor = (product?.attributes as IAttribute[])?.reduce(
          (acc: RowIColor[], item) => {
            let group = acc.find(
              (g) => g.colorId === (item.color as IColor)?._id
            );

            // Nếu nhóm không tồn tại, tạo nhóm mới
            if (!group) {
              group = {
                colorId: (item.color as IColor)._id as string,
                colorName: (item.color as IColor).name as string,
                colorCode: (item.color as IColor).code as string,
              };
              acc.push(group);
              return acc;
            }
            return acc;
          },
          []
        );

        return {
          ...product,
          listColor,
        };
      });

      return res.status(STATUS.OK).json({
        message: "Lấy thành công",
        data: listProductAndColor,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async activeCategory(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const {active} = req.body

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa truyền id",
        });

      const existingCategory = await CategoryModel.findById(id);

      if (!existingCategory)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có danh mục này",
        });

      const newUpdate = await CategoryModel.findByIdAndUpdate(
        id,
        {
          active: !!active ? true : false,
        },
        { new: true }
      );

      return res.status(STATUS.OK).json({
        message: "Cập nhập thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async listCategoryActive(req: RequestModel, res: Response) {
    try {
      const newUpdate = await CategoryModel.find(
        {
          active: true,
        },
      );

      return res.status(STATUS.OK).json({
        message: "Lấy thành công",
        data:newUpdate
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new categoryController();
