import { Router } from "express";
import TagsController from "../controllers/Tags";
const routerTags = Router();

routerTags.get("/getAllTags", TagsController.getAllTags);
routerTags.post("/add", TagsController.addTags);
routerTags.post("/paging", TagsController.pagingTags);
routerTags.get("/tag/:id", TagsController.getTagsById);
routerTags.put("/update/:id", TagsController.updateTags);
routerTags.delete("/delete/:id", TagsController.deleteById);
routerTags.put("/unDelete/:id", TagsController.UndeleteById);
routerTags.put("/deleteMany", TagsController.deleteMany);
routerTags.put("/unDeleteMany", TagsController.unDeleteMany);
export default routerTags;
