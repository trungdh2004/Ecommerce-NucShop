import { Router } from "express";
import SizeController from "../../controllers/product/size.controller";

const routerSize = Router();

routerSize.post("/paging", SizeController.pagingSize);
routerSize.get("/getAll", SizeController.getAllSize);
routerSize.post("/addSize", SizeController.addSize);
routerSize.delete("/deleteSize/:id", SizeController.deleteById);
routerSize.put("/updateSize/:id", SizeController.updateSize);
routerSize.get("/size/:id", SizeController.getSizeById);
routerSize.put("/unDelete/:id", SizeController.unDeleteCategory);
routerSize.put("/deleteMany", SizeController.deleteMany);
routerSize.put("/unDeleteMany", SizeController.unDeleteMany);

export default routerSize;