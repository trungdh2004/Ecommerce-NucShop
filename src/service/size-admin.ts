import instance from "@/config/instance";
import { SearchObjectType } from "@/types/searchObjecTypes";
import { SizeTypes } from "@/types/typeSize";

export const paddingSize = async (SearchObjectType: SearchObjectType) => {
	return await instance.post(`/size/paging`, SearchObjectType);
};

export const addSize = async (dataForm: SizeTypes) => {
	return await instance.post(`/size/addSize`, dataForm);
};

export const updateSize = async (id: string | boolean, dataForm: SizeTypes) => {
	return await instance.put(`/size/updateSize/${id}`, dataForm);
};

export const getSizeId = async (id: string | boolean) => {
	return await instance.get(`/size/size/${id}`);
}

export const hiddenSize = async (id: string | boolean) => {
	return await instance.delete(`size/deleteSize/${id}`);
};

export const unhiddenSize = async (id: string | boolean) => {
	return await instance.put(`size/unDelete/${id}`);
};

export const hiddenListSize = async (listId: any) => {
	return await instance.put(`size/deleteMany`, {
		listId,
	});
};
export const getAllSize = () => {
	return instance.get(`size/getAll`);
};

export const unhiddenListSize = async (listId: any) => {
	return await instance.put(`size/unDeleteMany`, {
		listId,
	});
};

