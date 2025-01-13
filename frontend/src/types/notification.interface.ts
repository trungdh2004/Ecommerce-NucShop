export interface INotification {
	thumbnail?: string | null;
	_id: string;
	message: string;
	receiver: [];
	directType: string;
	directId: string;
	recipientType: string;
	type: string;
	isRead: boolean;
	createdAt: Date;
	updatedAt: Date;
	__v: 0;
}

export interface ISearchObjectNotifications {
	pageIndex: number;
	totalAllOptions: number;
	totalOptionPage: number;
	totalPage: number;
	content: INotification[];
}

export interface INotificationAdmin {
	_id: string;
	message: string; // Nội dung của thông báo
	type: string; // Loại thông báo
	createdAt?: Date; // Ngày tạo (tự động)
	updatedAt?: Date; // Ngày cập nhật (tự động)
	direct: string;
	directId: string;
	is_delete: boolean;
	readOnly: string[];
}

export interface ISearchObjectNotificationsAdmin {
	pageIndex: number;
	totalAllOptions: number;
	totalOptionPage: number;
	totalPage: number;
	content: INotificationAdmin[];
}
