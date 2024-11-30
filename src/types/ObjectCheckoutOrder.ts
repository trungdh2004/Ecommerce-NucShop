export interface Address {
	location: number[];
	_id: string;
	user: string;
	username: string;
	is_main: boolean;
	phone: string;
	city: {
		name: string;
		idProvince: string;
		_id: string;
	};
	district: {
		name: string;
		idDistrict: string;
		_id: string;
	};
	commune: {
		name: string;
		idCommune: string;
		_id: string;
	};
	address: string;
	detailAddress: string;
	deleted: boolean;
}

export interface ObjectCheckoutOrder {
	listId: string[];
	addressId: string;
	voucher?: string | null;
	paymentMethod: number;
	note?: string;
  shippingCost?: number;
  returnUrl?: string;
}

interface Color {
	_id: string;
	name: string;
	code: string;
	slug: string;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
}

interface Size {
	_id: string;
	name: string;
	slug: string;
	fromHeight: number;
	toHeight: number;
	fromWeight: number;
	toWeight: number;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
}

interface Attribute {
	color: Color;
	size: Size;
	discount: number;
	price: number;
	quantity: number;
	_id: string;
	createdAt: string;
}

export default interface ProductOrder {
	_id: string;
	name: string;
	price: number;
	discount: number;
	quantity: number;
	quantitySold: number;
	productID: string;
	createdAt: string;
	thumbnail: string;
	attribute: Attribute;
}

export interface ResponseData {
	address: Address;
	data: ProductOrder;
	message: string;
	shippingCost: number;
	voucherMain: any;
}
