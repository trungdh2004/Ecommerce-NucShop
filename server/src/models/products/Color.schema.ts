import mongoose from "mongoose";
import { IColor } from "../../interface/product";
import { required } from "joi";
import { generateSlugs } from "../../middlewares/generateSlug";

const ColorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

ColorSchema.pre<IColor>("save", async function (next) {
  const slug = generateSlugs(this.name);
  this.slug = slug;
  next();
});

const ColorModel = mongoose.model<IColor>("Color", ColorSchema);

export default ColorModel;
