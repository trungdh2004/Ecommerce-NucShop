import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import {
  deleteNotification,
  getPagingNotification,
  watchedNotification
} from "@/service/notification.service";
import {
  INotification,
  ISearchObjectNotifications,
} from "@/types/notification.interface";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Cart from "./Cart";
import Notification from "./Notification";
import Search from "./Search";
import User from "./User";

const Actions = () => {
	const { isLoggedIn, authUser, socket } = useAuth();

	const [dataNotification, setDataNotification] =
		useState<ISearchObjectNotifications>({
			content: [],
			pageIndex: 1,
			totalAllOptions: 0,
			totalOptionPage: 0,
			totalPage: 0,
		});
	const [before, setBefore] = useState<null | string>(null);
	const [countNotRead, setCountNotRead] = useState(0);

	useEffect(() => {
		if (socket) {
			socket.on("notification", (notification: INotification) => {
				setDataNotification((prev) => {
					const data = [notification, ...prev.content];

					return {
						...prev,
						content: data,
					};
				});
				setCountNotRead((prev) => prev + 1);
			});
		}
	}, [socket]);

	useEffect(() => {
		if (isLoggedIn) {
			(async () => {
				try {
					const { data } = await getPagingNotification(1);
					setDataNotification(data);
					setBefore(data?.before);
					setCountNotRead(data.countNotificationNotRead);
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
		}
	}, [isLoggedIn]);

	const handleNextPage = async () => {
		try {
			// if (dataNotification.pageIndex < dataNotification.totalPage) {
			const { data } = await getPagingNotification(
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

			// }
		} catch (error) {}
	};

	const handleWatchedNotification = async (id: string, isRead: boolean) => {
		try {
			const { data } = await watchedNotification(id, isRead);
			setDataNotification((prev) => {
				const newContent = prev.content.map((item) =>
					item._id.toString() === data._id.toString() ? data : item,
				);
				return {
					...prev,
					content: newContent,
				};
			});
			if (data.isRead) {
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

	const handleDeleteNotification = async (id: string, isRead: boolean) => {
		try {
			await deleteNotification(id);

			setDataNotification((prev) => {
				const newContent = prev.content.filter(
					(item) => item._id.toString() !== id,
				);

				return {
					...prev,
					content: newContent,
					totalAllOptions: prev.totalAllOptions - 1,
				};
			});

			if (!isRead) {
				setCountNotRead((prev) => --prev);
			}
		} catch (error) {
			toast.error("Lỗi gỡ thông báo");
		}
	};

	// const handleWatchedAllNotification = async () => {
	// 	try {
	// 		await watchedAllNotification();
	// 		setDataNotification((prev) => {
	// 			const newContent = prev.content.map((item) => {
	// 				return {
	// 					...item,
	// 					isRead: true,
	// 				};
	// 			});

	// 			return {
	// 				...prev,
	// 				content: newContent,
	// 			};
	// 		});
	// 		setCountNotRead(0);
	// 	} catch (error) {
	// 		toast.error("Đã xem tất cả bị lỗi");
	// 	}
	// };

	return (
		<div className="flex items-center justify-center max-h-8 gap-1 md:gap-4  *:rounded-full  *:cursor-pointer">
			<div className="hidden md:block">
				<Search />
			</div>
			<div className="">
				<Notification
					dataNotification={dataNotification}
					countNotRead={countNotRead}
					handleNextPage={handleNextPage}
					handleWatchedNotification={handleWatchedNotification}
					handleDeleteNotification={handleDeleteNotification}
				/>
			</div>
			<Cart />

			{isLoggedIn && authUser?._id ? (
				<div className="hover:bg-[#919eab27] p-1 ">
					<User />
				</div>
			) : (
				<Link to={`/auth/login`}>
					<Button className="hidden h-8 py-1 text-sm lg:block md:block bg-custom-300 hover:bg-custom">
						Đăng nhập
					</Button>
				</Link>
			)}
		</div>
	);
};

export default Actions;
