import { Response } from "express";
import { RequestModel } from "../interface/models";
import STATUS from "../utils/status";
import { TagsValidation } from "../validation/blog.validation";
import TagsModel from "../models/Tags.schema";
import { formatDataPaging } from "../common/pagingData";

class TagsController {
  async addTags(req: RequestModel, res: Response) {
    try {
      const { error } = TagsValidation.validate(req.body);
      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }
      const { name, description } = req.body;

      const newTags = await TagsModel.create({
        name,
        description,
      });

      return res.status(STATUS.OK).json({
        message: "Tạo thẻ thành công",
        data: newTags,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
        error: error,
      });
    }
  }

  async pagingTags(req: RequestModel, res: Response) {
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

      const dataTags = await TagsModel.aggregate(pipeline)
        .collation({
          locale: "en_US",
          strength: 1,
        })
        .skip(skip)
        .limit(limit);
      const countTags = await TagsModel.aggregate([
        ...pipeline,
        {
          $count: "total",
        },
      ]);

      const result = formatDataPaging({
        limit,
        pageIndex,
        data: dataTags,
        count: countTags[0]?.total || 0,
      });

      return res.status(STATUS.OK).json(result);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getAllTags(req: RequestModel, res: Response) {
    try {
      const { tab = 1 } = req.body;

      const allTags = await TagsModel.find({
        deleted: tab === 1 ? false : true,
      });
      return res.status(STATUS.OK).json({
        message: "Lấy giá trị thành công",
        data: allTags,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getTagsById(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn thẻ",
        });
      }

      const TagsData = await TagsModel.findById(id);

      if (!TagsData) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có thẻ thỏa mãn",
        });
      }

      return res.status(STATUS.OK).json({
        message: "Lấy giá trị thành công",
        data: TagsData,
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
          message: "Bạn chưa chọn thẻ",
        });
      }

      const tagsData = await TagsModel.findById(id);

      if (!tagsData) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có thẻ thỏa mãn",
        });
      }

      await TagsModel.findByIdAndUpdate(
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

  async UndeleteById(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn thẻ",
        });
      }

      const tagsData = await TagsModel.findById(id);

      if (!tagsData) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có thẻ thỏa mãn",
        });
      }

      await TagsModel.findByIdAndUpdate(
        id,
        {
          deleted: false,
        },
        { new: true }
      );

      return res.status(STATUS.OK).json({
        message: "Khôi phục thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async updateTags(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      const { error } = TagsValidation.validate(req.body);
      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }
      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn thẻ",
        });
      }

      const TagsData = await TagsModel.findById(id);

      if (!TagsData) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có thẻ thỏa mãn",
        });
      }

      const newTags = await TagsModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      return res.status(STATUS.OK).json({
        message: "Thay đổi thành công",
        data: newTags,
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
          message: "Bạn chưa chọn thẻ tag sản phẩm",
        });
      }

      await TagsModel.find({ _id: { $in: listId } }).select("_id");

      const CategoryData = await TagsModel.updateMany(
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
          ? "Có một thẻ tag không có trong dữ liệu"
          : error.message,
      });
    }
  }

  async unDeleteMany(req: RequestModel, res: Response) {
    try {
      const { listId } = req.body;

      if (!listId || listId.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn size sản phẩm",
        });
      }

      await TagsModel.find({ _id: { $in: listId } }).select("_id");

      const CategoryData = await TagsModel.updateMany(
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
          ? "Có một thẻ tag không có trong dữ liệu"
          : error.message,
      });
    }
  }
}

export default new TagsController();
