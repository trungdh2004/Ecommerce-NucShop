import { Response } from "express";
import { RequestModel } from "../../interface/models";
import UserModel from "../../models/User.Schema";
import STATUS from "../../utils/status";
import { formatDataPaging } from "../../common/pagingData";

class UserAdmin {
  async listCurrentUsers(req: RequestModel, res: Response) {
    try {
      const {
        pageIndex = 1,
        pageSize,
        fieldSort,
        sort = -1,
        keyword,
        provider,
        tab = 1,
      } = req.body;
      const user = req.user;
      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;

      let pipeline: any[] = [];
      // search
      if (keyword) {
        pipeline.push({
          $match: {
            full_name: { $regex: keyword, $options: "i" },
          },
        });
      }

      if (provider) {
        pipeline.push({
          $match: {
            provider: provider,
          },
        });
      }
      // skip
      // pipeline.push({ $skip: skip }, { $limit: limit });
      // sắp xếp
      if (fieldSort) {
        pipeline.push({
          $sort: { [fieldSort]: sort },
        });
      } else {
        pipeline.push({
          $sort: { createdAt: sort },
        });
      }

      if (tab === 1) {
        pipeline.push({
          $match: {
            blocked_at: false,
          },
        });
      } else if (tab === 2) {
        pipeline.push({
          $match: {
            blocked_at: true,
          },
        });
      }

      pipeline.push({
        $project: {
          _id: 1, // Loại bỏ trường _id
          full_name: 1, // Trường name
          email: 1, // Trường age
          provider: 1, // Trường email
          avatarUrl: 1, // Trường email
          is_admin: 1, // Trường email
          is_staff: 1, // Tr
          blocked_at: 1, // Trường email
          createdAt: 1, // Trường email
        },
      });

      const countDocuments = await UserModel.aggregate([
        ...pipeline,
        {
          $count: "total",
        },
      ]);

      const listUser = await UserModel.aggregate(pipeline)
        .collation({
          locale: "en_US",
          strength: 1,
        })
        .skip(skip)
        .limit(limit);

      const data = formatDataPaging({
        limit,
        pageIndex,
        data: listUser,
        count: countDocuments[0]?.total || 0,
      });

      return res.status(STATUS.OK).json(data);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async updateRole(req: RequestModel, res: Response) {
    try {
      const user = req.user;

      const { id } = req.params;
      const { role } = req.body;

      if (!user?.is_admin) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn không có quyền",
        });
      }

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Truyền thiếu dữ liệu",
        });
      }

      const existingUser = await UserModel.findById(id);

      if (!existingUser) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có tài khoản",
        });
      }

      if (existingUser.is_admin) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn không có quyền",
        });
      }

      let queryBody = {};

      if (role === 2) {
        queryBody = {
          is_staff: true,
        };
      } else if (role === 3) {
        queryBody = {
          is_admin: true,
        };
      } else {
        queryBody = {
          is_admin: false,
          is_staff: false,
        };
      }

      const updateUser = await UserModel.findByIdAndUpdate(id, queryBody);

      return res.status(STATUS.OK).json({
        message: "Bạn không có quyền",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async pagingStaff(req: RequestModel, res: Response) {
    try {
      const { pageIndex = 1, pageSize, keyword } = req.body;

      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;

      let queryKeyword = keyword
        ? {
          full_name: {
              $regex: keyword,
              $options: "i",
            },
          }
        : {};

      const listUser = await UserModel.find({
        ...queryKeyword,
        is_staff:true
      }).sort({
        createdAt:-1
      }).skip(skip).limit(limit);

      const count = await UserModel.countDocuments({is_staff:true})

      const result = formatDataPaging({
        limit,
        pageIndex,
        data: listUser,
        count: count,
      });

      return res.status(STATUS.OK).json(result);

    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getAdminCurrentById(req: RequestModel, res: Response) {}
}

export default new UserAdmin();
