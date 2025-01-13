import { Response } from "express";
import { RequestModel } from "../../interface/models";
import STATUS from "../../utils/status";
import { colorValidation } from "../../validation/product.validation";
import ColorModel from "../../models/products/Color.schema";
import { formatDataPaging } from "../../common/pagingData";

class ColorController {
  async addColor(req: RequestModel, res: Response) {
    try {
      const { error } = colorValidation.validate(req.body);
      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }
      const { name, code } = req.body;

      const newColor = await ColorModel.create({
        name,
        code,
      });

      return res.status(STATUS.OK).json({
        message: "Tạo màu thành công",
        data: newColor,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async pagingColor(req: RequestModel, res: Response) {
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

      const dataColor = await ColorModel.aggregate(pipeline)
        .collation({
          locale: "en_US",
          strength: 1,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const countColor = await ColorModel.aggregate([
        ...pipeline,
        {
          $count: "total",
        },
      ]);

      const result = formatDataPaging({
        limit,
        pageIndex,
        data: dataColor,
        count: countColor[0]?.total || 0,
      });

      return res.status(STATUS.OK).json(result);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getAllColor(req: RequestModel, res: Response) {
    try {
      const { tab = 1 } = req.body;

      const allCategory = await ColorModel.find({
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

  async getColorById(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn Color",
        });
      }

      const ColorData = await ColorModel.findById(id);

      if (!ColorData) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có Color thỏa mãn",
        });
      }

      return res.status(STATUS.OK).json({
        message: "Lấy giá trị thành công",
        data: ColorData,
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
          message: "Bạn chưa chọn Color",
        });
      }

      const ColorData = await ColorModel.findById(id);

      if (!ColorData) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có Color thỏa mãn",
        });
      }

      await ColorModel.findByIdAndUpdate(
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

  async updateColor(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      const { error } = colorValidation.validate(req.body);
      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }
      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn Color",
        });
      }

      const ColorData = await ColorModel.findById(id);

      if (!ColorData) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có Color thỏa mãn",
        });
      }

      const newColor = await ColorModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      return res.status(STATUS.OK).json({
        message: "Thay đổi thành công",
        data: newColor,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async unDeleteColor(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn loại sản phẩm",
        });
      }

      const CategoryData = await ColorModel.findById(id);

      if (!CategoryData) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có loại sản phẩm thỏa mãn",
        });
      }

      const newCate = await ColorModel.findByIdAndUpdate(
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

  async blockedMany(req: RequestModel, res: Response) {
    try {
      const { listId } = req.body;

      if (!listId || listId.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn màu",
        });
      }

      await ColorModel.find({ _id: { $in: listId } }).select("_id");

      await ColorModel.updateMany(
        { _id: { $in: listId } },
        { $set: { deleted: true } },
        { new: true }
      );

      return res.status(STATUS.OK).json({
        message: "Xóa màu thành công",
      });
    } catch (error: any) {
      console.log("error", error.kind);

      return res.status(STATUS.INTERNAL).json({
        message: error.kind
          ? "Có một người dùng không có trong dữ liệu"
          : error.message,
      });
    }
  }

  async unBlockedMany(req: RequestModel, res: Response) {
    try {
      const { listId } = req.body;

      if (!listId || listId.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn màu",
        });
      }

      await ColorModel.find({ _id: { $in: listId } }).select("_id");

      await ColorModel.updateMany(
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
          ? "Có một người dùng không có trong dữ liệu"
          : error.message,
      });
    }
  }
}

export default new ColorController();
