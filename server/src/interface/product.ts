export interface ICategory {
  _id: string;
  name: string;
  description: string;
  slug:string;
  active?: boolean;
}
export interface IColor {
  _id: string;
  name: string;
  code: string;
  slug: string;
}
export interface ISize {
  _id: string;
  name: string;
  toHeight: number;
  fromHeight: number;
  toWeight: number;
  fromWeight: number;
  slug: string;
}

export interface IProduct {
  _id?: string;
  name: string;
  price: number;
  discount: number;
  description: string;
  thumbnail: string;
  images: { url: string }[];
  slug: string;
  is_deleted: boolean;
  is_simple: boolean;
  is_hot: boolean;
  category: string;
  quantitySold: number;
  quantity: number;
  ratingCount:number;
  rating: number;
  ratingQuantity: number;
  attributes: IAttribute[] | string[];
}

export interface IAttribute {
  _id?: string;
  color: string | IColor;
  size: string | ISize;
  price: number;
  quantity: number;
  discount: number;
}

export interface IAttributeV2 {
  _id?: string;
  color: IColor;
  size: ISize;
  price: number;
  quantity: number;
  discount: number;
}


export interface IProductSlider {
  _id?: string;
  label: string;
  name: string;
  index: number;
  product: string | IProduct,
  colorCode: string,
  thumbnail?: string
}

export interface ICategoryActive {
  _id?: string;
  index: number;
  category: string | ICategory,
}