import { Response } from "express";
import { RequestModel } from "../../interface/models";
import PaymentModel from "../../models/order/Payment.schema";
import { formatDataPaging } from "../../common/pagingData";
import STATUS from "../../utils/status";

class PaymentController {
  async pagingClient(req: RequestModel, res: Response) {
    try {
      const { pageIndex = 1, pageSize } = req.body;
      const limit = pageSize || 20;
      const skip = (pageIndex - 1) * limit;
      const user = req.user;

      const listPayment = await PaymentModel.find({
        user: user?.id,
      })
        .skip(skip)
        .limit(limit)
        .sort({
          createdAt: -1,
        });

      const countPayment = await PaymentModel.countDocuments({
        user: user?.id,
      });

      const data = formatDataPaging({
        limit,
        pageIndex,
        data: listPayment,
        count: countPayment,
      });

      return res.status(STATUS.OK).json(data);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        error: error.message,
      });
    }
  }

  async pagingAdmin(req: RequestModel, res: Response) {
    try {
      const { pageIndex = 1, pageSize, keyword, startDate, endDate } = req.body;
      const limit = pageSize || 10;
      const skip = (pageIndex - 1) * limit;
      let queryKeyword = keyword
        ? {
            codeOrder: {
              $regex: keyword,
              $options: "i",
            },
          }
        : {};
      let queryDate = {};

      if (startDate || endDate) {
        let dateStartString = null;
        let dateEndString = null;
        if (startDate && endDate) {
          dateStartString = new Date(startDate);
          dateEndString = new Date(endDate);
          const startOfDay = new Date(
            dateStartString.getUTCFullYear(),
            dateStartString.getUTCMonth(),
            dateStartString.getUTCDate(),
            0,
            0,
            0
          );
          const endOfDay = new Date(
            dateEndString.getUTCFullYear(),
            dateEndString.getUTCMonth(),
            dateEndString.getUTCDate(),
            23,
            59,
            59
          );
          queryDate = {
            createdAt: {
              $gte: startOfDay, // Lớn hơn hoặc bằng thời gian bắt đầu của ngày đó
              $lt: endOfDay,
            },
          };
        } else if (startDate) {
          dateStartString = new Date(startDate);
          const startOfDay = new Date(
            dateStartString.getUTCFullYear(),
            dateStartString.getUTCMonth(),
            dateStartString.getUTCDate(),
            0,
            0,
            0
          );
          queryDate = {
            createdAt: {
              $gte: startOfDay, // Lớn hơn hoặc bằng thời gian bắt đầu của ngày đó
            },
          };
        } else if (endDate) {
          dateEndString = new Date(endDate);

          const endOfDay = new Date(
            dateEndString.getUTCFullYear(),
            dateEndString.getUTCMonth(),
            dateEndString.getUTCDate(),
            23,
            59,
            59
          );

          queryDate = {
            createdAt: {
              $lte: endOfDay,
            },
          };
        }
      }

      console.log({
        queryKeyword,
      });

      const listPayment = await PaymentModel.find({
        ...queryKeyword,
        ...queryDate,
      })
        .skip(skip)
        .limit(limit)
        .sort({
          createdAt: -1,
        });

      const countPayment = await PaymentModel.countDocuments({
        ...queryKeyword,
        ...queryDate,
      });

      const data = formatDataPaging({
        limit,
        pageIndex,
        data: listPayment,
        count: countPayment,
      });

      return res.status(STATUS.OK).json(data);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        error: error.message,
      });
    }
  }
}

export default new PaymentController();
