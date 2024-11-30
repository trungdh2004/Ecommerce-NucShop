import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import InfiniteScroll from "react-infinite-scroll-component";
import { IoCheckmark } from "react-icons/io5";
import { HiMiniEllipsisHorizontal } from "react-icons/hi2";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import {
	INotificationAdmin,
	ISearchObjectNotificationsAdmin,
} from "@/types/notification.interface";
import { TYPE_NOTIFICATION } from "@/config/configType";
import { useNavigate } from "react-router-dom";
import { watchedNotification, watchedNotificationAdmin } from "@/service/notification.service";
import { calculateTimeDistance } from "@/common/func";

interface IProps {
	countNotRead: number;
	dataNotification: ISearchObjectNotificationsAdmin;
	handleNextPage: () => void;
	handleWatchedNotification: (id: string, isRead: boolean) => void;
	userId:string,
	dataContent:INotificationAdmin[]
}

const Notification = ({
	countNotRead,
	dataNotification,
	handleNextPage,
	handleWatchedNotification,
	userId,
	dataContent
}: IProps) => {
	const router = useNavigate();
	const [open, setOpen] = useState(false);

	return (
		<DropdownMenu modal={false} open={open}>
			<DropdownMenuTrigger asChild>
				<div
					className="relative"
					onClick={() => {
						setOpen(!open);
					}}
				>
					<span className=" rounded-full bg-red-500 text-white absolute w-4 h-4 text-xs flex items-center justify-center -top-1 -right-1">
						{countNotRead}
					</span>
					<IoNotificationsOutline strokeWidth={4} size={20} />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				style={{ boxShadow: "0 -4px 32px rgba(0, 0, 0, .2)" }}
				className="max-sm:w-[300px] w-[400px] py-2 px-1 sm:px-2 *:cursor-pointer  text-[#1d2129] rounded-lg border-none"
				side="bottom"
				align="end"
			>
				<DropdownMenuLabel>
					<div className="flex items-center justify-between">
						<h6 className="h6 text-lg max-sm:text-sm">Thông báo</h6>
						{/* <button
							className="text-sm font-normal border-none outline-none text-blue-500 px-2 py-1 hover:bg-gray-100 rounded-sm"
							onClick={handleWatchedAllNotification}
						>
							Đánh dấu đã đọc
						</button> */}
					</div>
				</DropdownMenuLabel>
				<div
					className="h-[68vh] overflow-y-auto scroll-custom space-y-1"
					id="scrollableDiv"
				>
					<InfiniteScroll
						dataLength={dataContent.length} //This is important field to render the next data
						next={handleNextPage}
						hasMore={dataNotification.pageIndex !== dataNotification.totalPage}
						loader={
							<p className="text-center text-sm text-gray-400">Loading...</p>
						}
						refreshFunction={() => {
							console.log("refreshFunction");
						}}
						pullDownToRefresh={false}
						pullDownToRefreshThreshold={dataNotification.totalAllOptions}
						pullDownToRefreshContent={
							<h3 style={{ textAlign: "center" }}>
								&#8595; Pull down to refresh
							</h3>
						}
						releaseToRefreshContent={
							<h3 style={{ textAlign: "center" }}>
								&#8593; Release to refresh
							</h3>
						}
						endMessage={null}
						scrollableTarget="scrollableDiv"
					>
						{dataContent?.length > 0 &&
							dataContent?.map((item) => {
								const isRead = item.readOnly.includes(userId as string)

								return (
									<div className="relative " key={item._id}>
										<DropdownMenuItem
											className={cn(
												" group mb-1 pr-6",
												!isRead && "bg-blue-100/40",
											)}
											onClick={async () => {
												if (item.type === TYPE_NOTIFICATION.ORDER) {
													if (item?.directId) {
														router(`/admin/order/${item.directId}`);
														if (!isRead) {
															await handleWatchedNotification(item._id, true);
														}
													}
												}
												setOpen(false)
											}}
										>
											<div className="flex w-full items-center justify-start gap-x-2 cursor-pointer ">
												<div className="flex-1 space-y-1 leading-[18px]">
													<div
														className={cn("max-sm:text-sm w-full ")}
														dangerouslySetInnerHTML={{ __html: item?.message }}
													></div>
													<span className="text-xs text-gray-500 max-sm:text-sm">
														{item?.createdAt
															? calculateTimeDistance(item?.createdAt)
															: "Không xác định"}
													</span>
												</div>
											</div>
										</DropdownMenuItem>
	
										<div className="absolute right-1 top-1  z-[1px] group">
											<button className="size-5 rounded-full hover:bg-gray-200 flex items-center justify-center ">
												<HiMiniEllipsisHorizontal size={14} />
											</button>
											<div className="w-44 p-1 absolute right-0 top-0 hidden group-hover:block z-10 bg-white rounded-sm shadow">
												<button
													className="text-sm border-none rounded-sm hover:bg-gray-100 outline-none w-full py-1 pl-1 pr-2 flex gap-2 items-center"
													onClick={() => {
														handleWatchedNotification(item._id, !isRead);
													}}
												>
													<IoCheckmark size={16} />
													<span>
														{isRead
															? "Đánh dấu chưa xem"
															: "Đánh dấu đã xem"}
													</span>
												</button>
											</div>
										</div>
									</div>
								)
							})}

						{dataContent.length === 0 && (
							<div className="w-full h-full flex items-center justify-center">
								<p>Không có thông báo</p>
							</div>
						)}
					</InfiniteScroll>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default Notification;
