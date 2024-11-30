import { cn } from "@/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
import React from "react";
import { CiCircleCheck } from "react-icons/ci";
import { FaRegCircleCheck } from "react-icons/fa6";
import OrderTrackingMobile from "./OrderTrackingMobile";

const OrderTracking = ({ data }: any) => {
	console.log(data);

	return (
		<div className="bg-main rounded-lg  box-shadow p-5 border border-1 border-gray-200">
			<h3 className="my-5">Chi tiết theo dõi đơn hàng</h3>
			<div className="lg:flex md:flex sm:flex hidden items-center justify-between w-full">
				<div className="relative flex flex-col items-center">
					<div className="w-10 h-10 flex items-center justify-center">
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
					<span className="mt-2 text-black text-sm">Đã Đặt Hàng</span>
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
					<div className="w-10 h-10 flex items-center justify-center">
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
					<span className="mt-2 text-black text-sm">Xác nhận</span>
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
					<div className="w-10 h-10 flex items-center justify-center">
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
					<span className="mt-2 text-black text-sm">Đang giao hàng</span>
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
					<div className="w-10 h-10 flex items-center justify-center">
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
					<span className="mt-2 text-black text-sm">Giao hàng</span>
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
					<div className="w-10 h-10 flex items-center justify-center">
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
					<span className="mt-2 text-black text-sm">
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
