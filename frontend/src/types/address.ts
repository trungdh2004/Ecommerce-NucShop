export interface IAddress {
	_id: string;
	username: string;
	phone: string;
	city: {
		name: string;
		idProvince: string;
		_id?: string;
	};
	district: {
		name: string;
		idDistrict: string;
		_id?: string;
	};
	commune: {
		name: string;
		idCommune: string;
		_id?: string;
	};
	user: string;
	address: string;
	detailAddress: string;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
	location: {
		type: string;
		coordinates: number[];
	};
}
export interface ICity {
	idProvince: string;
	name: string;
}

export interface IDistrict {
	idDistrict: string;
	name: string;
}
export interface ICommune {
	idCommune: string;
	name: string;
}
