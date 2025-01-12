import { Response } from "express";
import { RequestModel } from "../interface/models";
import CustomerModel from "../models/Customer.schema";
import { formatDataPaging } from "../common/pagingData";
import STATUS from "../utils/status";

class CustomerController {
  async pagingCustomer(req: RequestModel, res: Response) {
    try {
      const { sort = -1, pageIndex, pageSize } = req.body;
      const limit = pageSize || 10;
      const skip = (pageIndex - 1) * limit || 0;

      const listCustomer = await CustomerModel.find()
        .populate({
          path: "user",
          select: {
            email: 1,
            _id: 1,
            full_name: 1,
            avatarUrl: 1,
          },
        })
        .sort({
          totalMoney: sort,
          createdAt: sort,
        })
        .skip(skip)
        .limit(limit);

      const countCustomer = await CustomerModel.countDocuments();

      const data = formatDataPaging({
        limit,
        pageIndex,
        data: listCustomer,
        count: countCustomer,
      });

      return res.status(STATUS.OK).json(data);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async updateRanks(req: RequestModel, res: Response) {
    try {
      const { rank } = req.body;
      const { id } = req.params;

      if (!id || rank < 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Nhập thiếu dữ liệu",
        });
      }

      if (!rank && rank !== 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Nhập thiếu dữ liệu",
        });
      }

      const existingCustomer = await CustomerModel.findById(id);

      if (!existingCustomer) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có khách hàng",
        });
      }

      const updateCustomer = await CustomerModel.findByIdAndUpdate(
        id,
        {
          rank: rank,
        },
        { new: true }
      );

      return res.status(STATUS.OK).json({
        message: "cập nhập thành công",
        data: updateCustomer,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new CustomerController();
