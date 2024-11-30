export interface SearchObjectOrder {
	status: number;
	pageIndex?: number;
	pageSize?: number;
	sort?: number;
	startDate?: Date | null;
	endDate?: Date | null;
	method?: number | null;
	paymentStatus?: boolean | null;
	is_shipper?: boolean | null;
}

