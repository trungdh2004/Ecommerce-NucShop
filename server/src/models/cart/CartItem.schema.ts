import mongoose from "mongoose";
import { ISize } from "../../interface/product";
import { generateSlugs } from "../../middlewares/generateSlug";
import { IProductCart } from "../../interface/cart";

const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    cart: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    attribute: {
      type: mongoose.Types.ObjectId,
      ref: "Attribute",
      default: null
    },
    is_simple: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CartItemModel = mongoose.model("CartItem", CartItemSchema);

export default CartItemModel;
