import { Response } from "express";
import { RequestModel } from "../interface/models";
import NotificationModel from "../models/Notification.schema";
import { formatDataPaging } from "../common/pagingData";
import STATUS from "../utils/status";
import NotificationAdminModel from "../models/NotificationAdmin.schema";

class NotificationController {
  async pagingNotification(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const pageIndex = Number(req.query.page) || 1;
      const beforeQuery = req.query.before;
      let limit = 10;
      let skip = (pageIndex - 1) * limit || 0;

      let queryBefore = {};

      if (beforeQuery) {
        queryBefore = {
          createdAt: {
            $lte: beforeQuery,
          },
        };
      }

      const listNotification = await NotificationModel.find({
        $or: [
          {
            receiver: {
              $in: [user?.id],
            },
            recipientType: "single",
          },
          {
            recipientType: "all",
          },
        ],
        is_delete: false,
        ...queryBefore,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const countNotification = await NotificationModel.countDocuments({
        $or: [
          {
            receiver: {
              $in: [user?.id],
            },
            recipientType: "single",
          },
          {
            recipientType: "all",
          },
        ],
        is_delete: false,
      });

      const countNotificationNotRead = await NotificationModel.countDocuments({
        $or: [
          {
            receiver: {
              $in: [user?.id],
            },
            recipientType: "single",
          },
          {
            recipientType: "all",
          },
        ],
        isRead: false,
        is_delete: false,
      });
      let before = null;

      if (listNotification?.length > 0) {
        before = listNotification[0].createdAt;
      }
      const result = formatDataPaging({
        limit,
        pageIndex,
        data: listNotification,
        count: countNotification,
      });

      return res.status(STATUS.OK).json({
        ...result,
        countNotificationNotRead,
        before,
      });
    } catch (error:any) {
        return res.status(STATUS.INTERNAL).json({
            message:error?.message
        })
    }
  }
  async handleWatched(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;
      const { isRead } = req.body;

      if (!id)
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ message: "Bạn chưa chọn thông báo" });

      if (!user) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ message: "Bạn chưa đăng nhập" });
      }

      const existingNotification = await NotificationModel.findById(id);

      if (!existingNotification)
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ message: "Không có thông báo nào" });

      if (!existingNotification.receiver?.includes(user.id)) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ message: "Bạn không có quyền" });
      }

      const newNotification = await NotificationModel.findByIdAndUpdate(
        id,
        {
          isRead: isRead ? true : false,
        },
        { new: true }
      );

      return res.status(STATUS.OK).json(newNotification);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
  async handleDelete(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!id)
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ message: "Bạn chưa chọn thông báo" });

      if (!user) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ message: "Bạn chưa đăng nhập" });
      }

      const existingNotification = await NotificationModel.findById(id);

      if (!existingNotification)
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ message: "Không có thông báo nào" });

      if (!existingNotification.receiver?.includes(user.id)) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ message: "Bạn không có quyền" });
      }

      const newNotification = await NotificationModel.findByIdAndUpdate(id, {
        is_delete: true,
      });

      return res.status(STATUS.OK).json({
        message: "Xóa thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
  async handleWatchedAll(req: RequestModel, res: Response) {
    try {
      const user = req.user;

      await NotificationModel.updateMany(
        {
          isRead: false,
          receiver: {
            $in: [user?.id],
          },
          is_delete: false,
        },
        {
          isRead: true,
        }
      );

      return res.status(STATUS.OK).json({
        message: "Đã đọc tất cả thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async pagingNotificationAdmin(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const pageIndex = Number(req.query.page) || 1;
      const beforeQuery = req.query.before;

      let limit = 10;
      let skip = (pageIndex - 1) * limit || 0;

      let queryBefore = {};

      if (beforeQuery) {
        queryBefore = {
          createdAt: {
            $lte: beforeQuery,
          },
        };
      }

      const listNotification = await NotificationAdminModel.find({
        ...queryBefore
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const countNotification = await NotificationAdminModel.countDocuments();

      const countNotificationNotRead =
        await NotificationAdminModel.countDocuments({
          readOnly: {
            $nin: [user?.id],
          },
        });

        let before = null;

        if (listNotification?.length > 0) {
          before = listNotification[0].createdAt;
        }

      const result = formatDataPaging({
        limit,
        pageIndex,
        data: listNotification,
        count: countNotification,
      });

      return res.status(STATUS.OK).json({
        ...result,
        countNotificationNotRead,
        before,
      });
    } catch (error:any) {
      return res.status(STATUS.INTERNAL).json({
          message:error?.message
      })
  }
  }

  async handleWatchedAdmin(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;
      const { isRead } = req.body;

      if (!id)
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ message: "Bạn chưa chọn thông báo" });

      if (!user) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ message: "Bạn chưa đăng nhập" });
      }

      const existingNotification = await NotificationAdminModel.findById(id);

      if (!existingNotification)
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ message: "Không có thông báo nào" });

      let queryRead = {};

      if (isRead) {
        queryRead = {
          $push: {
            readOnly: user?.id,
          },
        };
      } else {
        queryRead = {
          $pull: {
            readOnly: user?.id,
          },
        };
      }

      const newNotification = await NotificationAdminModel.findByIdAndUpdate(
        id,
        queryRead,
        { new: true }
      );

      return res.status(STATUS.OK).json(newNotification);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new NotificationController();
