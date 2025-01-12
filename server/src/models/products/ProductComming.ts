import mongoose from "mongoose";

const ProductComing = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    date:{
        type:Date,
        required: true,
    },
    active:{
        type:Boolean,
        default: false,
    }
  },
  {
    timestamps: true,
  }
);


const ProductComingModel = mongoose.model("ProductComing", ProductComing);

export default ProductComingModel;
