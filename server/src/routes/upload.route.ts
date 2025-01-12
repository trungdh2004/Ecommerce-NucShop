import { NextFunction, Request, Response, Router } from "express";
import UploadController from "../controllers/common/uploadCloud";
import uploadCloud from "../utils/helper";
import multer from "multer";
import STATUS from "../utils/status";
const routerUpload = Router();

// routerUpload.post(
//   "/singleImage",
//   uploadCloud.single("image"),
//   UploadController.uploadSingleFileCloudinary
// );

routerUpload.post(
  "/singleImage",
  (req: Request, res: Response, next: NextFunction) => {
    uploadCloud.single("image")(req, res, (err: any) => {
      if (err) {
        // Xử lý lỗi tải ảnh lên
        console.error("Error uploading image:", err);

        if (err instanceof multer.MulterError) {
          // Xử lý lỗi Multer
          return res
            .status(STATUS.BAD_REQUEST)
            .json({ error: "Multer error: " + err?.message });
        } else if (err?.message?.includes("Cloudinary")) {
          // Xử lý lỗi từ Cloudinary
          return res
            .status(STATUS.INTERNAL)
            .json({ error: "Cloudinary error: " + err?.message });
        } else {
          // Xử lý các lỗi khác
          return res
            .status(STATUS.INTERNAL)
            .json({ error: "Unknown error: " + err.message });
        }
      }
      next();
    });
  },
  UploadController.uploadSingleFileCloudinary
);

routerUpload.post(
  "/multipleImage",
  (req: Request, res: Response, next: NextFunction) => {
    uploadCloud.array("images")(req, res, (err: any) => {
      if (err) {
        // Xử lý lỗi tải ảnh lên
        console.error("Error uploading image:", err.message);

        if (err instanceof multer.MulterError) {
          // Xử lý lỗi Multer
          return res
            .status(STATUS.BAD_REQUEST)
            .json({ error: "Multer error: " + err.message });
        } else if (err.message.includes("Cloudinary")) {
          // Xử lý lỗi từ Cloudinary
          return res
            .status(STATUS.INTERNAL)
            .json({ error: "Cloudinary error: " + err.message });
        } else {
          // Xử lý các lỗi khác
          return res
            .status(STATUS.INTERNAL)
            .json({ error: "Unknown error: " + err.message });
        }
      }
      next();
    });
  },
  UploadController.uploadMultipleFileCloudinary
);

export default routerUpload;
