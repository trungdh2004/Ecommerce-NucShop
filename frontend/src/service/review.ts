import instance from "@/config/instance";

export const getReviewProduct = (
	id: string,
	searchRating: {
		pageIndex: number;
		rating: number | null;
	},
) => instance.post(`/evaluate/paging/${id}`, searchRating);
