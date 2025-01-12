import { Router } from "express";
import authentication from "../middlewares/authentication";
import CustomerController from "../controllers/Customer.controller";

const routerCustomer = Router();
routerCustomer.post("/paging",authentication, CustomerController.pagingCustomer);
routerCustomer.put("/updateRank/:id",authentication, CustomerController.updateRanks);

export default routerCustomer;
