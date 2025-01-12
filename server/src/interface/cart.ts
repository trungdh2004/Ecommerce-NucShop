import { IUser } from "./models";
import { IAttribute, IProduct } from "./product";

export interface ICart {
  _id: string;
  user: string | IUser;
}

export interface IProductCart {
  product: string | IProduct;
  quantity: number;
  cart: string | ICart;
  attribute: IAttribute | string;
}
//
// data find

export interface IndexCartItem {
  is_simple: boolean;
  _id: string;
  product: ProductFindCart;
  quantity: number;
  cart: string;
  attribute: AttributeFind;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface AttributeFind {
  _id: string;
  color: Color;
  size: Size;
  price: number;
  quantity: number;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Color {
  _id: string;
  name: string;
  code: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  __v: number;
}

export interface Size {
  _id: string;
  name: string;
  fromHeight: number;
  toHeight: number;
  toWeight: number;
  fromWeight: number;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  __v: number;
}

export interface ProductFindCart {
  is_simple: boolean;
  is_hot: boolean;
  is_deleted:boolean;
  _id: string;
  name: string;
  price: number;
  discount: number;
  thumbnail: string;
  quantity: number;
  attributes: AttributeFind[];
  createdAt: Date;
  slug: string;
}

// data new

export interface IndexResAcc {
  createdAt: Date;
  items: Item[];
  attributes: AttributeElement[];
  product: ProductFindCart;
  listColor: ListColor[];
  listSize: ListSize[];
  is_simple: boolean;
}

export interface AttributeElement {
  _id: string;
  color: Color;
  size: Size;
  quantity: number;
  discount: number;
  price: number;
}

export interface Item {
  quantity: number;
  createdAt: Date;
  _id: string;
  price: number;
  name: string;
  discount: number;
  thumbnail: string;
  attribute: ItemAttribute;
  is_simple: boolean;
  productId: string;
  slug: string;
  totalQuantity?: number;
}

export interface ItemAttribute {
  _id: string;
  color: Color;
  size: Size;
  price: number;
  quantity: number;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ListColor {
  colorId: string;
  colorName: string;
  list: AttributeElement[];
  quantity: number;
  colorCode: string;
}

export interface ListSize {
  sizeId: string;
  sizeName: string;
  list: AttributeElement[];
  quantity: number;
}

export interface Image {
  url: string;
  _id: string;
}
