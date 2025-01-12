import mongoose from "mongoose";
import { ISize } from "../../interface/product";
import { generateSlugs } from "../../middlewares/generateSlug";

const SizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fromHeight: {
      type: Number,
      required: true,
    },
    toHeight: {
      type: Number,
      required: true,
    },
    toWeight: {
      type: Number,
      required: true,
    },
    fromWeight: {
      type: Number,
      required: true,
    },
    slug: {
      index: true,
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

SizeSchema.pre<ISize>("save", async function (next) {
  const slug = generateSlugs(this.name);
  this.slug = slug;
  next();
});

const SizeModel = mongoose.model("Size", SizeSchema);

export default SizeModel;
