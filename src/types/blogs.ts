export type IBlogs = {
	_id?: string;
	title: string;
	content: string;
	isDeleted: string;
	createdAt: string;
	published_at: string;
	isPublish: boolean;
	user_id: {
		avatarUrl?: string;
		email: string;
		_id: string;
		full_name: string;
	};
	views_count: number;
	countLike: number;
	comments_count: number;
	thumbnail_url?: string;
	meta_description: string;
	meta_title?: string;
	tags: string;
};
export interface IBlogSearch {
	_id: string;
	title: string;
	thumbnail_url: string;
	meta_title: string;
	meta_description: string;
	views_count: number;
	published_at: string;
	countLike: number;
	slug: string;
	user_id: { _id: string; full_name: string; avatarUrl: string };
}
