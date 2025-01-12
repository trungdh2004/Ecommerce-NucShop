import { Router } from "express";
import { pagingTest, TestSocket, testVnPay, toolOrder } from "../controllers/test";
import authentication from "../middlewares/authentication";
const routerTest = Router();

routerTest.get("/socketAll", TestSocket);
routerTest.post("/pagingTest", pagingTest);
routerTest.get("/momo", testVnPay);
routerTest.post("/toolOrder",authentication, toolOrder);
export default routerTest;
