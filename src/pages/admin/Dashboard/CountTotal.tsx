import { formatQuantity } from "@/common/localFunction";
import { getCountTotal } from "@/service/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const CountTotal = () => {
	const {data} = useQuery({
		queryKey:["countTotal"],
		queryFn:async() => {
			try {
				const {data} = await getCountTotal()

				return data
			} catch (error) {
				
			}
		}
	})

	return (
		<>
			<div className="h-20 md:h-[100px] rounded-xl relative box-shadow col-span-6 lg:col-span-3 overflow-hidden bg-gradient-to-r from-[rgba(191,230,255,0.48)] to-[rgba(115,185,251,0.84)] flex items-center px-1 md:px-4 justify-between border-l-[4px] border-blue-500">
				<div className="size-8 md:size-12 flex items-center justify-center bg-white rounded-full">
					<img
						src="/ic-glass-bag.svg"
						alt=""
						className="size-6 md:size-10 object-cover"
					/>
				</div>
				<div className="">
					<p className="text-[#042174] md:text-base text-sm">Tổng đơn hàng</p>
					<h3 className="font-bold text-2xl text-blue-700 text-end">{formatQuantity(data?.totalOrderNew)}</h3>
				</div>
				<div
					style={{
						mask: "url(/shape-square.svg) center center / contain no-repeat",
					}}
					className="absolute -top-6 -left-2 size-[240px] z-[-1] bg-blue-800 text-blue-800"
				></div>
			</div>

			<div className="h-20 md:h-[100px] rounded-xl relative box-shadow  col-span-6 lg:col-span-3 overflow-hidden bg-gradient-to-r from-[rgba(182,252,194,0.48)] to-[rgba(136,255,132,0.92)] flex items-center px-1 md:px-4 justify-between border-l-[4px] border-green-500 gap-2">
				<div className="size-8 md:size-12 flex items-center justify-center bg-white rounded-full">
					<img
						src="/ic-glass-buy.svg"
						alt=""
						className="size-6 md:size-10 object-cover"
					/>
				</div>
				<div className="flex-1">
					<p className="text-[#186d37] md:text-base text-sm text-end">
						Đơn hàng đã giao
					</p>
					<h3 className="font-bold text-2xl text-green-600 text-end">{formatQuantity(data?.totalOrderSuccess)}</h3>
				</div>
				<div
					style={{
						mask: "url(/shape-square.svg) center center / contain no-repeat",
					}}
					className="absolute -top-6 -left-2 size-[240px] z-[-1] bg-blue-800 text-blue-800"
				></div>
			</div>
			<div className="h-20 md:h-[100px] rounded-xl relative box-shadow  col-span-6 lg:col-span-3 overflow-hidden bg-gradient-to-r from-[rgba(239,214,255,0.48)] to-[rgba(198,132,255,0.48)] flex items-center px-1 md:px-4 justify-between border-l-[4px] border-violet-500">
				<div className="size-8 md:size-12 flex items-center justify-center bg-white rounded-full">
					<img
						src="/ic-glass-users.svg"
						alt=""
						className="size-6 md:size-10 object-cover"
					/>
				</div>
				<div className="">
					<p className="text-[#27097A] md:text-base text-sm text-end">
						Người dùng
					</p>
					<h3 className="font-bold text-2xl text-[#5119B7] text-end">{formatQuantity(data?.totalUser)}</h3>
				</div>
				<div
					style={{
						mask: "url(/shape-square.svg) center center / contain no-repeat",
					}}
					className="absolute -top-6 -left-2 size-[240px] z-[-1] bg-blue-800 text-blue-800"
				></div>
			</div>
			<div className="h-20 md:h-[100px] rounded-xl relative box-shadow  col-span-6 lg:col-span-3 overflow-hidden bg-gradient-to-r from-[rgba(255,230,206,0.48)] to-[rgba(255,172,130,0.76)] flex items-center px-1 md:px-4 justify-between border-l-[4px] border-orange-500">
				<div className="size-8 md:size-12 flex items-center justify-center bg-white rounded-full">
					<img
						src="/ic-notification-package.svg"
						alt=""
						className="size-6 md:size-8 object-cover"
					/>
				</div>
				<div className="">
					<p className="text-[#7A0916]"> Sản phẩm</p>
					<h3 className="font-bold text-2xl text-[#7A0916] text-end">{formatQuantity(data?.totalProduct)}</h3>
				</div>
				<div
					style={{
						mask: "url(/shape-square.svg) center center / contain no-repeat",
					}}
					className="absolute -top-6 -left-2 size-[240px] z-[-1] bg-blue-800 text-blue-800"
				></div>
			</div>
		</>
	);
};

export default CountTotal;
