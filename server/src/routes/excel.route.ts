import { Router } from "express";
import ProductExcelController from "../controllers/file/ProductExcel.controller";
import multer from "multer";

const storage = multer.memoryStorage(); // Lưu file vào bộ nhớ tạm
const upload = multer({ storage: storage });
const routerExcel = Router();

routerExcel.get("/excel",ProductExcelController.exportExcelProduct);
routerExcel.post("/excelPro",ProductExcelController.pagingProductFile);
routerExcel.post("/import",upload.single('file'),ProductExcelController.exportExcel);
export default routerExcel;
