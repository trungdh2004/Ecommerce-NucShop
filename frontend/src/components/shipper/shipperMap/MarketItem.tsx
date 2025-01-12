import { formatQuantity } from "@/common/localFunction";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { updateStatusShippingOrder } from "@/service/shipper";
import { IOrderShipper } from "@/types/shipper.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaBox } from "react-icons/fa";
import { Marker } from "react-map-gl";
import { toast } from "sonner";

interface IProps {
	order: IOrderShipper;
	location: number[];
}

const MarketItem = ({ order, location }: IProps) => {
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationKey: ["mutation"],
		mutationFn: (id: string): Promise<IOrderShipper> =>
			updateStatusShippingOrder(id),
		onSuccess(data: any) {
			queryClient.invalidateQueries({
				queryKey: ["listOrder", "shipper"],
			});
			window.open(
				`/shipper/transport/${encodeURIComponent(data.data.data.code)}`,
			);
		},
		onError(_, error) {
			console.log("error:", error);
			toast.error(error);
		},
	});

	return (
		<Marker longitude={location[0]} latitude={location[1]} anchor="bottom">
			<Popover>
				<PopoverTrigger asChild>
					<div>
						{/* <GoDotFill size={20} className="text-red-500" /> */}
						<div className="relative flex items-center justify-center">
							<div
								className={cn(
									"relative size-10 rounded-full flex justify-center items-center bg-blue-500 z-10",
									order.status === 3 && "bg-green-500",
								)}
							>
								<FaBox size={20} color="white" />
							</div>
							<div
								className={cn(
									"absolute size-4 -bottom-1 bg-blue-500 rotate-45 z-0",
									order.status === 3 && "bg-green-500",
								)}
							></div>
						</div>
					</div>
				</PopoverTrigger>
				<PopoverContent className="w-[240px] p-2" align="center" side="top">
					<div className="">
						<div className="pb-1 border-b ">
							<p className="font-semibold">Tên: {order.address.username}</p>
							<p className="font-semibold">SĐT: {order.address.phone}</p>
						</div>
						<p>
							Mã đơn hàng: <span className="font-bold">{order?.code}</span>
						</p>
						<p>
							Tổng số lượng sản phẩm:{" "}
							<span className="font-bold text-red-500">
								{formatQuantity(order?.orderItems?.length, "sp")}
							</span>
						</p>
						<p>
							Tổng giá trị đơn hàng:{" "}
							<span className="font-bold text-red-500">
								{formatQuantity(order?.totalMoney, "đ")}
							</span>{" "}
						</p>
						<p>
							Tiền khách trả khi nhận:{" "}
							<span className="font-bold text-red-500">
								{formatQuantity(order?.amountToPay, "đ")}
							</span>{" "}
						</p>
						<p>
							Giá ship:{" "}
							<span className="font-bold text-red-500">
								{formatQuantity(order?.shippingCost, "đ")}
							</span>{" "}
						</p>
						<p className="line-clamp-2">Lời nhắn: {order.note}</p>
						<div className="pt-2 mt-1 border-t">
							<div
								className={cn(
									"w-full text-center border rounded-md border-blue-500 text-blue-500 hover:bg-blue-100",
									order.status === 3 && "border-green-500 text-green-500",
								)}
								onClick={() => {
									if (order.status === 2) {
										mutate(order._id as string);
									}
									if (order.status === 3) {
										window.open(
											`/shipper/transport/${encodeURIComponent(order.code)}`,
										);
									}
								}}
							>
								{order.status === 3 ? "Đang giao hàng" : "Giao hàng"}
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</Marker>
	);
};

export default MarketItem;
