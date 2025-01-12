import { Router } from "express";
import addressController from "../controllers/address.controller";
import authentication from "../middlewares/authentication";

const routerAddress = Router();

routerAddress.post(
  "/paddingAddress",
  authentication,
  addressController.paddingAddress
);
routerAddress.post(
  "/addAddress",
  authentication,
  addressController.postAddress
);
routerAddress.delete(
  "/deleteAddress/:id",
  authentication,
  addressController.deleteAddress
);
routerAddress.put(
  "/updateAddress/:id",
  authentication,
  addressController.updateAddress
);
routerAddress.put(
  "/updateMain/:id",
  authentication,
  addressController.updateMainAddress
);
routerAddress.get("/:id", authentication, addressController.getAddressById);
routerAddress.post(
  "/getAddressMeter",
  authentication,
  addressController.getAddressMeter
);

export default routerAddress;
