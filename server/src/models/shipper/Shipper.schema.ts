import mongoose from "mongoose";
import { ISize } from "../../interface/product";
import { generateSlugs } from "../../middlewares/generateSlug";
import { ICart } from "../../interface/cart";
import { IShipper } from "../../interface/shipper";

const ShipperSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    idCitizen: {
      type: String,
      required: true,
      maxLength: 12,
    },
    avatar: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    is_block: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    block_at: {
      type: String,
      default: null,
    },
    totalIncome: {
      type: Number,
      default: 0,
    },
    city: {
      type: {
        name: {
          type: String,
        },
        idProvince: String,
      },
      required: true,
    },
    district: {
      type: {
        name: String,
        idProvince: String,
        idDistrict: String,
      },
      required: true,
    },
    commune: {
      type: {
        name: String,
        idCommune: String,
        idDistrict: String,
      },
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ShipperModel = mongoose.model<IShipper>("Shipper", ShipperSchema);

export default ShipperModel;
