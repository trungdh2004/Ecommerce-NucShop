import { IProduct } from "./typeProduct";
import { IColor, ISize } from "./variants";

export interface IAttribute {
	color?: IColor;
	size?: ISize;
	createdAt?: string;
	discount?: number;
	price?: number;
	quantity?: number;
	updatedAt?: string;
	_id?: string;
}
export interface IProductDetail {
	_id?: string;
	name?: string;
	price?: number;
	discount?: number;
	description?: string;
	thumbnail?: string;
	images?: [
		{
			url: string;
			_id: string;
		},
	];
	is_deleted?: boolean;
	category?: {
		_id: string;
		name: string;
		description: string;
	};
	quantitySold: number;
	quantity: number;
	is_simple: boolean;
	isSpecial: boolean;
	attributes?: [IAttribute];
	createdAt?: string;
	updatedAt?: string;
	slug?: string;
	listColor?: IListColorAttribute[];
	listSize?: IListSizeAttribute[];
	rating: number;
	ratingCount: number;
	ratingQuantity: number;
	viewCount: number;
}
export interface IListSizeAttribute {
	sizeId: string;
	sizeName: string;
	list: [IAttribute];
	quantity: number;
}
export interface IListColorAttribute {
	colorId: string;
	colorName: string;
	list: [IAttribute];
	quantity: number;
	colorCode: string;
}
export interface IProductSlider {
	colorCode?: string;
	createdAt?: string;
	index?: number;
	label?: string;
	product?: IProduct;
	thumbnail?: string;
	title?: string;
	updatedAt?: string;
	__v?: number;
	_id?: string;
}

export interface IFilterProduct {
	category: string | null;
	min: number | null;
	max: number | null;
	color: string[];
	size: string[];
	fieldSort: string;
	sort: 1 | -1;
}
export interface IProductSearch {
	discount: number;
	name: string;
	price: number;
	quantity: number;
	quantitySold: number;
	rating: number;
	slug: string;
	thumbnail: string;
	_id: string;
}
