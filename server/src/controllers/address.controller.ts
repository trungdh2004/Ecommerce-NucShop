import { Request, Response } from "express";
import AddressModel from "../models/Address.schema";
import UserModel from "../models/User.Schema";
import { addressValidation } from "../validation/address.validation";
import STATUS from "../utils/status";
import { IAddress } from "../interface/address";
import { RequestModel } from "../interface/models";
import mongoose, { ObjectId } from "mongoose";

class AddressController {
  // theo người dùng
  async paddingAddress(req: RequestModel, res: Response) {
    try {
      const { pageIndex = 1, pageSize } = req.body;
      const user = req.user;
      let limit = pageSize || 5;
      let skip = (pageIndex - 1) * limit || 0;

      const address = await AddressModel.find({
        user: user?.id,
        deleted: false,
      })
        // .populate("user")
        .skip(skip)
        .limit(limit)
        .sort({ is_main: -1, createdAt: -1 });
      const addressLength = await AddressModel.countDocuments({
        user: user?.id,
        deleted: false,
      });

      const totalPage =
        addressLength === 0 ? 0 : Math.ceil(addressLength / limit);
      const totalOptionPage = address.length;
      const totalAllOptions = addressLength;
      const result = {
        pageIndex: pageIndex,
        pageSize: limit,
        totalPage,
        totalOptionPage,
        totalAllOptions,
        content: address,
      };
      res.json({
        ...result,
      });
    } catch (error) {}
  }

  async postAddress(req: RequestModel, res: Response) {
    try {
      const { error } = addressValidation.validate(req.body);

      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }

      let is_main = false;

      const {
        username,
        phone,
        city,
        district,
        commune,
        address,
        detailAddress,
        location,
      }: IAddress = req.body;

      if (!req.user) {
        return res.status(STATUS.AUTHENTICATOR).json({
          message: "Mời bạn đăng nhập",
        });
      }

      const existingUser = await UserModel.findById(req.user.id);

      if (!existingUser) {
        return res.status(STATUS.AUTHENTICATOR).json({
          message: "Bạn chưa đăng nhập",
        });
      }

      const countAddress = await AddressModel.countDocuments({
        user: req.user?.id,
        is_main: true,
        deleted: false,
      });

      if (countAddress === 0) {
        is_main = true;
      }

      const newAddress = await AddressModel.create({
        user: existingUser._id,
        username,
        phone,
        city,
        district,
        commune,
        address,
        location: {
          type: "Point",
          coordinates: location,
        },
        detailAddress,
        is_main: is_main,
      });

      return res.status(STATUS.OK).json({
        message: "Tạo địa chỉ mới thành công",
        data: newAddress,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async deleteAddress(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const { id } = req.params;

      if (!user) {
        return res.status(STATUS.AUTHENTICATOR).json({
          message: "Bạn chưa đăng nhập",
        });
      }

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa truyền id địa chỉ",
        });
      }

      const existingAddress = await AddressModel.findById(id);

      if (!existingAddress) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có địa chỉ nào ",
        });
      }

      if (existingAddress.user.toString() !== user.id.toString()) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn không có quyền xóa",
        });
      }

      await AddressModel.findByIdAndDelete(existingAddress._id);

      if (existingAddress.is_main) {
        await AddressModel.findOneAndUpdate(
          {
            is_main: false,
          },
          { is_main: true }
        );
      }

      return res.status(STATUS.OK).json({
        message: "Xóa địa chỉ thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getAddressById(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!user) {
        return res.status(STATUS.AUTHENTICATOR).json({
          message: "Bạn chưa đăng nhập",
        });
      }

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa truyền id của địa chỉ",
        });
      }

      const existingAddress = await AddressModel.findById<IAddress>(
        id
      ).populate("user");

      if (!existingAddress) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có địa chỉ thỏa mãn",
        });
      }

      const userID = existingAddress.user._id;

      if (!userID || userID.toString() !== user?.id.toString()) {
        return res.status(STATUS.OK).json({
          message: "Bạn không có quyền lấy địa chỉ",
        });
      }
      return res.status(STATUS.OK).json({
        message: "Lấy địa chỉ thành công",
        data: existingAddress,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async updateMainAddress(req: RequestModel, res: Response) {
    try {
      const user = req.user;

      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn hay chọn giá trị bạn muốn mặc định",
        });
      }

      const existingAddress = await AddressModel.findById(id);

      if (!existingAddress) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có địa chỉ nào phù hợp",
        });
      }

      await AddressModel.findOneAndUpdate(
        {
          user: user?.id,
          is_main: true,
        },
        {
          is_main: false,
        }
      );

      const updateMainAddress = await AddressModel.findByIdAndUpdate(
        id,
        {
          is_main: true,
        },
        { new: true }
      );

      return res.status(STATUS.OK).json({
        message: "Thay đổi địa chỉ mặc định thành công",
        data: updateMainAddress,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async updateAddress(req: RequestModel, res: Response) {
    try {
      const { error } = addressValidation.validate(req.body);
      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }

      const {
        username,
        phone,
        city,
        district,
        commune,
        address,
        detailAddress,
        location,
      }: IAddress = req.body;
      const { id } = req.params;
      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn địa chỉ ",
        });
      }

      const existingAddress = await AddressModel.findById(id);

      if (!existingAddress) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có địa chỉ nào phù hợp ",
        });
      }

      if (!req.user) {
        return res.status(STATUS.AUTHENTICATOR).json({
          message: "Mời bạn đăng nhập",
        });
      }
      const newAddress = await AddressModel.findByIdAndUpdate(
        existingAddress._id,
        {
          username,
          phone,
          city,
          district,
          commune,
          address,
          location: {
            type: "Point",
            coordinates: location,
          },
          detailAddress,
        },
        { new: true }
      );

      return res.status(STATUS.OK).json({
        message: "Chỉnh sửa địa chỉ thành công",
        data: newAddress,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getAddressMeter(req: RequestModel, res: Response) {
    try {
      const { location, meter } = req.body;
      // const data = await AddressModel.find({
      //   location:{
      //     $geoWithin: {
      //       $centerSphere: [
      //         location, // Tọa độ của bạn
      //         meter / 6378.1 // Khoảng cách tính bằng bán kính Trái Đất (6378.1 km)
      //       ]
      //     }

      //   }
      // })
      const nearbyLocations = await AddressModel.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: location,
            },
            distanceField: "dist.calculated",
            spherical: true,
          },
        },
        {
          $match: {
            _id: new mongoose.Types.ObjectId("66b1f3bc0f8ee5d0274e5263"),
          },
        },
      ]);

      return res.status(STATUS.OK).json({
        nearbyLocations,
        message: "Lấy thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new AddressController();
