export interface IVoucher {
	code: string;
	createdAt: string;
	description: string;
	discountType: number;
	discountValue: number;
	endDate: string;
	maxAmount: number;
	minimumOrderValue: number;
	modifiedBy: string;
	modifiedDate: string;
	name: string;
	startDate: string;
	status: number;
	updatedAt: string;
	usageCount: number;
	usageLimit: number;
	listUseProduct: string[];
	user: string;
	type: string;
	_id: string;
}
