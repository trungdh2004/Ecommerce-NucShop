import instance from "@/config/instance";
const endpoint = "/cart";
type addToCartType = {
	productId: string;
	quantity: number;
	attribute: string | null;
};
type pagingCart = {
	pageSize: number;
};
export const pagingCart = (payload: pagingCart) => {
	const uri = `${endpoint}/pagingCart`;
	return instance.post(uri, payload);
};
export const pagingCartV2 = () => {
	const uri = `${endpoint}/pagingCartV2`;
	return instance.get(uri);
};
export const addProductToCart = (data: addToCartType) => {
	const uri = `${endpoint}/addProductCart`;
	return instance.post(uri, data);
};
export const getCountMyShoppingCart = () => {
	const uri = `${endpoint}/countCart`;
	return instance.get(uri);
};
export const deleteCartItem = (listId: string | string[]) => {
	const uri = `${endpoint}/deleteProductCart`;
	listId = Array.isArray(listId) ? listId : [listId];
	return instance.post(uri, { listId });
};
export const updateCartItem = (
	id: string,
	payload: { quantity?: number; attribute?: string },
) => {
	const uri = `${endpoint}/updateProductCart/${id}`;
	return instance.put(uri, payload);
};
export const pagingNewCart = (payload: {
	pageIndex?: number;
	pageSize?: number;
}) => {
	const uri = `${endpoint}/pagingNewCart`;
	return instance.post(uri, payload);
};
type buyNowServicesType = {
	productId: string;
	quantity: number;
	attribute: string | null;
};
export const buyNowSevices = (payload: buyNowServicesType) => {
	const uri = `${endpoint}/productToOrder`;
	return instance.post(uri, payload);
};
