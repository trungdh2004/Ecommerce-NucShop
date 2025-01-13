export interface ICustomer {
	sort: number;
	pageIndex: number;
	pageSize: number;
}

export interface IPagingPayment extends ICustomer {
	keyword: string;
	startDate: string | null;
	endDate: string | null;
}