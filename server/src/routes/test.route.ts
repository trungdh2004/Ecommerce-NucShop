import { Router } from "express";
import { pagingTest, TestSocket, testVnPay, toolOrder } from "../controllers/test";
import authentication from "../middlewares/authentication";
import requestController from "../controllers/request.controller";

const routerTest = Router();

routerTest.get("/socketAll", TestSocket);
routerTest.post("/pagingTest", pagingTest);
routerTest.get("/momo", testVnPay);
routerTest.post("/toolOrder",authentication, toolOrder);
routerTest.get("/request",requestController.getCountRevenue);
export default routerTest;
