import { IAddress } from "./address";

export interface IShipper {
	user?: string;
	fullName: string;
	birthDate: Date;
	address: string;
	idCitizen: string;
	avatar: string;
	phone: string;
	is_block?: boolean;
	active?: boolean;
	block_at?: string;
	totalIncome?: number;
	createdAt?: string;
	updatedAt?: string;
	city: {
		name: string;
		idProvince: string;
	};
	district: {
		name: string;
		idDistrict: string;
	};
	commune: {
		name: string;
		idCommune: string;
	};
}

export interface IOrderShipper {
	_id?: string;
	code: string;
	address: IAddress;
	totalMoney: number;
	amountToPay: number;
	shippingCost: number;
	status: number;
	orderItems: string[];
	note: string;
}

export interface SearchShipperOrder {
	pageSize: number;
	pageIndex: number;
	active: boolean | null;
	isBlock: boolean | null;
	keyword: string;
}
export interface IShipperDetail {
	shipper: {
		_id: string;
		user: {
			_id: string;
			point: number;
			email: string;
			avatarUrl: string;
		};
		fullName: string;
		birthDate: string;
		idCitizen: string;
		avatar: string;
		phone: string;
		is_block: boolean;
		active: boolean;
		block_at: null;
		totalIncome: number;
		city: {
			name: string;
			idProvince: string;
			_id: string;
		};
		district: {
			name: string;
			idDistrict: string;
			_id: string;
		};
		commune: {
			name: string;
			idCommune: string;
			_id: string;
		};
		address: string;
		createdAt: string;
		updatedAt: string;
		__v: number;
	};
	countOrderConfirm: number;
	countOrderRunning: number;
	countOrderSuccess: number;
	countOrderCancel: number;
}
export interface IShipperListOrder {
	_id: string;
	user: string;
	code: string;
	address: {
		location: {
			type: string;
			coordinates: number[];
		};
		_id: string;
		user: string;
		username: string;
		is_main: boolean;
		phone: string;
		city: {
			name: string;
			idProvince: string;
			_id: string;
		};
		district: {
			name: string;
			idDistrict: string;
			_id: string;
		};
		commune: {
			name: string;
			idCommune: string;
			_id: string;
		};
		address: string;
		detailAddress: string;
		deleted: boolean;
		createdAt: string;
		updatedAt: string;
		__v: number;
	};
	status: number;
	statusList: number[];
	voucherAmount: number;
	voucher: any;
	voucherVersion: any;
	totalMoney: number;
	amountToPay: number;
	confirmedDate: string;
	shippingDate: string;
	shippedDate: string;
	deliveredDate: any;
	cancelOrderDate: any;
	cancelBy: any;
	noteCancel: any;
	distance: number;
	shippingCost: number;
	estimatedDeliveryDate: string;
	paymentMethod: number;
	paymentStatus: boolean;
	payment: any;
	note: string;
	shipper: string;
	orderItems: string[];
	orderDate: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}
