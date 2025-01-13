import { Request, Response } from "express";
import { formatDataPaging } from "../../common/pagingData";
import { RequestModel } from "../../interface/models";
import { IAttribute, IColor, ISize } from "../../interface/product";
import { generateSlugs } from "../../middlewares/generateSlug";
import CartItemModel from "../../models/cart/CartItem.schema";
import AttributeModel from "../../models/products/Attribute.schema";
import ProductModel from "../../models/products/Product.schema";
import STATUS from "../../utils/status";
import { productValidations } from "../../validation/product.validation";

interface RowIColor {
  colorId: string;
  colorName: string;
  list: IAttribute[];
  quantity: number;
  colorCode: string;
}
interface RowISize {
  sizeId: string;
  sizeName: string;
  list: IAttribute[];
  quantity: number;
}

function randomThreeConsecutiveNumbers(a: number) {
  if (a < 4) {
    return 0;
  }
  const start = Math.floor(Math.random() * (a - 4));

  return start;
}

class ProductController {
  async addProduct(req: Request, res: Response) {
    try {
      const { error } = productValidations.validate(req.body);

      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }

      const {
        name,
        price,
        discount,
        description,
        thumbnail,
        category,
        quantitySold,
        images,
        featured,
        attributes = [],
        is_hot,
        is_simple,
        quantity,
      } = req.body;

      if (is_simple) {
        const product = await ProductModel.create({
          name,
          price,
          discount,
          description,
          thumbnail,
          category,
          quantitySold,
          images,
          featured,
          quantity,
          is_hot,
          is_simple,
        });

        return res.status(STATUS.OK).json({
          message: "Tạo thành công",
          data: product,
        });
      }

      const dataAttributes = await AttributeModel.create<IAttribute[]>(
        attributes
      );

      const quantityAttribute = dataAttributes.reduce((acc, item) => {
        return acc + item.quantity;
      }, 0);

      const product = await ProductModel.create({
        name,
        price,
        discount,
        description,
        thumbnail,
        category,
        quantitySold,
        images,
        featured,
        quantity: quantityAttribute,
        attributes: dataAttributes?.map((item) => item._id),
        is_hot,
      });

      return res.status(STATUS.OK).json({
        message: "Tạo thành công",
        data: product,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  // client
  async showProductById(req: RequestModel, res: Response) {
    try {
      const { slug } = req.params;
      if (!slug)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn sản phẩm",
        });

      const product = await ProductModel.findOne({
        slug: slug,
      })
        .populate([
          {
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
          },
          {
            path: "category",
            model: "Category",
            select: {
              _id: 1,
              name: 1,
              description: 1,
            },
          },
        ])
        .lean();

      await ProductModel.findOneAndUpdate(
        {
          slug: slug,
        },
        {
          $inc: {
            viewCount: 1,
          },
        }
      );

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
              list: [item],
              quantity: item.quantity,
              colorCode: (item.color as IColor).code as string,
            };
            acc.push(group);
            return acc;
          }

          // Thêm đối tượng vào nhóm tương ứng
          group.list.push(item);
          group.quantity = group.quantity + item.quantity;
          return acc;
        },
        []
      );

      const listSize = (product?.attributes as IAttribute[])?.reduce(
        (acc: RowISize[], item) => {
          let group = acc.find((g) => g.sizeId === (item.size as ISize)?._id);
          // Nếu nhóm không tồn tại, tạo nhóm mới
          if (!group) {
            group = {
              sizeId: (item.size as ISize)._id as string,
              sizeName: (item.size as ISize).name as string,
              list: [item],
              quantity: item.quantity,
            };
            acc.push(group);
            return acc;
          }

          // Thêm đối tượng vào nhóm tương ứng
          group.list.push(item);
          group.quantity = group.quantity + item.quantity;
          return acc;
        },
        []
      );

      const countProduct = await ProductModel.countDocuments({
        is_deleted: false,
        slug: {
          $ne: slug,
        },
      });

      const random = randomThreeConsecutiveNumbers(countProduct);

      const listProductOther = await ProductModel.find({
        is_deleted: false,
        slug: {
          $ne: slug,
        },
      })
        .skip(random)
        .limit(6)
        .populate([
          {
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
          },
          "category",
        ])
        .exec();

      return res.status(STATUS.OK).json({
        data: {
          ...product,
          listColor,
          listSize,
        },
        listProductOther,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async updateById(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn sản phẩm",
        });
      const { error } = productValidations.validate(req.body);

      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }
      const {
        name,
        price,
        discount,
        description,
        thumbnail,
        category,
        quantitySold,
        images,
        attributes = [],
        is_simple,
        is_hot,
        quantity,
      } = req.body;

      const existingProduct = await ProductModel.findById(id);

      if (!existingProduct)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có sản phẩm thỏa mãn",
        });

      let slugProduct = existingProduct.slug;

      if (
        existingProduct.name.toLocaleLowerCase() !== name.toLocaleLowerCase()
      ) {
        slugProduct = generateSlugs(name);
      }

      if (is_simple) {
        const listAttributeId = existingProduct?.attributes;

        await AttributeModel.deleteMany({
          _id: {
            $in: listAttributeId,
          },
        });

        const product = await ProductModel.findByIdAndUpdate(
          existingProduct._id,
          {
            name,
            price,
            discount,
            description,
            thumbnail,
            category,
            quantitySold,
            images,
            quantity,
            is_hot,
            is_simple,
            attributes,
          }
        );

        if (is_simple !== existingProduct.is_simple) {
          await CartItemModel.deleteMany({
            product: existingProduct._id,
          });
        }
        return res.status(STATUS.OK).json({
          message: "Tạo thành công",
          data: product,
        });
      }

      const listNew = attributes.filter((item: IAttribute) => !item._id);
      const listToId = attributes?.filter((item: IAttribute) => item._id);
      const listToIdDelete =
        existingProduct?.attributes?.filter((item) => {
          const check = listToId?.some(
            (row: IAttribute) => row?._id?.toString() === item?.toString()
          );
          return !check;
        }) || [];
      let dataAttributes = [...listToId.map((item: IAttribute) => item._id)];

      if (listToId.length > 0) {
        const bulkOps = listToId.map((item: IAttribute) => {
          return {
            updateOne: {
              filter: { _id: item._id },
              update: {
                $set: {
                  color: item.color,
                  size: item.size,
                  price: item.price,
                  quantity: item.quantity,
                  discount: item.discount,
                },
              },
              upsert: true,
            },
          };
        });

        await AttributeModel.bulkWrite(bulkOps);
      }

      if (listNew.length > 0) {
        const listNewAttributes = await AttributeModel.create<IAttribute[]>(
          listNew.map((item: IAttribute) => {
            const { _id, ...value } = item;
            return value;
          })
        );
        dataAttributes = [
          ...dataAttributes,
          ...listNewAttributes?.map((item) => item._id),
        ];
      }

      if (listToIdDelete?.length > 0) {
        await AttributeModel.deleteMany({
          _id: { $in: listToIdDelete },
        });
      }

      const quantityAttribute = attributes.reduce(
        (acc: number, item: IAttribute) => {
          return acc + item.quantity;
        },
        0
      );

      const newProduct = await ProductModel.findByIdAndUpdate(
        existingProduct?._id,
        {
          name,
          price,
          discount,
          description,
          thumbnail,
          category,
          quantitySold,
          quantity: is_simple ? quantity : quantityAttribute,
          images,
          attributes: dataAttributes,
          slug: slugProduct,
          is_hot,
          is_simple,
        },
        { new: true }
      ).populate([
        {
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
        },
        {
          path: "category",
          model: "Category",
          select: {
            _id: 1,
            name: 1,
            description: 1,
          },
        },
      ]);

      return res.status(STATUS.OK).json({
        message: "hehe",
        data: newProduct,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
  // admin
  async getProductById(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn sản phẩm",
        });

      const product = await ProductModel.findById(id).populate([
        {
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
        },
        {
          path: "category",
          model: "Category",
          select: {
            _id: 1,
            name: 1,
            description: 1,
          },
        },
      ]);

      if (!product)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có sản phẩm",
        });

      return res.status(STATUS.OK).json({
        data: product,
        message: "Lấy sản phẩm thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async deletedProductById(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn sản phẩm",
        });

      const existingProduct = await ProductModel.findById(id);

      if (!existingProduct)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có sản phẩm nào",
        });

      await ProductModel.findByIdAndUpdate(existingProduct._id, {
        is_deleted: true,
      });

      await CartItemModel.deleteOne({
        product: existingProduct._id,
      });

      return res.status(STATUS.OK).json({
        message: "Ẩn sản phẩm thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async unDeletedProductById(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn sản phẩm",
        });

      const existingProduct = await ProductModel.findById(id);

      if (!existingProduct)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có sản phẩm nào",
        });

      await ProductModel.findByIdAndUpdate(existingProduct._id, {
        is_deleted: false,
      });

      return res.status(STATUS.OK).json({
        message: "Khôi phục sản phẩm thành công",
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
          message: "Bạn chưa chọn sản phẩm",
        });
      }

      await ProductModel.find({ _id: { $in: listId } }).select("_id");

      const CategoryData = await ProductModel.updateMany(
        { _id: { $in: listId } },
        { $set: { is_deleted: true } },
        { new: true }
      );

      await CartItemModel.deleteMany({
        product: {
          $in: listId,
        },
      });

      return res.status(STATUS.OK).json({
        message: "Xóa thành công",
      });
    } catch (error: any) {
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

      await ProductModel.find({ _id: { $in: listId } }).select("_id");

      const CategoryData = await ProductModel.updateMany(
        { _id: { $in: listId } },
        { $set: { is_deleted: false } },
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

  async pagingProduct(req: RequestModel, res: Response) {
    try {
      const {
        pageIndex,
        pageSize,
        keyword,
        color = [],
        size = [],
        sort = -1,
        fieldSort,
        category,
        min,
        max,
        tab,
        rating,
      } = req.body;

      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;
      let queryKeyword = keyword
        ? {
            name: {
              $regex: keyword,
              $options: "i",
            },
          }
        : {};
      let queryAttribute = {};
      let querySort = {};
      let queryCategory = {};
      let queryPrice = {};
      let queryTab = {};
      let queryRating = {};

      if (tab === 2) {
        queryTab = {
          is_deleted: true,
        };
      } else {
        queryTab = {
          is_deleted: false,
        };
      }

      // attribute
      if (color.length > 0 || size.length > 0) {
        let conditions = {};

        if (color.length > 0 && size.length > 0) {
          conditions = {
            $and: [
              {
                size: {
                  $in: size,
                },
              },
              {
                color: {
                  $in: color,
                },
              },
            ],
          };
        } else if (color.length > 0) {
          conditions = { color: color };
        } else if (size.length > 0) {
          conditions = { size: size };
        }
        const listAttributeColor = await AttributeModel.find(conditions);
        const colorAttributeIds = listAttributeColor?.map((attr) => attr._id);
        queryAttribute = {
          attributes: {
            $in: colorAttributeIds,
          },
        };
      }

      // sắp xếp
      if (fieldSort) {
        querySort = {
          [fieldSort]: sort,
        };
      } else {
        querySort = {
          createdAt: sort,
        };
      }

      if (category) {
        queryCategory = {
          category,
        };
      }

      if (min || max) {
        if (min && max) {
          queryPrice = {
            $and: [
              {
                price: {
                  $lte: max,
                },
              },
              {
                price: {
                  $gte: min,
                },
              },
            ],
          };
        } else if (min) {
          queryPrice = {
            price: {
              $gte: min,
            },
          };
        } else if (max) {
          queryPrice = {
            price: {
              $lte: max,
            },
          };
        }
      }

      if (rating) {
        switch (rating) {
          case 5:
            queryRating = {
              rating: {
                $lte: 5,
                $gt: 4,
              },
            };
            break;
          case 4:
            queryRating = {
              rating: {
                $lte: 4,
                $gt: 3,
              },
            };
            break;
          case 3:
            queryRating = {
              rating: {
                $lte: 3,
                $gt: 2,
              },
            };
            break;
          case 2:
            queryRating = {
              rating: {
                $lte: 2,
                $gt: 1,
              },
            };
            break;
          case 1:
            queryRating = {
              rating: {
                $lte: 1,
                $gte: 0,
              },
            };
            break;

          default:
            queryRating = {};
        }
      }

      const listProduct = await ProductModel.find({
        ...queryKeyword,
        ...queryAttribute,
        ...queryCategory,
        ...queryPrice,
        ...queryTab,
        ...queryRating,
      })
        .sort(querySort)
        .skip(skip)
        .limit(limit)
        .populate([
          {
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
          },
          "category",
        ])
        .select("-description -category")
        .exec();

      const countProduct = await ProductModel.countDocuments({
        ...queryKeyword,
        ...queryAttribute,
        ...queryCategory,
        ...queryPrice,
        ...queryTab,
        ...queryRating,
      });

      const result = formatDataPaging({
        limit,
        pageIndex,
        data: listProduct,
        count: countProduct,
      });
      return res.status(STATUS.OK).json(result);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async pagingProductOfVoucher(req: RequestModel, res: Response) {
    try {
      const { pageIndex, keyword } = req.body;
      let limit = 5;
      let skip = (pageIndex - 1) * limit || 0;
      let queryKeyword = keyword
        ? {
            name: {
              $regex: keyword,
              $options: "i",
            },
          }
        : {};

      const listProduct = await ProductModel.find({
        ...queryKeyword,
        is_deleted: false,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select({
          _id: 1,
          name: 1,
          thumbnail: 1,
        })
        .exec();

      const countProduct = await ProductModel.countDocuments({
        ...queryKeyword,
        is_deleted: false,
      });
      const result = formatDataPaging({
        limit,
        pageIndex,
        data: listProduct,
        count: countProduct,
      });
      return res.status(STATUS.OK).json(result);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async listProductHot(req: Request, res: Response) {
    try {
      const limit = 10;

      const listProduct = await ProductModel.find({
        is_hot: true,
      })
        .populate([
          {
            path: "category",
            select: {
              _id: 1,
              name: 1,
            },
          },
          {
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
          },
        ])
        .sort({
          createdAt: -1,
        })
        .skip(0)
        .limit(limit);

      return res.status(STATUS.OK).json({
        listProduct,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new ProductController();
