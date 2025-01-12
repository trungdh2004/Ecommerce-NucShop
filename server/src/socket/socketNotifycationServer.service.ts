import { getFullSocketAdmin, getIo, getSocket } from ".";
import { TYPE_NOTIFICATION_ADMIN } from "../config/typeNotification";
import NotificationModel from "../models/Notification.schema";
import NotificationAdminModel from "../models/NotificationAdmin.schema";

export const SocketEmit = (order: any, message: string, userId: string) => {
  const socket = getSocket(userId);
  const io = getIo();
  io.to(socket).emit(`${message}`, order);
};

interface Props {
  message: string;
  type: string;
  directId: string;
}

export const socketNotificationAdmin = async (
  message:string,
  type:string,
  directId:string,
) => {
  try {
    if (!message || !type || !directId) {
      return;
    }
    const listAdmin = getFullSocketAdmin()
    const io = getIo();

    if(!io) return;

    const notificationAdmin = await NotificationAdminModel.create({
      message,
      directId,
      type
    })

    io.to(listAdmin).emit("notificationAdmin",notificationAdmin)
  } catch (error) {
    return;
  }
};

export const socketNotificationAllClient = async (
  message: string,
  id: string,
  type: string,
  thumbnail?:string
) => {
  try {
    const io = getIo();

    if(!message || !id || !type) {
      return
    }

    const newNotification = await NotificationModel.create({
      message: message,
      directType: type,
      type: type,
      directId: id,
      recipientType: "all",
      thumbnail
    });

    io.emit("notification", newNotification);

    return 
  } catch (error) {

    return
  }
};
