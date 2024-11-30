import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import OrderItem from "../component/OrderItem";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InfiniteScroll from "react-infinite-scroll-component";
import { pagingOrderShipper } from "@/service/shipper";
import { cn } from "@/lib/utils";
import { IoReload } from "react-icons/io5";
import { TooltipComponent } from "@/components/common/TooltipComponent";
import { toast } from "sonner";

const OrderNewIndex = () => {
	const [status, setStatus] = useState(2);
	const [resultOrder, setResultOrder] = useState({
		content: [],
		pageIndex: 1,
		totalPage: 1,
	});

	useEffect(() => {
		(async () => {
			try {
				const { data } = await pagingOrderShipper(1, status);

				setResultOrder({
					content: data.content,
					pageIndex: data.pageIndex,
					totalPage: data.totalPage,
				});
			} catch (error) {}
		})();
	}, [status]);

	const handleNextPage = async () => {
		try {
			const pageNext = resultOrder.pageIndex + 1 || 2;
			const { data } = await pagingOrderShipper(pageNext, status);
			setResultOrder({
				content: data.content,
				pageIndex: data.pageIndex,
				totalPage: data.totalPage,
			});
		} catch (error) {}
	};

	const handleReset = async () => {
		try {
			const { data } = await pagingOrderShipper(1, status);
			setResultOrder({
				content: data.content,
				pageIndex: data.pageIndex,
				totalPage: data.totalPage,
			});
			toast.success("Đã cập nhập dữ liệu mới")
		} catch (error:any) {
			toast.error(error.message)
		}
	}

	const hasMore =
		resultOrder.content.length === 0
			? false
			: resultOrder.pageIndex !== resultOrder.totalPage;

	return (
		<div className=" relative">
			<header className="p-2 md:px-4 md:mb-4 flex justify-between items-end sticky top-0 bg-main w-full">
				<h2 className="font-semibold text-xl sm:text-2xl leading-8">
					Đơn hàng
				</h2>
				<div className="flex items-center gap-2">
					<TooltipComponent label="Lấy dữ liệu mới">
						<button className="p-1 rounded-sm bg-orange-400 text-white" onClick={handleReset}>
							<IoReload size={20} />
						</button>
					</TooltipComponent>
					<div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"py-[2px] h-8 text-sm hover:bg-gray-100",
										status === 2
											? "text-blue-500 hover:text-blue-500"
											: "text-green-500 hover:text-green-500",
									)}
								>
									{status === 2 ? "Đơn mới" : "Đang giao"}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-auto" align="end">
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={() => {
										setStatus(2);
									}}
								>
									Đơn hàng mới
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={() => {
										setStatus(3);
									}}
								>
									Đơn hàng đang giao
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			<InfiniteScroll
				dataLength={resultOrder.content.length} //This is important field to render the next resultOrder
				next={handleNextPage}
				hasMore={hasMore}
				loader={<p className="text-center text-sm text-gray-400">Loading...</p>}
				endMessage={<p style={{ textAlign: "center" }}></p>}
				refreshFunction={() => {
					console.log("refreshFunction");
				}}
				pullDownToRefresh={false}
				pullDownToRefreshThreshold={80}
				pullDownToRefreshContent={
					<h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
				}
				releaseToRefreshContent={
					<h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
				}
				scrollableTarget="scrollableDiv"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 px-2 md:px-4">
					{resultOrder?.content?.map((order: any) => (
						<OrderItem key={order._id} order={order} />
					))}

					{resultOrder?.content?.length === 0 && (
						<div className="w-full col-span-2 border rounded-md h-20 flex items-center justify-center p-4 text-center">
							Không có đơn hàng
						</div>
					)}
				</div>
			</InfiniteScroll>
		</div>
	);
};

export default OrderNewIndex;
