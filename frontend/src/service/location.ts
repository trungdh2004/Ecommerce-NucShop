import instance from "@/config/instance";
import { ILocation } from "@/types/location";

export const getLocation = () => instance.get("/system/getLocation");

export const updateLocation = (obj: ILocation) =>
	instance.post("/system/locationShop", obj);
