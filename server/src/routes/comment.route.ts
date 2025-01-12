import { Router } from "express";
import CommentController from "../controllers/comment/Comment.controller";
import authentication from "../middlewares/authentication";

const routerComment = Router();
routerComment.post("/createComment",authentication, CommentController.createComment);
routerComment.post("/getListComment", CommentController.getListComments);
routerComment.put("/reactionsComment/:id",authentication, CommentController.reactionsComment);
routerComment.delete("/deleteComment/:id",authentication, CommentController.deleteComment);
export default routerComment;
