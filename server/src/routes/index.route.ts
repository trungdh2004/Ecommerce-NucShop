import { Router } from "express";
import routerAuth from "./auth.route";
import routerAddress from "./adress.route";
import routerCategory from "./product/category.route";
import routerProduct from "./product/product.route";
import authentication from "../middlewares/authentication";
import routerAdmin from "./analytics.route";
import routerUpload from "./upload.route";
import routerTags from "./tags.route";
import routerBlogs from "./blog.route";
import routerSize from "./product/size.route";
import routerColor from "./product/color.route";
import routerCart from "./cart.route";
import routerOrder from "./order.route";
import routerVoucher from "./voucher.route";
import routerShipper from "./shipper.route";
import routerDashboard from "./dashboard.route";
import routerNotification from "./notification.route";
import routerComment from "./comment.route";
import routerEvaluate from "./evaluate.route";
import routerSystem from "./sysTem.router";
import routerPayment from "./payment";
import routerExcel from "./excel.route";
import routerCustomer from "./customer.route";
import routerChat from "./chat.route";
import routerProductComing from "./product/productComing.route";
import routerRevenue from "./revenue.route";
import routerTest from "./test.route";
// import routerTest from "./test.route";
// import routerTest from "./test.route";

const router = Router();

router.use("/auth", routerAuth); //
router.use("/address", routerAddress);//
router.use("/category", routerCategory);//
router.use("/color", routerColor);//
router.use("/product", routerProduct);//
router.use("/admin", routerAdmin);//
router.use("/upload", routerUpload);//
router.use("/tags", routerTags);//
router.use("/blogs", routerBlogs);//
router.use("/size", routerSize);//
router.use("/cart", routerCart);
router.use("/order", routerOrder);
router.use("/voucher", routerVoucher);
router.use("/shipper", routerShipper);
router.use("/dashboard", routerDashboard);
router.use("/notification", routerNotification);
router.use("/comment", routerComment);
router.use("/evaluate", routerEvaluate);
router.use("/system", routerSystem);
router.use("/payment", routerPayment);
router.use("/file", routerExcel);
router.use("/customer", routerCustomer);
router.use("/chat", routerChat);
router.use("/productComing", routerProductComing);
router.use("/revenue", routerRevenue);

router.use("/test", routerTest);

export default router;
