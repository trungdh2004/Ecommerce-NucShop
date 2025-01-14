import { cn } from "@/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
import { CiCircleCheck } from "react-icons/ci";

const OrderTrackingMobile = ({ data }: any) => {
	return (
		<div className="flex flex-col justify-center gap-2 lg:hidden md:hidden sm:hidden">
			<div className="flex">
				<CiCircleCheck
					size={20}
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
							? "text-blue-600"
							: "",
					)}
				/>
				<span className="ml-2 text-sm text-gray-500">Đã đặt hàng</span>
			</div>
			<div className="flex gap-3">
				<div
					className={cn(
						"h-9 w-[1px] bg-gray-400 ml-[9px]",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 2,
						)
							? "bg-blue-600"
							: "",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? "bg-red-600"
							: "",
					)}
				></div>
				<span className="ml-2 text-sm text-gray-500">
					{data.find(
						(order: {
							status: number;
							date: string;
							message: string;
							sub: string;
						}) => order && order.status === 1,
					) &&
						formatInTimeZone(
							new Date(
								data.find(
									(order: {
										status: number;
										date: string;
										message: string;
										sub: string;
									}) => order && order.status === 1,
								)?.date,
							),
							"Asia/Ho_Chi_Minh",
							"dd/MM/yyyy HH:mm:ss",
						)}
				</span>
			</div>

			<div className="flex">
				<CiCircleCheck
					size={20}
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
							? "text-blue-600"
							: "",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? "text-red-600"
							: "",
					)}
				/>

				<span className="ml-2 text-sm text-gray-500">Xác nhận</span>
			</div>
			<div className="flex gap-3">
				<div
					className={cn(
						"h-9 w-[1px] bg-gray-400 ml-[9px]",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 3,
						)
							? "bg-blue-600"
							: "",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? "bg-red-600"
							: "",
					)}
				></div>
				<span className="ml-2 text-sm text-gray-500">
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
									)?.date,
								),
								"Asia/Ho_Chi_Minh",
								"dd/MM/yyyy HH:mm:ss",
							)
						: "Chưa xác nhận"}
				</span>
			</div>
			<div className="flex">
				<CiCircleCheck
					size={20}
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
							? "text-blue-600"
							: "",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? "text-red-600"
							: "",
					)}
				/>

				<span className="ml-2 text-sm text-gray-500">Đang giao hàng</span>
			</div>
			<div className="flex gap-3">
				<div
					className={cn(
						"h-9 w-[1px] bg-gray-400 ml-[9px]",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 4,
						)
							? "bg-blue-600"
							: "",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? "bg-red-600"
							: "",
					)}
				></div>
				<span className="ml-2 text-sm text-gray-500">
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
									)?.date,
								),
								"Asia/Ho_Chi_Minh",
								"dd/MM/yyyy HH:mm:ss",
							)
						: "Chưa xác nhận"}
				</span>
			</div>
			<div className="flex">
				<CiCircleCheck
					size={20}
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
							? "text-blue-600"
							: "",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? "text-red-600"
							: "",
					)}
				/>

				<span className="ml-2 text-sm text-gray-500">Giao hàng</span>
			</div>
			<div className="flex gap-3">
				<div
					className={cn(
						"h-9 w-[1px] bg-gray-400 ml-[9px]",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 5,
						)
							? "bg-blue-600"
							: "",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? "bg-red-600"
							: "",
					)}
				></div>
				<span className="ml-2 text-sm text-gray-500">
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
									)?.date,
								),
								"Asia/Ho_Chi_Minh",
								"dd/MM/yyyy HH:mm:ss",
							)
						: "Chưa xác nhận"}
				</span>
			</div>
			<div className="flex">
				<CiCircleCheck
					size={20}
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
							? "text-blue-600"
							: "",
						data.some(
							(order: {
								status: number;
								date: string;
								message: string;
								sub: string;
							}) => order && order.status === 6,
						)
							? "text-red-600"
							: "",
					)}
				/>
				<span className="ml-2 text-sm text-gray-500">
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
			</div>
			<div className="pl-5">
				<span className="ml-2 text-sm text-gray-500">
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
	);
};

export default OrderTrackingMobile;
