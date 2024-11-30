import { TooltipComponent } from "@/components/common/TooltipComponent";
import React from "react";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoBagCheck } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { MdRemoveShoppingCart } from "react-icons/md";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
	{ month: "January", desktop: 186, mobile: 80 },
	{ month: "February", desktop: 305, mobile: 200 },
	{ month: "March", desktop: 237, mobile: 120 },
	{ month: "April", desktop: 73, mobile: 190 },
	{ month: "May", desktop: 209, mobile: 130 },
	{ month: "June", desktop: 214, mobile: 140 },
];
const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "#22c55e",
	},
	mobile: {
		label: "Mobile",
		color: "#5a95f7",
	},
} satisfies ChartConfig;

const OrderDashboardIndex = () => {
	return (
		<>
			<header className="p-2 md:px-4 md:mb-4 flex justify-between items-end sticky top-0 bg-white w-full z-10">
				<h2 className="font-semibold text-xl sm:text-2xl leading-8">
					Thống kê
				</h2>
			</header>
			<div className="grid grid-cols-12 px-2 sm:px-4 gap-2 sm:gap-4">
				<div className="col-span-6 md:col-span-3 h-16 sm:h-20 bg-white box-shadow flex items-center justify-between px-2 sm:px-4 border border-blue-200 rounded-lg">
					<TooltipComponent label="Doanh thu">
						<div className="p-1 sm:p-3 rounded-md border border-blue-500 text-blue-500 bg-blue-50 cursor-pointer">
							<FaMoneyBillTrendUp size={20} />
						</div>
					</TooltipComponent>
					<div className="text-end">
						<h4 className="text-sm sm:text-base">Doanh thu</h4>
						<span className="text-base sm:text-xl font-semibold text-blue-500">
							100.000đ
						</span>
					</div>
				</div>
				<div className="col-span-6 md:col-span-3 h-16 sm:h-20 bg-white box-shadow flex items-center justify-between px-2 sm:px-4 border border-green-200 rounded-lg">
					<TooltipComponent label="Doanh thu">
						<div className="p-1 sm:p-3 rounded-md border border-green-500 text-green-500 bg-green-50 cursor-pointer">
							<IoBagCheck size={20} />
						</div>
					</TooltipComponent>
					<div className="text-end">
						<h4 className="text-sm sm:text-base">Đã giao hàng</h4>
						<span className="text-base sm:text-xl font-semibold text-green-500">
							100.000đ
						</span>
					</div>
				</div>
				<div className="col-span-6 md:col-span-3 h-16 sm:h-20 bg-white box-shadow flex items-center justify-between px-2 sm:px-4 border border-orange-200 rounded-lg">
					<TooltipComponent label="Doanh thu">
						<div className="p-1 sm:p-3 rounded-md border border-orange-500 text-orange-500 bg-orange-50 cursor-pointer">
							<FaCartShopping size={20} />
						</div>
					</TooltipComponent>
					<div className="text-end">
						<h4 className="text-sm sm:text-base">Chưa giao</h4>
						<span className="text-base sm:text-xl font-semibold text-orange-500">
							100.000đ
						</span>
					</div>
				</div>
				<div className="col-span-6 md:col-span-3 h-16 sm:h-20 bg-white box-shadow flex items-center justify-between px-2 sm:px-4 border border-red-200 rounded-lg">
					<TooltipComponent label="Doanh thu">
						<div className="p-1 sm:p-3 rounded-md border border-red-500 text-red-500 bg-red-50 cursor-pointer">
							<MdRemoveShoppingCart size={20} />
						</div>
					</TooltipComponent>
					<div className="text-end">
						<h4 className="text-sm sm:text-base">Đơn hàng hủy</h4>
						<span className="text-base sm:text-xl font-semibold text-red-500">
							100.000đ
						</span>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-12  px-2 sm:px-4 gap-4 w-full mt-4 pb-4">
				<div className="col-span-12 md:col-span-8 bg-white box-shadow flex flex-col">
					<div className="h-10 w-full p-2">
						<p className="text-sm font-medium ">
							Biều đồ doanh thu và đơn hàng
						</p>
					</div>
					<div className="flex-1">
						<ChartContainer config={chartConfig}>
							<BarChart accessibilityLayer data={chartData}>
								<CartesianGrid vertical={false} />
								<ChartLegend content={<ChartLegendContent />} />
								<XAxis
									dataKey="month"
									tickLine={false}
									// tickMargin={10}
									axisLine={false}
									tickFormatter={(value) => value.slice(0, 3)}
								/>
								<YAxis />
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent indicator="dashed" />}
								/>
								<Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
								<Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
							</BarChart>
						</ChartContainer>
					</div>
				</div>
				<div className="col-span-12 md:col-span-4 h-auto bg-white box-shadow flex flex-col min-h-[300px]">
					<div className="h-10 w-full p-2 bg-white">
						<p className="text-sm font-medium ">Danh sách tiền ship</p>
					</div>
					<div className="px-2 flex-1 space-y-1">
						<div className="w-full px-2 py-2 rounded-r-md bg-yellow-100 text-sm">
							Nhận 50k ship đơn hàng có mã:{" "}
							<span className="font-medium text-sm">MDHFJSHEGFE</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default OrderDashboardIndex;
