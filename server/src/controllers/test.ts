import { Request, Response } from "express";
import { socketNotificationAllClient } from "../socket/socketNotifycationClient.service";
import { getFullSocketAdmin } from "../socket";
import { socketNotificationAdmin } from "../socket/socketNotifycationServer.service";
import { TYPE_NOTIFICATION_ADMIN } from "../config/typeNotification";
import STATUS from "../utils/status";
import { formatDataPaging } from "../common/pagingData";
import * as crypto from "crypto";
import axios from "axios";
import { RequestModel } from "../interface/models";
import AddressModel from "../models/Address.schema";
import LocationModel from "../models/Location.schema";
import mongoose from "mongoose";
import { chargeShippingFee } from "../common/func";
import CartItemModel from "../models/cart/CartItem.schema";
import { IndexCartItem } from "../interface/cart";
import OrderItemsModel from "../models/order/OrderProduct.schema";
import { generateOrderCode } from "../middlewares/generateSlug";
import OrderModel from "../models/order/Order.schema";
import ShipperModel from "../models/shipper/Shipper.schema";

const getAllDaysInMonth = (year: number, month: number) => {
  const days = [];
  const date = new Date(year, month - 1, 1, 12);
  console.log("date now:", date);

  // Vòng lặp qua từng ngày trong tháng
  while (date.getMonth() === month - 1) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
};

const generateCode = async (code: string): Promise<string> => {
  const existingCode = await OrderModel.findOne({
    code: code,
  });
  if (existingCode) {
    let codeNew = generateOrderCode();
    return generateCode(codeNew as string);
  }
  return code;
};

const long = +process.env.LONGSHOP! || 105.62573250208116;
const lat = +process.env.LATSHOP! || 21.045193948892585;

export const TestSocket = async (req: Request, res: Response) => {
  try {
    const listSocket = getFullSocketAdmin();
    socketNotificationAdmin(
      "XIn chào test nè",
      TYPE_NOTIFICATION_ADMIN.ORDER,
      "123456"
    );
    return res.json("hihhi");
  } catch (error) {}
};

export const pagingTest = async (req: Request, res: Response) => {
  try {
    const array = Array.from({ length: 100 }, (_, i) => ({
      value: i + 1,
      name: i + 1,
    }));

    const { pageIndex } = req.body;

    const limit = 10;

    const skip = (pageIndex - 1) * limit || 0;

    const listData = array.splice(skip, limit);

    const data = formatDataPaging({
      limit: limit,
      pageIndex: pageIndex,
      data: listData,
      count: 100,
    });

    return res.status(STATUS.OK).json(data);
  } catch (error) {}
};

