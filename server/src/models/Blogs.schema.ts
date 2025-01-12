import { required } from "joi";
import mongoose from "mongoose";
import { IBlogs } from "../interface/blogs";
import { generateSlugs } from "../middlewares/generateSlug";

const BlogsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
    },
    thumbnail_url: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      // unique: true,
      index: true,
    },
    meta_title: {
      type: String,
      default: "",
    },
    meta_description: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    views_count: {
      type: Number,
      required: true,
      default: 0,
    },
    isPublish: {
      type: Boolean,
      default: false,
    },
    published_at: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date!,
      default: null,
    },
    comments_count: {
      type: Number,
      required: true,
      default: 0,
    },
    countLike: {
      type: Number,
      required: true,
      default: 0,
    },
    reactions: [{ type: mongoose.Types.ObjectId }],
    selected_tags: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Tags",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const BlogsModel = mongoose.model<IBlogs>("Blogs", BlogsSchema);

export default BlogsModel;
