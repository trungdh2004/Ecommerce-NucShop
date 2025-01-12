import { Router } from "express";
import searchController from "../controllers/search.controller";
import locationController from "../controllers/location.controller";
const routerSystem = Router();

routerSystem.get("/searchClient", searchController.searchClient);
routerSystem.get("/searchClientDetail", searchController.searchClientDetail);
routerSystem.post("/locationShop", locationController.createOrUpdate);
routerSystem.get("/getLocation", locationController.getLocation);
routerSystem.post("/contactForm", searchController.contactForm);
export default routerSystem;
