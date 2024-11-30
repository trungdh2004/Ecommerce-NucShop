import { Variants } from "framer-motion";
import { IColor } from "./typeProduct";

export interface IStatus {
	index: number | null;
	name: string | null;
}
export interface IProductOfOrder {
	_id: string;
	name: string;
	price: number;
	discount: number;
	thumbnail: string;
	slug: string;
}
export interface IItemOrder {
	_id: string;
	attribute: string;
	variant: string;
	product: IProductOfOrder;
	quantity: number;
	createdAt: string;
	updatedAt: string;
	is_evaluate: boolean;
	price: number;
}
export interface IItemOrderList {
	productId: string;
	product: IProductOfOrder;
	totalMoney: number;
	items: IItemOrder[];
	is_evaluate: boolean;
}
export interface IOrderList {
	_id: string;
	user: string;
	code: string;
	address: string;
	status: number;
	statusList: number[];
	voucher: string | null;
	voucherVersion: string | null;
	totalMoney: number;
	amountToPay: number;
	confirmedDate: string | null;
	shippingDate: string | null;
	shippedDate: string | null;
	deliveredDate: string | null;
	cancelBy: string | null;
	noteCancel: string | null;
	distance: number;
	shippingCost: number;
	estimatedDeliveryDate: string | null;
	paymentMethod: number;
	paymentStatus: boolean;
	payment: string | null;
	note: string;
	orderDate: string;
	createdAt: string;
	updatedAt: string;
	itemList: IItemOrderList[];
}
export interface IOrderItemDetail extends IItemOrder {
	status: number;
	totalMoney: number;
	__v?: number;
}
export interface IOrderDetail {
	_id: string;
	user: string;
	code: string;
	address: string;
	status: number;
	statusList: number[];
	voucher: string | null;
	voucherVersion: string | null;
	totalMoney: number;
	amountToPay: number;
	confirmedDate: string | null;
	shippingDate: string | null;
	shippedDate: string | null;
	deliveredDate: string | null;
	cancelBy: string | null;
	noteCancel: string | null;
	distance: number;
	shippingCost: number;
	estimatedDeliveryDate: string | null;
	paymentMethod: number;
	paymentStatus: boolean;
	payment: string | null;
	note: string;
	orderItems: IOrderItemDetail;
	orderDate: string;
	createdAt: string;
	updatedAt: string;
}
export interface IListStatusOrderDate {
	status: number;
	date: string;
	message: string;
	sub: string;
}

export interface IOrderMoneyValue {
	amount: number;
}

export type ProductOrderItem = {
	quantity: number;
	_id: string;
	thumbnail: string;
	name: string;
	discount: number;
	price: number;
	attribute: any | null;
	is_simple: boolean;
	createdAt: string;
	productId: string;
};

export type ProductOrder = {
	productId: string;
	totalAmount: number;
	items: ProductOrderItem[];
};
