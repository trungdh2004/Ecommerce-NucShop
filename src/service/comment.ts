import instance from "@/config/instance";
import { IObjectComment } from "@/types/TypeObjectComment";

export const createComment = (
	content: string,
	commentId: string,
	commentType: string,
	parent_id?: string
) => {
	const data = instance.post(`/comment/createComment`, {
		content,
		commentId,
		commentType,
		parent_id
	});
	return data;
};

export const getListComments = (listObject: IObjectComment) => {
	const data = instance.post(`/comment/getListComment`, listObject);
	return data;
};

export const reactionsComment = (id: string, is_reacted: boolean) => {
	const data = instance.put(`/comment/reactionsComment/${id}`, {
		is_reacted: is_reacted,
	});
	return data;
};

export const deleteComment = (id: string) => {
  const data = instance.delete(`/comment/deleteComment/${id}`);
  return data;
};
