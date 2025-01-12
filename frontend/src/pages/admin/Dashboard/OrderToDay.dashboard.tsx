import { formatQuantity } from "@/common/localFunction";
import { getToDayOrder } from "@/service/dashboard.service";
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
		<div className="flex flex-col w-full h-auto p-2 bg-white rounded-xl box-shadow">
			<div className="flex items-center justify-between py-2 border-b">
				<p className="font-semibold">Biểu đồ đơn hàng hôm nay</p>
				<div className="flex items-center gap-2"></div>
			</div>
			<div className="py-4">
				<div className="relative flex min-h-14 ">
					<div className="relative flex flex-col items-center mr-2">
						<p className="my-1 bg-blue-500 rounded-full size-3"></p>
						<div className="flex-1 w-[2px] bg-gray-500"></div>
					</div>
					<div>
						<p className="text-sm font-medium">Đơn hàng mới</p>
						<p className="text-xs text-gray-400">
							{formatQuantity(data?.countNew)} đơn hàng
						</p>
					</div>
				</div>
				<div className="relative flex min-h-14 ">
					<div className="relative flex flex-col items-center mr-2">
						<p className="size-3 bg-[#ff6a00] rounded-full my-1"></p>
						<div className="flex-1 w-[2px] bg-gray-500"></div>
					</div>
					<div>
						<p className="text-sm font-medium">Đơn hàng đã xác nhận</p>
						<p className="text-xs text-gray-400">
							{formatQuantity(data?.countConfirm)} đơn hàng
						</p>
					</div>
				</div>
				<div className="relative flex min-h-14 ">
					<div className="relative flex flex-col items-center mr-2">
						<p className="size-3 bg-[#29f492] rounded-full my-1"></p>
						<div className="flex-1 w-[2px] bg-gray-500"></div>
					</div>
					<div>
						<p className="text-sm font-medium">Đơn hàng đang vận chuyển</p>
						<p className="text-xs text-gray-400">
							{formatQuantity(data?.countShipping)} đơn hàng
						</p>
					</div>
				</div>
				<div className="relative flex min-h-14 ">
					<div className="relative flex flex-col items-center mr-2">
						<p className="my-1 bg-green-500 rounded-full size-3"></p>
						<div className="flex-1 w-[2px] bg-gray-500"></div>
					</div>
					<div>
						<p className="text-sm font-medium">Đơn hàng đã giao</p>
						<p className="text-xs text-gray-400">
							{formatQuantity(data?.countShipped)} đơn hàng
						</p>
					</div>
				</div>
				<div className="relative flex min-h-14 ">
					<div className="relative flex flex-col items-center mr-2">
						<p className="my-1 rounded-full size-3 bg-rose-500"></p>
					</div>
					<div>
						<p className="text-sm font-medium">Đơn hàng hủy</p>
						<p className="text-xs text-gray-400">
							{formatQuantity(data?.countCancel)} đơn hàng
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderToDayDashBoard;
