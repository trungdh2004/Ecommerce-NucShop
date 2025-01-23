import { TooltipComponent } from "@/components/common/TooltipComponent";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FaCartShopping, FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoBagCheck } from "react-icons/io5";
import { MdRemoveShoppingCart } from "react-icons/md";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
			<header className="sticky top-0 z-10 flex items-end justify-between w-full p-2 bg-white md:px-4 md:mb-4">
				<h2 className="text-xl font-semibold leading-8 sm:text-2xl">
					Thống kê
				</h2>
			</header>
			<div className="grid grid-cols-12 gap-2 px-2 sm:px-4 sm:gap-4">
				<div className="flex items-center justify-between h-16 col-span-6 px-2 bg-white border border-blue-200 rounded-lg md:col-span-3 sm:h-20 box-shadow sm:px-4">
					<TooltipComponent label="Doanh thu">
						<div className="p-1 text-blue-500 border border-blue-500 rounded-md cursor-pointer sm:p-3 bg-blue-50">
							<FaMoneyBillTrendUp size={20} />
						</div>
					</TooltipComponent>
					<div className="text-end">
						<h4 className="text-sm sm:text-base">Doanh thu</h4>
						<span className="text-base font-semibold text-blue-500 sm:text-xl">
							100.000đ
						</span>
					</div>
				</div>
				<div className="flex items-center justify-between h-16 col-span-6 px-2 bg-white border border-green-200 rounded-lg md:col-span-3 sm:h-20 box-shadow sm:px-4">
					<TooltipComponent label="Doanh thu">
						<div className="p-1 text-green-500 border border-green-500 rounded-md cursor-pointer sm:p-3 bg-green-50">
							<IoBagCheck size={20} />
						</div>
					</TooltipComponent>
					<div className="text-end">
						<h4 className="text-sm sm:text-base">Đã giao hàng</h4>
						<span className="text-base font-semibold text-green-500 sm:text-xl">
							100.000đ
						</span>
					</div>
				</div>
				<div className="flex items-center justify-between h-16 col-span-6 px-2 bg-white border border-orange-200 rounded-lg md:col-span-3 sm:h-20 box-shadow sm:px-4">
					<TooltipComponent label="Doanh thu">
						<div className="p-1 text-orange-500 border border-orange-500 rounded-md cursor-pointer sm:p-3 bg-orange-50">
							<FaCartShopping size={20} />
						</div>
					</TooltipComponent>
					<div className="text-end">
						<h4 className="text-sm sm:text-base">Chưa giao</h4>
						<span className="text-base font-semibold text-orange-500 sm:text-xl">
							100.000đ
						</span>
					</div>
				</div>
				<div className="flex items-center justify-between h-16 col-span-6 px-2 bg-white border border-red-200 rounded-lg md:col-span-3 sm:h-20 box-shadow sm:px-4">
					<TooltipComponent label="Doanh thu">
						<div className="p-1 text-red-500 border border-red-500 rounded-md cursor-pointer sm:p-3 bg-red-50">
							<MdRemoveShoppingCart size={20} />
						</div>
					</TooltipComponent>
					<div className="text-end">
						<h4 className="text-sm sm:text-base">Đơn hàng hủy</h4>
						<span className="text-base font-semibold text-red-500 sm:text-xl">
							100.000đ
						</span>
					</div>
				</div>
			</div>

			<div className="grid w-full grid-cols-12 gap-4 px-2 pb-4 mt-4 sm:px-4">
				<div className="flex flex-col col-span-12 bg-white md:col-span-8 box-shadow">
					<div className="w-full h-10 p-2">
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
					<div className="w-full h-10 p-2 bg-white">
						<p className="text-sm font-medium ">Danh sách tiền ship</p>
					</div>
					<div className="flex-1 px-2 space-y-1">
						<div className="w-full px-2 py-2 text-sm bg-yellow-100 rounded-r-md">
							Nhận 50k ship đơn hàng có mã:{" "}
							<span className="text-sm font-medium">MDHFJSHEGFE</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default OrderDashboardIndex;
