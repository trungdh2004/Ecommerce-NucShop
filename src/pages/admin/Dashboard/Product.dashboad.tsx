"use client";

import { formatQuantity } from "@/common/localFunction";
import { getCountProduct } from "@/service/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
	active,
	payload,
	label,
}) => {
	console.log({ active, payload, label });

	if (active && payload && payload.length) {

		const url = payload[0]?.payload?.productImage
		return (
			<div className="p-2 rounded-sm bg-white box-shadow min-w-[120px]">
				<p className="font-medium mb-1 text-sm text-center flex justify-center">
					<img src={url} className="size-5 rounded-sm border"/>
				</p>
				<table className="w-full text-xs">
					<tr>
						<td colSpan={1}>
							<div className="size-3 bg-orange-500 rounded-sm "></div>
						</td>
						<td className=" text-left" colSpan={2}>
							<div className="">Số lượng bán</div>
						</td>
						<td className="text-end" colSpan={2}>
							<div className="">{payload[0]?.value}</div>
						</td>
					</tr>
					<tr>
						<td colSpan={1}>
							<div className="size-3 bg-blue-500 rounded-sm "></div>
						</td>
						<td className=" text-left" colSpan={2}>
							<div className="">Doanh thu</div>
						</td>
						<td className="text-end" colSpan={2}>
							<div className="">{formatQuantity(payload[1]?.value as number,"đ")}</div>
						</td>
					</tr>
					
				</table>
			</div>
		);
	}

	return null;
};

export default function ProductDashboard() {
	const { data } = useQuery({
		queryKey: ["dashboardProduct"],
		queryFn: async () => {
			try {
				const { data } = await getCountProduct();
				return data;
			} catch (error) {}
		},
	});

	return (
		<div className="h-[300px] lg:h-[400px] flex flex-col p-2">
			<div className="flex items-center justify-between py-2 border-b">
				<p className="font-semibold">Biểu đồ sản phẩm bán chạy</p>
			</div>

			<div className="flex-1 w-full">
				<ResponsiveContainer width={"100%"} height="100%">
					<BarChart accessibilityLayer data={data}>
						{/* <CartesianGrid vertical={false} /> */}
						<Tooltip content={<CustomTooltip />}/>
						<XAxis
							dataKey="_id"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tick={({ x, y, payload, value }) => {
								const image = data[payload.index].productImage;
								return (
									<foreignObject x={x - 15} y={y - 10} width={30} height={30}>
										<img
											src={image}
											width={30} // Đặt chiều rộng của hình ảnh
											height={30} // Đặt chiều cao của hình ảnh
											className="size-[30px] border rounded-sm"
										/>
									</foreignObject>
								);
							}}
						/>
						<YAxis
							dataKey="totalQuantity"
							yAxisId={0}
							tickLine={false}
							label={{
								value: "Số lượng",
								angle: -90,
								position: "insideLeft",
							}}
							tick={{fontSize:"12px"}}
						/>
						<YAxis
							dataKey="totalMoney"
							orientation="right"
							yAxisId={1}
							label={{
								value: "Doanh thu",
								angle: 90,
								position: "insideRight",
							}}
							tick={{fontSize:"12px"}}
						/>
						<Bar
							dataKey="totalQuantity"
							fill="#f97316"
							radius={4}
							opacity={1}
							yAxisId={0}
						/>
						<Bar
							dataKey="totalMoney"
							fill="#3b82f6"
							radius={4}
							yAxisId={1}
							opacity={1}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
