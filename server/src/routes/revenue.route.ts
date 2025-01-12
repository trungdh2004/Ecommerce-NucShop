import { Router } from "express";
import authentication from "../middlewares/authentication";
import revenueController from "../controllers/revenue.controller";
const routerRevenue = Router();

routerRevenue.get("/getCountRevenue",revenueController.getCountRevenue );
routerRevenue.get("/getListDataRevenue",revenueController.getListDataRevenue );
export default routerRevenue;
