import { Router } from "express";
import evaluateController from "../controllers/order/evaluate.controller";
import authentication from "../middlewares/authentication";
const routerEvaluate = Router();

routerEvaluate.post(
  "/create",
  authentication,
  evaluateController.createEvaluate
);
routerEvaluate.post("/paging/:id", evaluateController.pagingEvaluate);
export default routerEvaluate;
