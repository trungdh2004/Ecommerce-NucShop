import instance from "@/config/instance";
import { SearchObjectTypeProduct } from "@/types/searchObjecTypes";
import { IProduct } from "@/types/typeProduct";

const url = "product";

export const addProduct = (value: IProduct) =>
	instance.post(`${url}/create`, value);

export const getProductById = (id: string) =>
	instance.get(`${url}/findById/${id}`);

export const updateProductById = (id: string, value: IProduct) =>
	instance.put(`${url}/updateById/${id}`, value);

export const pagingProduct = (value: SearchObjectTypeProduct) =>
	instance.post(`${url}/paging`, value);

export const deletedById = (id: string) =>
	instance.put(`${url}/deletedById/${id}`);

export const unDeletedById = (id: string) =>
	instance.put(`${url}/unDeletedById/${id}`);

export const unDeleteMany = (value: { listId: string[] }) =>
	instance.put(`${url}/unDeletedMany`, value);

export const deleteMany = (value: { listId: string[] }) =>
	instance.put(`${url}/deletedMany`, value);
export const getProductBySlug = (slug: string) =>
	instance.get(`${url}/findBySlug/${slug}`);

export const listProductHot = () => instance.get(`product/listProductHot`);

export const pagingProductOfVoucher = ({
	pageIndex,
	keyword,
}: {
	pageIndex: number;
	keyword: string;
}) => instance.post(`${url}/pagingProductOfVoucher`, { pageIndex, keyword });

export const exportServiceProduct = () =>
	instance.post(
		`file/excelPro`,
		{},
		{
			responseType: "blob", // Quan trọng: đặt responseType là 'blob'
		},
	);

export const importServiceProduct = (data: FormData) =>
	instance.post(`file/import`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

export const pagingProductComing = (obj: any) =>
	instance.post(`productComing/paging`, obj);

export const createProductComing = (obj: any) =>
	instance.post(`productComing/create`, obj);

export const updateActiveProductComing = (id: string) =>
	instance.get(`productComing/active/${id}`);

export const deleteProductComing = (id: string) =>
	instance.delete(`productComing/delete/${id}`);

export const getProductComingById = (id: string) =>
	instance.get(`productComing/findById/${id}`);

export const updateProductComing = (id: string, object: any) =>
	instance.put(`productComing/update/${id}`, object);
export const findProductActive = () =>
	instance.get(`productComing/findByActive`);
