import { cn } from "@/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
import { FaRegCircleCheck } from "react-icons/fa6";
import OrderTrackingMobile from "./OrderTrackingMobile";

const OrderTracking = ({ data }: any) => {
	console.log(data);

	return (
		<div className="p-5 border border-gray-200 rounded-lg bg-main box-shadow border-1">
			<h3 className="mb-5">Chi tiết theo dõi đơn hàng</h3>
			<div className="items-center justify-between hidden w-full lg:flex md:flex sm:flex">
				<div className="relative flex flex-col items-center">
					<div className="flex items-center justify-center w-10 h-10">
						<FaRegCircleCheck
							size={35}
							className={cn(
								"text-gray-500",
								data.some(
									(order: {
										status: number;
										date: string;
										message: string;
										sub: string;
									}) => order && order.status === 1,
								)
									? "text-blue-500"
									: "",
							)}
						/>
					</div>
					<span className="mt-2 text-sm text-black">Đã Đặt Hàng</span>
					<span className="text-sm text-gray-500">
						{data.find(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 1,
						)
							? formatInTimeZone(
									new Date(
										data.find(
											(order: {
												status: number;
												date: string;
												message: string;
												sub: string;
											}) => order && order.status === 1,
										).date,
									),
									"Asia/Ho_Chi_Minh",
									"dd/MM/yyyy HH:mm:ss",
								)
							: "Ngày giờ không hợp lệ"}
					</span>
				</div>

				<div
					className={cn(
						"flex-auto border-t-2 border-gray-500 pb-12",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 2,
						)
							? "border-blue-500"
							: "",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? "border-red-500"
							: "",
					)}
				/>

				<div className="relative flex flex-col items-center">
					<div className="flex items-center justify-center w-10 h-10">
						<FaRegCircleCheck
							size={35}
							className={cn(
								"text-gray-500",
								data.some(
									(order: {
										status: number;
										date: string;
										message: string;
										sub: string;
									}) => order && order.status === 2,
								)
									? "text-blue-500"
									: "",
								data.some(
									(order: {
										status: number;
										date: string;
										message: string;
										sub: string;
									}) => order && order.status === 6,
								)
									? "text-red-500"
									: "",
							)}
						/>
					</div>
					<span className="mt-2 text-sm text-black">Xác nhận</span>
					<span className="text-sm text-gray-500">
						{data.find(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 2,
						)
							? formatInTimeZone(
									new Date(
										data.find(
											(order: {
												status: number;
												date: string;
												message: string;
												sub: string;
											}) => order && order.status === 2,
										).date,
									),
									"Asia/Ho_Chi_Minh",
									"dd/MM/yyyy HH:mm:ss",
								)
							: "Chưa xác nhận"}
					</span>
				</div>

				<div
					className={cn(
						"flex-auto border-t-2 border-gray-500 pb-12",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 3,
						)
							? "border-blue-500"
							: "",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? "border-red-500"
							: "",
					)}
				/>

				<div className="relative flex flex-col items-center">
					<div className="flex items-center justify-center w-10 h-10">
						<FaRegCircleCheck
							size={35}
							className={cn(
								"text-gray-500",
								data.some(
									(order: {
										status: number;
										date: string;
										message: string;
										sub: string;
									}) => order && order.status === 3,
								)
									? "text-blue-500"
									: "",
								data.some(
									(order: {
										status: number;
										date: string;
										message: string;
										sub: string;
									}) => order && order.status === 6,
								)
									? "text-red-500"
									: "",
							)}
						/>
					</div>
					<span className="mt-2 text-sm text-black">Đang giao hàng</span>
					<span className="text-sm text-gray-500">
						{data.find(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 3,
						)
							? formatInTimeZone(
									new Date(
										data.find(
											(order: {
												status: number;
												date: string;
												message: string;
												sub: string;
											}) => order && order.status === 3,
										).date,
									),
									"Asia/Ho_Chi_Minh",
									"dd/MM/yyyy HH:mm:ss",
								)
							: "Chưa xác nhận"}
					</span>
				</div>

				<div
					className={cn(
						"flex-auto border-t-2 border-gray-500 pb-12",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 4,
						)
							? "border-blue-500"
							: "",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? "border-red-500"
							: "",
					)}
				/>

				<div className="relative flex flex-col items-center">
					<div className="flex items-center justify-center w-10 h-10">
						<FaRegCircleCheck
							size={35}
							className={cn(
								"text-gray-500",
								data.some(
									(order: {
										status: number;
										date: string;
										message: string;
										sub: string;
									}) => order && order.status === 4,
								)
									? "text-blue-500"
									: "",
								data.some(
									(order: {
										status: number;
										date: string;
										message: string;
										sub: string;
									}) => order && order.status === 6,
								)
									? "text-red-500"
									: "",
							)}
						/>
					</div>
					<span className="mt-2 text-sm text-black">Giao hàng</span>
					<span className="text-sm text-gray-500">
						{data.find(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 4,
						)
							? formatInTimeZone(
									new Date(
										data.find(
											(order: {
												status: number;
												date: string;
												message: string;
												sub: string;
											}) => order && order.status === 4,
										).date,
									),
									"Asia/Ho_Chi_Minh",
									"dd/MM/yyyy HH:mm:ss",
								)
							: "Chưa xác nhận"}
					</span>
				</div>
				<div
					className={cn(
						"flex-auto border-t-2 border-gray-500 pb-12",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 5,
						)
							? "border-blue-500"
							: "",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? "border-red-500"
							: "",
					)}
				/>

				<div className="relative flex flex-col items-center">
					<div className="flex items-center justify-center w-10 h-10">
						<FaRegCircleCheck
							size={35}
							className={cn(
								"text-gray-500",
								data.some(
									(order: {
										status: number;
										date: string;
										message: string;
										sub: string;
									}) => order && order.status === 5,
								)
									? "text-blue-500"
									: "",
								data.some(
									(order: {
										status: number;
										date: string;
										message: string;
										sub: string;
									}) => order && order.status === 6,
								)
									? "text-red-500"
									: "",
							)}
						/>
					</div>
					<span className="mt-2 text-sm text-black">
						{data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? "Đã hủy hàng"
							: "Đã nhận hàng"}
					</span>
					<span className="text-sm text-gray-500">
						{data.find(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? formatInTimeZone(
									new Date(
										data.find(
											(order: {
												status: number;
												date: string;
												message: string;
												sub: string;
											}) => order && order.status === 6,
										)?.date,
									),
									"Asia/Ho_Chi_Minh",
									"dd/MM/yyyy HH:mm:ss",
								)
							: data.find(
										(order: {
											status: number;
											date: string;
											message: string;
											sub: string;
										}) => order && order.status === 5,
								  )
								? formatInTimeZone(
										new Date(
											data.find(
												(order: {
													status: number;
													date: string;
													message: string;
													sub: string;
												}) => order && order.status === 5,
											)?.date,
										),
										"Asia/Ho_Chi_Minh",
										"dd/MM/yyyy HH:mm:ss",
									)
								: "Chưa xác nhận"}
					</span>
				</div>
			</div>
			<OrderTrackingMobile data={data} />
		</div>
	);
};

export default OrderTracking;
