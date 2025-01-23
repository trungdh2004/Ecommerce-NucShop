import instance from "@/config/instance";
import { ICustomer } from "@/types/customer";

export const pagingCustomer = (obj: ICustomer) =>
	instance.post(`/customer/paging`, obj);
