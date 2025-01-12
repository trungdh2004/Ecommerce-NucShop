import instance from "@/config/instance";
import { SearchObjectType } from "@/types/searchObjecTypes";
import { TypeObjectCategory } from "@/types/TypeObjectCategory";
export const getAllTags = async () => {
	const data = await instance.get(`tags/getAllTags`);
	return data;
};
export const hiddentag = async (id: string | boolean) => {
	const data = await instance.delete(`tags/delete/${id}`);
	return data;
};
export const unhiddentag = async (id: string | boolean) => {
	const data = await instance.put(`tags/unDelete/${id}`);
	return data;
};
export const pagingTags = async (searchObject: SearchObjectType) => {
	const data = await instance.post(`/tags/paging`, searchObject);
	return data;
};

export const updateTag = async (
	open: string | boolean,
	dataForm: TypeObjectCategory,
) => {
	const data = instance.put(`/tags/update/${open}`, dataForm);
	return data;
};

export const addTag = async (dataForm: TypeObjectCategory) => {
	const data = await instance.post(`/tags/add`, dataForm);
	return data;
};

export const getTag = async (open: string | boolean) => {
	const data = await instance.get(`/tags/tag/${open}`);
	return data;
};

export const hiddenListTag = async (listId: any) => {
	const data = await instance.put(`tags/deleteMany`, {
		listId,
	});
	return data;
};

export const unhiddenListTag = async (listId: any) => {
	const data = await instance.put(`tags/unDeleteMany`, {
		listId,
	});
	return data;
};
