import { Request, Response } from "express";
import { generateVoucherCode } from "../middlewares/generateSlug";
import VoucherModel from "../models/order/Voucher.schema";
import STATUS from "../utils/status";
import { RequestModel } from "../interface/models";
import OrderModel from "../models/order/Order.schema";
import { voucherValidation } from "../validation/voucher.validation";
import { formatDataPaging } from "../common/pagingData";
import { IVoucher } from "../interface/voucher";
import CartItemModel from "../models/cart/CartItem.schema";
import { IndexCartItem } from "../interface/cart";

const generateCode = async (): Promise<string> => {
  let code = generateVoucherCode();

  const existingCode = await VoucherModel.findOne({
    code: code,
  });
  if (existingCode) {
    return generateCode();
  }
  return code;
};

export const checkVoucher = (voucher: IVoucher) => {
  if (voucher.status === 0) {
    return {
      message: "Voucher không hoạt động",
      check: false,
    };
  }

  const dateNow = new Date().getTime();
  const stopVoucher = voucher.endDate;
  const startDateVoucher = voucher.startDate;

  if (dateNow < new Date(startDateVoucher).getTime()) {
    return {
      message: "Voucher chưa đến thời gian sử dụng",
      check: false,
    };
  }
  if (dateNow > new Date(stopVoucher).getTime()) {
    return {
      message: "Voucher đã hết hạn",
      check: false,
    };
  }

  if (voucher.usageCount >= voucher.usageLimit) {
    return {
      message: "Voucher đã hết lượt sử dụng",
      check: false,
    };
  }

  return {
    check: true,
    voucher,
  };
};

export const handleAmountVoucher = (
  voucher: IVoucher,
  totalMoney: number,
  listProduct: {
    productId: string;
    totalMoney: number;
  }[]
) => {
  if (voucher.type === "1") {
    if (voucher.minimumOrderValue > totalMoney) {
      return {
        status: false,
        amount: 0,
        valueAmount: totalMoney,
        message: "Tổng số tiền không thỏa mãn",
      };
    }

    if (voucher.discountType === 1) {
      const downAmount = voucher.discountValue;
      const amount = totalMoney - downAmount;
      if (amount < 0) {
        return {
          status: true,
          amount: totalMoney,
          valueAmount: 0,
          message: "",
        };
      } else {
        return {
          status: true,
          amount: downAmount,
          valueAmount: amount,
          message: "",
        };
      }
    } else {
      const downAmount = voucher.discountValue;
      const percentAmount = (totalMoney * downAmount) / 100;
      const checkDownVoucher =
        percentAmount > voucher.maxAmount ? voucher.maxAmount : percentAmount;

      return {
        status: true,
        amount: checkDownVoucher,
        valueAmount: totalMoney - checkDownVoucher,
        message: "",
      };
    }
  } else {
    const getCheckProduct = listProduct?.filter((item) =>
      voucher.listUseProduct.includes(item.productId)
    );

    if (getCheckProduct.length === 0) {
      return {
        status: false,
        amount: 0,
        valueAmount: totalMoney,
        message: "Voucher không thể áp dụng được",
      };
    }

    const totalListPro = getCheckProduct.reduce((acc: number, item) => {
      return acc + item.totalMoney;
    }, 0);

    if (voucher.minimumOrderValue > totalListPro) {
      return {
        status: false,
        amount: 0,
        valueAmount: totalMoney,
        message: "Tổng số tiền không thỏa mãn",
      };
    }

    if (voucher.discountType === 1) {
      const downAmount = voucher.discountValue;
      const amount = totalListPro - downAmount;
      if (amount < 0) {
        return {
          status: true,
          amount: totalListPro,
          valueAmount: totalMoney - totalListPro,
          message: "",
        };
      } else {
        return {
          status: true,
          amount: downAmount,
          valueAmount: totalMoney - downAmount,
          message: "",
        };
      }
    } else {
      const downAmount = voucher.discountValue;
      const percentAmount = (totalListPro * downAmount) / 100;

      const checkDownVoucher =
        percentAmount > voucher.maxAmount ? voucher.maxAmount : percentAmount;

      return {
        status: true,
        amount: checkDownVoucher,
        valueAmount: totalMoney - checkDownVoucher,
        message: "",
      };
    }
  }
};

