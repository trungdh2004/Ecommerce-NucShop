import mongoose, { Document, Schema, Types } from "mongoose";
import { IProduct } from "../interface/product";
import { TYPE_NOTIFICATION_ADMIN } from "../config/typeNotification";


type MyObjectValues = typeof TYPE_NOTIFICATION_ADMIN[keyof typeof TYPE_NOTIFICATION_ADMIN];
// Định nghĩa interface cho Notification
export interface INotification extends Document {
  message: string; // Nội dung của thông báo
  type:MyObjectValues// Loại thông báo
  createdAt?: Date; // Ngày tạo (tự động)
  updatedAt?: Date; // Ngày cập nhật (tự động)
  direct:string;
  directId:string;
  is_delete:boolean
  readOnly:[]
}

// Định nghĩa schema cho Notification
const NotificationAdminSchema: Schema<INotification> = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    directId:{
      type:String,
      required:true,
    },
    type: {
      type: String,
      required: true,
      default: "APP//ORDER",
    },
    readOnly: [
      {
        type:String,
      }
    ],
  },
  {
    timestamps: true, // Tự động tạo trường `createdAt` và `updatedAt`
  }
);

// Tạo model cho Notification
const NotificationAdminModel = mongoose.model<INotification>(
  "NotificationAdmin",
  NotificationAdminSchema
);

export default NotificationAdminModel;
