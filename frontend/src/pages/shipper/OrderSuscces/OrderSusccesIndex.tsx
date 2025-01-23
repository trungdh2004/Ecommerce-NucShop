import { useEffect, useState } from "react";
import OrderItem from "../component/OrderItem";

import { pagingOrderShipper } from "@/service/shipper";
import InfiniteScroll from "react-infinite-scroll-component";

const OrderSuccessIndex = () => {
	const [resultOrder, setResultOrder] = useState({
		content: [],
		pageIndex: 1,
		totalPage: 1,
	});

	useEffect(() => {
		(async () => {
			try {
				const { data } = await pagingOrderShipper(1, 4);

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
			const { data } = await pagingOrderShipper(pageNext, 4);
			setResultOrder((prev: any) => {
				return {
					...prev,
					content: [...prev.content, ...data.content],
					pageIndex: data.pageIndex,
				};
			});
		} catch (error) {}
	};

	// const handleReset = async () => {
	// 	try {
	// 		const { data } = await pagingOrderShipper(1, 4);
	// 		setResultOrder({
	// 			content: data.content,
	// 			pageIndex: data.pageIndex,
	// 			totalPage: data.totalPage,
	// 		});
	// 		toast.success("Đã cập nhập dữ liệu mới");
	// 	} catch (error: any) {
	// 		toast.error(error.message);
	// 	}
	// };

	// const hasMore =
	// 	resultOrder.content.length === 0
	// 		? false
	// 		: resultOrder.pageIndex !== resultOrder.totalPage;

	return (
		<div className="relative ">
			<header className="sticky top-0 flex items-end justify-between w-full p-2 md:px-4 md:mb-4 bg-main">
				<h2 className="text-xl font-semibold leading-8 sm:text-2xl">
					Đơn hàng đã giao
				</h2>
			</header>

			<InfiniteScroll
				dataLength={resultOrder.content.length} //This is important field to render the next resultOrder
				next={handleNextPage}
				hasMore={resultOrder?.pageIndex !== resultOrder?.totalPage}
				loader={<p className="text-sm text-center text-gray-400">Loading...</p>}
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
				<div className="grid w-full grid-cols-1 gap-4 px-2 md:grid-cols-2 md:px-4">
					{resultOrder?.content?.map((order: any) => (
						<OrderItem key={order._id} order={order} isSuccess />
					))}

					{resultOrder?.content?.length === 0 && (
						<div className="flex items-center justify-center w-full h-20 col-span-2 p-4 text-center border rounded-md">
							Không có đơn hàng
						</div>
					)}
				</div>
			</InfiniteScroll>
		</div>
	);
};

export default OrderSuccessIndex;
