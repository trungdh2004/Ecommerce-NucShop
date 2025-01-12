import { useAuth } from "@/hooks/auth";
import {
	pagingNotificationAdmin,
	watchedNotificationAdmin,
} from "@/service/notification.service";
import {
	INotificationAdmin,
	ISearchObjectNotificationsAdmin,
} from "@/types/notification.interface";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Notification from "./Notification";

const ActionsNotification = () => {
	const { isLoggedIn, authUser, socket } = useAuth();

	const [dataNotification, setDataNotification] =
		useState<ISearchObjectNotificationsAdmin>({
			content: [],
			pageIndex: 1,
			totalAllOptions: 0,
			totalOptionPage: 0,
			totalPage: 0,
		});
	const [before, setBefore] = useState<null | string>(null);

	const [dataContent, setDataContent] = useState<INotificationAdmin[]>([]);
	const [countNotRead, setCountNotRead] = useState(0);

	useEffect(() => {
		if (socket) {
			socket.on("notificationAdmin", (notification: INotificationAdmin) => {
				setDataContent((prev) => {
					const data = [notification, ...prev];
					return data;
				});
				setCountNotRead((prev) => prev + 1);
			});
		}
	}, [socket]);

	useEffect(() => {
		if (isLoggedIn) {
			(async () => {
				try {
					const { data } = await pagingNotificationAdmin(1);
					setDataNotification(data);
					setBefore(data?.before);
					setCountNotRead(data.countNotificationNotRead);
					setDataContent(data.content);
				} catch (error) {
					setCountNotRead(0);
				}
			})();
		} else {
			setDataNotification({
				content: [],
				pageIndex: 1,
				totalAllOptions: 0,
				totalOptionPage: 0,
				totalPage: 0,
			});
			setCountNotRead(0);
			setDataContent([]);
		}
	}, [isLoggedIn]);

	const handleNextPage = async () => {
		try {
			// if (dataNotification.pageIndex < dataNotification.totalPage) {
			const { data } = await pagingNotificationAdmin(
				dataNotification.pageIndex + 1,
				before,
			);

			setDataNotification((prev) => {
				const dataContent = [...prev.content, ...data.content];
				return {
					...prev,
					content: dataContent,
					pageIndex: data.pageIndex,
				};
			});
			setDataContent((prev) => [...prev, ...data.content]);
		} catch (error) {}
	};

	const handleWatchedNotification = async (id: string, isRead: boolean) => {
		try {
			const { data } = await watchedNotificationAdmin(id, isRead);
			setDataNotification((prev) => {
				const newContent = prev.content.map((item) =>
					item._id.toString() === data._id.toString() ? data : item,
				);
				return {
					...prev,
					content: newContent,
				};
			});

			setDataContent((prev) => {
				const newContent = prev.map((item) =>
					item._id.toString() === data._id.toString() ? data : item,
				);
				return newContent;
			});
			if (isRead) {
				setCountNotRead((prev) => {
					if (prev === 0) return prev;
					return --prev;
				});
			} else {
				setCountNotRead((prev) => ++prev);
			}
		} catch (error) {
			toast.error("Lỗi thông báo");
		}
	};

	return (
		<div className="">
			<Notification
				dataNotification={dataNotification}
				countNotRead={countNotRead}
				handleNextPage={handleNextPage}
				handleWatchedNotification={handleWatchedNotification}
				userId={authUser?._id as string}
				dataContent={dataContent}
			/>
		</div>
	);
};

export default ActionsNotification;
