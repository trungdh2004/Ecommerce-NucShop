import { useEffect, useState } from "react";
import { OrderCard } from "./OrderCard";
import { getListOrderIsShipper } from "@/service/shipper";
import { AxiosError } from "axios";
import { toast } from "sonner";
import Paginations from "@/components/common/Pagination";
import { useSearchParams } from "react-router-dom";
import { TooltipComponent } from "@/components/common/TooltipComponent";
import { IoReload } from "react-icons/io5";

const ForShippersPage = () => {
  const [_, setPageIndex] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchParamsObject, setSearchParamsObject] = useState(()=>{
    const paramsObject: any = Object.fromEntries(searchParams.entries());
    return {
      pageIndex: paramsObject?.pageIndex | 1,
      pageSize: 12,
    }
    
  });
  const [resultOrder, setResultOrder] = useState({
		content: [],
		pageIndex: 1,
		totalPage: 12,
	});
	useEffect(() => {
    handleGetListOrderIsShipper(searchParamsObject.pageIndex,searchParamsObject.pageSize)
  }, [searchParamsObject]);
	const handleGetListOrderIsShipper = async (
		pageIndex: number,
		pageSize: number,
	) => {
		try {
			const { data } = await getListOrderIsShipper({ pageIndex, pageSize });
			setResultOrder(data);
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};
	return (
		<div className="p-6 mx-auto ">
			<div className="flex items-center justify-between">
			  <h2 className="mb-4 text-xl font-semibold leading-8 sm:text-2xl">
  				Đơn hàng
  			</h2>
        <TooltipComponent label="Lấy dữ liệu mới">
						<button
							className="p-1 text-white bg-orange-400 rounded-sm"
							onClick={()=>{handleGetListOrderIsShipper(1,12);  toast.success('Lấy dữ liệu mới thành công');}}
						>
							<IoReload size={20} />
						</button>
					</TooltipComponent>
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{resultOrder?.content.map((order:any) => (
					<OrderCard key={order.id}  {...order} onConfirm={()=>handleGetListOrderIsShipper(1,12)}/>
				))}
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
		</div>
	);
};

export default ForShippersPage;
