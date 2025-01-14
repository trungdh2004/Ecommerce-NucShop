import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import { formatQuantity } from "@/common/localFunction";
import { getCountCategory } from "@/service/dashboard.service";
import { useQuery } from "@tanstack/react-query";

export const description = "A bar chart with a custom label";
interface CustomTooltipProps extends TooltipProps<number, string> {}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
	active,
	payload,
	label,
}) => {
	if (active && payload && payload.length) {
		return (
			<div className="p-2 rounded-sm bg-white box-shadow min-w-[120px]">
				<p className="mb-1 text-sm font-medium ">{`${label}`}</p>
				<table className="w-full text-xs">
					<tr>
						<td colSpan={1}>
							<div className="bg-blue-500 rounded-sm size-3 "></div>
						</td>
						<td className="text-left " colSpan={2}>
							<div className="">Doanh thu</div>
						</td>
						<td colSpan={1}>
							<div className=""></div>
						</td>
						<td className="text-end" colSpan={2}>
							<div className="">
								{formatQuantity(payload[0].value || 0, "đ")}
							</div>
						</td>
					</tr>
				</table>
			</div>
		);
	}

	return null;
};

export default function CategoryDashboard() {
	const { data } = useQuery({
		queryKey: ["dashboardCategory"],
		queryFn: async () => {
			try {
				const { data } = await getCountCategory();
				return data;
			} catch (error) {}
		},
	});

	return (
		<div className="h-[300px] lg:h-[400px] flex flex-col p-2 overflow-y-auto">
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
							bottom: 12,
						}}
						barCategoryGap={"15%"}
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
								position="insideRight"
								content={(props) => {
									const { x, y, value } = props;
									return (
										<g>
											<foreignObject
												x={Number(x) + 5}
												y={Number(y) + 40}
												width={100}
												height={50}
											>
												<div className="flex flex-col items-start text-xs">
													<span>{value}:</span>
												</div>
											</foreignObject>
										</g>
									);
								}}
							/>
							<LabelList
								dataKey="totalMoney"
								position="insideRight"
								content={(props) => {
									const { x, y, value } = props;
									return (
										<g>
											<foreignObject
												x={Number(x) + 95}
												y={Number(y) + 40}
												width={100}
												height={50}
											>
												<div className="flex flex-col items-start text-xs">
													<span className="text-red-500">
														{formatQuantity(Number(value), "đ")}
													</span>
												</div>
											</foreignObject>
										</g>
									);
								}}
							/>
						</Bar>
						{/* <Bar
							dataKey="totalMoney"
							layout="horizontal"
							fill="#008cff"
							radius={4}
						>
							
							  <LabelList
  								dataKey="categoryName"
  								position="insideLeft"
  								offset={5}
  								className="fill-[--color-label]"
  								fontSize={12}
  							/>
  							<LabelList
  								dataKey="totalMoney"
  								position="insideBottomLeft"
  								offset={5}
  								className="fill-foreground"
  								fontSize={14}
  								formatter={(value: any) => formatQuantity(value, "đ")}
  							/>
							
						</Bar> */}
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
