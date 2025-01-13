import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/common/func";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { getCountRevenue } from "@/service/revenue";
import { FcMoneyTransfer, FcShipped } from "react-icons/fc";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface StatisticsData {
	totalMoney: number;
	count: number;
	countSuccess: number;
	countCancel: number;
	totalOrderSuccess: number;
	totalOrderCancel: number;
}

const COLORS = ["#00C49F", "#ef4444", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;

// Render label cho biểu đồ Pie
const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
}: any) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? "start" : "end"}
			dominantBaseline="central"
		>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};
const CustomTooltip = ({ active, payload }:any) => {
  if (active && payload && payload.length) {

    return (
      <div className="p-4 bg-white border rounded-lg shadow-lg">
        <p className="text-lg " >
          {`${payload[0].name} : `}
          <span className="text-red-500">{formatCurrency(payload[0].value || 0)}</span>
        </p>
      </div>
    );
  }

  return null;
};
const StatisticsCard = () => {
	const [data, setData] = useState<StatisticsData>({
		totalMoney: 0,
		count: 0,
		countCancel: 0,
		countSuccess: 0,
		totalOrderCancel: 0,
		totalOrderSuccess: 0,
	});
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const { data } = await getCountRevenue();
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
	}, []);

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{[1, 2].map((item) => (
					<Card key={item} className="w-full h-40 animate-pulse">
						<CardContent className="p-6">
							<div className="w-1/3 h-4 mb-4 bg-gray-200 rounded"></div>
							<div className="w-2/3 h-8 bg-gray-200 rounded"></div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	const orderData = [
		{ name: "Thành công", value: data.countSuccess },
		{ name: "Hủy", value: data.countCancel },
	];

	const moneyData = [
		{ name: "Thành công", value: data.totalOrderSuccess },
		{ name: "Thất bại", value: data.totalOrderCancel },
	];

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Card className="relative w-full overflow-hidden group">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
								Tổng doanh thu <FcMoneyTransfer />
							</p>
							<h3 className="mt-2 font-sans text-lg font-bold text-red-500">
								{formatCurrency(data.totalOrderSuccess)}
							</h3>
						</div>
					</div>
					<div className="absolute bottom-0 left-0 w-full h-1 transition-colors duration-200 bg-primary/10 group-hover:bg-blue-500"></div>
				</CardContent>
			</Card>

			<Card className="relative w-full overflow-hidden group">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Số đơn hàng
							</p>
							<h3 className="mt-2 text-lg font-bold">
								{data.count.toLocaleString()}
							</h3>
						</div>
						<div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
							<FcShipped className="text-lg" />
						</div>
					</div>
					<div className="absolute bottom-0 left-0 w-full h-1 transition-colors duration-200 bg-primary/10 group-hover:bg-blue-500"></div>
				</CardContent>
			</Card>

			<Card className="w-full col-span-1 md:col-span-2">
				<CardContent className="p-6">
					<div className="flex flex-col items-center gap-4 md:flex-row">
						<div className="flex-1 space-y-1 text-nowrap">
							<p className="text-sm font-medium text-muted-foreground ">
								Tổng đơn hàng
							</p>
							<p className="text-base font-bold">
								Thành công:{" "}
								<span className="text-green-500">
									{data?.countSuccess}
								</span>
							</p>
							<p className="text-base font-bold">
								Thất bại:{" "}
								<span className="text-red-500">{data?.countCancel}</span>
							</p>
						</div>
						<ResponsiveContainer width={"100%"} height={120}>
							<PieChart>
								<Tooltip />
								<Pie
									data={orderData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={renderCustomizedLabel}
									outerRadius={60}
									fill="#8884d8"
									dataKey="value"
								>
									{orderData.map((_, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>

			<Card className="w-full col-span-1 md:col-span-2">
				<CardContent className="p-6">
					<div className="flex flex-col items-center gap-4 md:flex-row">
						<div className="flex-1 space-y-1">
							<p className="text-sm font-medium text-muted-foreground">
								Tổng tiền đơn hàng
							</p>
							<p className="text-base font-bold">
								Thành công:{" "}
								<span className="text-green-500">
									{formatCurrency(data.totalOrderSuccess)}
								</span>
							</p>
							<p className="text-base font-bold">
								Thất bại:{" "}
								<span className="text-red-500">
									{formatCurrency(data.totalOrderCancel)}
								</span>
							</p>
						</div>
						<ResponsiveContainer width={"100%"} height={120}>
							<PieChart>
								<Tooltip content={CustomTooltip}/>
								<Pie
									data={moneyData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={renderCustomizedLabel}
									outerRadius={60}
									fill="#8884d8"
									dataKey="value"
								>
									{moneyData.map((_, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default StatisticsCard;
