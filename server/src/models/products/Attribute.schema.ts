import mongoose from "mongoose";
import { IAttribute } from "../../interface/product";

const AttributeSchema = new mongoose.Schema(
  {
    
    color: {
      ref: "Color",
      type: mongoose.Types.ObjectId,
      required: true,
    },
    size: {
      ref: "Size",
      type: mongoose.Types.ObjectId,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const AttributeModel = mongoose.model<IAttribute>("Attribute", AttributeSchema);

export default AttributeModel;
