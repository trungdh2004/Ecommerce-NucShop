import { Response } from "express";
import { RequestModel } from "../interface/models";
import OrderModel from "../models/order/Order.schema";
import ProductModel from "../models/products/Product.schema";
import UserModel from "../models/User.Schema";
import STATUS from "../utils/status";
import { getDateStartAndEnd, getMonthStartAndEnd } from "../common/func";
import OrderItemsModel from "../models/order/OrderProduct.schema";
import BlogsModel from "../models/Blogs.schema";

class DashboardController {
  async getCountTotalDashboard(req: RequestModel, res: Response) {
    try {
      const userCount = await UserModel.countDocuments();
      const productCount = await ProductModel.countDocuments({
        is_deleted: false,
      });
      const orderCountNew = await OrderModel.countDocuments({
        status: {
          $ne: 0,
        },
      });

      const orderCountSuccess = await OrderModel.countDocuments({
        status: {
          $in: [4, 5],
        },
      });

      return res.status(STATUS.OK).json({
        totalUser: userCount,
        totalProduct: productCount,
        totalOrderNew: orderCountNew,
        totalOrderSuccess: orderCountSuccess,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async chartDateOrder(req: RequestModel, res: Response) {
    try {
      const { status = 1 } = req.params;

      let listDataOrder = [];

      if (status !== "1" && status !== "2") {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Truyền sai giá trị",
        });
      }

      if (status === "1") {
        for (let i = 0; i < 10; i++) {
          const { startDay, endDay } = getDateStartAndEnd(i);
          const countNew = await OrderModel.countDocuments({
            orderDate: { $gte: startDay, $lte: endDay },
            status: {
              $ne: 0,
            },
          });
          const countSuccess = await OrderModel.countDocuments({
            shippedDate: { $gte: startDay, $lte: endDay },
            status: {
              $ne: 0,
            },
          });
          const countCancel = await OrderModel.countDocuments({
            cancelOrderDate: { $gte: startDay, $lte: endDay },
            status: {
              $ne: 0,
            },
          });
          listDataOrder.push({
            success: countSuccess,
            new: countNew,
            cancel: countCancel,
            date: new Date(endDay).toLocaleDateString(),
          });
        }
      } else if (status === "2") {
        for (let i = 0; i < 10; i++) {
          const { startDate, endDate } = getMonthStartAndEnd(i);
          const countNew = await OrderModel.countDocuments({
            orderDate: { $gte: startDate, $lte: endDate },
          });
          const countSuccess = await OrderModel.countDocuments({
            shippedDate: { $gte: startDate, $lte: endDate },
          });
          const countCancel = await OrderModel.countDocuments({
            cancelOrderDate: { $gte: startDate, $lte: endDate },
          });

          const dateValue = new Date(endDate);

          const month = dateValue.getMonth() + 1;

          const date = `${
            month < 10 ? "0" + month : month
          }/${dateValue.getFullYear()}`;

          listDataOrder.push({
            success: countSuccess,
            new: countNew,
            cancel: countCancel,
            date,
          });
        }
      }

      return res.status(STATUS.OK).json({
        listDataOrder,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getMethodRegister(req: RequestModel, res: Response) {
    try {
      const countCredential = await UserModel.countDocuments({
        provider: "credential",
      });

      const countGoogle = await UserModel.countDocuments({
        provider: "google.com",
      });

      return res.status(STATUS.OK).json([
        {
          method: "Đăng kí",
          count: countCredential,
          fill: "rgb(24, 119, 242)",
        },
        {
          method: "Google",
          count: countGoogle,
          fill: "rgb(255, 86, 48)",
        },
      ]);
    } catch (error) {}
  }

  async getListOrderNew(req: RequestModel, res: Response) {
    try {
      const listOrder = await OrderModel.find({
        status: {
          $in: [1, 2, 3],
        },
      })
        .sort({
          orderDate: -1,
        })
        .limit(5)
        .populate("user");

      return res.status(STATUS.OK).json(listOrder);
    } catch (error) {}
  }

  async getListProductChart(req: RequestModel, res: Response) {
    try {
      const topProducts = await OrderItemsModel.aggregate([
        // Nhóm theo sản phẩm, tính tổng số lượng và tổng doanh thu
        {
          $match: {
            status: {
              $in: [5],
            },
          },
        },
        {
          $group: {
            _id: "$product", // Nhóm theo trường 'product'
            totalQuantity: { $sum: "$quantity" }, // Tính tổng số lượng
            totalMoney: { $sum: "$totalMoney" }, // Tính tổng doanh thu
          },
        },
        // Sắp xếp theo tổng số lượng giảm dần (bán chạy nhất lên đầu)
        { $sort: { totalMoney: -1 } },
        // Giới hạn kết quả trả về là 5 sản phẩm
        { $limit: 5 },
        // Kết hợp với thông tin chi tiết của sản phẩm từ collection Product
        {
          $lookup: {
            from: "products", // Tên collection mà 'product' trỏ đến
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        // Làm phẳng mảng `productDetails` sau khi lookup
        {
          $unwind: "$productDetails",
        },
        // Chọn chỉ các trường cần thiết để hiển thị
        {
          $project: {
            productImage: "$productDetails.thumbnail", // Giả sử tên sản phẩm là 'name'
            productName: "$productDetails.name", // Giả sử tên sản phẩm là 'name'
            totalQuantity: 1,
            totalMoney: 1,
          },
        },
      ]);

      return res.status(STATUS.OK).json(topProducts);
    } catch (error) {}
  }

  async getListCategoryChart(req: RequestModel, res: Response) {
    try {
      const topProducts = await OrderItemsModel.aggregate([
        {
          $match: {
            status: {
              $in: [4, 5],
            },
          },
        },
        {
          $lookup: {
            from: "products", // Tên collection của Product
            localField: "product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $group: {
            _id: "$productDetails.category", // Nhóm theo category của sản phẩm
            totalQuantity: { $sum: "$quantity" }, // Tính tổng số lượng
            totalMoney: { $sum: "$totalMoney" }, // Tính tổng doanh thu
          },
        },
        // Sắp xếp theo tổng doanh thu giảm dần
        { $sort: { totalMoney: -1 } },
        // Giới hạn kết quả trả về, có thể thay đổi tùy thuộc vào số lượng danh mục
        { $limit: 5 },
        // Kết hợp với thông tin chi tiết của category từ collection Category
        {
          $lookup: {
            from: "categories", // Tên collection của Category
            localField: "_id",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        // Làm phẳng mảng categoryDetails
        {
          $unwind: "$categoryDetails",
        },
        // Chọn chỉ các trường cần thiết để hiển thị
        {
          $project: {
            categoryName: "$categoryDetails.name", // Giả sử tên danh mục là 'name'
            totalQuantity: 1,
            totalMoney: 1,
          },
        },
      ]);

      return res.status(STATUS.OK).json(topProducts);
    } catch (error) {}
  }

  async getOrderToDay(req: RequestModel, res: Response) {
    try {
      const toDay = new Date();

      const endOfDay = new Date(
        toDay.getUTCFullYear(),
        toDay.getUTCMonth(),
        toDay.getUTCDate(),
        23,
        59,
        59
      );
      const startOfDay = new Date(
        toDay.getUTCFullYear(),
        toDay.getUTCMonth(),
        toDay.getUTCDate(),
        0,
        0,
        0
      );

      const countNew = await OrderModel.countDocuments({
        status: 1,
        orderDate: {
          $gte: startOfDay, // Lớn hơn hoặc bằng thời gian bắt đầu của ngày đó
          $lt: endOfDay,
        },
      });
      const countConfirm = await OrderModel.countDocuments({
        status: 2,
        confirmedDate: {
          $gte: startOfDay, // Lớn hơn hoặc bằng thời gian bắt đầu của ngày đó
          $lt: endOfDay,
        },
      });
      const countShipping = await OrderModel.countDocuments({
        status: 3,
        shippingDate: {
          $gte: startOfDay, // Lớn hơn hoặc bằng thời gian bắt đầu của ngày đó
          $lt: endOfDay,
        },
      });
      const countShipped = await OrderModel.countDocuments({
        status: {
          $in: [4, 5],
        },
        $or: [
          {
            shippedDate: {
              $gte: startOfDay, // Lớn hơn hoặc bằng thời gian bắt đầu của ngày đó
              $lt: endOfDay,
            },
          },
          {
            deliveredDate: {
              $gte: startOfDay, // Lớn hơn hoặc bằng thời gian bắt đầu của ngày đó
              $lt: endOfDay,
            },
          },
        ],
      });
      const countCancel = await OrderModel.countDocuments({
        status: 6,
        cancelOrderDate: {
          $gte: startOfDay, // Lớn hơn hoặc bằng thời gian bắt đầu của ngày đó
          $lt: endOfDay,
        },
      });

      return res.status(STATUS.OK).json({
        countNew,
        countConfirm,
        countShipping,
        countShipped,
        countCancel,
      });
    } catch (error) {}
  }

  async getListNewBlog(req: RequestModel, res: Response) {
    try {
      const today = new Date();
      const startOfDay = new Date(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
        0,
        0,
        0
      );
      const listBlog = await BlogsModel.find({
        isPublish: true,
        published_at: {
          $lt: startOfDay,
        },
      })
        .sort({ published_at: -1 })
        .limit(5)
        .select({
          thumbnail_url: 1,
          meta_title: 1,
          meta_description: 1,
          published_at: 1,
          _id: 1,
        });

      return res.status(STATUS.OK).json(listBlog);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new DashboardController();
