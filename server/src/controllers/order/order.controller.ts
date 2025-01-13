import { Response } from "express";
import { RequestModel } from "../../interface/models";
import STATUS from "../../utils/status";
import OrderModel from "../../models/order/Order.schema";
import CartItemModel from "../../models/cart/CartItem.schema";
import { formatDataPaging } from "../../common/pagingData";
import mongoose from "mongoose";
import AddressModel from "../../models/Address.schema";
import { IndexCartItem, IProductCart } from "../../interface/cart";
import { IAttribute, IColor, IProduct, ISize } from "../../interface/product";
import OrderItemsModel from "../../models/order/OrderProduct.schema";
import { truncateSentence } from "../../utils/cutText";
import vnpay from "../payment/vnpay.payment";
import { ProductCode, VnpLocale } from "vnpay";
import { generateOrderCode } from "../../middlewares/generateSlug";
import PaymentModel from "../../models/order/Payment.schema";
import {
  chargeShippingFee,
  handleFutureDateTimeOrder,
} from "../../common/func";
import { IListCart, IOrder, IOrderItem } from "../../interface/order";
import ShipperModel from "../../models/shipper/Shipper.schema";
import { IAddress } from "../../interface/address";
// import { SocketEmit } from "../../socket/socketNotifycation.service";
import VoucherModel from "../../models/order/Voucher.schema";
import { checkVoucher, handleAmountVoucher } from "../voucher";
import { IVoucher } from "../../interface/voucher";
import AttributeModel from "../../models/products/Attribute.schema";
import ProductModel from "../../models/products/Product.schema";
import {
  socketNewOrderShipperClient,
  socketNotificationOrderClient,
} from "../../socket/socketNotifycationClient.service";
import { socketNotificationAdmin } from "../../socket/socketNotifycationServer.service";
import { TYPE_NOTIFICATION_ADMIN } from "../../config/typeNotification";
import { formatCurrency } from "../../config/func";
import LocationModel from "../../models/Location.schema";
import CustomerModel from "../../models/Customer.schema";
import sendToMail from "../../mail/mailConfig";
import * as crypto from "crypto";

const long = +process.env.LONGSHOP! || 105.62573250208116;
const lat = +process.env.LATSHOP! || 21.045193948892585;

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

interface IAmountVoucher {
  amountReduced: number;
  totalMoneyNew: number;
}

const amountReducedVoucher = (
  totalMoney: number,
  voucher: IVoucher | null
): IAmountVoucher => {
  if (!voucher)
    return {
      amountReduced: 0,
      totalMoneyNew: totalMoney,
    };
  const voucherDiscountType = voucher.discountType;
  const voucherDiscountValue = voucher.discountValue;

  if (voucherDiscountType === 2) {
    const amountReduced = (+totalMoney * +voucherDiscountValue) / 100;
    const totalVoucherAmountNew = totalMoney - amountReduced;

    return {
      amountReduced,
      totalMoneyNew: totalVoucherAmountNew >= 0 ? totalVoucherAmountNew : 0,
    };
  }
  if (voucherDiscountType === 1) {
    const totalVoucherAmountNew = totalMoney - voucherDiscountValue;

    return {
      amountReduced: voucherDiscountValue,
      totalMoneyNew: totalVoucherAmountNew >= 0 ? totalVoucherAmountNew : 0,
    };
  }

  return {
    amountReduced: 0,
    totalMoneyNew: totalMoney,
  };
};

interface IProductSelectOrder {
  _id: string;
  name: string;
  price: number;
  discount: number;
  thumbnail: string;
  slug: string;
}

interface IAccOrderClient {
  productId: string;
  product: IProductSelectOrder;
  items: IOrderItem[];
  totalMoney: number;
  is_evaluate: boolean;
}

interface IReturnVnPay {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}