export const testVnPay = async (req: Request, res: Response) => {
  try {
    const momoConfig = {
      partnerCode: "MOMOBKUN20180529",
      accessKey: "klm05TvNBzhg7h7j",
      secretKey: "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa",
      endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
    };

    const requestId = new Date(); // requestId có thể giống với orderId
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=200000&extraData=&ipnUrl=https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b&orderId=1234567&orderInfo=donhangdep&partnerCode=${momoConfig.partnerCode}&redirectUrl=http://localhost:4000/shop&requestId=${requestId}&requestType=captureWallet`;

    const amount = 200000;
    const extraData = "";
    const notifyUrl =
      "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
    const orderId = "123456";
    const orderInfo = "đẹp";
    const partnerCode = momoConfig.partnerCode;
    const returnUrl = "http://localhost:4000/shop";
    const requestType = "payWithATM";

    const row = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}
`;

    console.log("row", row);

    const signature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(row)
      .digest("hex");

    const payload = {
      partnerCode: momoConfig.partnerCode,
      accessKey: momoConfig.accessKey,
      requestId,
      amount: 200000,
      orderId: "1234567",
      orderInfo: "donhangdep",
      returnUrl: "http://localhost:4000/shop",
      notifyUrl: "http",
      extraData: "",
      requestType: "captureWallet",
      signature,
      ipnUrl: "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b",
    };

    console.log("payload", payload);

    const response = await axios.post(momoConfig.endpoint, payload);
    return res.json(response.data);
  } catch (error) {
    return res.json({ error: error });
  }
};

export const toolOrder = async (req: RequestModel, res: Response) => {
  try {
    const { month, year, cartId, min, max, cancel, shipper } = req.body;
    const user = req.user;

    if (!month || !year || !cartId || cartId.length === 0) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "Đề nghị tuyên nhập đầy đủ",
      });
    }

    let minCount = min || 1;
    let maxCount = max || 4;

    const dateMonth = new Date(year, month - 1, 1, 0, 0, 0);
    console.log({
      dateMonth,
    });

    const existingAddressMain = await AddressModel.findOne({
      is_main: true,
      user: user?.id,
    });

    if (!existingAddressMain) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "Đề nghị em tuyên tạo address cho tài khoản đã",
      });
    }

    let shipperMain = null;

    if (shipper) {
      shipperMain = await ShipperModel.findOne({
        _id: shipper,
        is_block: false,
        active: true,
      });
    } else {
      shipperMain = await ShipperModel.findOne({
        is_block: false,
        active: true,
      });
    }

    if (!shipperMain) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "Đề nghị em tuyên tạo shipper",
      });
    }

    let statusList = [0, 1];

    if (cancel) {
      statusList = [0, 1, 2, 3, 6];
    } else {
      statusList = [0, 1, 2, 3, 4, 5];
    }

    const findLocationShop = await LocationModel.findOne();

    const longShop = findLocationShop?.long || long;
    const latShop = findLocationShop?.lat || lat;

    const addressDetail = await AddressModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longShop, latShop],
          },
          distanceField: "dist",
          spherical: true,
        },
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(existingAddressMain._id),
        },
      },
      {
        $limit: 1,
      },
    ]);

    if (!addressDetail) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "Không có địa chỉ",
      });
    }

    const shippingCost = addressDetail
      ? chargeShippingFee(addressDetail[0]?.dist)
      : 0;

    const dataListDate = getAllDaysInMonth(year, month);

    const listCartItem = await CartItemModel.find<IndexCartItem>({
      _id: {
        $in: cartId,
      },
    }).populate([
      {
        path: "attribute",
        populate: [
          {
            path: "color",
            model: "Color",
          },
          {
            path: "size",
            model: "Size",
          },
        ],
      },
      {
        path: "product",
        select: {
          _id: 1,
          name: 1,
          discount: 1,
          price: 1,
          thumbnail: 1,
          attributes: 1,
          quantity: 1,
          is_hot: 1,
          is_simple: 1,
          createdAt: 1,
        },
      },
    ]);

    let countOrder = 0;

    if (!listCartItem || listCartItem.length === 0) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "Không có sản phẩm nào",
      });
    }

    const listDateNew = listCartItem.map((item) => {
      const variant = item?.is_simple
        ? "Sản phẩm đơn giản"
        : `${item?.attribute?.size?.name || "Size"} - ${
            item?.attribute?.color?.name || "Màu"
          }`;
      const price = item.is_simple
        ? item.product.discount
        : item.attribute.discount;
      return {
        product: item.product?._id,
        status: cancel ? 6 : 5,
        variant: variant,
        price: price,
        quantity: item.quantity,
        totalMoney: +item.quantity * +price,
        attribute: item?.attribute?._id || null,
        is_simple: item.is_simple || false,
      };
    });

    for (let i = 0; i < dataListDate.length; i++) {
      const count = Math.floor(Math.random() * maxCount);

      if (count > 0) {
        for (let j = 0; j < count; j++) {
          const listOrderItem = await OrderItemsModel.create(listDateNew);

          const listIdOrderItem =
            listOrderItem?.length > 0
              ? listOrderItem?.map((item) => item._id)
              : [];

          let code = generateOrderCode();
          code = await generateCode(code);

          const totalMoney2 = listOrderItem.reduce((acc: number, item) => {
            return acc + item.totalMoney;
          }, 0);

          await OrderModel.create({
            user: user?.id,
            address: {
              username: existingAddressMain.username,
              phone: existingAddressMain.phone,
              address: existingAddressMain.address,
              detailAddress: existingAddressMain.detailAddress,
              location: existingAddressMain.location,
            },
            totalMoney: totalMoney2,
            amountToPay: totalMoney2 + shippingCost,
            voucherAmount: 0,
            voucher: null,
            voucherVersion: null,
            distance: addressDetail[0].dist,
            shippingCost: shippingCost || 0,
            paymentMethod: "1",
            note: "",
            code,
            orderItems: listIdOrderItem,
            status: cancel ? 6 : 5,
            statusList: statusList,
            orderDate: dataListDate[i],
            confirmedDate: dataListDate[i],
            shippingDate: dataListDate[i],
            shippedDate: dataListDate[i],
            deliveredDate: dataListDate[i],
            shipper: shipperMain._id || null,
          });

          countOrder++;
        }
      }
    }

    return res.json({
      dateMonth,
      countOrder,
    });
  } catch (error: any) {
    return res.json({
      message: error.message,
    });
  }
};
