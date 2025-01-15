import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatInTimeZone } from "date-fns-tz";
import { DetailTime } from "@/types/order";
const OrderDetailTime = ({ data }: any) => {
	console.log(data);

	// const sortedData = data.sort((a: any, b: any) => {
	// 	if (a === null) return 1;
	// 	if (b === null) return -1;
	// 	return a.status - b.status;
	// });
	// const getOrderStatusMessage = (status: number) => {
	// 	if (status === 1) {
	// 		return "Đặt hàng thành công";
	// 	} else if (status === 2) {
	// 		return "Xác nhận đơn hàng";
	// 	} else if (status === 3) {
	// 		return "Đang giao hàng";
	// 	} else if (status === 4) {
	// 		return "Giao hàng thành công";
	// 	} else if (status === 5) {
	// 		return "Đã nhận hàng";
	// 	} else if (status === 6) {
	// 		return "Đã hủy hàng";
	// 	} else {
	// 		return "Trạng thái không xác định";
	// 	}
	// };
	// const checkStatus = sortedData?.map((order: any) => {
	// 	if (order) {
	// 		return {
	// 			...order,
	// 			informationStatus: getOrderStatusMessage(order.status),
	// 		};
	// 	}
	// });
	return (
		<div className="p-4 border border-gray-200 rounded-md bg-main border-1 box-shadow">
			<h3 className="pb-3 pl-3 font-medium">Theo dõi đơn hàng</h3>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-left">Thông tin</TableHead>
						<TableHead>Ngày giờ</TableHead>
						<TableHead>Tin nhắn</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data?.informationOrder?.map((data: DetailTime, index: number) => {
						return (
							<TableRow key={index}>
								<TableCell className="font-medium text-nowrap">
									{data?.name}
								</TableCell>
								<TableCell className="text-nowrap">
									{data?.date &&
										formatInTimeZone(
											new Date(data?.date),
											"Asia/Ho_Chi_Minh",
											"yyyy-MM-dd HH:mm:ss",
										)}
								</TableCell>
								<TableCell className="text-nowrap">{data?.content}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};

export default OrderDetailTime;