class OrderController {
  async createOrderPayUponReceiptV2(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const { listId, addressId, voucher, paymentMethod, note } = req.body;

      if (paymentMethod !== 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Phương thức thanh toán lỗi",
        });
      }

      if (!listId || listId.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn sản phẩm",
        });
      }

      if (!addressId) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn địa chỉ",
        });
      }

      let address = await AddressModel.findById(addressId);

      if (!address) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có địa chỉ",
        });
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
            _id: new mongoose.Types.ObjectId(address._id),
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

      const listCartItem = await CartItemModel.find<IndexCartItem>({
        _id: {
          $in: listId,
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

      if (!listCartItem || listCartItem.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có sản phẩm nào",
        });
      }

      if (listId.length !== listCartItem.length) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đã có sản phẩm bị xóa mời bạn trờ về",
        });
      }

      const checkProduct = listCartItem.find(
        (item) => item?.product?.is_deleted
      );

      if (checkProduct) {
        const stringName = truncateSentence(checkProduct.product.name, 30);
        return res.status(STATUS.BAD_REQUEST).json({
          message: `Sản phẩm '${stringName}' đã bị xóa`,
        });
      }
      const checkAttribute = listCartItem.find(
        (item) => !item.attribute && !item?.product?.is_simple
      );

      if (checkAttribute) {
        const stringName = truncateSentence(checkAttribute.product.name, 30);
        return res.status(STATUS.BAD_REQUEST).json({
          message: `Sản phẩm '${stringName}' đã xóa loại sản phẩm bạn chọn`,
        });
      }

      const checkQuantity = listCartItem.find((item) => {
        const quantity = item.quantity;
        const quantityAttribute = item?.product?.is_simple
          ? item.product.quantity
          : item.attribute.quantity;

        if (quantity > quantityAttribute) {
          return true;
        }
        return false;
      });

      if (checkQuantity) {
        const stringName = truncateSentence(checkQuantity.product.name, 30);
        return res.status(STATUS.BAD_REQUEST).json({
          message: `Sản phẩm '${stringName}' đã vượt quá số lượng`,
        });
      }

      // return res.status(STATUS.BAD_REQUEST).json({
      //   message: "hhihi",
      //   checkQuantity,
      //   checkAttribute,
      // });

      const listDateNew = listCartItem.map((item) => {
        const variant = item?.product?.is_simple
          ? "Sản phẩm đơn giản"
          : `${item?.attribute?.size?.name || "Size"} - ${
              item?.attribute?.color?.name || "Màu"
            }`;
        const price = item?.product.is_simple
          ? item.product.discount
          : item.attribute.discount;
        return {
          product: item.product?._id,
          status: 1,
          variant: variant,
          price: price,
          quantity: item.quantity,
          totalMoney: +item.quantity * +price,
          attribute: item?.attribute?._id || null,
          is_simple: item?.product.is_simple || false,
        };
      });

      const listDataMail = listCartItem.map((item) => {
        const variant = item?.product?.is_simple
          ? "Sản phẩm đơn giản"
          : `${item?.attribute?.size?.name || "Size"} - ${
              item?.attribute?.color?.name || "Màu"
            }`;
        const price = item?.product.is_simple
          ? item.product.discount
          : item.attribute.discount;
        return {
          product: {
            name: item.product.name,
            thumbnail: item.product.thumbnail,
          },
          variant: variant,
          price: formatCurrency(price),
          quantity: item.quantity,
          totalMoney: formatCurrency(+item.quantity * +price),
        };
      });

      const listProduct = listCartItem.map((item) => {
        const productId = item.product._id;
        let totalMoney = 0;

        if (item?.product.is_simple) {
          totalMoney = item.product.discount * item.quantity;
        } else {
          totalMoney = item.attribute.discount * item.quantity;
        }

        return {
          productId,
          totalMoney,
        };
      });

      const totalMoney = listCartItem.reduce((sum, item) => {
        let total = 0;
        if (item?.product.is_simple) {
          total = item.product.discount * item.quantity;
        } else {
          total = item.attribute.discount * item.quantity;
        }
        return sum + total;
      }, 0);

      let voucherMain = null;

      if (voucher) {
        const existingVoucher = await VoucherModel.findOne({
          _id: voucher,
        });

        if (!existingVoucher) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Không có voucher này",
          });
        }
        const check = await OrderModel.findOne({
          voucher: existingVoucher._id,
          user: user?.id,
          status: {
            $ne: 0,
          },
        });

        if (check) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Voucher bạn đã sử dụng",
          });
        }

        const dataVoucher = checkVoucher(existingVoucher);

        if (!dataVoucher?.check) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: dataVoucher.message,
          });
        }

        const amountVoucher = handleAmountVoucher(
          existingVoucher,
          totalMoney,
          listProduct
        );

        if (!amountVoucher.status) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: amountVoucher.message,
          });
        }

        voucherMain = {
          voucher: voucher,
          amount: amountVoucher.amount,
          remainingMoney: amountVoucher.valueAmount,
          version: existingVoucher.version,
        };
      }

      const listOrderItem = await OrderItemsModel.create(listDateNew);

      const listIdOrderItem =
        listOrderItem?.length > 0 ? listOrderItem?.map((item) => item._id) : [];

      const totalMoney2 = listOrderItem.reduce((acc: number, item) => {
        return acc + item.totalMoney;
      }, 0);
      const totalQuantity = listCartItem.reduce((acc: number, item) => {
        return acc + item.quantity;
      }, 0);

      const shippingCost = addressDetail
        ? chargeShippingFee(addressDetail[0]?.dist, totalMoney, totalQuantity)
        : 0;
      // // Tạo một ngày mới sau 2 ngày

      let code = generateOrderCode();
      code = await generateCode(code);

      const newOrder = await OrderModel.create({
        user: user?.id,
        address: {
          username: address.username,
          phone: address.phone,
          address: address.address,
          detailAddress: address.detailAddress,
          location: address.location,
        },
        totalMoney: voucherMain ? voucherMain.remainingMoney : totalMoney2,
        amountToPay: voucherMain
          ? voucherMain.remainingMoney + shippingCost
          : totalMoney2 + shippingCost,
        voucherAmount: voucherMain ? voucherMain.amount : 0,
        voucher: voucher,
        voucherVersion: voucherMain?.version || null,
        distance: addressDetail[0].dist,
        shippingCost: shippingCost || 0,
        paymentMethod,
        note,
        code,
        orderItems: listIdOrderItem,
        status: 1,
        statusList: [0, 1],
        informationOrder: [
          {
            name: "Đặt hàng thành công",
            date: Date.now(),
            content: "Đơn hàng đặt thành công",
          },
        ],
      });

      if (!newOrder) {
        await OrderItemsModel.deleteMany({
          _id: {
            $in: listIdOrderItem,
          },
        });

        return res.status(STATUS.BAD_REQUEST).json({
          message: "Tạo đơn hàng thất bại",
        });
      }
      await CartItemModel.deleteMany({
        _id: {
          $in: listId,
        },
      });
      socketNotificationAdmin(
        `<p>Đơn hàng: <span style="color:blue;font-weight:500;">${newOrder.code}</span> vừa được đặt, vui lòng kiểm tra thông tin</p>`,
        TYPE_NOTIFICATION_ADMIN.ORDER,
        newOrder._id
      );

      const dataSendMail = {
        orderItems: listDataMail,
        code: newOrder.code,
        createdAt: new Date(newOrder.createdAt).toLocaleString(),
        address: newOrder.address,
        amountToPay: formatCurrency(newOrder.amountToPay),
        totalMoney: formatCurrency(newOrder.totalMoney),
        shippingCost: formatCurrency(shippingCost),
        note: newOrder.note,
        voucher: formatCurrency(newOrder.voucherAmount),
        payment: formatCurrency(newOrder.paymentAmount),
      };

      sendToMail(
        user?.email as string,
        "Thông báo đặt hàng thành công tại NUCSHOP",
        dataSendMail,
        process.env.EMAIL!,
        "/order.ejs"
      );

      return res.status(STATUS.OK).json({
        message: "Tạo đơn hàng thành công",
        order: newOrder,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async pagingCartOrder(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const { listId, addressId, voucher } = req.body;

      if (!user)
        return res.status(STATUS.AUTHORIZED).json({
          message: "Bạn chưa đăng nhập",
        });
      if (!listId?.length) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa truyền danh sách sản phẩm chọn",
        });
      }

      let addressMain = null;

      let voucherMain = null;

      if (voucher) {
        const existingVoucher = await VoucherModel.findById(voucher);

        if (existingVoucher) {
          const check = await OrderModel.findOne({
            voucher: existingVoucher._id,
            user: user.id,
            status: {
              $ne: 0,
            },
          });

          if (!check) {
            const data = checkVoucher(existingVoucher);

            if (data.check) {
              voucherMain = data.voucher;
            }
          }
        }
      }

      const existingAddressMain = await AddressModel.findOne({
        is_main: true,
        user: user?.id,
      });

      const findLocationShop = await LocationModel.findOne();

      const longShop = findLocationShop?.long || long;
      const latShop = findLocationShop?.lat || lat;

      if (addressId) {
        const existingAddressId = await AddressModel.findById(addressId);

        if (existingAddressId) {
          addressMain = await AddressModel.aggregate([
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
                _id: new mongoose.Types.ObjectId(existingAddressId._id),
              },
            },
            {
              $limit: 1,
            },
          ]);
        } else {
          if (existingAddressMain) {
            addressMain = await AddressModel.aggregate([
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
          }
        }
      } else {
        if (existingAddressMain) {
          addressMain = await AddressModel.aggregate([
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
        }
      }

      const listIdObject = listId.map(
        (item: string) => new mongoose.Types.ObjectId(item)
      );

      const listProduct = await CartItemModel.aggregate([
        {
          $match: {
            _id: { $in: listIdObject },
          },
        },
        {
          $lookup: {
            from: "products", // Tên bộ sưu tập products
            localField: "product",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product", // Giải nén mảng productDetails
        },
        {
          $lookup: {
            from: "attributes", // Tên bộ sưu tập products
            localField: "attribute",
            foreignField: "_id",
            as: "attribute",
          },
        },
        {
          $unwind: "$attribute", // Giải nén mảng productDetails
        },
        {
          $lookup: {
            from: "colors", // Tên bộ sưu tập products
            localField: "attribute.color",
            foreignField: "_id",
            as: "attribute.color",
          },
        },
        {
          $unwind: "$attribute.color", // Giải nén mảng productDetails
        },
        {
          $lookup: {
            from: "sizes", // Tên bộ sưu tập products
            localField: "attribute.size",
            foreignField: "_id",
            as: "attribute.size",
          },
        },
        {
          $unwind: "$attribute.size", // Giải nén mảng productDetails
        },
        {
          $group: {
            _id: "$product",
            createdAt: { $max: "$createdAt" },
            items: {
              $addToSet: {
                quantity: "$quantity",
                createdAt: "$createdAt",
                _id: "$_id",
                price: "$product.price",
                name: "$product.name",
                productId: "$product._id",
                quantitySold: "$product.quantitySold",
                discount: "$product.discount",
                thumbnail: "$product.thumbnail",
                attribute: "$attribute",
              },
            },
            totalAmount: {
              $sum: { $multiply: ["$quantity", "$attribute.discount"] },
            },
          },
        },
        {
          $sort: {
            createdAt: -1, // Sắp xếp nhóm theo ID
          },
        },
        {
          $project: {
            _id: 0,
            product: "$_id",
            createdAt: 1,
            items: 1,
            totalAmount: 1,
          },
        },
      ]);

      const shippingCost = addressMain
        ? chargeShippingFee(addressMain[0]?.dist)
        : 0;

      return res.status(STATUS.OK).json({
        message: "Lấy thành công ",
        data: listProduct,
        address: addressMain ? addressMain[0] : null,
        shippingCost,
        voucherMain,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
  // paging lấy danh sách của order
  async pagingCartState(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const { listId, addressId, voucher } = req.body;

      if (!user)
        return res.status(STATUS.AUTHORIZED).json({
          message: "Bạn chưa đăng nhập",
        });
      if (!listId?.length) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa truyền danh sách sản phẩm chọn",
        });
      }

      const findLocationShop = await LocationModel.findOne();

      const longShop = findLocationShop?.long || long;
      const latShop = findLocationShop?.lat || lat;
      let addressMain = null;
      const existingAddressMain = await AddressModel.findOne({
        is_main: true,
        user: user?.id,
      });
      if (addressId) {
        const existingAddressId = await AddressModel.findById(addressId);

        if (existingAddressId) {
          addressMain = await AddressModel.aggregate([
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
                _id: new mongoose.Types.ObjectId(existingAddressId._id),
              },
            },
            {
              $limit: 1,
            },
          ]);
        } else {
          if (existingAddressMain) {
            addressMain = await AddressModel.aggregate([
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
          }
        }
      } else {
        if (existingAddressMain) {
          addressMain = await AddressModel.aggregate([
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
        }
      }

      const listCartItem = await CartItemModel.find<IndexCartItem>({
        _id: {
          $in: [...listId],
        },
      })
        .populate([
          {
            path: "product",
            populate: {
              path: "attributes",
              populate: [
                {
                  path: "color",
                },
                {
                  path: "size",
                },
              ],
            },
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
          {
            path: "attribute",
            populate: [
              {
                path: "color",
              },
              {
                path: "size",
              },
            ],
          },
        ])
        .sort({ createdAt: -1 });

      const check = listCartItem.find((item) => {
        if (!item.product.is_simple && !item.attribute) {
          return true;
        }

        return false;
      });

      if (check) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: `Sản phẩm "${check.product.name}" xảy ra lỗi mời bạn quay lại giỏ hàng`,
        });
      }

      const listData = listCartItem.reduce((acc: IListCart[], item) => {
        const findCart = acc.find((sub) => sub.productId === item.product._id);

        if (findCart) {
          const data = {
            quantity: item.quantity,
            _id: item._id,
            thumbnail: item.product.thumbnail,
            name: item.product.name,
            discount: item.product.is_simple
              ? item.product.discount
              : item.attribute.discount,
            price: item.product.is_simple
              ? item.product.price
              : item.attribute.price,
            attribute: item.attribute,
            is_simple: item.product.is_simple,
            createdAt: item.createdAt,
            productId: item.product._id,
          };
          findCart.items.push(data);
          findCart.totalAmount += +data.quantity * +data?.discount;
          return acc;
        }

        const sub = {
          quantity: item.quantity,
          _id: item._id,
          thumbnail: item.product.thumbnail,
          name: item.product.name,
          discount: item.product.is_simple
            ? item.product.discount
            : item.attribute.discount,
          price: item.product.is_simple
            ? item.product.price
            : item.attribute.price,
          attribute: item.attribute,
          is_simple: item.product.is_simple,
          createdAt: item.createdAt,
          productId: item.product._id,
        };

        const data = {
          productId: item.product._id,
          totalAmount: +sub.quantity * +sub.discount,
          items: [sub],
        };

        return [...acc, data];
      }, []);

      const listProduct = listCartItem.map((item) => {
        const productId = item.product._id;
        let totalMoney = 0;

        if (item.is_simple) {
          totalMoney = item.product.discount * item.quantity;
        } else {
          totalMoney = item.attribute.discount * item.quantity;
        }

        return {
          productId,
          totalMoney,
        };
      });

      const totalMoney = listCartItem.reduce((sum, item) => {
        let total = 0;
        if (item.is_simple) {
          total = item.product.discount * item.quantity;
        } else {
          total = item.attribute.discount * item.quantity;
        }
        return sum + total;
      }, 0);

      let voucherMain = null;

      const totalQuantity = listCartItem.reduce((acc: number, item) => {
        return acc + item.quantity;
      }, 0);

      const shippingCost = addressMain
        ? chargeShippingFee(addressMain[0]?.dist, totalMoney, totalQuantity)
        : 0;

      if (voucher) {
        const existingVoucher = await VoucherModel.findOne({
          _id: voucher,
        });

        if (!existingVoucher) {
          voucherMain = null;
        } else {
          const check = await OrderModel.findOne({
            voucher: existingVoucher._id,
            user: user.id,
            status: {
              $ne: 0,
            },
          });
          if (!check) {
            const data = checkVoucher(existingVoucher);

            if (data.check) {
              const amountVoucher = handleAmountVoucher(
                existingVoucher,
                totalMoney,
                listProduct
              );

              if (amountVoucher.status) {
                voucherMain = {
                  voucher: existingVoucher,
                  amountVoucher: amountVoucher.amount,
                };
              }
            }
          }
        }
      }

      return res.status(STATUS.OK).json({
        message: "Lấy thành công ",
        data: listData,
        address: addressMain ? addressMain[0] : null,
        shippingCost,
        voucherMain,
      });
    } catch (err: any) {
      return res.status(STATUS.INTERNAL).json({
        message: err.message,
      });
    }
  }

  async createStateUrlCart(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const { listId, voucher } = req.body;

      if (!listId || listId.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn sản phẩm đặt mua",
        });
      }

      const listCartItem = await CartItemModel.find<IndexCartItem>({
        _id: {
          $in: listId,
        },
      }).populate([
        {
          path: "attribute",
        },
        {
          path: "product",
        },
      ]);

      if (listId.length !== listCartItem.length) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đã có sản phẩm bị xóa",
        });
      }

      const checkProduct = listCartItem.find(
        (item) => item?.product?.is_deleted
      );

      if (checkProduct) {
        const stringName = truncateSentence(checkProduct.product.name, 30);
        return res.status(STATUS.BAD_REQUEST).json({
          message: `Sản phẩm '${stringName}' đã bị xóa`,
        });
      }
      const checkAttribute = listCartItem.find(
        (item) => !item.attribute && !item?.product?.is_simple
      );

      if (checkAttribute) {
        const stringName = truncateSentence(checkAttribute.product.name, 30);
        return res.status(STATUS.BAD_REQUEST).json({
          message: `Sản phẩm '${stringName}' đã xóa loại sản phẩm bạn chọn`,
        });
      }

      const checkQuantity = listCartItem.find((item) => {
        const quantity = item.quantity;
        const quantityAttribute = item?.product?.is_simple
          ? item.product.quantity
          : item.attribute.quantity;

        if (quantity > quantityAttribute) {
          return true;
        }
        return false;
      });

      if (checkQuantity) {
        const stringName = truncateSentence(checkQuantity.product.name, 30);
        return res.status(STATUS.BAD_REQUEST).json({
          message: `Sản phẩm '${stringName}' đã vượt quá số lượng`,
        });
      }

      const listProduct = listCartItem.map((item) => {
        const productId = item.product._id;
        let totalMoney = 0;

        if (item?.product?.is_simple) {
          totalMoney = item.product.discount * item.quantity;
        } else {
          totalMoney = item.attribute.discount * item.quantity;
        }

        return {
          productId,
          totalMoney,
        };
      });

      const totalMoney = listCartItem.reduce((sum, item) => {
        let total = 0;
        if (item?.product?.is_simple) {
          total = item.product.discount * item.quantity;
        } else {
          total = item.attribute.discount * item.quantity;
        }
        return sum + total;
      }, 0);

      let voucherMain = null;

      if (voucher) {
        const existingVoucher = await VoucherModel.findOne({
          _id: voucher,
        });

        if (!existingVoucher) {
          voucherMain = null;
        } else {
          const check = await OrderModel.findOne({
            voucher: existingVoucher._id,
            user: user?.id,
            status: {
              $ne: 0,
            },
          });
          if (!check) {
            const data = checkVoucher(existingVoucher);

            if (data.check) {
              const amountVoucher = handleAmountVoucher(
                existingVoucher,
                totalMoney,
                listProduct
              );

              if (amountVoucher.status) {
                voucherMain = existingVoucher;
              }
            }
          } else {
            voucherMain = null;
          }
        }
      }

      const stateValue = {
        listId,
        voucher: voucherMain?._id || null,
      };

      const stateJson = JSON.stringify(stateValue);

      const stateDeCodeUrl = encodeURIComponent(stateJson);

      return res.status(STATUS.OK).json({
        url: stateDeCodeUrl,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async createOrderVNPayPayment(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const { listId, addressId, voucher, paymentMethod, note, returnUrl } =
        req.body;

      if (paymentMethod !== 2 && paymentMethod !== 3 && paymentMethod !== 4) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Phương thức thanh toán lỗi",
        });
      }

      if (!listId || listId.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn sản phẩm",
        });
      }
      if (!addressId) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn địa chỉ",
        });
      }
      const findLocationShop = await LocationModel.findOne();

      const longShop = findLocationShop?.long || long;
      const latShop = findLocationShop?.lat || lat;

      let address = await AddressModel.findById(addressId);

      if (!address) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có địa chỉ",
        });
      }

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
            _id: new mongoose.Types.ObjectId(address._id),
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

      const listCartItem = await CartItemModel.find<IndexCartItem>({
        _id: {
          $in: listId,
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

      if (!listCartItem || listCartItem.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có sản phẩm nào",
        });
      }

      if (listId.length !== listCartItem.length) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đã có sản phẩm bị xóa mời bạn trờ về",
        });
      }

      const checkProduct = listCartItem.find(
        (item) => item?.product?.is_deleted
      );

      if (checkProduct) {
        const stringName = truncateSentence(checkProduct.product.name, 30);
        return res.status(STATUS.BAD_REQUEST).json({
          message: `Sản phẩm '${stringName}' đã bị xóa`,
        });
      }
      const checkAttribute = listCartItem.find(
        (item) => !item.attribute && !item?.product?.is_simple
      );

      if (checkAttribute) {
        const stringName = truncateSentence(checkAttribute.product.name, 30);
        return res.status(STATUS.BAD_REQUEST).json({
          message: `Sản phẩm '${stringName}' đã xóa loại sản phẩm bạn chọn`,
        });
      }

      const checkQuantity = listCartItem.find((item) => {
        const quantity = item.quantity;
        const quantityAttribute = item?.product?.is_simple
          ? item.product.quantity
          : item.attribute.quantity;

        if (quantity > quantityAttribute) {
          return true;
        }
        return false;
      });

      if (checkQuantity) {
        const stringName = truncateSentence(checkQuantity.product.name, 30);
        return res.status(STATUS.BAD_REQUEST).json({
          message: `Sản phẩm '${stringName}' đã vượt quá số lượng`,
        });
      }

      const listProduct = listCartItem.map((item) => {
        const productId = item.product._id;
        let totalMoney = 0;

        if (item.is_simple) {
          totalMoney = item.product.discount * item.quantity;
        } else {
          totalMoney = item.attribute.discount * item.quantity;
        }

        return {
          productId,
          totalMoney,
        };
      });

      const totalMoney = listCartItem.reduce((sum, item) => {
        let total = 0;
        if (item.is_simple) {
          total = item.product.discount * item.quantity;
        } else {
          total = item.attribute.discount * item.quantity;
        }
        return sum + total;
      }, 0);

      let voucherMain = null;

      if (voucher) {
        const existingVoucher = await VoucherModel.findOne({
          _id: voucher,
        });

        if (!existingVoucher) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Không có voucher này",
          });
        }
        const check = await OrderModel.findOne({
          voucher: existingVoucher._id,
          user: user?.id,
          status: {
            $ne: 0,
          },
        });

        if (check) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Voucher bạn đã sử dụng",
          });
        }

        const dataVoucher = checkVoucher(existingVoucher);

        if (!dataVoucher?.check) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: dataVoucher.message,
          });
        }

        const amountVoucher = handleAmountVoucher(
          existingVoucher,
          totalMoney,
          listProduct
        );

        if (!amountVoucher.status) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: amountVoucher.message,
          });
        }

        voucherMain = {
          voucher: existingVoucher._id,
          amount: amountVoucher.amount,
          remainingMoney: amountVoucher.valueAmount,
          version: existingVoucher.version,
        };
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
          status: 0,
          variant: variant,
          price: price,
          quantity: item.quantity,
          totalMoney: +item.quantity * +price,
          attribute: item?.attribute?._id || null,
          is_simple: item.is_simple || false,
        };
      });

      const listOrderItem = await OrderItemsModel.create(listDateNew);

      const listIdOrderItem =
        listOrderItem?.length > 0 ? listOrderItem?.map((item) => item._id) : [];

      const totalMoney2 = listOrderItem.reduce((acc: number, item) => {
        return acc + item?.totalMoney;
      }, 0);

      const totalQuantity = listOrderItem.reduce((acc: number, item) => {
        return acc + item.quantity;
      }, 0);

      const shippingCost = addressDetail
        ? chargeShippingFee(addressDetail[0]?.dist, totalMoney2, totalQuantity)
        : 0;
      // Tạo một ngày mới sau 2 ngày

      let code = generateOrderCode();
      code = await generateCode(code);

      const newOrder = await OrderModel.create({
        user: user?.id,
        address: {
          username: address.username,
          phone: address.phone,
          address: address.address,
          detailAddress: address.detailAddress,
          location: address.location,
        },
        totalMoney: voucherMain ? voucherMain.remainingMoney : totalMoney2,
        amountToPay: voucherMain
          ? voucherMain.remainingMoney + shippingCost
          : totalMoney2 + shippingCost,
        voucherAmount: voucherMain ? voucherMain.amount : 0,
        voucher: voucher,
        voucherVersion: voucherMain?.version,
        distance: addressDetail[0].dist,
        shippingCost: shippingCost || 0,
        paymentMethod,
        note,
        code,
        orderItems: listIdOrderItem,
        informationOrder: [
          {
            name: "Đặt hàng thành công",
            date: Date.now(),
            content: "Đơn hàng đặt thành công",
          },
        ],
      });

      if (!newOrder) {
        await OrderItemsModel.deleteMany({
          _id: {
            $in: listIdOrderItem,
          },
        });

        return res.status(STATUS.BAD_REQUEST).json({
          message: "Tạo đơn hàng thất bại",
        });
      }

      const stateValue = {
        listId,
        voucher: voucher || null,
        addressId: address._id,
      };

      const stateJson = JSON.stringify(stateValue);

      const stateDeCodeUrl = encodeURIComponent(stateJson);

      if (paymentMethod === 3) {
        const secretKey = process.env.SECRETKEY_MOMO!;
        const accessKey = process.env.ACCESSKEY_MOMO!;
        const partnerCode = process.env.PARTNERCODE_MOMO!;

        const orderInfo = "Thanh toan MoMo";
        const redirectUrl = `${returnUrl}?state=${stateDeCodeUrl}`;
        const ipnUrl =
          "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
        const requestType = "payWithMethod";
        const amount = newOrder?.amountToPay;
        const orderId = newOrder?._id;
        const requestId = orderId;
        const extraData = "";
        const orderGroupId = "";
        const autoCapture = true;
        const lang = "vi";

        const rawSignature =
          "accessKey=" +
          accessKey +
          "&amount=" +
          amount +
          "&extraData=" +
          extraData +
          "&ipnUrl=" +
          ipnUrl +
          "&orderId=" +
          orderId +
          "&orderInfo=" +
          orderInfo +
          "&partnerCode=" +
          partnerCode +
          "&redirectUrl=" +
          redirectUrl +
          "&requestId=" +
          requestId +
          "&requestType=" +
          requestType;

        var signature = crypto
          .createHmac("sha256", secretKey)
          .update(rawSignature)
          .digest("hex");

        const requestBody = JSON.stringify({
          partnerCode: partnerCode,
          partnerName: "Test",
          storeId: "MomoTestStore",
          requestId: requestId,
          amount: amount,
          orderId: orderId,
          orderInfo: orderInfo,
          redirectUrl: redirectUrl,
          ipnUrl: ipnUrl,
          lang: lang,
          requestType: requestType,
          autoCapture: autoCapture,
          extraData: extraData,
          orderGroupId: orderGroupId,
          signature: signature,
        });
        const responsive = await fetch(
          "https://test-payment.momo.vn/v2/gateway/api/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: requestBody,
          }
        );

        const data = await responsive.json();
        if (!responsive.ok) {
          return res.status(STATUS.BAD_REQUEST).json(data);
        }

        if (data?.resultCode !== 0) {
          return res.status(STATUS.BAD_REQUEST).json(data);
        }
        return res.status(STATUS.OK).json({ paymentUrl: data?.payUrl });
      } else {
        const ipAddress = String(
          req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.ip
        );
        const paymentUrl = vnpay.buildPaymentUrl({
          vnp_Amount: newOrder?.amountToPay,
          vnp_IpAddr: ipAddress,
          vnp_TxnRef: `${newOrder._id}`,
          vnp_OrderInfo: "Thanh toan cho ma GD:" + newOrder._id,
          vnp_OrderType: ProductCode.Other,
          vnp_ReturnUrl: `${returnUrl}?state=${stateDeCodeUrl}`, // Đường dẫn nên là của frontend
          vnp_Locale: VnpLocale.VN,
        });
        return res.status(STATUS.OK).json({ paymentUrl });
      }
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async returnOrderVnPay(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const {
        state,
        vnp_Amount,
        vnp_BankCode,
        vnp_BankTranNo,
        vnp_CardType,
        vnp_OrderInfo,
        vnp_PayDate,
        vnp_ResponseCode = "02",
        vnp_TmnCode,
        vnp_TransactionNo,
        vnp_TransactionStatus,
        vnp_TxnRef,
        vnp_SecureHash,
      } = req.query;

      console.log({
        body: req.query,
      });

      if (
        !vnp_Amount ||
        !vnp_BankCode ||
        !vnp_CardType ||
        !vnp_OrderInfo ||
        !vnp_TmnCode ||
        !vnp_TransactionNo ||
        !vnp_TransactionStatus ||
        !vnp_TxnRef ||
        !vnp_SecureHash
      ) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Giao dịch bất ổn xin mời về trang chủ",
          url: "/",
          type: 1,
        });
      }

      const queryReturn: IReturnVnPay = {
        vnp_Amount: vnp_Amount as string,
        vnp_BankCode: vnp_BankCode as string,
        vnp_BankTranNo: vnp_BankTranNo as string,
        vnp_CardType: vnp_CardType as string,
        vnp_OrderInfo: vnp_OrderInfo as string,
        vnp_PayDate: vnp_PayDate as string,
        vnp_ResponseCode: vnp_ResponseCode as string,
        vnp_TmnCode: vnp_TmnCode as string,
        vnp_TransactionNo: vnp_TransactionNo as string,
        vnp_TransactionStatus: vnp_TransactionStatus as string,
        vnp_TxnRef: vnp_TxnRef as string,
        vnp_SecureHash: vnp_SecureHash as string,
      };
      let verify = vnpay.verifyReturnUrl(queryReturn);

      if (!verify.isVerified) {
        const existingOrder = await OrderModel.findById(vnp_TxnRef);
        if (existingOrder) {
          await OrderModel.findByIdAndDelete(existingOrder._id);

          await OrderItemsModel.deleteMany({
            _id: {
              $in: existingOrder.orderItems,
            },
          });

          if (state) {
            return res.status(STATUS.BAD_REQUEST).json({
              message: "Quá trình giao dịch đã bị chỉnh sửa đơn hàng sẽ bị hủy",
              type: 2,
              url: `?state=${encodeURIComponent(state as string)}`,
            });
          } else {
            return res.status(STATUS.BAD_REQUEST).json({
              message: "Quá trình giao dịch đã bị chỉnh sửa đơn hàng sẽ bị hủy",
              url: "/",
              type: 1,
            });
          }
        }

        if (state) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Quá trình giao dịch đã bị chỉnh sửa đơn hàng sẽ bị hủy",
            type: 2,
            url: `?state=${encodeURIComponent(state as string)}`,
          });
        } else {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Quá trình giao dịch đã bị chỉnh sửa đơn hàng sẽ bị hủy",
            url: "/",
            type: 1,
          });
        }
      }
      if (!verify.isSuccess) {
        const existingOrder = await OrderModel.findById(vnp_TxnRef);
        if (!existingOrder) {
          if (state) {
            return res.status(STATUS.BAD_REQUEST).json({
              message: "Không tìm thấy giá trị đơn hàng",
              type: 2,
              url: `?state=${encodeURIComponent(state as string)}`,
            });
          } else {
            return res.status(STATUS.BAD_REQUEST).json({
              message: "Không tìm thấy giá trị đơn hàng",
              url: "/",
              type: 1,
            });
          }
        }

        await OrderModel.findByIdAndDelete(existingOrder._id);

        await OrderItemsModel.deleteMany({
          _id: {
            $in: existingOrder.orderItems,
          },
        });

        if (state) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Giao dịch đã hủy",
            type: 2,
            url: `?state=${encodeURIComponent(state as string)}`,
          });
        } else {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Giao dịch đã hủy",
            url: "/",
            type: 1,
          });
        }
      }

      const existingOrder = await OrderModel.findById(vnp_TxnRef).populate({
        path: "orderItems",
        populate: {
          path: "product",
          select: {
            name: 1,
            thumbnail: 1,
          },
        },
      });

      if (!existingOrder) {
        if (state) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Không tìm thấy giá trị đơn hàng",
            type: 2,
            url: `?state=${encodeURIComponent(state as string)}`,
          });
        } else {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Không tìm thấy giá trị đơn hàng",
            url: "/",
            type: 1,
          });
        }
      }

      const payment = await PaymentModel.create({
        user: user?.id,
        method: 1,
        codeOrder: existingOrder.code,
        transactionId: verify.vnp_TransactionNo,
        amount: verify.vnp_Amount,
        paymentDate: verify.vnp_PayDate,
        cardType: verify.vnp_CardType,
        bankCode: verify.vnp_BankCode,
      });

      const updateOder = await OrderModel.findByIdAndUpdate(
        existingOrder._id,
        {
          payment: payment._id,
          status: 1,
          $push: {
            statusList: 1,
          },
          amountToPay: 0,
          paymentStatus: true,
          paymentAmount: +verify.vnp_Amount,
        },
        { new: true }
      );

      if (!updateOder) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Xử lí đơn hàng lỗi chúng tôi sẽ hoàn trả tiền sau",
          url: "/",
          type: 1,
        });
      }

      await OrderItemsModel.updateMany(
        {
          _id: {
            $in: existingOrder.orderItems,
          },
        },
        {
          status: 1,
        }
      );

      socketNotificationAdmin(
        `<p>Đơn hàng <span style="color:blue;font-weight:500;">${updateOder?.code}</span> vừa được đặt, vui lòng kiểm tra thông tin</p>`,
        TYPE_NOTIFICATION_ADMIN.ORDER,
        updateOder?._id
      );
      socketNotificationAdmin(
        `<p>Có giao dịch thanh toán online với số tiền : <span style="color:red;font-weight:500;">${formatCurrency(
          payment?.amount
        )}</span>, vui lòng kiểm tra thông tin</p>`,
        TYPE_NOTIFICATION_ADMIN.PAYMENT,
        `${payment?._id}`
      );

      const totalMoney = existingOrder?.orderItems?.reduce(
        (sum, item) => sum + (item as IOrderItem).totalMoney,
        0
      );

      const dataSendMail = {
        orderItems: existingOrder?.orderItems,
        code: existingOrder.code,
        createdAt: new Date(existingOrder.createdAt).toLocaleString(),
        address: existingOrder.address,
        amountToPay: formatCurrency(0),
        totalMoney: formatCurrency(totalMoney),
        shippingCost: formatCurrency(existingOrder.shippingCost),
        note: existingOrder.note,
        voucher: formatCurrency(existingOrder.voucherAmount),
        payment: formatCurrency(+verify.vnp_Amount),
      };

      sendToMail(
        user?.email as string,
        "Thông báo đặt hàng thành công tại NUCSHOP",
        dataSendMail,
        process.env.EMAIL!,
        "/order.ejs"
      );

      if (state) {
        const data = JSON.parse(state as string);

        await CartItemModel.deleteMany({
          _id: {
            $in: data.listId,
          },
        });
      }

      return res.status(STATUS.OK).json({
        message: "Đơn hàng giao dịch thành công",
        type: 3,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  // momo
  async returnUrlMomo(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const {
        state,
        orderId,
        amount,
        transId,
        resultCode,
        payType,
        responseTime,
        requestId,
      } = req.query;

      if (!orderId || !amount || !requestId) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Giao dịch bất ổn xin mời về trang chủ",
          url: "/",
          type: 1,
        });
      }

      const existingOrder = await OrderModel.findById(orderId).populate({
        path: "orderItems",
        populate: {
          path: "product",
          select: {
            name: 1,
            thumbnail: 1,
          },
        },
      });

      if (!existingOrder) {
        if (state) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Không có đơn hàng nào",
            type: 2,
            url: `?state=${encodeURIComponent(state as string)}`,
          });
        } else {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Không có đơn hàng nào",
            url: "/",
            type: 1,
          });
        }
      }

      const secretKey = process.env.SECRETKEY_MOMO!;
      const accessKey = process.env.ACCESSKEY_MOMO!;
      const partnerCode = process.env.PARTNERCODE_MOMO!;

      const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = JSON.stringify({
        partnerCode,
        requestId: orderId,
        orderId,
        signature,
        lang: "vi",
      });

      const responsive = await fetch(
        "https://test-payment.momo.vn/v2/gateway/api/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        }
      );
      const data = await responsive.json();

      if (!responsive.ok) {
        await OrderModel.findByIdAndDelete(existingOrder._id);

        await OrderItemsModel.deleteMany({
          _id: {
            $in: existingOrder.orderItems,
          },
        });

        if (state) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Giao dịch xảy ra lỗi",
            type: 2,
            url: `?state=${encodeURIComponent(state as string)}`,
          });
        } else {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Giao dịch xảy ra lỗi",
            url: "/",
            type: 1,
          });
        }
      }

      if (data?.resultCode !== 0) {
        await OrderModel.findByIdAndDelete(existingOrder._id);

        await OrderItemsModel.deleteMany({
          _id: {
            $in: existingOrder.orderItems,
          },
        });

        if (state) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Giao dịch xảy ra lỗi",
            type: 2,
            url: `?state=${encodeURIComponent(state as string)}`,
          });
        } else {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Giao dịch xảy ra lỗi",
            url: "/",
            type: 1,
          });
        }
      }

      const payment = await PaymentModel.create({
        user: user?.id,
        method: 2,
        codeOrder: existingOrder.code,
        transactionId: transId,
        amount: amount,
        paymentDate: responseTime,
        cardType: payType,
        bankCode: "MoMo",
      });

      const updateOder = await OrderModel.findByIdAndUpdate(
        existingOrder._id,
        {
          payment: payment._id,
          status: 1,
          $push: {
            statusList: 1,
          },
          amountToPay: 0,
          paymentStatus: true,
          paymentAmount: +amount,
        },
        { new: true }
      );

      if (!updateOder) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Xử lí đơn hàng lỗi chúng tôi sẽ hoàn trả tiền sau",
          url: "/",
          type: 1,
        });
      }

      await OrderItemsModel.updateMany(
        {
          _id: {
            $in: existingOrder.orderItems,
          },
        },
        {
          status: 1,
        }
      );

      socketNotificationAdmin(
        `<p>Đơn hàng <span style="color:blue;font-weight:500;">${updateOder?.code}</span> vừa được đặt, vui lòng kiểm tra thông tin</p>`,
        TYPE_NOTIFICATION_ADMIN.ORDER,
        updateOder?._id
      );
      socketNotificationAdmin(
        `<p>Có giao dịch thanh toán online với số tiền : <span style="color:red;font-weight:500;">${formatCurrency(
          payment?.amount
        )}</span>, vui lòng kiểm tra thông tin</p>`,
        TYPE_NOTIFICATION_ADMIN.PAYMENT,
        `${payment?._id}`
      );

      const totalMoney = existingOrder?.orderItems?.reduce(
        (sum, item) => sum + (item as IOrderItem).totalMoney,
        0
      );

      const dataSendMail = {
        orderItems: existingOrder?.orderItems,
        code: existingOrder.code,
        createdAt: new Date(existingOrder.createdAt).toLocaleString(),
        address: existingOrder.address,
        amountToPay: formatCurrency(0),
        totalMoney: formatCurrency(totalMoney),
        shippingCost: formatCurrency(existingOrder.shippingCost),
        note: existingOrder.note,
        voucher: formatCurrency(existingOrder.voucherAmount),
        payment: formatCurrency(+amount),
      };

      sendToMail(
        user?.email as string,
        "Thông báo đặt hàng thành công tại NUCSHOP",
        dataSendMail,
        process.env.EMAIL!,
        "/order.ejs"
      );

      if (state) {
        const data = JSON.parse(state as string);

        await CartItemModel.deleteMany({
          _id: {
            $in: data.listId,
          },
        });
      }

      return res.status(STATUS.OK).json({
        message: "Đơn hàng giao dịch thành công",
        type: 3,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  //zalo pay

  // server khi nhận đơn hàng
  async pagingOrderAdmin(req: RequestModel, res: Response) {
    try {
      const {
        status = 1,
        pageIndex,
        pageSize,
        sort = -1,
        startDate,
        endDate,
        method,
        is_shipper,
        paymentStatus,
        keyword,
      } = req.body;
      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;

      let queryDate = {};
      let queryMethod = {};
      let queryPaymentStatus = {};
      let shipperQuery = {};
      let queryKeyword = keyword
        ? {
            name: {
              $regex: keyword,
              $options: "i",
            },
          }
        : {};

      if (startDate || endDate) {
        let dateStartString = null;
        let dateEndString = null;
        if (startDate && endDate) {
          dateStartString = new Date(startDate);
          dateEndString = new Date(endDate);
          const startOfDay = new Date(
            dateStartString.getUTCFullYear(),
            dateStartString.getUTCMonth(),
            dateStartString.getUTCDate(),
            0,
            0,
            0
          );
          const endOfDay = new Date(
            dateEndString.getUTCFullYear(),
            dateEndString.getUTCMonth(),
            dateEndString.getUTCDate(),
            23,
            59,
            59
          );
          queryDate = {
            createdAt: {
              $gte: startOfDay, // Lớn hơn hoặc bằng thời gian bắt đầu của ngày đó
              $lt: endOfDay,
            },
          };
        } else if (startDate) {
          dateStartString = new Date(startDate);
          const startOfDay = new Date(
            dateStartString.getUTCFullYear(),
            dateStartString.getUTCMonth(),
            dateStartString.getUTCDate(),
            0,
            0,
            0
          );
          queryDate = {
            createdAt: {
              $gte: startOfDay, // Lớn hơn hoặc bằng thời gian bắt đầu của ngày đó
            },
          };
        } else if (endDate) {
          dateEndString = new Date(endDate);

          const endOfDay = new Date(
            dateEndString.getUTCFullYear(),
            dateEndString.getUTCMonth(),
            dateEndString.getUTCDate(),
            23,
            59,
            59
          );

          queryDate = {
            createdAt: {
              $lte: endOfDay,
            },
          };
        }
      }

      if (method) {
        switch (method) {
          case 1:
            queryMethod = {
              paymentMethod: 1,
            };
            break;
          case 2:
            queryMethod = {
              paymentMethod: 2,
            };
            break;
          case 3:
            queryMethod = {
              paymentMethod: 3,
            };
            break;
          default:
            queryMethod = {};
        }
      }

      if (paymentStatus) {
        queryPaymentStatus = {
          paymentStatus: !!paymentStatus,
        };
      }

      if (is_shipper) {
        shipperQuery = {
          shipper: { $ne: null },
        };
      } else {
        if (status === 6) {
          shipperQuery = {};
        } else {
          shipperQuery = {
            shipper: null,
          };
        }
      }

      const listOrder = await OrderModel.find({
        status: status,
        ...queryDate,
        ...queryMethod,
        ...queryPaymentStatus,
        ...shipperQuery,
      })
        .populate(["user", "payment", "shipper"])
        .sort({
          orderDate: sort,
        })
        .skip(skip)
        .limit(limit);

      const countOrder = await OrderModel.countDocuments({
        status: status,
        ...queryDate,
        ...queryMethod,
        ...queryPaymentStatus,
        ...shipperQuery,
      });

      const data = formatDataPaging({
        limit,
        pageIndex,
        data: listOrder,
        count: countOrder,
      });

      return res.status(STATUS.OK).json({
        message: "Lấy danh sách thành công",
        data: data,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  // chi tiết order

  async getByIdOrderAdmin(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn đơn hàng",
        });

      const existingOrder = await OrderModel.findById(id).populate([
        {
          path: "user",
          select: {
            _id: 1,
            email: 1,
            full_name: 1,
            avatarUrl: 1,
          },
        },
        "shipper",
        "payment",
        {
          path: "orderItems",
          populate: {
            path: "product",
            select: {
              name: 1,
              _id: 1,
              thumbnail: 1,
              price: 1,
              discount: 1,
            },
          },
        },
      ]);

      if (!existingOrder) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có đơn hàng nào",
        });
      }

      const listStatusOrderDate = existingOrder.statusList
        .reverse()
        ?.map((item) => {
          if (item === 6) {
            return {
              status: 6,
              date: existingOrder?.cancelOrderDate,
              message: "Đơn hàng đã hủy",
              sub: existingOrder.noteCancel,
            };
          }
          if (item === 5) {
            return {
              status: 5,
              date: existingOrder?.deliveredDate,
              message: "Đơn hàng thành công",
            };
          } else if (item === 4) {
            return {
              status: 4,
              date: existingOrder?.shippedDate,
              message: "Đơn hàng giao thành công",
              sub: `Người nhận: ${existingOrder?.address?.username}`,
            };
          } else if (item === 3) {
            return {
              status: 3,
              date: existingOrder?.shippingDate,
              message: "Đơn hàng đang giao",
              sub: `Đơn hàng sẽ sớm được giao, vui lòng chú ý điện thoại`,
            };
          } else if (item === 2) {
            return {
              status: 2,
              date: existingOrder?.confirmedDate,
              message: "Đơn hàng đang được chuẩn bị",
              sub: "Shop đang chuẩn bị đơn hàng",
            };
          } else if (item === 1) {
            return {
              status: 1,
              date: existingOrder?.orderDate,
              message: "Đơn hàng đặt thành công",
              sub: "Đơn hàng đã được đặt",
            };
          }
        });

      return res.status(STATUS.OK).json({
        message: "Lấy giá trị thành công",
        data: existingOrder,
        listStatusOrderDate,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  // đồng ý đơn hàng
  async confirmOrderAdmin(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn đơn hàng",
        });

      const existingOrder = await OrderModel.findById(id).populate({
        path: "orderItems",
        populate: [
          {
            path: "attribute",
          },
          {
            path: "product",
          },
        ],
      });

      if (!existingOrder) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có đơn hàng nào",
        });
      }

      if (existingOrder.status !== 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đơn hàng xảy ra lỗi",
        });
      }

      const checkAttribute = existingOrder.orderItems.find((item) => {
        const orderItem = item as IOrderItem;

        if (orderItem.is_simple) {
          return false;
        }

        if (!orderItem.attribute) {
          return true;
        }

        return false;
      });

      if (checkAttribute) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: `Sản phẩm '${
            ((checkAttribute as IOrderItem).product as IProduct)?.name
          }' đã không còn loại hàng (${
            (checkAttribute as IOrderItem).variant
          })`,
        });
      }

      const checkQuantity = existingOrder.orderItems.find((item) => {
        const itemData = item as IOrderItem;
        if (itemData.is_simple) {
          const check = itemData.product?.quantity < itemData.quantity;
          return check;
        }

        if (itemData.quantity > itemData.attribute?.quantity) {
          return true;
        }

        return false;
      });

      if (checkQuantity) {
        const itemData = checkQuantity as IOrderItem;

        return res.status(STATUS.BAD_REQUEST).json({
          message: `Sản phẩm '${itemData.product?.name}' đã hết hàng loại hàng (${itemData.variant})`,
        });
      }

      let futureDateTimeOrder = handleFutureDateTimeOrder(1000);

      if (existingOrder.distance) {
        futureDateTimeOrder = handleFutureDateTimeOrder(existingOrder.distance);
      }
      const orderUpdate = await OrderModel.findOneAndUpdate(
        {
          _id: existingOrder._id,
          status: 1,
        },
        {
          status: 2,
          $push: {
            statusList: 2,
            informationOrder: {
              name: "Xác nhận đơn hàng",
              date: Date.now(),
              content: "Đơn hàng đang được chuẩn bị",
            },
          },
          confirmedDate: Date.now(),
          estimatedDeliveryDate: futureDateTimeOrder,
        }
      );

      if (!orderUpdate) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đồng ý đơn hàng lỗi vì có xung đột ",
        });
      }

      await OrderItemsModel.updateMany(
        {
          _id: {
            $in: existingOrder.orderItems,
          },
        },
        {
          status: 2,
        },
        {
          now: true,
        }
      );

      existingOrder.orderItems.map(async (item, index) => {
        const orderItem = item as IOrderItem;
        const id = orderItem?.attribute?._id;
        const quantity = orderItem.quantity;
        const is_simple = orderItem.is_simple;

        if (!is_simple) {
          await AttributeModel.findByIdAndUpdate(id, {
            $inc: { quantity: -quantity },
          });
        }

        await ProductModel.findByIdAndUpdate(orderItem?.product?._id, {
          $inc: { quantity: -quantity },
        });
        await OrderItemsModel.findByIdAndUpdate(orderItem._id, {
          status: 2,
        });
      });

      socketNotificationOrderClient(
        existingOrder?.code as string,
        2,
        `${existingOrder?.user}`,
        existingOrder?._id as string
      );

      return res.status(STATUS.OK).json({
        message: "Cập nhập đơn hàng thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  // chuyể đơn vị vận chuyển
  async shippingUnit(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn đơn hàng",
        });

      const existingOrder = await OrderModel.findById(id).populate({
        path: "orderItems",
        populate: [
          {
            path: "attribute",
          },
          {
            path: "product",
          },
        ],
      });

      if (!existingOrder) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có đơn hàng nào",
        });
      }

      await OrderModel.findByIdAndUpdate(existingOrder._id, {
        is_shipper: true,
        $push: {
          informationOrder: {
            name: "Sang bên vị vận chuyển",
            date: Date.now(),
            content:
              "Đơn hàng đã đóng gói thành công và chuyển sang vận chuyển",
          },
        },
      });

      return res.status(STATUS.OK).json({
        message: "Cập nhập đơn hàng thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  // chọn shipper
  async deliveredToShipper(req: RequestModel, res: Response) {
    try {
      const { shipper } = req.body;
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa chọn đơn hàng",
        });
      }

      if (!shipper) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa chọn shipper",
        });
      }

      const existingOrder = await OrderModel.findById(id);

      if (!existingOrder) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có đơn hàng nào",
        });
      }

      if (existingOrder.status < 2) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đơn hàng chưa xác nhận",
        });
      }

      if (existingOrder.status > 2) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đơn hàng không được sửa shipper",
        });
      }

      const existingShipper = await ShipperModel.findById(shipper);

      if (!existingShipper) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có shipper nào",
        });
      }

      const updateOrder = await OrderModel.findByIdAndUpdate(
        id,
        {
          shipper: existingShipper._id,
          $push: {
            informationOrder: {
              name: "Đã chọn người vận chuyển",
              date: Date.now(),
              content: `Đơn hàng đã được giao cho shipper ${existingShipper.fullName}`,
            },
          },
        },
        { new: true }
      );

      socketNewOrderShipperClient(updateOrder, `${existingShipper.user}`);

      return res.status(STATUS.OK).json({
        message: "Chọn shipper thành công",
        data: updateOrder,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  // queryClient
  async pagingOrderClient(req: RequestModel, res: Response) {
    try {
      const { status, pageIndex, pageSize } = req.body;
      const user = req.user;
      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;
      let queryStatus = {};

      if (!status) {
        queryStatus = {
          status: {
            $in: [1, 2, 3, 4, 5, 6],
          },
        };
      } else if (status === 8) {
        queryStatus = {
          status: {
            $in: [4, 5],
          },
        };
      } else {
        queryStatus = {
          status: status,
        };
      }

      const listOrder = await OrderModel.find({
        user: user?.id,
        ...queryStatus,
      })
        .populate({
          path: "orderItems",
          populate: {
            path: "product",
            select: {
              _id: 1,
              price: 1,
              discount: 1,
              thumbnail: 1,
              name: 1,
              slug: 1,
            },
          },
        })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean();

      const convestOrder =
        listOrder.length > 0
          ? listOrder?.map((order: IOrder, index) => {
              if (order.orderItems.length > 0) {
                const mapItemOrder = order.orderItems.reduce(
                  (acc: IAccOrderClient[], item) => {
                    const accCheck = acc.find(
                      (row) =>
                        row.productId.toString() ===
                        (
                          (item as IOrderItem).product as IProductSelectOrder
                        )._id.toString()
                    );
                    if (accCheck) {
                      const totalMoney =
                        accCheck.totalMoney + (item as IOrderItem).totalMoney;
                      accCheck.items.push(item as IOrderItem);
                      accCheck.totalMoney = totalMoney;
                      return acc;
                    }

                    acc.push({
                      productId: (
                        (item as IOrderItem).product as IProductSelectOrder
                      )._id,
                      product: (item as IOrderItem)
                        .product as IProductSelectOrder,
                      totalMoney: (item as IOrderItem).totalMoney,
                      items: [item as IOrderItem],
                      is_evaluate: (item as IOrderItem).is_evaluate,
                    });
                    return acc;
                  },
                  []
                );
                return {
                  ...order,
                  itemList: mapItemOrder,
                };
              }

              return [];
            })
          : [];

      const countOrder = await OrderModel.countDocuments({
        user: user?.id,
        ...queryStatus,
      });

      const data = formatDataPaging({
        limit,
        pageIndex,
        data: convestOrder,
        count: countOrder,
      });

      return res.status(STATUS.OK).json({
        message: "Lấy danh sách thành công",
        data: data,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  // đã nhận hàng
  async receivedClientOrder(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn đơn hàng",
        });
      }

      const existingOrder = await OrderModel.findById(id).populate(
        "orderItems"
      );

      if (!existingOrder) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có đơn hàng",
        });
      }

      if (existingOrder.status !== 4) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đơn hàng chưa giao",
        });
      }

      const successOrder = await OrderModel.findByIdAndUpdate(
        id,
        {
          status: 5,
          $push: {
            statusList: 5,
            informationOrder: {
              name: "Giao hàng thành công",
              date: Date.now(),
              content: `Đơn hàng đã được nhận bởi ${existingOrder.address.username}`,
            },
          },
          deliveredDate: Date.now(),
        },
        { new: true }
      );

      await OrderItemsModel.updateMany(
        {
          _id: {
            $in: existingOrder.orderItems,
          },
        },
        {
          status: 5,
        },
        {
          now: true,
        }
      );

      return res.status(STATUS.OK).json({
        message: "Cập nhập thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  // hủy hàng
  async cancelClientOrder(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;
      const { note, cancelBy } = req.body;

      let noteCancel = note || "";

      if (cancelBy !== 1 && cancelBy !== 2 && cancelBy !== 3) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Truyền dữ liệu không thỏa mãn",
        });
      }

      if (!note) {
        if (cancelBy === 2) {
          noteCancel =
            "Sản phẩm của chúng tôi không cung cấp được xin lỗi quý khách";
        } else if (cancelBy === 3) {
          noteCancel =
            "Giao hàng thất bại bởi không liên lạc được với người dùng";
        }
      }

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn đơn hàng",
        });
      }

      const existingOrder = await OrderModel.findById(id);

      if (!existingOrder) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có đơn hàng",
        });
      }

      if (existingOrder.status !== 1 && existingOrder.status !== 3) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đơn hàng không thể huy",
        });
      }

      if (existingOrder.status === 1 && cancelBy === 3) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đơn hàng không thể hủy",
        });
      }

      if (existingOrder.status === 3 && cancelBy !== 3) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Đơn hàng không thể hủy",
        });
      }

      const successOrder = await OrderModel.findByIdAndUpdate(
        id,
        {
          status: 6,
          $push: {
            statusList: 6,
            informationOrder: {
              name: "Đơn hàng đã hủy",
              date: Date.now(),
              content: noteCancel,
            },
          },
          noteCancel,
          cancelBy: cancelBy,
          cancelOrderDate: Date.now(),
        },
        { new: true }
      );

      await OrderItemsModel.updateMany(
        {
          _id: {
            $in: existingOrder.orderItems,
          },
        },
        {
          status: 6,
        },
        {
          now: true,
        }
      );

      const customer = await CustomerModel.findOne({
        user: successOrder?.user,
      });

      if (customer) {
        await CustomerModel.findByIdAndUpdate(customer._id, {
          $inc: { totalOrder: 1, totalOrderCancel: 1 },
        });
      } else {
        await CustomerModel.create({
          user: successOrder?.user,
          totalOrder: 1,
          totalOrderCancel: 1,
        });
      }

      socketNotificationOrderClient(
        existingOrder?.code as string,
        6,
        `${existingOrder?.user}`,
        existingOrder?._id as string
      );

      return res.status(STATUS.OK).json({
        message: "Hủy đơn hàng thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getByIdOrderClient(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn đơn hàng",
        });

      const existingOrder = await OrderModel.findById(id).populate([
        "shipper",
        "payment",
        {
          path: "orderItems",
          populate: {
            path: "product",
            select: {
              name: 1,
              _id: 1,
              thumbnail: 1,
              price: 1,
              discount: 1,
            },
          },
        },
      ]);

      if (!existingOrder) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có đơn hàng nào",
        });
      }

      if (existingOrder.user.toString() !== user?.id.toString()) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn không có quyền xem chi tiết đơn hàng",
        });
      }

      const listStatusOrderDate = existingOrder.statusList
        .reverse()
        ?.map((item) => {
          if (item === 6) {
            return {
              status: 6,
              date: existingOrder?.cancelOrderDate,
              message: "Đơn hàng đã hủy",
            };
          } else if (item === 5) {
            return {
              status: 5,
              date: existingOrder?.deliveredDate,
              message: "Đơn hàng thành công",
            };
          } else if (item === 4) {
            return {
              status: 4,
              date: existingOrder?.shippedDate,
              message: "Đơn hàng giao thành công",
              sub: `Người nhận: ${existingOrder?.address.username}`,
            };
          } else if (item === 3) {
            return {
              status: 3,
              date: existingOrder?.shippingDate,
              message: "Đơn hàng đang giao",
              sub: `Đơn hàng sẽ sớm được giao, vui lòng chú ý điện thoại`,
            };
          } else if (item === 2) {
            return {
              status: 2,
              date: existingOrder?.confirmedDate,
              message: "Đơn hàng đang được chuẩn bị",
              sub: "Shop đang chuẩn bị đơn hàng",
            };
          } else if (item === 1) {
            return {
              status: 1,
              date: existingOrder?.orderDate,
              message: "Đơn hàng đặt thành công",
              sub: "Đơn hàng đã được đặt",
            };
          }
        });

      return res.status(STATUS.OK).json({
        message: "Lấy giá trị thành công",
        data: existingOrder,
        listStatusOrderDate,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new OrderController();
