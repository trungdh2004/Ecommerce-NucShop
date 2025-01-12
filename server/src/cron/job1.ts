import OrderModel from "../models/order/Order.schema";

const updateStatusShippedToSuccess = async () => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);


    await OrderModel.updateMany({
      status: 4,
    },{
        status:5,
        $push:{
            statusList:5
        }
    });
    console.log("Cập nhập trạng thái đơn hàng thành công");
  } catch (error) {
    console.log("Cập nhập trạng thái đơn hàng thất bại");
    
  }
};

const removeStatus = async () => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);


    await OrderModel.deleteMany({
      status: 0,
    });
  } catch (error) {
    console.log(error);
    
  }
};

export default updateStatusShippedToSuccess