import {
	Bar,
	BarChart,
	LabelList,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
	XAxis,
	YAxis
} from "recharts";

import { formatQuantity } from "@/common/localFunction";
import {
	ChartConfig
} from "@/components/ui/chart";
import { getCountCategory } from "@/service/dashboard.service";
import { useQuery } from "@tanstack/react-query";

export const description = "A bar chart with a custom label";

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
		color: "#008cff",
	},
	totalMoney: {
		label: "Doanh thu",
	},
	label: {
		color: "hsl(var(--background))",
	},
} satisfies ChartConfig;
interface CustomTooltipProps extends TooltipProps<number, string> {}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
	active,
	payload,
	label,
}) => {
	console.log({ active, payload, label });

	if (active && payload && payload.length) {
		return (
			<div className="p-2 rounded-sm bg-white box-shadow min-w-[120px]">
				<p className="font-medium mb-1 text-sm ">{`${label}`}</p>
				<table className="w-full text-xs">
					<tr>
						<td colSpan={1}>
							<div className="size-3 bg-blue-500 rounded-sm "></div>
						</td>
						<td className=" text-left" colSpan={2}>
							<div className="">Doanh thu</div>
						</td>
						<td className="text-end" colSpan={2}>
							<div className="">{payload[0].value}</div>
						</td>
					</tr>
				</table>
			</div>
		);
	}

	return null;
};

export default function CategoryDashboard() {
	const { data, isLoading } = useQuery({
		queryKey: ["dashboardCategory"],
		queryFn: async () => {
			try {
				const { data } = await getCountCategory();
				return data;
			} catch (error) {}
		},
	});

	return (
		<div className="h-[300px] lg:h-[400px] flex flex-col p-2">
			<div className="flex items-center justify-between py-2 border-b">
				<p className="font-semibold">Biểu đồ loại hàng mua nhiều nhất </p>
			</div>

			<div className="flex-1 w-full">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						accessibilityLayer
						data={data}
						layout="vertical"
						margin={{
							right: 16,
						}}
					>
						<YAxis
							dataKey="categoryName"
							type="category"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							hide
						/>
						<XAxis dataKey="totalMoney" type="number" hide />
						<Tooltip content={<CustomTooltip />} />
						<Bar
							dataKey="totalMoney"
							layout="horizontal"
							fill="#008cff"
							radius={4}
						>
							<LabelList
								dataKey="categoryName"
								position="insideLeft"
								offset={8}
								className="fill-[--color-label]"
								fontSize={12}
							/>
							<LabelList
								dataKey="totalMoney"
								position="insideRight"
								offset={8}
								className="fill-foreground"
								fontSize={14}
								formatter={(value: any) => formatQuantity(value, "đ")}
							/>
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
