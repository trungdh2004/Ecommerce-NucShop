import instance from "@/config/instance";
import { SearchObjectType } from "@/types/searchObjecTypes";
export const getBlogPaging = (searchObject: SearchObjectType) => {
	const uri = "/blogs/pagingBlog";
	return instance.post(uri, searchObject);
}
export const getMyBlog = (searchObject: SearchObjectType) => {
	const uri = "/blogs/pagingBlogUser";
	return instance.post(uri, searchObject);
}
export const newBlogs = (data: any) => {
	const uri = "/blogs/new-blogs";
	return instance.post(uri, data);
};
export const showBlogsEdit = (id: string) => {
	const uri = `/blogs/show-blog-edit/${id}`;
	return instance.get(uri);
};
export const getBlogDetail = (id: string) => {
	const uri = `/blogs/detail/${id}`;
	return instance.get(uri);
};
export const updateBlogs = (id: string, data: any) => {
	const uri = `/blogs/put-blogs/${id}`;
	return instance.put(uri, data);
};
export const publishBlogs = (id: string, data: any) => {
	const uri = `/blogs/publish/${id}`;
	return instance.put(uri, data);
};
export const pagingBlogs = (searchObj: SearchObjectType) => {
	const uri = `/blogs/pagingBlog`;
	return instance.post(uri, searchObj);
};
export const deleteBlogBYId = (id: string | boolean) => {
	const url = `/blogs/delete/${id}`;
	return instance.delete(url);
}
export const getBlogDetailClient = (id: string) => {
	const uri = `/blogs/detailClient/${id}`;
	return instance.get(uri);
};
export const actionUpdateReactions = ({id,isLike}:{id:string,isLike:boolean}) => {
	const uri = `/blogs/reactions/${id}`;
	return instance.put(uri,{isLike});
};
