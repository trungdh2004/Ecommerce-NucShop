"use client";

import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
	XAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import { getChartOrderDashboard } from "@/service/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

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
				<p className="mb-1 text-sm font-medium ">{`${label}`}</p>
				<table className="w-full text-xs">
					<tr>
						<td colSpan={1}>
							<div className="bg-blue-500 rounded-sm size-3 "></div>
						</td>
						<td className="text-left " colSpan={2}>
							<div className="">Đơn mới</div>
						</td>
						<td className="text-end" colSpan={2}>
							<div className="">{payload[0].value}</div>
						</td>
					</tr>
					<tr>
						<td colSpan={1}>
							<div className="bg-green-500 rounded-sm size-3 "></div>
						</td>
						<td className="text-left " colSpan={2}>
							<div className="">Thành công</div>
						</td>
						<td className="text-end" colSpan={2}>
							<div className="">{payload[1].value}</div>
						</td>
					</tr>
					<tr>
						<td colSpan={1}>
							<div className="rounded-sm size-3 bg-rose-500 "></div>
						</td>
						<td className="text-left " colSpan={2}>
							<div className="">Hủy</div>
						</td>
						<td className="text-end" colSpan={2}>
							<div className="">{payload[2].value}</div>
						</td>
					</tr>
				</table>
			</div>
		);
	}

	return null;
};

export function ComponentChart() {
	const [status, setStatus] = useState(1);
	const { data } = useQuery({
		queryKey: ["chartOrder", status],
		queryFn: async () => {
			try {
				const { data } = await getChartOrderDashboard(status);
				return data;
			} catch (error) {
				toast.error("Lấy thông tin thất bại");
			}
		},
	});

	return (
		<div className="h-[300px] lg:h-[400px] flex flex-col p-2">
			<div className="flex items-center justify-between py-2 border-b">
				<p className="font-semibold">Biểu đồ đơn hàng</p>
				<div className="flex items-center gap-2">
					<button
						className={cn(
							"py-1 px-2 rounded-sm  font-medium border text-sm hover:bg-blue-500 hover:text-white",
							status === 1 && "bg-blue-500 text-white",
						)}
						onClick={() => {
							setStatus(1);
						}}
					>
						Ngày
					</button>
					<button
						className={cn(
							"py-1 px-2 rounded-sm  font-medium border text-sm hover:bg-blue-500 hover:text-white",
							status === 2 && "bg-blue-500 text-white",
						)}
						onClick={() => {
							setStatus(2);
						}}
					>
						Tháng
					</button>
				</div>
			</div>
			<div className="flex-1 w-full py-1">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={data?.listDataOrder || []}
						margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
					>
						<defs>
							<linearGradient id="cancel" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
								<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
							</linearGradient>
							<linearGradient id="new" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
								<stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
							</linearGradient>
						</defs>
						<XAxis
							dataKey="date"
							tickLine={true}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value}
							tick={{ fontSize: 11 }}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Area
							type="monotone"
							dataKey="new"
							stroke="blue"
							fillOpacity={0.2}
							fill="rgba(115 , 185, 251, 0.84)"
						/>
						<Area
							type="monotone"
							dataKey="success"
							stroke="green"
							fillOpacity={0.2}
							fill="rgba(136, 255, 132, 0.92)"
						/>
						<Area
							type="monotone"
							dataKey="cancel"
							stroke="red"
							fillOpacity={0.2}
							fill="red"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
