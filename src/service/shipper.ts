import instance from "@/config/instance";
import { IOrderShipper, IShipper } from "@/types/shipper.interface";

export const registerShipper = async (obj: IShipper) =>
	instance.post(`/shipper/registerShipper`, obj);
export const changeAccountShipper = (obj: IShipper) =>
	instance.post(`/shipper/changeAccountShipper`, obj);
export const getCurrentShipper = async () =>
	instance.get(`/shipper/getCurrentShipper`);

export const getListOrderMap = async () =>
	instance.get(`/shipper/getListOrderMap`);

export const getOrderMapByCode = async (code: string) =>
	instance.get(`/shipper/getOrderByCode/${code}`);

export const updateStatusShippingOrder = async (id: string): Promise<any> =>
	instance.put(`/shipper/updateStatusShippingOrder/` + id);

export const updateStatusShippedOrder = async (id: string): Promise<any> =>
	instance.put(`/shipper/updateStatusShippedOrder/` + id);

export const pagingShipper = async (ObjectSearchShipper: any) =>
	instance.post(`/shipper/paging`, ObjectSearchShipper);

export const pagingOrderShipper = (pageIndex?: number, status?: number) =>
	instance.post(`/shipper/pagingOrderShipper?page=${pageIndex}`, { status });
export const updateActionShippers = ({
	listId,
	type = 1,
	isBlock = false,
}: {
	listId: string[];
	type?: number;
	isBlock?: boolean;
}) => instance.put(`/shipper/actionListShipper`, { listId, type, isBlock });
export const getDetailShipperById = (id: string) =>
	instance.get(`/shipper/getDetailShipper/${id}`);
export const pagingOrderShipperById = (
	id: string,
	{ pageIndex = 0, status = 1 },
) =>
	instance.post(`/shipper/getDetailShipperAdmin/${id}`, { pageIndex, status });
