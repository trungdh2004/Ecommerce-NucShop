import mongoose, { Document, Schema, Types } from "mongoose";
import { IProduct } from "../interface/product";

// Định nghĩa interface cho Notification
export interface INotification extends Document {
  title: string; // Tiêu đề của thông báo
  message: string; // Nội dung của thông báo
  receiver?: mongoose.Types.ObjectId[]; // Người nhận (tham chiếu đến người dùng)
  type:string// Loại thông báo
  recipientType: "single" | "multiple" | "all";
  isRead: boolean; // Trạng thái đã đọc/chưa đọc
  createdAt?: Date; // Ngày tạo (tự động)
  updatedAt?: Date; // Ngày cập nhật (tự động)
  direct:string;
  directType:string;
  directId:string;
  thumbnail:string | null;
  is_delete:boolean
}

// Định nghĩa schema cho Notification
const NotificationSchema: Schema<INotification> = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    receiver: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User", // Tham chiếu đến mô hình User
      },
    ],
    directType:{
      type:String,
      required:true,
    },
    directId:{
      type:String,
      required:true,
    },
    recipientType: {
      type: String,
      enum: ["single", "all"], // Kiểu người nhận
      required: true,
      default: "single", // Mặc định là gửi cho một người
    },
    type: {
      type: String,
      required: true,
      default: "APP//ORDER",
    },
    thumbnail:{
      type: String,
      default:null
    },
    isRead: {
      type: Boolean,
      default: false, // Mặc định là chưa đọc
    },
    is_delete:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true, // Tự động tạo trường `createdAt` và `updatedAt`
  }
);

// Tạo model cho Notification
const NotificationModel = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

export default NotificationModel;
