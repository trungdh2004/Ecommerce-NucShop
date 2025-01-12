import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalMoney: {
      type: Number,
      default: 0,
    },
    totalOrder: {
      type: Number,
      default: 0,
    },
    totalOrderSuccess: {
      type: Number,
      default: 0,
    },
    totalProductSuccess: {
      type: Number,
      default: 0,
    },
    totalOrderCancel: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CustomerModel = mongoose.model("Customer", CustomerSchema);

export default CustomerModel;
