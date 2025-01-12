import { Router } from "express";
import notificationController from "../controllers/Notification.controller";
import authentication from "../middlewares/authentication";
const routerNotification = Router();

routerNotification.get("/paging",authentication,notificationController.pagingNotification);

routerNotification.put("/watched/:id",authentication,notificationController.handleWatched);

routerNotification.delete("/delete/:id",authentication,notificationController.handleDelete);

routerNotification.get("/watchedAll",authentication,notificationController.handleWatchedAll);

routerNotification.get("/pagingNotificationAdmin",authentication,notificationController.pagingNotificationAdmin);

routerNotification.put("/watchedNotificationAdmin/:id",authentication,notificationController.handleWatchedAdmin);


export default routerNotification;
