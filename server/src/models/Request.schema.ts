import mongoose from "mongoose";
import { generateSlugs } from "../middlewares/generateSlug";
import { ITags } from "../interface/blogs";

const TagsSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    ip2: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


const RequestModel = mongoose.model("Request", TagsSchema);

export default RequestModel;
