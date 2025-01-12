import mongoose from "mongoose";
import { IUser } from "../interface/models";

const UserSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
    },
    point:{
      type:Number,
      default:0
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min: 6,
      // required: true,
    },
    provider: {
      type: String,
      default: "credential",
    },
    uid: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: "https://res.cloudinary.com/dundmo7q8/image/upload/v1731318978/shopApp/gfxxbr0uaqcdsherufbd.jpg",
    },
    phone: {
      type: String,
    },
    birthDay: {
      type: String,
    },
    bio: {
      type: String,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    is_staff: {
      type: Boolean,
      default: false,
    },
    blocked_at: {
      type: Boolean,
      default: false,
    },
    comment_blocked_at: {
      type: Boolean,
      default: false,
    },
    is_shipper:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
