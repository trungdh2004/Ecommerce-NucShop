import { formatCurrency } from "@/common/func";
import { refuseOrderShipper, updateStatusShippingOrder } from "@/service/shipper";
import { IOrderShipper } from "@/types/shipper.interface";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
interface IProps {
	order: any;
	isSuccess?: boolean;
  onHandleSuccess?: () => void;
}

const OrderItem = ({ order, isSuccess = false,onHandleSuccess }: IProps) => {
	const { mutate } = useMutation({
		mutationKey: ["mutation"],
		mutationFn: (id: string): Promise<IOrderShipper> =>
			updateStatusShippingOrder(id),
		onSuccess(data: any) {
			window.open(
				`/shipper/transport/${encodeURIComponent(data.data.data.code)}`,
			);
		},
		onError(_, error) {
			console.log("error:", error);
			toast.error(error);
		},
	});
  const handleRefuseOrderShipper = async (orderId:string) =>{
    try {
      const {data} = await refuseOrderShipper(orderId);
      onHandleSuccess?.();
      toast.success(data?.message);
    } catch (error) {
      if(error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      }
    }
  }
	return (
		<div className="w-full px-2 py-2 bg-white border border-dashed rounded-md box-shadow md:px-4">
			<div className="">
				<div className="flex items-center justify-between text-sm">
					<p>
						Mã đơn hàng:{" "}
						<span className="font-semibold text-blue-500">{order.code}</span>
					</p>
					<p>
						<span className="font-semibold text-blue-500">
							{order.orderItems?.length}
						</span>{" "}
						sp
					</p>
				</div>
				<div className="flex items-center justify-between text-sm">
					<p>
						Tên: <span className="font-medium">{order?.address?.username}</span>
					</p>
					<p>
						SĐT: <span className="font-medium">{order?.address?.phone}</span>
					</p>
				</div>

				<div className="mt-1 text-sm border-t">
					<div className="flex flex-col justify-between md:flex-row md:items-center">
						<p>
							Tổng tiền phải thu :{" "}
							<span className="font-medium text-red-500">
								{formatCurrency(order?.amountToPay)}
							</span>
						</p>
					</div>
					<p>Địa chỉ : {order?.address?.address}</p>
					{!isSuccess && (
						<p>
							Thời hạn giao: {format(order.estimatedDeliveryDate, "dd-MM-yyyy")}
						</p>
					)}
				</div>

				<div className="flex items-center justify-between w-full mt-1 border-t">
					{!isSuccess ? (
						<div className="space-x-2 space-y-2">
             {order?.status === 2 && (
								<button
									className="px-4 py-[2px] mt-1 border border-red-500 text-red-500 rounded-full text-sm font-semibold hover:bg-red-500 hover:text-white leading-5"
									onClick={() => {
										handleRefuseOrderShipper(order._id as string);
									}}
								>
									Từ chối giao hàng
								</button>
							)}
							{order?.status === 2 ? (
								<button
									className="px-4 py-[2px] mt-1 border border-blue-500 text-blue-500 rounded-full text-sm font-semibold hover:bg-blue-500 hover:text-white leading-5"
									onClick={() => {
										mutate(order._id as string);
									}}
								>
									Giao hàng
								</button>
							) : (
								<button
									className="px-4 py-[2px] mt-1 border border-green-500 text-green-500 rounded-full text-sm font-semibold hover:bg-green-500 hover:text-white leading-5"
									onClick={() => {
										if (order.status === 3) {
											window.open(
												`/shipper/transport/${encodeURIComponent(order.code)}`,
											);
										}
									}}
								>
									Đang giao hàng
								</button>
							)}
						</div>
					) : (
						<p className="text-sm ">
							Đã giao:{" "}
							<span className="font-medium text-blue-500">
								{format(order.shippedDate, "hh:mm dd-MM-yyyy")}
							</span>
						</p>
					)}

					<p className="text-sm">
						Ship :{" "}
						<span className="font-medium text-red-500">
							{formatCurrency(order?.shippingCost)}
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default OrderItem;
