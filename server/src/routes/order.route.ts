import { Router } from "express";
import authentication from "../middlewares/authentication";
import orderController from "../controllers/order/order.controller";
import authorizationStaff from "../middlewares/authoricationStaff";
const routerOrder = Router();

routerOrder.post(
  "/createOrderPayUponReceipt",
  authentication,
  orderController.createOrderPayUponReceiptV2
);
routerOrder.post(
  "/pagingCartOrder",
  authentication,
  orderController.pagingCartState
);
routerOrder.post(
  "/createStateUrlCart",
  authentication,
  orderController.createStateUrlCart
);
routerOrder.get(
  "/returnVnPay",
  authentication,
  orderController.returnOrderVnPay
);
routerOrder.get(
  "/returnUrlMoMo",
  authentication,
  orderController.returnUrlMomo
);
routerOrder.post(
  "/createOrderVNPayPayment",
  authentication,
  orderController.createOrderVNPayPayment
);

// admin
routerOrder.post(
  "/pagingOrderServer",
  authentication,
  orderController.pagingOrderAdmin
);
routerOrder.get(
  "/getByIdServer/:id",
  authentication,
  orderController.getByIdOrderAdmin
);
routerOrder.post(
  "/confirmOrder/:id",
  authentication,
  orderController.confirmOrderAdmin
);
routerOrder.post(
  "/shippingUnit/:id",
  authentication,
  orderController.shippingUnit
);
routerOrder.post(
  "/deliveredToShipper/:id",
  authentication,
  orderController.deliveredToShipper
);
routerOrder.post(
  "/cancelOrder/:id",
  authentication,
  orderController.cancelClientOrder
);

// client
routerOrder.post(
  "/pagingOrderClient",
  authentication,
  orderController.pagingOrderClient
);
routerOrder.get(
  "/getDetailOrder/:id",
  authentication,
  orderController.getByIdOrderClient
);
routerOrder.get(
  "/receivedClientOrder/:id",
  authentication,
  orderController.receivedClientOrder
);

export default routerOrder;
