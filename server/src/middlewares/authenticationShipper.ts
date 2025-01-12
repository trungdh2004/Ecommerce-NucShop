import jwt, { VerifyErrors } from "jsonwebtoken";
import STATUS from "../utils/status";
import { NextFunction, Request, Response } from "express";
import UserModel from "../models/User.Schema";
import { RequestModel, RequestShipper } from "../interface/models";
import ShipperModel from "../models/shipper/Shipper.schema";

interface PayloadToken {
  id: any;
  email: string;
  is_admin: boolean;
  is_staff: boolean;
}

 const authenticationShipper = async (
  req: RequestShipper,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(STATUS.AUTHORIZED).json({
        message: "Bạn chưa đăng nhập",
      });
    }

    jwt.verify(
      token,
      process.env.SECRET_ACCESSTOKEN!,
      async (err: VerifyErrors | null, data?: object | string) => {
        if (err) {
          let message = "Lỗi token";

          if (err.message === "invalid token") {
            message = "Token không hợp lệ";
          }
          if (err.message === "jwt expired") {
            message = "Token đã hết hạn";
          }

          return res.status(STATUS.AUTHORIZED).json({
            message: message,
          });
        }

        const existingUser = await UserModel.findById(
          (data as PayloadToken).id
        );

        if (!existingUser) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Tài khoản không thỏa mãn",
          });
        }

        if (!existingUser?.is_shipper) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Tài khoàn không phải shipper",
          });
        }

        const existingShipper = await ShipperModel.findOne({
          user: existingUser?._id,
        });

        if (!existingShipper) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Tài khoản không phải shipper",
          });
        }

        req.shipper = {
          id: existingShipper?._id,
          email: existingUser.email,
          phone: existingShipper.phone,
          id_user:existingUser?._id,
          fullName:existingShipper?.fullName
        };

        next();
      }
    );
  } catch (error: any) {
    return res.status(STATUS.INTERNAL).json({
      message: error.message,
    });
  }
};


export default authenticationShipper