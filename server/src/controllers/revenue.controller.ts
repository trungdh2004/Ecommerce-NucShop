import { Response } from "express";
import { RequestModel } from "../interface/models";
import STATUS from "../utils/status";
import OrderModel from "../models/order/Order.schema";

interface IOrderArrayMonth {
  _id: string;
  totalMoney: number;
  orderItems: string[];
  orderDate: string;
  status: number;
}

const getAllDaysInMonth = (year: number, month: number) => {
  const days = new Map();
  const date = new Date(year, month - 1, 1);
  let i = 1;
  // Vòng lặp qua từng ngày trong tháng
  while (date.getMonth() === month - 1) {
    days.set(i, {
      value: i,
      totalMoney: 0,
      count: 0,
      name: `Ngày ${i}`,
      netRevenue: 0,
      countOrderSuccess: 0,
      countOrderCancel: 0,
    });
    i++;
    date.setDate(date.getDate() + 1);
  }

  return days;
};

const handleArrayMonth = (
  arr: IOrderArrayMonth[],
  type: string,
  month?: number,
  yearDefault?: number
) => {
  if (type === "month" && month) {
    const year = yearDefault ? yearDefault : new Date().getFullYear();
    const listDays = getAllDaysInMonth(year, month as number);

    arr.map((item) => {
      const day = new Date(item.orderDate).getDate();
      const valueMap = listDays.get(day);
      if (valueMap) {
        valueMap.totalMoney += item.totalMoney;
        valueMap.count += 1;
        if (item.status === 4 || item.status === 5) {
          valueMap.countOrderSuccess += 1;
          valueMap.netRevenue += item.totalMoney;
        }
        if (item.status === 6) {
          valueMap.countOrderCancel += 1;
        }
        listDays.set(day, valueMap);
      }
      return day;
    });
    return Array.from(listDays.values());
  } else {
    const mapYear = new Map();
    for (let i = 1; i <= 12; i++) {
      mapYear.set(i, {
        value: i,
        totalMoney: 0,
        count: 0,
        name: `Tháng ${i}`,
        netRevenue: 0,
        countOrderSuccess: 0,
        countOrderCancel: 0,
      });
    }

    arr.map((item) => {
      const day = new Date(item.orderDate).getMonth();
      const valueMap = mapYear.get(day + 1);
      if (valueMap) {
        valueMap.totalMoney += item.totalMoney;
        valueMap.count += 1;
        if (item.status === 4 || item.status === 5) {
          valueMap.countOrderSuccess += 1;
          valueMap.netRevenue += item.totalMoney;
        }
        if (item.status === 6) {
          valueMap.countOrderCancel += 1;
        }
        mapYear.set(day + 1, valueMap);
      }
    });

    return Array.from(mapYear.values());
  }
};

class RevenueController {
  async getCountRevenue(req: RequestModel, res: Response) {
    try {
      const listOrder = await OrderModel.find({
        status: {
          $in: [ 5, 6],
        },
      }).select({
        totalMoney: 1,
        orderItems: 1,
        status: 1,
      });

      let countSuccess = 0;
      let totalOrderSuccess = 0;
      let countCancel = 0;
      let totalOrderCancel = 0;

      const totalMoney = listOrder?.reduce((sum, item) => {
        if (item.status === 6) {
          countCancel += 1;
          totalOrderCancel += item.totalMoney;
        }

        if (item.status === 4 || item.status === 5) {
          countSuccess += 1;
          totalOrderSuccess += item.totalMoney;
        }
        return sum + item.totalMoney;
      }, 0);

      return res.status(STATUS.OK).json({
        totalMoney,
        count: listOrder.length,
        countSuccess,
        countCancel,
        totalOrderSuccess,
        totalOrderCancel,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getListDataRevenue(req: RequestModel, res: Response) {
    try {
      const { type = "toMonth", month, year } = req.query;
      let queryOrder = {};

      if (type === "year") {
        const currentYear = year ? +year : new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1); // Ngày 1 tháng 1 năm hiện tại, 00:00:00
        const endOfYear = new Date(currentYear + 1, 0, 1);

        queryOrder = {
          orderDate: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        };
      } else if (type === "month") {
        const now = new Date();
        const yearData = year ? +year : now.getFullYear();
        const monthData = month ? +month : now.getMonth();
        const startOfFebruary = new Date(yearData, monthData - 1, 1);
        const endOfFebruary = new Date(yearData, monthData, 1);

        queryOrder = {
          orderDate: {
            $gte: startOfFebruary,
            $lt: endOfFebruary,
          },
        };
      } else {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        queryOrder = {
          orderDate: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        };
      }

      const listOrder = await OrderModel.find<IOrderArrayMonth>({
        ...queryOrder,
        status: {
          $in: [5, 6],
        },
      }).select({
        totalMoney: 1,
        orderDate: 1,
        orderItems: 1,
        status: 1,
      });
      const newDate = new Date();
      let typeData = type === "year" ? "year" : "month";

      let monthData = type === "month" ? month : newDate.getMonth();

      let yearData = year ? year : newDate.getFullYear();

      const data = await handleArrayMonth(
        listOrder,
        typeData as string,
        monthData as number,
        yearData as number
      );

      return res.status(STATUS.OK).json(data);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new RevenueController();
