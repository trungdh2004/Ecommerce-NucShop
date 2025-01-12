import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    lastContent: {
      type: String,
      default: null,
    },
    lastSender: {
      type: String,
      enum: ["USER", "ADMIN"],
    },
    lastMessage: {
      type: Date,
      default: null,
    },
    lastRead: [{ type: String, enum: ["ADMIN", "USER"] }],
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ConversationModel = mongoose.model("Conversation", ConversationSchema);

export default ConversationModel;
