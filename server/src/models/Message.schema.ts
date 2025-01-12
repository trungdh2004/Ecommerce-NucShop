import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    user:{
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      enum: ["USER", "ADMIN"],
      required: true,
    },
    read: [
      {
        type: String,
        enum: ["USER", "ADMIN"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Message", MessageSchema);

export default MessageModel;
