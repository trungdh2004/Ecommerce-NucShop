import mongoose, { Mongoose } from "mongoose";
import { ISize } from "../../interface/product";
import { generateSlugs } from "../../middlewares/generateSlug";
import { IOrderItem } from "../../interface/order";

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      ref: "User",
      type: mongoose.Types.ObjectId,
      required: true,
    },
    // 1 vnpay 2 momo
    method: {
      type: Number,
      enum: [1, 2],
      required: true,
    },
    //
    cardType: {
      type: String,
    },
    bankCode: {
      type: String,
    },
    codeOrder: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    amount: {
      type: String,
      required: true,
    },
    paymentDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentModel = mongoose.model("Payment", PaymentSchema);

export default PaymentModel;
