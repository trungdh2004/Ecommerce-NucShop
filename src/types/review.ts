interface User {
	_id: string;
	full_name: string;
	email: string;
	avatarUrl: string;
}

export interface Review {
	_id: string;
	product: string;
	rating: number;
	user: User;
	attribute: string;
	content: string;
	isDelete: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface SearchRatingState {
	pageIndex: number;
	pageSize: number;
	totalPage: number;
	totalOptionPage: number;
	totalAllOptions: number;
	content: Review[] | [];
}
