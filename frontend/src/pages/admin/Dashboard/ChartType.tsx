import * as React from "react";
import { Label, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { getChartUserDashboard } from "@/service/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function ComponentChartType() {
	const { data } = useQuery({
		queryKey: ["chartUser"],
		queryFn: async () => {
			try {
				const { data } = await getChartUserDashboard();
				return data;
			} catch (error) {
				toast.error("Lấy thông tin thất bại");
			}
		},
	});
	const totalUser = React.useMemo(() => {
		return data?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;
	}, [data]);

	return (
		<div className="h-[300px] lg:h-[400px] flex flex-col p-2">
			<div className="flex items-center justify-between py-2 border-b">
				<p className="font-semibold">Biểu đồ phương thức đăng kí</p>
				<div className="flex items-center gap-2"></div>
			</div>
			<div className="flex-1 w-full">
				<ResponsiveContainer width={"100%"} height="100%">
					<PieChart>
						<Tooltip />
						<Pie
							data={data}
							dataKey="count"
							nameKey="method"
							innerRadius={40}
							strokeWidth={10}
							fill="green"
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="text-3xl font-bold fill-foreground"
												>
													{totalUser}
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ResponsiveContainer>
			</div>
			<div className="flex items-center justify-around py-2">
				<div className="flex items-center gap-2">
					<p className="bg-blue-500 rounded-sm size-3"></p>
					<p>Đăng kí</p>
				</div>
				<div className="flex items-center gap-2">
					<p className="bg-orange-500 rounded-sm size-3"></p>
					<p>Google</p>
				</div>
			</div>
		</div>
	);
}
