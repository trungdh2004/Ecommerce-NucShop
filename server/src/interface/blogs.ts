export interface IBlogs {
  id?: number;
  user_id: string;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  content: string;
  views_count: number;
  // is_recommend: boolean;
  published_at: string;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
  comments_count?: number;
  countLike: number;
  selected_tags?: [];
  thumbnail_url: string;
  isNotification: boolean;
  is_delete: boolean;
  isPublish:boolean
}

export interface ITags {
  _id?: string;
  name: string;
  description: string;
  slug: string;
}
