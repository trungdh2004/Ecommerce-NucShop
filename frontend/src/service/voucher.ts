import instance from "@/config/instance";
import { SearchObjectType } from "@/types/searchObjecTypes";
import { IVoucher } from "@/types/voucher";
const url = "voucher";
export const takeApplyDiscountCode = (payload: {
	code: string;
	listId: string[];
}) => {
	return instance.post(`${url}/getCheck`, payload);
};
export const createVoucher = (payload: IVoucher) => {
	return instance.post(`${url}/add`, payload);
};
export const getPaginatedVouchers = async (
	SearchObjectType: SearchObjectType,
) => {
	return instance.post(`${url}/paging`, SearchObjectType);
};
export const getPaginatedVouchersClient = async (
	SearchObjectType: SearchObjectType,
) => {
	return instance.post(`${url}/pagingClient`, SearchObjectType);
};

export const updateVoucherById = async (payload?: IVoucher) => {
	const voucherId = payload?._id;
	delete (payload as any)._id;
	return instance.put(`${url}/update/${voucherId}`, payload);
};
export const getVoucherById = async (id: string) => {
	return instance.get(`${url}/findOneVoucher/${id}`);
};
export const activeVoucherById = async (id: string) => {
	return instance.put(`${url}/startAction/${id}`);
};
export const deActiveVoucherById = async (id: string) => {
	return instance.put(`${url}/stopAction/${id}`);
};

export const generateCodeAuto = async () => {
	return instance.get(`${url}/generateCodeAuto`);
};
export const updateViewHomeVoucherById = (id: string, isHome: boolean) => {
	return instance.put(`${url}/updatePublicHome/${id}`, { isHome });
};
export const getVoucherViewHome = (limit = 3) => {
	return instance.get(`${url}/listVoucherHome?limit=${limit}`);
};
