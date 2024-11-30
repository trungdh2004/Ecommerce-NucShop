export interface IObjectComment {
	commentId: string | undefined;
	commentType: string;
	pageIndex?: number;
	pageSize?: number;
	sort?: number;
}

interface User {
	avatarUrl: string;
	full_name: string;
	is_admin: boolean;
	is_staff: boolean;
	_id: string;
}

export interface Comment {
	commentType: string;
	comment_id: string;
	content: string;
	createdAt: string;
	is_removed: boolean;
	reactions: any[];
	reactions_count: number;
	replies: string[];
	replies_count: number;
	updatedAt: string;
	user: User;
	_id: string;
}

export interface IPageComment {
	pageIndex: number;
	pageSize: number;
	totalPage: number;
	totalOptionPage: number;
	totalAllOptions: number;
}