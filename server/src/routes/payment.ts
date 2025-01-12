import { Router } from "express";
import paymentController from "../controllers/payment/payment.controller";
import authentication from "../middlewares/authentication";
const routerPayment = Router();

routerPayment.post(
  "/pagingPaymentClient",
  authentication,
  paymentController.pagingClient
);
routerPayment.post(
  "/pagingPaymentAdmin",
  authentication,
  paymentController.pagingAdmin
);
export default routerPayment;
