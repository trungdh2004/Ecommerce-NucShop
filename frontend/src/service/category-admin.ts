import instance from "@/config/instance";
import { SearchObjectType } from "@/types/searchObjecTypes";
import { TypeObjectCategory } from "@/types/TypeObjectCategory";
const urlConfig = "category";
export const getAllCate = async () => {
	const data = await instance.get(`${urlConfig}/getAllCate`);
	return data;
};

export const paddingCate = async (SearchObjectType: SearchObjectType) => {
	const data = await instance.post(
		`${urlConfig}/paddingCate`,
		SearchObjectType,
	);
	return data;
};

export const hiddencate = async (id: string | boolean) => {
	const data = await instance.delete(`${urlConfig}/deleteCate/${id}`);
	return data;
};

export const unhiddencate = async (id: string | boolean) => {
	const data = await instance.put(`${urlConfig}/unDelete/${id}`);
	return data;
};
export const getAllCategory = async () => {
	const data = await instance.get(`${urlConfig}/getAllCate`);
	return data;
};

export const hiddenManyCate = async (listId: any) => {
	const data = await instance.put(`${urlConfig}/deleteMany`, {
		listId,
	});
	return data;
};

export const unhiddenManyCate = async (listId: any) => {
	const data = await instance.put(`${urlConfig}/unDeleteMany`, {
		listId,
	});
	return data;
};

export const updateCategory = async (
	open: string | boolean,
	dataForm: TypeObjectCategory,
) => {
	const data = await instance.put(`${urlConfig}/updateCate/${open}`, dataForm);
	return data;
};

export const addCategory = async (dataForm: TypeObjectCategory) => {
	const data = await instance.post(`${urlConfig}/addCate`, dataForm);
	return data;
};

export const getCategory = async (open: string | boolean) => {
	const data = instance.get(`${urlConfig}/cate/${open}`);
	return data;
};
export const getCateById = async (id: string | number) => {
	const data = await instance.get(`${urlConfig}/getProductByCategory/${id}`);
	return data;
};
export const activeCategory = async ({
	id,
	active,
}: {
	id: string;
	active: boolean;
}) => {
	return instance.put(`${urlConfig}/activeCate/${id}`, { active });
};
export const getCategoryActive = () => {
	return instance.get(`${urlConfig}/getCateActive`);
};
