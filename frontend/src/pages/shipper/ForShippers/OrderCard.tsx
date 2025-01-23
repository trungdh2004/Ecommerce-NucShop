import { convertToKm, estimateTime } from "@/common/func";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { confirmOrderShipper } from "@/service/shipper";
import { AxiosError } from "axios";
import {
  Barcode,
  CreditCard,
  DollarSign,
  MapPin,
  Package
} from "lucide-react";
import { FcShipped } from "react-icons/fc";
import { MdOutlineAccessTime } from "react-icons/md";
import { toast } from "sonner";

interface OrderCardProps {
  _id:string;
	code: string;
	address: any;
	orderItems: string[];
	amountToPay: number;
	shippingCost: number;
	distance: number;
  onConfirm:()=>void;
}

export function OrderCard({
  _id,
	code,
	address,
	orderItems,
	amountToPay,
	shippingCost,
	distance,
  onConfirm,
}: OrderCardProps) {
	const { hours, minutes } = estimateTime(distance);
  const handleConfirmOrderShipper = async ()=>{
    try {
      const {data} = await confirmOrderShipper(_id);
      onConfirm();
      toast.success(data?.message);
    } catch (error) {
      if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
    }
  }
	return (
		<Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
			<div className="p-4 bg-gradient-to-r from-giuspo-600 to-giuspo-400">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-bold text-black">Đơn hàng #{code}</h3>
					<Badge variant="secondary" className="bg-white text-giuspo-600">
						Khoảng cách {convertToKm(distance)} km
					</Badge>
				</div>
			</div>
			<CardContent className="p-6">
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<Barcode className="w-5 h-5 mr-3 text-giuspo-500" />
							<p className="text-sm font-medium text-gray-700">
								Mã đơn: {code}
							</p>
						</div>
						<Badge
							variant="outline"
							className="flex items-center gap-1 text-giuspo-600 border-giuspo-600"
						>
							<MdOutlineAccessTime className="w-5 h-5 text-giuspo-500" />Ước tính: {" "}
							{`${hours > 0 ? hours + "giờ" : ""} ${minutes} phút`}
						</Badge>
					</div>
					<div className="flex items-start">
						<MapPin className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-giuspo-500" />
						<p className="text-sm text-gray-600">{address?.detailAddress}, {address?.address}</p>
					</div>
					<div className="flex items-center">
						<Package className="w-5 h-5 mr-3 text-giuspo-500" />
						<p className="text-sm text-gray-600">{orderItems?.length} sản phẩm</p>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<DollarSign className="w-5 h-5 mr-3 text-giuspo-500" />
							<p className="text-sm font-medium text-giuspo-600">
								{amountToPay.toLocaleString("vi-VN")}đ
							</p>
						</div>
						<div className="flex items-center">
							<CreditCard className="w-5 h-5 mr-3 text-giuspo-500" />
							<p className="text-sm font-medium text-giuspo-600">
								Phí ship: {shippingCost.toLocaleString("vi-VN")}đ
							</p>
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="p-4 ">
				<Button onClick={handleConfirmOrderShipper} className="w-full text-white transition-colors duration-300 bg-blue-500 hover:bg-blue-700">
					<FcShipped className="w-4 h-4 mr-2" />
					Nhận đơn hàng
				</Button>
			</CardFooter>
		</Card>
	);
}
