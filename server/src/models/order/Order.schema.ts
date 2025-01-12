import mongoose from "mongoose";
import { ISize } from "../../interface/product";
import {
  generateOrderCode,
  generateSlugs,
} from "../../middlewares/generateSlug";
import { IOrder } from "../../interface/order";
import { required } from "joi";
// 0 : đơn hàng chưa xác định
// 1 : Đang chờ xác nhận đơn hàng
// 2 : Đã xác nhân đơn hàng
// 3 : Đang giao hàng
// 4 : ship đã giao hàng
// 5 : Đã nhận hàng
// 6 : Hủy đơn hàng
// 7 : Đã đánh giá

const OrderSchema = new mongoose.Schema(
  {
    user: {
      // người đặt hàng
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      unique: true,
      index: true,
    },
    address: {
      // địa chỉ
      // type: mongoose.Types.ObjectId,
      // ref: "address",
      // required: true,
      username: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      detailAddress: {
        type: String,
        required: true,
      },
      location: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: { type: [Number], required: true },
      },
    },
    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7],
      default: 0,
    },
    statusList: {
      type: Array,
      default: [0],
    },
    voucherAmount: {
      type: Number,
      default: 0,
    },
    voucher: {
      // voucher sử dụng
      type: mongoose.Types.ObjectId,
      ref: "Voucher",
      default: null,
    },
    voucherVersion: {
      type: Number,
      default: null,
    },
    totalMoney: {
      // tổng số tiền đơn hàng
      type: Number,
      default: 0,
      required: true,
    },
    amountToPay: {
      // tổng số tiền người dùng phải thanh toán
      type: Number,
      default: 0,
      required: true,
    },
    orderDate: {
      // thời gian đơn hàng đặt
      type: Date,
      default: Date.now,
    },
    confirmedDate: {
      // thời gian xác nhận đơn hàng
      type: Date,
      default: null,
    },
    // thời gian shipper bdau giao
    shippingDate: {
      type: Date,
      default: null,
    },
    // thời gian shipper đã giao
    shippedDate: {
      type: Date,
      default: null,
    },
    // thời gian xác nhận đã nhận
    deliveredDate: {
      type: Date,
      default: null,
    },
    cancelOrderDate: {
      // thời gian đơn hàng hủy
      type: Date,
      default: null,
    },
    // 1 là người dùng hủy 2 là nhân viên hủy 3 giao hàng thất bại
    cancelBy: {
      type: Number,
      enum: [1, 2, 3],
      default: null,
    },
    noteCancel: {
      type: String,
      default: null,
    },
    distance: {
      type: Number,
      default: 0,
    },
    // tiền ship
    shippingCost: {
      type: Number,
      default: 0,
      required: true,
    },
    // thời gian ước tính nhân
    estimatedDeliveryDate: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      // phương thức thanh toán
      type: Number,
      enum: [1, 2, 3],
      default: 1,
      required: true,
    },
    paymentStatus: {
      // trạng thái đã thanh toán
      type: Boolean,
      default: false,
      required: true,
    },
    payment: {
      ref: "Payment",
      type: mongoose.Types.ObjectId,
      default: null,
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    note: {
      // lời dặn của người dùng
      type: String,
      default: "",
    },
    shipper: {
      ref: "Shipper",
      type: mongoose.Types.ObjectId,
      default: null,
    },
    is_shipper: {
      type: Boolean,
      default: false,
    },
    informationOrder: [
      {
        name: String,
        date: Date,
        content: String,
      },
    ],
    orderItems: [
      {
        type: mongoose.Types.ObjectId,
        ref: "OrderItems",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
