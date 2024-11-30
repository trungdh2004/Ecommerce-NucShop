export interface ISearchPopup {
	listBlog: {
		_id: string;
		slug: string;
		title: string;
		thumbnail_url: string;
		meta_title: string;
		meta_description: string;
		views_count: number;
		countLike: number;
		published_at: string;
	}[];
	listProduct: {
		rating: number;
		slug: string;
		_id: string;
		name: string;
		price: number;
		discount: number;
		thumbnail: string;
		quantitySold: number;
		quantity: number;
	}[];
}
