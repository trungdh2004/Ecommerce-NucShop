import { Request, Response } from "express";
import STATUS from "../../utils/status";
import ProductComingModel from "../../models/products/ProductComming";
import { formatDataPaging } from "../../common/pagingData";

class ProductComingController {
  async createProduct(req: Request, res: Response) {
    try {
      const { productId, date, active = false } = req.body;

      if (!productId || !date) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Nhập thiếu dữ liệu",
        });
      }

      if (active) {
        await ProductComingModel.updateMany(
          {},
          {
            active: false,
          }
        );
      }

      const newProductComing = await ProductComingModel.create({
        product: productId,
        date: new Date(date),
        active,
      });

      return res.status(STATUS.OK).json({
        productComing: newProductComing,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async pagingProductComing(req: Request, res: Response) {
    try {
      const { pageIndex, pageSize } = req.body;

      const limit = pageSize || 10;
      const skip = (pageIndex - 1) * limit || 0;

      const listProduct = await ProductComingModel.find({})
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "product",
          select: {
            _id: 1,
            name: 1,
            price: 1,
            thumbnail: 1,
            quantity: 1,
            discount: 1,
          },
        });

      const count = await ProductComingModel.countDocuments();

      const data = formatDataPaging({
        limit: limit,
        pageIndex: pageIndex,
        data: listProduct,
        count: count,
      });

      return res.status(STATUS.OK).json(data);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async activeProductComing(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa chọn id",
        });
      }

      const existingProduct = await ProductComingModel.findById(id);

      if (!existingProduct) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có ",
        });
      }

      await ProductComingModel.updateMany(
        {},
        {
          active: false,
        }
      );

      const newUpdate = await ProductComingModel.findByIdAndUpdate(
        id,
        {
          active: true,
        },
        { new: true }
      );

      return res.status(STATUS.OK).json({
        message: "Cập nhập thành công",
        product: newUpdate,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa chọn id",
        });
      }

      const existingProduct = await ProductComingModel.findById(id).populate({
        path: "product",
        select: {
          _id: 1,
          name: 1,
          thumbnail: 1,
          price: 1,
          discount: 1,
        },
      });

      if (!existingProduct) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có ",
        });
      }

      return res.status(STATUS.OK).json({
        product: existingProduct,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async updateComing(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { productId, date, active = false } = req.body;

      if (!id || !productId || !date) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Lỗi thiếu dữ liệu",
        });
      }

      const existingProduct = await ProductComingModel.findById(id);

      if (!existingProduct) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có ",
        });
      }

      if (active) {
        await ProductComingModel.updateMany(
          {},
          {
            active: false,
          }
        );
      }

      const newUpdate = await ProductComingModel.findByIdAndUpdate(id, {
        product: productId,
        date: new Date(date),
        active,
      });

      return res.status(STATUS.OK).json({
        message: "Sửa thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async findByActive(req: Request, res: Response) {
    try {
      const existingProduct = await ProductComingModel.findOne({
        active: true,
      }).populate({
        path: "product",
        select: {
          _id: 1,
          name: 1,
          price: 1,
          thumbnail: 1,
          quantity: 1,
          discount: 1,
          slug: 1,
      },
      });

      if (!existingProduct) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có ",
        });
      }

      return res.status(STATUS.OK).json(existingProduct);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async deleteProductComing(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa chọn id",
        });
      }

      const existingProduct = await ProductComingModel.findById(id);

      if (!existingProduct) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có ",
        });
      }

      await ProductComingModel.findByIdAndDelete(id);

      return res.status(STATUS.OK).json({
        message: "Xóa thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new ProductComingController();
