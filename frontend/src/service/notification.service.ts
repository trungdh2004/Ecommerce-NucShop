import instance from "@/config/instance";

export const getPagingNotification = (page: number, before?: string | null) =>
	instance.get(
		`/notification/paging?page=${page}${before ? "&before=" + before : ""}`,
	);

export const watchedNotification = (id: string, isRead: boolean) =>
	instance.put(`/notification/watched/${id}`, {
		isRead,
	});

export const watchedAllNotification = () =>
	instance.get(`/notification/watchedAll`);

export const deleteNotification = (id: string) =>
	instance.delete(`/notification/delete/${id}`);

export const pagingNotificationAdmin = (page: number, before?: string | null) =>
	instance.get(
		`/notification/pagingNotificationAdmin?page=${page}${before ? "&before=" + before : ""}`,
	);

export const watchedNotificationAdmin = (id: string, isRead: boolean) =>
	instance.put(`/notification/watchedNotificationAdmin/${id}`, {
		isRead,
	});
