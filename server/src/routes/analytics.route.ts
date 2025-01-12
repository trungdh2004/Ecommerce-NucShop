import { Router } from "express";
import UserAdmin from "../controllers/admin/user.admin";
import authorization from "../middlewares/authorization";
import authentication from "../middlewares/authentication";
const routerAdmin = Router();

routerAdmin.post("/list-user", UserAdmin.listCurrentUsers);
routerAdmin.put("/updateRole/:id",authorization, UserAdmin.updateRole);
routerAdmin.post("/list-staff",authentication, UserAdmin.pagingStaff);

export default routerAdmin;
