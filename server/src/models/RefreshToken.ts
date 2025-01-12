import { required } from "joi";
import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RefreshTokenModel = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshTokenModel;
