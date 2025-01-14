import RevenueChartFilter from "./RevenueChartFilter";
import StatisticsCard from "./StatisticsCard";
const RevenueChart = () => {
	return (
		<div className="w-full">
			<h4 className="text-base font-medium md:text-xl">Danh sách danh mục</h4>

			<div className="mt-4">
				<div className="grid grid-cols-3 gap-5">
					<div className="col-span-3 xl:col-span-1">
						<StatisticsCard />
					</div>
					<div className="col-span-3 bg-white xl:col-span-2 box-shadow rounded-xl">
						<RevenueChartFilter
							className="flex flex-col w-full h-full"
							title="Biểu đồ doanh thu theo tháng hiện tại"
						/>
					</div>
				</div>
				<RevenueChartFilter
					isShowFilter
					title="Biểu đồ danh thu lọc theo tháng năm"
					className="mt-5 bg-white box-shadow rounded-xl flex flex-col h-[480px]"
				/>
			</div>
		</div>
	);
};

export default RevenueChart;
