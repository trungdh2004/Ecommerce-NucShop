import { Request, Response } from "express";
import STATUS from "../../utils/status";

class UploadController {
  uploadSingleFileCloudinary = async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Message not found",
        });
      }
      return res.status(STATUS.OK).json(file);
    } catch (error: any) {
      // handle error here
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  };

  uploadMultipleFileCloudinary = async (req: Request, res: Response) => {
    try {
      const files = req.files;
      return res.status(STATUS.OK).json(files);
    } catch (error:any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      })
    }
  };
}

export default new UploadController();
