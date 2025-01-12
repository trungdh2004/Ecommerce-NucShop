import instance from "@/config/instance";

interface IParamsGetListDataRevenue {
	type?: string;
	year?: number | string;
	month?: number | string;
}

export const getListDataRevenue = ({
	type = "",
	year = "",
	month = "",
}: IParamsGetListDataRevenue) => {
	const searchParams = new URLSearchParams();

	const params = {
		type,
		year: String(year),
		month: String(month),
	};

	Object.entries(params).forEach(([key, value]) => {
		if (value) searchParams.append(key, value);
	});

	const queryString = searchParams.toString();
	const url = `/revenue/getListDataRevenue${queryString ? `?${queryString}` : ""}`;

	return instance.get(url);
};
export const getCountRevenue = () => {
	const url = `/revenue/getCountRevenue`;
	return instance.get(url);
};
