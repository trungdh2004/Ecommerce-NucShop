import React from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatInTimeZone } from "date-fns-tz";
const OrderDetailTime = ({ data }: any) => {
	console.log(data);
	const sortedData = data.sort((a: any, b: any) => {
		if (a === null) return 1;
		if (b === null) return -1;
		return a.status - b.status;
	});

	console.log(sortedData);
	const getOrderStatusMessage = (status: number) => {
		if (status === 1) {
			return "Đặt hàng thành công";
		} else if (status === 2) {
			return "Xác nhận đơn hàng";
		} else if (status === 3) {
			return "Đang giao hàng";
		} else if (status === 4) {
			return "Giao hàng thành công";
		} else if (status === 5) {
			return "Đã nhận hàng";
		} else {
			return "Trạng thái không xác định";
		}
	};
	const checkStatus = sortedData?.map((order: any) => {
		if (order) {
			return {
				...order,
				informationStatus: getOrderStatusMessage(order.status),
			};
		}
	});
	console.log(checkStatus);

	return (
		<div className="bg-main rounded-md border border-1 border-gray-100 box-shadow p-4">
			<h3 className="font-medium pl-3 py-3">Theo dõi đơn hàng</h3>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-left">Thông tin</TableHead>
						<TableHead>Ngày giờ</TableHead>
						<TableHead>Tin nhắn</TableHead>
						<TableHead>Chi tiết</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{checkStatus?.map((data: any) => (
						<TableRow key={data?.status}>
							<TableCell className="font-medium">
								{data?.informationStatus}
							</TableCell>
							<TableCell>
								{data?.date &&
									formatInTimeZone(
										new Date(data?.date),
										"Asia/Ho_Chi_Minh",
										"yyyy-MM-dd HH:mm:ss",
									)}
							</TableCell>
							<TableCell>{data?.message}</TableCell>
							<TableCell>{data?.sub}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default OrderDetailTime;
