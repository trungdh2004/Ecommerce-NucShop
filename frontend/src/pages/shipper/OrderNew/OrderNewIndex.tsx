import Paginations from "@/components/common/Pagination";
import { TooltipComponent } from "@/components/common/TooltipComponent";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { pagingOrderShipper } from "@/service/shipper";
import { useEffect, useState } from "react";
import { IoReload } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import OrderItem from "../component/OrderItem";

const OrderNewIndex = () => {
  const [_, setPageIndex] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchParamsObject, setSearchParamsObject] = useState(()=>{
    const paramsObject: any = Object.fromEntries(searchParams.entries());
    return {
      pageIndex: paramsObject?.pageIndex | 1,
      pageSize: 12,
    }
    
  });
	const [status, setStatus] = useState(2);
	const [resultOrder, setResultOrder] = useState({
		content: [],
		pageIndex: 1,
		totalPage: 1,
	});
  const getOrderShipper = async (pageIndex:number) =>{
    try {
      const { data } = await pagingOrderShipper(pageIndex, status);

      setResultOrder({
        content: data.content,
        pageIndex: data.pageIndex,
        totalPage: data.totalPage,
      });
    } catch (error) {}
  }
	useEffect(() => {
		getOrderShipper(searchParamsObject.pageIndex);
	}, [status,searchParamsObject]);

	const handleNextPage = async () => {
		try {
			const pageNext = resultOrder.pageIndex + 1 || 2;
			const { data } = await pagingOrderShipper(pageNext, status);
			setResultOrder((prev: any) => {
				return {
					...prev,
					content: [...prev.content, ...data.content],
					pageIndex: data.pageIndex,
				};
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
			toast.success("Đã cập nhập dữ liệu mới");
		} catch (error: any) {
			toast.error(error.message);
		}
	};


	return (
		<div className="relative ">
			<header className="sticky top-0 flex items-end justify-between w-full p-2 md:px-4 md:mb-4 bg-main">
				<h2 className="text-xl font-semibold leading-8 sm:text-2xl">
					Đơn hàng
				</h2>
				<div className="flex items-center gap-2">
					<TooltipComponent label="Lấy dữ liệu mới">
						<button
							className="p-1 text-white bg-orange-400 rounded-sm"
							onClick={handleReset}
						>
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
      <div className="grid w-full grid-cols-1 gap-4 px-2 md:grid-cols-2 md:px-4">
					{resultOrder?.content?.map((order: any) => (
						<OrderItem key={order._id} order={order} onHandleSuccess={()=>getOrderShipper(1)}/>
					))}

					{resultOrder?.content?.length === 0 && (
						<div className="flex items-center justify-center w-full h-20 col-span-2 p-4 text-center border rounded-md">
							Không có đơn hàng
						</div>
					)}
				</div>
        {resultOrder?.content?.length > 0 && (
						<div className="flex items-center justify-center py-4">
							<Paginations
								pageCount={resultOrder?.totalPage}
								handlePageClick={(event: any) => {
									setPageIndex(event.selected + 1);
									setSearchParamsObject((prev) => ({
										...prev,
										pageIndex: event.selected + 1,
									}));
									searchParams.set("pageIndex", event.selected + 1);
									setSearchParams(searchParams);
								}}
								forcePage={searchParamsObject.pageIndex - 1}
							/>
						</div>
					)}
			{/* <InfiniteScroll
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
						<OrderItem key={order._id} order={order} onHandleSuccess={getOrderShipper}/>
					))}

					{resultOrder?.content?.length === 0 && (
						<div className="flex items-center justify-center w-full h-20 col-span-2 p-4 text-center border rounded-md">
							Không có đơn hàng
						</div>
					)}
				</div>
			</InfiniteScroll> */}
		</div>
	);
};

export default OrderNewIndex;
