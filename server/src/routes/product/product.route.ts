import { Router } from "express";
import productController from "../../controllers/product/product.controller";

const routerProduct = Router();

routerProduct.post("/create", productController.addProduct);
routerProduct.get("/findById/:id", productController.getProductById);
routerProduct.put("/updateById/:id", productController.updateById);
routerProduct.put("/deletedById/:id", productController.deletedProductById);
routerProduct.put("/unDeletedById/:id", productController.unDeletedProductById);
routerProduct.put("/deletedMany", productController.deleteMany);
routerProduct.put("/unDeletedMany", productController.unDeleteMany);
routerProduct.post("/paging", productController.pagingProduct);
routerProduct.get("/findBySlug/:slug", productController.showProductById);
routerProduct.post("/pagingProductOfVoucher", productController.pagingProductOfVoucher);
routerProduct.get("/listProductHot", productController.listProductHot);



export default routerProduct;
