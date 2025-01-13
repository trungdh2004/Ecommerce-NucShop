import { IAttribute, IColor, IProduct } from "./typeProduct";
import { ISize } from "./variants";

export interface ICartItem {
	_id?: string;
	name: string;
	price: number;
	discount: number;
	thumbnail: string;
	attribute: IAttribute;
	quantity?: number;
	quantitySold?: number;
	attributeProduct: IAttribute[];
	is_simple: boolean;
	totalQuantity: number;
}
export interface ICart {
	attributes: IAttribute[];
	items: ICartItem[];
	is_simple: boolean;
	product: IProduct;
	createdAt: string;
	listColor: [
		{
			colorId: string;
			colorName: string;
			list: [IAttribute];
			quantity: number;
			colorCode: string;
		},
	];
	listSize: [
		{
			sizeId: string;
			sizeName: string;
			list: [IAttribute];
			quantity: number;
		},
	];
}
export interface ICartPreview {
	_id: string;
	product: { _id: string; name: string; price: number; thumbnail: string };
	quantity: number;
	cart: string;
	attribute: {
		_id: string;
		color: IColor;
		size: ISize;
		price: number;
		quantity: number;
		discount: number;
		createdAt: Date;
		updatedAt: Date;
		__v: number;
	};
	createdAt: Date;
	updatedAt: Date;
	__v: number;
}