class VoucherController {
  async addVoucher(req: RequestModel, res: Response) {
    try {
      const user = req.user;

      const { error } = voucherValidation.validate(req.body);

      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }

      const {
        name,
        description,
        startDate,
        endDate,
        discountType,
        discountValue,
        usageLimit,
        minimumOrderValue,
        code,
        type,
        listUseProduct,
        maxAmount,
      } = req.body;

      const existingCode = await VoucherModel.findOne({
        code,
      });

      if (existingCode) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Mã Voucher đã có",
        });
      }

      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);
      newStartDate.setHours(0, 0, 0, 0);
      newEndDate.setHours(0, 0, 0, 0);

      const newVoucher = await VoucherModel.create({
        name,
        description,
        startDate: newStartDate,
        endDate: newEndDate,
        discountType,
        discountValue,
        usageLimit,
        code,
        user: user?.id,
        minimumOrderValue,
        listUseProduct,
        maxAmount,
        type,
      });

      return res.status(STATUS.OK).json({
        message: "Tạo thành công",
        data: newVoucher,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async generateCodeAuto(req: RequestModel, res: Response) {
    try {
      const code = await generateCode();

      return res.status(STATUS.OK).json({
        message: "Đã tạo mã code mới",
        code,
      });
    } catch (error) {}
  }

  async getVoucherCode(req: RequestModel, res: Response) {
    try {
      const { code, listId } = req.body;
      const user = req.user;
      if (listId?.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn sản phẩm",
        });
      }

      if (!code)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa nhập code",
        });

      const existingVoucher = await VoucherModel.findOne({
        code: code,
      });

      if (!existingVoucher)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có voucher nào !!",
        });

      const existingOrderVoucher = await OrderModel.findOne({
        user: user?.id,
        voucher: existingVoucher?.id,
        status: {
          $ne: 0,
        },
      });

      if (existingOrderVoucher) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Voucher này bạn đã sử dụng",
        });
      }

      if (existingVoucher.status === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Voucher không hoạt động",
        });
      }

      const dateNow = new Date().getTime();
      const stopVoucher = existingVoucher.endDate;
      const startDateVoucher = existingVoucher.startDate;

      if (dateNow < new Date(startDateVoucher).getTime()) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Voucher chưa đến thời gian sử dụng",
        });
      }

      if (dateNow > new Date(stopVoucher).getTime()) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Voucher đã hết hạn",
        });
      }

      if (existingVoucher.usageCount >= existingVoucher.usageLimit) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Voucher đã hết lượt sử dụng",
        });
      }

      const listCartItem = await CartItemModel.find<IndexCartItem>({
        _id: {
          $in: listId,
        },
      }).populate([
        {
          path: "product",
          select: {
            _id: 1,
            discount: 1,
            price: 1,
            quantity: 1,
          },
        },
        {
          path: "attribute",
        },
      ]);

      if (listCartItem?.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có sản phẩm nào",
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

      const valueCheck = handleAmountVoucher(
        existingVoucher,
        totalMoney,
        listProduct
      );

      if (!valueCheck.status) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: valueCheck.message,
        });
      }

      return res.status(STATUS.OK).json({
        message: "Lấy voucher thành công",
        valueCheck,
        voucher: existingVoucher,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async stopAction(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn giá trị",
        });

      const existingAction = await VoucherModel.findById(id);

      if (!existingAction)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có voucher",
        });

      const update = await VoucherModel.findByIdAndUpdate(id, {
        status: 2,
      });

      return res.status(STATUS.OK).json({
        message: "Ngừng sử dụng thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async startAction(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn giá trị",
        });

      const existingAction = await VoucherModel.findById(id);

      if (!existingAction)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có voucher",
        });

      const update = await VoucherModel.findByIdAndUpdate(id, {
        status: 1,
        version: existingAction.version + 1,
      });

      return res.status(STATUS.OK).json({
        message: "Sử dụng thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async updateVoucher(req: RequestModel, res: Response) {
    try {
      const {
        name,
        description,
        startDate,
        endDate,
        discountType,
        discountValue,
        usageLimit,
        minimumOrderValue,
        code,
        type,
        listUseProduct,
        maxAmount,
      } = req.body;

      const { id } = req.params;
      const { error } = voucherValidation.validate(req.body);

      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }
      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn voucher",
        });
      }

      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);
      newStartDate.setHours(0, 0, 0, 0);
      newEndDate.setHours(0, 0, 0, 0);

      const existingVoucher = await VoucherModel.findById(id);

      if (!existingVoucher) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có voucher nào",
        });
      }

      const existingCheckCode = await VoucherModel.findOne({
        code,
        _id: {
          $ne: existingVoucher._id,
        },
      });

      if (existingCheckCode) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Mã Voucher đã có",
        });
      }

      const newVoucher = await VoucherModel.findByIdAndUpdate(id, {
        name,
        description,
        startDate: newStartDate,
        endDate: newEndDate,
        discountType,
        discountValue,
        usageLimit,
        minimumOrderValue,
        code,
        maxAmount,
        type,
        listUseProduct,
      });

      return res.status(STATUS.OK).json({
        message: "Cập nhập thành công",
        data: newVoucher,
      });
    } catch (error: any) {
      console.log("error", error);

      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async findOneVoucher(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa nhập id",
        });

      const existingVoucher = await VoucherModel.findById(id);

      if (!existingVoucher) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có voucher",
        });
      }

      return res.status(STATUS.OK).json({
        message: "Lấy sản phẩm thành công",
        data: existingVoucher,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async pagingVoucher(req: RequestModel, res: Response) {
    try {
      const {
        pageIndex,
        pageSize,
        keyword,
        startDate,
        tab,
        discountType,
        usageLimit,
        sort,
        fieldSort,
      } = req.body;
      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;
      let queryKeyword = keyword
        ? {
            $or: [
              {
                name: {
                  $regex: keyword,
                  $options: "i",
                },
              },
              {
                code: {
                  $regex: keyword,
                  $options: "i",
                },
              },
            ],
          }
        : {};
      let queryStartDate = {};
      let queryDiscountType = {};
      let queryUsageLimit = {};
      let queryTab = {};
      let querySort = {};

      if (tab === 2) {
        queryTab = {
          status: 2,
        };
      } else {
        queryTab = {
          status: 1,
        };
      }

      if (startDate) {
        queryStartDate = {
          startDate: {
            $gte: startDate,
          },
        };
      }

      if (discountType) {
        queryDiscountType = {
          discountType: discountType,
        };
      }

      if (usageLimit) {
        queryUsageLimit = {
          usageLimit: usageLimit,
        };
      }

      if (fieldSort) {
        querySort = {
          [fieldSort]: sort,
        };
      } else {
        querySort = {
          createdAt: sort,
        };
      }

      const listVoucher = await VoucherModel.find({
        ...queryTab,
        ...queryStartDate,
        ...queryDiscountType,
        ...queryUsageLimit,
        ...queryStartDate,
        ...queryKeyword,
      })
        .sort(querySort)
        .skip(skip)
        .limit(limit);

      const countVoucher = await VoucherModel.countDocuments({
        ...queryTab,
        ...queryStartDate,
        ...queryDiscountType,
        ...queryUsageLimit,
        ...queryStartDate,
      });
      const result = formatDataPaging({
        limit,
        pageIndex,
        data: listVoucher,
        count: countVoucher,
      });
      return res.status(STATUS.OK).json(result);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async deleteList(req: RequestModel, res: Response) {
    try {
      const { listId } = req.body;

      if (!listId || listId?.lenght === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn voucher",
        });
      }

      const existingVoucher = await VoucherModel.find({
        _id: {
          $in: [listId],
        },
      });

      if (!existingVoucher) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có voucher nào",
        });
      }

      if (existingVoucher?.length !== listId?.length) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có voucher nào",
        });
      }

      await VoucherModel.deleteMany({
        _id: {
          $in: [listId],
        },
      });

      return res.status(STATUS.OK).json({
        message: "Xóa thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async updatePublicHome(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      const { isHome } = req.body;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa nhập id",
        });
      }

      const existingVoucher = await VoucherModel.findById(id);

      if (!existingVoucher) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có voucher",
        });
      }

      const update = await VoucherModel.findByIdAndUpdate(id, {
        isHome: !!isHome,
      });

      return res.status(STATUS.OK).json({
        message: "Cập nhập thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async listVoucherHome(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 3;

      const newDate = new Date();

      const listVoucher = await VoucherModel.find({
        isHome: true,
        status: 1,
        startDate: {
          $lte: newDate,
        },
        endDate: {
          $gte: newDate,
        },
      }).limit(limit);

      return res.status(STATUS.OK).json({
        message: "Danh sách voucher",
        data: listVoucher,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async pagingVoucherClient(req: Request, res: Response) {
    try {
      const { pageIndex, pageSize } = req.body;
      const limit = pageSize || 8;
      const skip = (pageIndex - 1) * limit || 0;

      const newDate = new Date();

      const listVoucher = await VoucherModel.find({
        status: 1,
        startDate: {
          $lte: newDate,
        },
        endDate: {
          $gte: newDate,
        },
      })
        .skip(skip)
        .limit(limit)
        .sort({
          createdAt: -1,
        });

      const count = await VoucherModel.countDocuments({
        status: 1,
        startDate: {
          $lte: newDate,
        },
        endDate: {
          $gte: newDate,
        },
      });

      const result = formatDataPaging({
        limit,
        pageIndex: pageIndex,
        data: listVoucher,
        count,
      });

      return res.status(STATUS.OK).json(result);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new VoucherController();
