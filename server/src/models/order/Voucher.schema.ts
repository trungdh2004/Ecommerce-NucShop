import mongoose from "mongoose";
import { ISize } from "../../interface/product";
import { generateSlugs } from "../../middlewares/generateSlug";
import { IVoucher } from "../../interface/voucher";
// import { IOrderItem } from "../../interface/order";

// 1 : giá tiền
// 2 : phần trăm,

const VoucherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    // dang % hay là sô tiền
    discountType: {
      type: Number,
      enum: [1, 2],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    usageLimit: {
      type: Number,
      required: true,
      default: 0,
    },
    minimumOrderValue: {
      type: Number,
      required: true,
      default: 0,
    },
    maxAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },
    version: {
      type: Number,
      default: 0,
    },
    modifiedDate: {
      type: String,
      default: null,
    },
    modifiedBy: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    isHome:{
      type:Boolean,
      default: false,
    },
    listUseProduct: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
    type: {
      type: String,
      enum: ["1", "2"],
      required: true,
      default: "1",
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const VoucherModel = mongoose.model<IVoucher>("Voucher", VoucherSchema);

export default VoucherModel;
