import instance from "@/config/instance";

export const getChartOrderDashboard = (status: number) =>
	instance.get("dashboard/chartOrder/" + status);

export const getChartUserDashboard = () => instance.get("dashboard/chartUser");

export const getNewOrder = () => instance.get("dashboard/listNewOrder");

export const getCountTotal = () => instance.get("dashboard/countTotal");

export const getCountProduct = () => instance.get("dashboard/getListProduct");

export const getCountCategory = () => instance.get("dashboard/getListCategory");

export const getToDayOrder = () => instance.get("dashboard/getOrderToDay");

export const getListBlogNew = () => instance.get("dashboard/getListBlog");
