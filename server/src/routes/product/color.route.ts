import { Router } from "express";
import colorController from "../../controllers/product/color.controller";

const routerColor = Router();

routerColor.get("/getAll", colorController.getAllColor);
routerColor.post("/paging", colorController.pagingColor);
routerColor.post("/add", colorController.addColor);
routerColor.delete("/delete/:id", colorController.deleteById);
routerColor.put("/update/:id", colorController.updateColor);
routerColor.get("/byId/:id", colorController.getColorById);
routerColor.put("/unDelete/:id", colorController.unDeleteColor);
routerColor.put("/deleteMany", colorController.blockedMany);
routerColor.put("/unDeleteMany", colorController.unBlockedMany);

export default routerColor;
