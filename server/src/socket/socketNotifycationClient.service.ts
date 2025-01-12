import { getIo, getSocket } from ".";
import TYPENOTIFICATION from "../config/typeNotification";
import { IOrder } from "../interface/order";
import NotificationModel from "../models/Notification.schema";

export const SocketEmit = (order: any, message: string, userId: string) => {
  const socket = getSocket(userId);
  const io = getIo();
  io.to(socket).emit(`${message}`, order);
};

export const socketNotificationOrderClient = async (
  code: string,
  status: number,
  userId: string,
  id: string
) => {
  try {
    if (!userId || !code || !status) {
      return;
    }

    const socket = getSocket(userId);
    const io = getIo();

    let message = "Bạn có thông báo về đơn hàng";

    if (status === 2) {
      message = `Đơn hàng có mã :<b>${code}</b> đã được xác nhận , bạn hãy kiểm tra !!`;
    }
    if (status === 3) {
      message = `Đơn hàng có mã :<strong>${code}</strong> đang chuẩn bị giao, bạn vui lòng kiểm tra !!`;
    }
    if (status === 4) {
      message = `Đơn hàng có mã :<strong>${code}</strong> đã giao thành công !!`;
    }
    if (status === 6) {
      message = `Đơn hàng có mã :<strong>${code}</strong> đã bị hủy !!`;
    }
    if (status === 7) {
      message = `Đơn hàng có mã :<strong>${code}</strong> đã bị nhân viên từ chối giao hàng !!`;
    }

    const newNotification = await NotificationModel.create({
      message: message,
      receiver: [userId],
      directType: TYPENOTIFICATION.ORDER,
      type: TYPENOTIFICATION.ORDER,
      directId: id,
      recipientType: "single",
    });

    if (newNotification) {
      io.to(socket).emit("notification", newNotification);
    }
  } catch (error) {
    return;
  }
};

export const socketNotificationAllClient = async (
  message: string,
  id: string,
  type: string,
  thumbnail?: string
) => {
  try {
    const io = getIo();

    if (!message || !id || !type) {
      return;
    }

    const newNotification = await NotificationModel.create({
      message: message,
      directType: type,
      type: type,
      directId: id,
      recipientType: "all",
      thumbnail,
    });

    io.emit("notification", newNotification);

    return;
  } catch (error) {
    return;
  }
};

export const socketNewOrderShipperClient = async (
  order: any,
  shipper: string
) => {
  if (!order || !shipper) {
    return;
  }
  const io = getIo();
  const socket = getSocket(shipper);

  io.to(socket).emit("newOrderShipper", order);
};
