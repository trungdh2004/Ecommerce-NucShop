import { Router } from "express";
import shipperController from "../controllers/shipper/shipper.controller";
import authentication from "../middlewares/authentication";
import authenticationShipper from "../middlewares/authenticationShipper";
const routerShipper = Router();

routerShipper.post("/registerShipper",authentication, shipperController.registerShipper);
routerShipper.post("/paging",authentication, shipperController.pagingShipper);
routerShipper.post("/getShipperById/:id",authentication, shipperController.getShipperById);
routerShipper.put("/actionListShipper",authentication, shipperController.actionListShipper);
routerShipper.get("/getCurrentShipper",authentication, shipperController.getByCurrentShipper);
routerShipper.get("/getListOrderMap",authenticationShipper, shipperController.getListOrderShipperMap);
routerShipper.get("/getOrderByCode/:code",authenticationShipper, shipperController.getOrderByCode);
routerShipper.put("/updateStatusShippingOrder/:id",authenticationShipper, shipperController.updateStatusShippingOrder);
routerShipper.put("/updateStatusShippedOrder/:id",authenticationShipper, shipperController.updateStatusShippedOrder);
routerShipper.post("/getListOrderSuccessShipper",authenticationShipper, shipperController.getListOrderSuccessShipper);
routerShipper.post("/getListOrderIsShipper",authenticationShipper, shipperController.getListOrderIsShipper);
routerShipper.post("/pagingOrderShipper",authenticationShipper, shipperController.pagingOrderShipper);
routerShipper.post("/pagingOrderShipperAdmin/:id",authentication, shipperController.pagingOrderShipper);
routerShipper.get("/getDetailShipper/:id",authentication, shipperController.shipperDetailAdmin);
routerShipper.post("/getDetailShipperAdmin/:id",authentication, shipperController.pagingOrderShipperAdmin);
routerShipper.post("/changeAccountShipper",authenticationShipper, shipperController.changeAccountShipper);
routerShipper.post("/refuseOrderShipper/:id",authenticationShipper, shipperController.refuseOrderShipper);
routerShipper.post("/confirmOrderShipper/:id",authenticationShipper, shipperController.confirmOrderShipper);

export default routerShipper;
