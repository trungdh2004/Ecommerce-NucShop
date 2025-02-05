import { Request, Response } from "express";
import STATUS from "../utils/status";
import RequestModel from "../models/Request.schema";

class RequestController {
  async getCountRevenue(req: Request, res: Response) {
    try {
      const locationIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

      await RequestModel.create({
        ip:locationIP,
        userAgent
      })

      return res.status(STATUS.OK).json("ok");
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new RequestController();