import instance from "@/config/instance";
import { ObjectCheckoutOrder } from "@/types/ObjectCheckoutOrder";
import { SearchObjectOrder } from "@/types/searchObjectOrder";

export const pagingOrder = async (listId: any) => {
	const data = await instance.post(`/order/pagingCartOrder`, listId);
	return data;
};

export const createOrderPayUponReceipt = async (
	orderCheckout: ObjectCheckoutOrder,
) => {
	const data = await instance.post(
		`/order/createOrderPayUponReceipt`,
		orderCheckout,
	);
	return data;
};

export const createOrderVNPayPayment = (orderCheckout: ObjectCheckoutOrder) => {
	const data = instance.post(`/order/createOrderVNPayPayment`, orderCheckout);
	return data;
};

// export const createOrderMoMo = async (
// 	orderCheckout: ObjectCheckoutOrder,
// ) => {
// 	const data = await instance.post(
// 		`/order/createOrderVNPayPayment`,
// 		orderCheckout,
// 	);
// 	return data;
// };

export const returnUrlVnPay = async (dataUrl: any) => {
	const data = await instance.get(`/order/returnVnPay?${dataUrl}`);
	return data;
};

export const returnUrlMoMo = async (dataUrl: any) => {
	const data = await instance.get(`/order/returnUrlMoMo?${dataUrl}`);
	return data;
};

export const pagingOrderAdmin = async (
	SearchObjectOrder: SearchObjectOrder,
) => {
	const data = await instance.post(
		`/order/pagingOrderServer`,
		SearchObjectOrder,
	);
	return data;
};

export const getOrderById = async (id: string) => {
	const data = await instance.get(`/order/getByIdServer/${id}`);
	return data;
};

export const confirmOrder = async (id: string) => {
	const data = await instance.post(`/order/confirmOrder/${id}`);
	return data;
};

export const selectShipper = async ({
	id,
	shipper,
}: {
	id: string;
	shipper: string | undefined;
}) => {
	const data = await instance.post(`/order/deliveredToShipper/${id}`, {
		shipper,
	});
	return data;
};

export const updateIsShiper = (id: string) => {
	return instance.post(`/order/shippingUnit/${id}`);
};

export const cancelOrder = async (
	id: string,
	note: string | null,
	cancelBy?: number,
) => {
	const data = await instance.post(`/order/cancelOrder/${id}`, {
		note: note,
		cancelBy: cancelBy,
	});
	return data;
};
export const createStateUrlCart = (payload: {
	listId: string[];
	voucher: string | null;
}) => {
	return instance.post(`/order/createStateUrlCart`, payload);
};
export const fetchOrder = async (obj: { status: null | number }) => {
	const data = await instance.post(`/order/pagingOrderClient`, obj);
	return data;
};

export const fetchOrderDetail = async (id: string) => {
	const data = await instance.get(`/order/getDetailOrder/${id}`);
	return data;
};
export const receivedClientOrder = async (id: string) => {
	const data = await instance.get(`/order/receivedClientOrder/${id}`);
	return data;
};
