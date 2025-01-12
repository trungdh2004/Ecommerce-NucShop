import { Response } from "express";
import { formatDataPaging } from "../../common/pagingData";
import { RequestModel, RequestShipper } from "../../interface/models";
import CustomerModel from "../../models/Customer.schema";
import OrderModel from "../../models/order/Order.schema";
import OrderItemsModel from "../../models/order/OrderProduct.schema";
import ProductModel from "../../models/products/Product.schema";
import ShipperModel from "../../models/shipper/Shipper.schema";
import UserModel from "../../models/User.Schema";
import { socketNotificationOrderClient } from "../../socket/socketNotifycationClient.service";
import STATUS from "../../utils/status";
import { IOrderItem } from "./../../interface/order";
import { socketNotificationAdmin } from "../../socket/socketNotifycationServer.service";
import { TYPE_NOTIFICATION_ADMIN } from "../../config/typeNotification";

class ShipperController {
  async registerShipper(req: RequestModel, res: Response) {
    try {
      const user = req.user;

      const {
        fullName,
        birthDate,
        address,
        idCitizen,
        avatar,
        phone,
        city,
        district,
        commune,
      } = req.body;

      if (!fullName || !birthDate || !address || !idCitizen || !avatar) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa nhập đủ dữ liệu",
        });
      }

      const existingShipper = await ShipperModel.findOne({
        user: user?.id,
      });

      if (existingShipper) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Tài khoản đã được đăng kí",
        });
      }

      const createShipper = await ShipperModel.create({
        fullName,
        birthDate,
        address,
        idCitizen,
        avatar,
        phone,
        city,
        district,
        commune,
        user: user?.id,
      });

      return res.status(STATUS.OK).json({
        message: "Đăng kí tài khoản thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async pagingShipper(req: RequestModel, res: Response) {
    try {
      const { pageSize, pageIndex, active, isBlock, keyword, tab } = req.body;

      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;
      let queryKeyword = keyword
        ? {
            fullName: {
              $regex: keyword,
              $options: "i",
            },
          }
        : {};
      let queryActive = {};
      let queryIsBlock = {};

      if (typeof active === "boolean") {
        queryActive = {
          active: active,
        };
      }

      if (typeof isBlock === "boolean") {
        queryIsBlock = {
          is_block: isBlock,
        };
      }
      if (tab) {
        queryActive = {
          active: tab === 1,
        };
      }
      const listData = await ShipperModel.find({
        ...queryKeyword,
        ...queryActive,
        ...queryIsBlock,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user");

      const countShipper = await ShipperModel.countDocuments({
        ...queryKeyword,
        ...queryActive,
        ...queryIsBlock,
      });

      const result = formatDataPaging({
        limit,
        pageIndex,
        data: listData,
        count: countShipper,
      });

      return res.status(STATUS.OK).json(result);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async checkUserAccount(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const existingShipper = await ShipperModel.findOne({
        user: user?.id,
      });

      if (existingShipper) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Tài khoản đã được đăng kí",
          active: true,
        });
      }

      return res.status(STATUS.OK).json({
        active: false,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getByCurrentShipper(req: RequestModel, res: Response) {
    try {
      const user = req.user;

      const existingShipper = await ShipperModel.findOne({
        user: user?.id,
      });

      if (!existingShipper) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Tài khoản chưa đăng kí",
          type: 1,
        });
      }

      if (!existingShipper?.active) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Tài khoản chưa được chấp nhập",
          type: 2,
        });
      }

      if (existingShipper?.is_block) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Tài khoản shipper của bạn đã bị cấm",
          type: 3,
        });
      }

      return res.status(STATUS.OK).json({
        message: "Lấy thông tin thành công",
        current: existingShipper,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getShipperById(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn shipper",
        });
      }

      const existingShipper = await ShipperModel.findById(id);

      if (!existingShipper) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có shipper nào",
        });
      }

      return res.status(STATUS.OK).json({
        message: "Lấy thông tin thành công",
        data: existingShipper,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getListOrderShipperMap(req: RequestShipper, res: Response) {
    try {
      const shipper = req.shipper;

      const listOrder = await OrderModel.find({
        shipper: shipper?.id,
        status: {
          $in: [2, 3],
        },
      }).select({
        code: 1,
        address: 1,
        _id: 1,
        status: 1,
        totalMoney: 1,
        amountToPay: 1,
        shippingCost: 1,
        orderItems: 1,
        note: 1,
      });

      return res.status(STATUS.OK).json(listOrder);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async actionListShipper(req: RequestModel, res: Response) {
    try {
      const { listId = [], type = 1, isBlock } = req.body;

      if (listId.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn shipper",
        });
      }

      const findListShipper = await ShipperModel.find({
        _id: {
          $in: listId,
        },
      });

      if (findListShipper.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có shipper nào",
        });
      }

      const listUser = findListShipper.map((shipper) => shipper.user);
      const payloadUpdate: {
        [key: string]: any;
      } = {};
      if (isBlock) {
        payloadUpdate.is_block = type === 1 ? true : false;
        payloadUpdate.block_at = type === 1 ? new Date().toISOString() : null;
      } else {
        payloadUpdate.active = type === 1 ? true : false;
      }
      const updateListShipper = await ShipperModel.updateMany(
        {
          _id: {
            $in: listId,
          },
        },
        payloadUpdate
      );
      if (!isBlock) {
        const updateUser = await UserModel.updateMany(
          {
            _id: {
              $in: [...listUser],
            },
          },
          {
            is_shipper: type === 1 ? true : false,
          }
        );
      }
      return res.status(STATUS.OK).json({
        message: "Cập nhập thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async shipperDetailAdmin(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn shipper",
        });
      }

      const existingShipper = await ShipperModel.findById(id).populate({
        path: "user",
        select: {
          _id: 1,
          fullName: 1,
          email: 1,
          point: 1,
          avatarUrl: 1,
        },
      });

      if (!existingShipper)
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ message: "Không có shipper nào" });

      const countOrderConfirm = await OrderModel.countDocuments({
        status: 2,
        shipper: id,
      });
      const countOrderRunning = await OrderModel.countDocuments({
        status: 3,
        shipper: id,
      });
      const countOrderSuccess = await OrderModel.countDocuments({
        status: {
          $in: [4, 5],
        },
        shipper: id,
      });
      const countOrderCancel = await OrderModel.countDocuments({
        status: 6,
        shipper: id,
      });

      return res.status(STATUS.OK).json({
        message: "Lấy thông tin thành công",
        shipper: existingShipper,
        countOrderConfirm,
        countOrderRunning,
        countOrderSuccess,
        countOrderCancel,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  //query get order by code
  async getOrderByCode(req: RequestShipper, res: Response) {
    try {
      const { code } = req.params;
      const shipper = req.shipper;

      if (!code)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa chọn đơn hàng",
        });

      const listOrder = await OrderModel.findOne({
        code: code,
        shipper: shipper?.id,
        status: {
          $in: [2, 3],
        },
      }).populate([
        {
          path: "orderItems",
          populate: {
            path: "product",
          },
        },
      ]);

      if (!listOrder) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có đơn hàng nào",
        });
      }

      return res.status(STATUS.OK).json({
        data: listOrder,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  // update status 2 -> 3
  async updateStatusShippingOrder(req: RequestShipper, res: Response) {
    try {
      const { id } = req.params;
      const shipper = req.shipper;

      if (!shipper) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn không phải là shipper",
        });
      }

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa nhập giá trị",
        });
      }

      const existingOrder = await OrderModel.findById(id).populate(
        "orderItems"
      );

      if (!existingOrder)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có đơn hàng",
        });

      if (existingOrder.shipper.toString() !== shipper?.id.toString()) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đơn hàng này không phải của bạn",
        });
      }

      const updateOrder = await OrderModel.findByIdAndUpdate(
        id,
        {
          status: 3,
          $push: {
            statusList: 3,
            informationOrder: {
              name: "Đơn hàng đang vận chuyển",
              date: Date.now(),
              content: `Đơn hàng mã ${existingOrder.code} đang đã được vận chuyển`,
            },
          },
          shippingDate: Date.now(),
        },
        { new: true }
      );

      existingOrder?.orderItems?.map(async (item) => {
        await OrderItemsModel.findByIdAndUpdate((item as IOrderItem)._id, {
          status: 3,
        });
      });

      socketNotificationOrderClient(
        updateOrder?.code as string,
        3,
        `${updateOrder?.user}`,
        updateOrder?._id as string
      );

      return res.status(STATUS.OK).json({
        message: "Cập nhập đơn hàng đang giao",
        data: updateOrder,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
  // update status 3 -> 4
  async updateStatusShippedOrder(req: RequestShipper, res: Response) {
    try {
      const { id } = req.params;
      const shipper = req.shipper;

      if (!shipper) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn không phải là shipper",
        });
      }

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa nhập giá trị",
        });
      }

      const existingOrder = await OrderModel.findById(id).populate(
        "orderItems"
      );

      if (!existingOrder)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có đơn hàng",
        });

      if (existingOrder.shipper.toString() !== shipper?.id.toString()) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn không có quyền đơn hàng này",
        });
      }

      const updateOrder = await OrderModel.findByIdAndUpdate(
        id,
        {
          status: 4,
          $push: {
            statusList: 4,
            informationOrder: {
              name: "Đơn hàng đã giao thành công",
              date: Date.now(),
              content: `Đơn hàng mã ${existingOrder.code} đã được giao thành công`,
            },
          },
          shippedDate: Date.now(),
        },
        { new: true }
      );

      existingOrder?.orderItems?.map(async (item) => {
        const product = (item as IOrderItem).product;
        const quantity = (item as IOrderItem).quantity;

        await ProductModel.findByIdAndUpdate(product, {
          $inc: { quantitySold: +quantity },
        });
        await OrderItemsModel.findByIdAndUpdate((item as IOrderItem)._id, {
          status: 4,
        });
      });

      const customer = await CustomerModel.findOne({
        user: updateOrder?.user,
      });

      if (customer) {
        await CustomerModel.findByIdAndUpdate(customer._id, {
          $inc: {
            totalOrder: 1,
            totalOrderSuccess: 1,
            totalProductSuccess: existingOrder?.orderItems?.length,
            totalMoney: existingOrder?.totalMoney,
          },
        });
      } else {
        await CustomerModel.create({
          user: updateOrder?.user,
          totalOrder: 1,
          totalOrderSuccess: 1,
          totalProductSuccess: existingOrder?.orderItems?.length,
          totalMoney: existingOrder?.totalMoney,
        });
      }

      socketNotificationOrderClient(
        updateOrder?.code as string,
        4,
        `${updateOrder?.user}`,
        updateOrder?._id as string
      );

      return res.status(STATUS.OK).json({
        message: "Cập nhập đơn hàng giao thành công",
        // data: updateOrder,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  // lấy tất cả đơn đã giao
  async getListOrderSuccessShipper(req: RequestShipper, res: Response) {
    try {
      const shipper = req.shipper;
      const { pageSize = 1, pageIndex } = req.body;
      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;
      const listOrder = await OrderModel.find({
        shipper: shipper?.id,
        statusList: {
          $in: 4,
        },
      })
        .skip(skip)
        .limit(limit)
        .populate("orderItems");

      const count = await OrderModel.countDocuments({
        shipper: shipper?.id,
        statusList: {
          $in: 4,
        },
      });

      const data = formatDataPaging({
        pageIndex: pageSize,
        limit,
        count,
        data: listOrder,
      });

      return res.status(STATUS.OK).json({
        ...data,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async pagingOrderShipper(req: RequestShipper, res: Response) {
    try {
      const shipper = req.shipper;
      const pageIndex = Number(req.query.page) || 1;
      const { status = 2 } = req.body;

      let limit = 10;
      let skip = (pageIndex - 1) * limit || 0;

      let queryStatus = {};

      if (status === 4) {
        queryStatus = {
          statusList: {
            $in: [4],
          },
        };
      } else {
        queryStatus = {
          status: status,
        };
      }

      const listOrder = await OrderModel.find({
        ...queryStatus,
        shipper: shipper?.id,
      })
        .sort({ confirmedDate: -1 })
        .skip(skip)
        .limit(limit);

      const count = await OrderModel.countDocuments({
        shipper: shipper?.id,
        ...queryStatus,
      });

      const result = formatDataPaging({
        limit,
        pageIndex,
        data: listOrder,
        count: count,
      });

      return res.status(STATUS.OK).json(result);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async pagingOrderShipperAdmin(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const { status = 2, pageIndex, pageSize } = req.body;

      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;

      let queryStatus = {};

      if (status === 4) {
        queryStatus = {
          statusList: {
            $in: [4, 5],
          },
        };
      } else {
        queryStatus = {
          status: status,
        };
      }

      const existingShipper = await ShipperModel.findById(id);

      if (!existingShipper) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có shipper",
        });
      }

      const listOrder = await OrderModel.find({
        ...queryStatus,
        shipper: id,
      })
        .sort({ confirmedDate: -1 })
        .skip(skip)
        .limit(limit);

      const count = await OrderModel.countDocuments({
        ...queryStatus,
        shipper: id,
      });

      const result = formatDataPaging({
        limit,
        pageIndex,
        data: listOrder,
        count: count,
      });

      return res.status(STATUS.OK).json(result);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async changeAccountShipper(req: RequestShipper, res: Response) {
    try {
      const {
        fullName,
        birthDate,
        address,
        idCitizen,
        avatar,
        phone,
        city,
        district,
        commune,
      } = req.body;

      const shipper = req.shipper;

      const existingShipper = await ShipperModel.findById(shipper?.id);

      if (!existingShipper) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có shipper",
        });
      }

      const updateShiper = await ShipperModel.findByIdAndUpdate(
        shipper?.id,
        {
          fullName,
          birthDate,
          address,
          idCitizen,
          avatar,
          phone,
          city,
          district,
          commune,
        },
        { new: true }
      );

      return res.status(STATUS.OK).json({
        message: "Cập nhập thành công",
        data: updateShiper,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error?.message,
      });
    }
  }
  async getListOrderIsShipper(req: RequestShipper, res: Response) {
    try {
      const shipper = req.shipper;
      const { pageSize, pageIndex } = req.body;
      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;
      const listOrder = await OrderModel.find({
        status: 2,
        is_shipper: true,
        shipper: null,
      })
        .skip(skip)
        .limit(limit)
        .select("-informationOrder");

      const count = await OrderModel.countDocuments({
        status: 2,
        is_shipper: true,
        shipper: null,
      });

      const data = formatDataPaging({
        pageIndex: pageSize,
        limit,
        count,
        data: listOrder,
      });

      return res.status(STATUS.OK).json({
        ...data,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async refuseOrderShipper(req: RequestShipper, res: Response) {
    try {
      const { id } = req.params;
      const shipper = req.shipper;

      if (!shipper) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn không phải là shipper",
        });
      }

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa nhập giá trị",
        });
      }

      const existingOrder = await OrderModel.findById(id).populate(
        "orderItems"
      );

      if (!existingOrder)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có đơn hàng",
        });

      if (existingOrder.shipper.toString() !== shipper?.id.toString()) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đơn hàng này không phải của bạn",
        });
      }

      if (existingOrder.status !== 2) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đơn hàng này không không thể hủy giao",
        });
      }
      const updateOrder = await OrderModel.findByIdAndUpdate(
        id,
        {
          status: 2,
          $push: {
            informationOrder: {
              name: "Từ chối giao hàng",
              date: Date.now(),
              content: `Nhân viên ${shipper.fullName} đã từ chối giao hàng`,
            },
          },
          shipper: null,
        },
        { new: true }
      );

      socketNotificationAdmin(
        `<p>Đơn hàng: <span style="color:blue;font-weight:500;">${existingOrder.code}</span> đã bị từ chối giao bởi ${shipper.fullName}</p>`,
        TYPE_NOTIFICATION_ADMIN.ORDER,
        existingOrder._id
      );

      return res.status(STATUS.OK).json({
        message: "Cập nhập đơn thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async confirmOrderShipper(req: RequestShipper, res: Response) {
    try {
      const { id } = req.params;
      const shipper = req.shipper;

      if (!shipper) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn không phải là shipper",
        });
      }

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa nhập giá trị",
        });
      }

      const existingOrder = await OrderModel.findById(id);

      if (!existingOrder)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có đơn hàng",
        });

      if (existingOrder.shipper) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đơn hàng này đã có người khác giao",
        });
      }
      const updateOrder = await OrderModel.findByIdAndUpdate(
        id,
        {
          $push: {
            informationOrder: {
              name: "Nhận giao hàng",
              date: Date.now(),
              content: `Nhân viên ${shipper?.fullName} đã nhận giao hàng`,
            },
          },
          shipper: shipper?.id,
        },
        { new: true }
      );

      socketNotificationAdmin(
        `<p>Đơn hàng: <span style="color:blue;font-weight:500;">${existingOrder.code}</span> đã nhận giao bởi ${shipper.fullName}</p>`,
        TYPE_NOTIFICATION_ADMIN.ORDER,
        existingOrder._id
      );

      return res.status(STATUS.OK).json({
        message: "Cập nhập đơn thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new ShipperController();
