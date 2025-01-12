import { Router } from "express";
import DashboardController from "../controllers/Dashboard.controller";
const routerDashboard = Router();

routerDashboard.get("/countTotal", DashboardController.getCountTotalDashboard);
routerDashboard.get("/chartOrder/:status", DashboardController.chartDateOrder);
routerDashboard.get("/chartUser", DashboardController.getMethodRegister);
routerDashboard.get("/listNewOrder", DashboardController.getListOrderNew);
routerDashboard.get("/getListProduct", DashboardController.getListProductChart);
routerDashboard.get("/getListCategory", DashboardController.getListCategoryChart);
routerDashboard.get("/getOrderToDay", DashboardController.getOrderToDay);
routerDashboard.get("/getListBlog", DashboardController.getListNewBlog);
export default routerDashboard;
