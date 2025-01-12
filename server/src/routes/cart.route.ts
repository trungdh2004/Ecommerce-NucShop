import { Router } from "express";
import cartController from "../controllers/cart/cart.controller";
import authentication from "../middlewares/authentication";
const routerCart = Router();

routerCart.post("/addProductCart", authentication, cartController.addProductToCart);
routerCart.put("/updateProductCart/:id", authentication, cartController.updateCartItem);
routerCart.post("/pagingCart", authentication, cartController.pagingCart);
routerCart.post("/deleteProductCart", authentication, cartController.deleteCartItem);
routerCart.get("/countCart", authentication, cartController.getCountProductCart);
routerCart.post("/pagingNewCart", authentication, cartController.getPagingNewCartItem);
routerCart.post("/productToOrder", authentication, cartController.productToOrder);
routerCart.get("/pagingCartV2", authentication, cartController.pagingCartV2);

export default routerCart;
