import { formatQuantity } from "@/common/localFunction";
import { getCountProduct, getToDayOrder } from "@/service/dashboard.service";
import { useQuery } from "@tanstack/react-query";

const OrderToDayDashBoard = () => {
    const { data } = useQuery({
		queryKey: ["dashboardOrderToDay"],
		queryFn: async () => {
			try {
				const { data } = await getToDayOrder();
				return data;
			} catch (error) {}
		},
	});

	return (
		<div className="w-full h-auto bg-white rounded-xl box-shadow flex flex-col p-2">
			<div className="flex items-center justify-between py-2 border-b">
				<p className="font-semibold">Biểu đồ phương thức đăng kí</p>
				<div className="flex items-center gap-2"></div>
			</div>
            <div className="py-2">
                <div className="flex relative min-h-12 ">
                    <div className="flex flex-col relative items-center mr-2">
                        <p className="size-3 bg-blue-500 rounded-full my-1"></p>
                        <div className="flex-1 w-[2px] bg-gray-500"></div>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Đơn hàng mới</p>
                        <p className="text-xs text-gray-400">{formatQuantity(data?.countNew)} đơn hàng</p>
                    </div>
                </div>
                <div className="flex relative min-h-12 ">
                    <div className="flex flex-col relative items-center mr-2">
                        <p className="size-3 bg-[#ff6a00] rounded-full my-1"></p>
                        <div className="flex-1 w-[2px] bg-gray-500"></div>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Đơn hàng đã xác nhận</p>
                        <p className="text-xs text-gray-400">{formatQuantity(data?.countConfirm)} đơn hàng</p>
                    </div>
                </div>
                <div className="flex relative min-h-12 ">
                    <div className="flex flex-col relative items-center mr-2">
                        <p className="size-3 bg-[#29f492] rounded-full my-1"></p>
                        <div className="flex-1 w-[2px] bg-gray-500"></div>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Đơn hàng đang vận chuyển</p>
                        <p className="text-xs text-gray-400">{formatQuantity(data?.countShipping)} đơn hàng</p>
                    </div>
                </div>
                <div className="flex relative min-h-12 ">
                    <div className="flex flex-col relative items-center mr-2">
                        <p className="size-3 bg-green-500 rounded-full my-1"></p>
                        <div className="flex-1 w-[2px] bg-gray-500"></div>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Đơn hàng đã giao</p>
                        <p className="text-xs text-gray-400">{formatQuantity(data?.countShipped)} đơn hàng</p>
                    </div>
                </div>
                <div className="flex relative min-h-12 ">
                    <div className="flex flex-col relative items-center mr-2">
                        <p className="size-3 bg-rose-500 rounded-full my-1"></p>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Đơn hàng hủy</p>
                        <p className="text-xs text-gray-400">{formatQuantity(data?.countCancel)} đơn hàng</p>
                    </div>
                </div>
                
            </div>
		</div>
	);
};

export default OrderToDayDashBoard;
