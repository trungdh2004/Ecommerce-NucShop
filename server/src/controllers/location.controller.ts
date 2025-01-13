import { Request, Response } from "express";
import STATUS from "../utils/status";
import LocationModel from "../models/Location.schema";

class LocationController {
  async createOrUpdate(req: Request, res: Response) {
    try {
      const { long, lat } = req.body;

      let findLocation = await LocationModel.findOne();

      if (!findLocation) {
        findLocation = await LocationModel.create({
          long: long,
          lat,
        });
      }

      const updateLocation = await LocationModel.findByIdAndUpdate(
        findLocation._id,
        {
          long: long,
          lat,
        },
        {
          new: true,
        }
      );

      return res.status(STATUS.OK).json(updateLocation);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getLocation(req: Request, res: Response) {
    try {
      const findOneLocation = await LocationModel.findOne();
      return res.status(STATUS.OK).json(findOneLocation);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new LocationController();
