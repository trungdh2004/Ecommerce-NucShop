import { Router } from "express";
import BlogController from "../controllers/Blog.controller";
import authentication from "../middlewares/authentication";
const routerBlogs = Router();

routerBlogs.post("/pagingBlog", BlogController.pagingBlog);
routerBlogs.post(
  "/pagingBlogUser",
  authentication,
  BlogController.pagingBlogMyUser
);
routerBlogs.post("/new-blogs", authentication, BlogController.postBlogs);
routerBlogs.put("/put-blogs/:id", authentication, BlogController.putBlogs);
routerBlogs.get(
  "/show-blog-edit/:id",
  authentication,
  BlogController.showForEdit
);
routerBlogs.put("/publish/:id", authentication, BlogController.publish);
routerBlogs.get("/detail/:id", BlogController.getBlogById);
routerBlogs.get("/detailClient/:id", BlogController.getBlogDetailClient);
routerBlogs.put("/reactions/:id", authentication, BlogController.reactions);
routerBlogs.delete("/delete/:id", authentication, BlogController.deleteGetById);
routerBlogs.put(
  "/cancel-publish/:id",
  authentication,
  BlogController.cancelPublish
);
routerBlogs.post("/pagingBlogClient", BlogController.pagingBlogClient);

export default routerBlogs;
