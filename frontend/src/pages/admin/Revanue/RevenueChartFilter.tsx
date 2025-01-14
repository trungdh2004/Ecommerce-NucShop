import { formatCurrency, getYearsArray } from "@/common/func";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getListDataRevenue } from "@/service/revenue";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { toast } from "sonner";

interface RevenueData {
	value: number;
	totalMoney: number;
	count: number;
	name: string;
	netRevenue: number;
	countOrderSuccess: number;
	countOrderCancel: number;
}

interface FilterParams {
	type: string;
	year: string;
	month: string;
}
const MONTHS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const CustomTooltip = ({ active, payload, label }: any) => {
	if (!active || !payload?.length) return null;
	console.log({ payload });

	return (
		<div className="p-4 bg-white border rounded shadow">
			<p className="font-bold">{label}</p>
			<p className="text-sm">Doanh thu: {formatCurrency(payload[0].value)}</p>
			<p className="text-sm">
				Tổng doanh thu: {formatCurrency(payload[0].payload.totalMoney)}
			</p>
			<p className="text-sm">Số đơn hàng: {payload[0].payload.count}</p>
			<p className="text-sm">
				Số đơn thành công: {payload[0].payload.countOrderSuccess}
			</p>
			<p className="text-sm">
				Số đơn thất bại: {payload[0].payload.countOrderCancel}
			</p>
		</div>
	);
};
type Props = {
	title: string;
	isShowFilter?: boolean;
	className?: string;
};
const RevenueChartFilter = ({
	title,
	isShowFilter = false,
	className,
}: Props) => {
	const [filterParams, setFilterParams] = useState<FilterParams>({
		type: "year",
		year: String(new Date()?.getFullYear()),
		month: "",
	});
	const [data, setData] = useState<RevenueData[]>([]);
	const [_, setIsLoading] = useState(false);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const { data } = await getListDataRevenue(
				isShowFilter ? filterParams : {},
			);
			setData(data);
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [filterParams]);

	const handleFilterChange = (key: keyof FilterParams) => (value: string) => {
		setFilterParams((prev) => ({ ...prev, [key]: value }));
	};

	const showYearSelect =
		filterParams.type === "" ||
		filterParams.type === "year" ||
		filterParams.type === "month";
	const showMonthSelect = filterParams.type === "month";
	return (
		<div className={className}>
			<div className="flex items-center justify-between py-2 pl-2 mb-5 border-b">
				<p className="font-semibold">{title}</p>
				<div className="flex items-center gap-2"></div>
			</div>
			<div
				className={cn(
					" gap-4 mb-3 flex-col md:flex-row justify-end md:pr-7",
					isShowFilter ? "flex" : "hidden",
				)}
			>
				<Select
					value={filterParams.type}
					onValueChange={handleFilterChange("type")}
				>
					<SelectTrigger className="max-sm:w-11/12 max-sm:mx-auto md:w-[180px]">
						<SelectValue placeholder="Chọn loại thống kê" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="month">Theo tháng</SelectItem>
						<SelectItem value="year">Theo năm</SelectItem>
					</SelectContent>
				</Select>

				{showYearSelect && (
					<Select
						value={filterParams.year}
						onValueChange={handleFilterChange("year")}
					>
						<SelectTrigger className="max-sm:w-11/12 max-sm:mx-auto md:w-[180px]">
							<SelectValue placeholder="Chọn năm" />
						</SelectTrigger>
						<SelectContent className="max-h-56">
							{getYearsArray(2010, new Date().getFullYear())
								?.reverse()
								?.map((year) => (
									<SelectItem key={year} value={String(year)}>
										{year}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				)}

				{showMonthSelect && (
					<Select
						value={filterParams.month}
						onValueChange={handleFilterChange("month")}
					>
						<SelectTrigger className="max-sm:w-11/12 max-sm:mx-auto md:w-[180px]">
							<SelectValue placeholder="Chọn tháng" />
						</SelectTrigger>
						<SelectContent className="max-h-56">
							{MONTHS.map((month) => (
								<SelectItem key={month} value={month}>
									Tháng {month}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</div>
			<div className="flex-1 w-full">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={data}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="name"
							angle={-50}
							tick={{ fontSize: "10px", dy: 14 }}
						/>
						<YAxis yAxisId={1} tick={{ fontSize: "12px" }} />
						<YAxis
							orientation="right"
							dataKey="count"
							yAxisId={2}
							tick={{ fontSize: "12px" }}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Legend />
						<Line
							type="monotone"
							dataKey="netRevenue"
							stroke="#4CC9FE"
							name="Doanh thu"
							strokeWidth={2}
							yAxisId={1}
						/>
						<Line
							type="monotone"
							dataKey="totalMoney"
							stroke="#659287"
							name="Tổng doanh thu"
							strokeWidth={2}
							yAxisId={1}
						/>
						<Line
							type="monotone"
							dataKey="countOrderSuccess"
							stroke="#8884d8"
							name="Đơn thành công"
							strokeWidth={2}
							yAxisId={2}
						/>
						<Line
							type="monotone"
							dataKey="count"
							stroke="#FFE6A9"
							name="Số đơn hàng"
							strokeWidth={2}
							yAxisId={2}
						/>
						<Line
							type="monotone"
							dataKey="countOrderCancel"
							stroke="#f32718"
							name="Đơn đã huỷ"
							strokeWidth={2}
							yAxisId={2}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default RevenueChartFilter;
