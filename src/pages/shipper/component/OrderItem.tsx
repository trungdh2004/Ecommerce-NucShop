import { formatCurrency } from "@/common/func";
import { updateStatusShippingOrder } from "@/service/shipper";
import { IOrderShipper } from "@/types/shipper.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import React from "react";
import { toast } from "sonner";

interface IProps {
	order: any;
	isSuccess?: boolean;
}

const OrderItem = ({ order, isSuccess = false }: IProps) => {
	const { mutate } = useMutation({
		mutationKey: ["mutation"],
		mutationFn: (id: string): Promise<IOrderShipper> =>
			updateStatusShippingOrder(id),
		onSuccess(data: any, variables, context) {
			window.open(
				`/shipper/transport/${encodeURIComponent(data.data.data.code)}`,
			);
		},
		onError(data, error) {
			console.log("error:", error);
			toast.error(error);
		},
	});

	return (
		<div className="w-full rounded-md bg-white box-shadow px-2 md:px-4 py-2 border border-dashed">
			<div className="">
				<div className="text-sm flex items-center justify-between">
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

				<div className="text-sm border-t mt-1">
					<div className="flex md:flex-row flex-col md:items-center justify-between">
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

				<div className="w-full mt-1 border-t flex items-center justify-between">
					{!isSuccess ? (
						<div>
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
					): (
						<p className="text-sm ">
							Đã giao: <span className="font-medium text-blue-500">{format(order.shippedDate, "hh:mm dd-MM-yyyy")}</span>
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
