import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
	{ name: "Tháng 1", uv: 4000, pv: 2400, amt: 2400 },
	{ name: "Tháng 2", uv: 3000, pv: 1398, amt: 2210 },
	{ name: "Tháng 3", uv: 2000, pv: 9800, amt: 2290 },
	{ name: "Tháng 4", uv: 2780, pv: 3908, amt: 2000 },
	{ name: "Tháng 5", uv: 1890, pv: 4800, amt: 2181 },
	{ name: "Tháng 6", uv: 2390, pv: 3800, amt: 2500 },
	{ name: "Tháng 7", uv: 3490, pv: 4300, amt: 2100 },
	{ name: "Tháng 1", uv: 4000, pv: 2400, amt: 2400 },
	{ name: "Tháng 2", uv: 3000, pv: 1398, amt: 2210 },
	{ name: "Tháng 3", uv: 2000, pv: 9800, amt: 2290 },
	{ name: "Tháng 4", uv: 2780, pv: 3908, amt: 2000 },
	{ name: "Tháng 5", uv: 1890, pv: 4800, amt: 2181 },
];

const SimpleBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart  data={data}>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
			<Legend />
			<Bar dataKey="uv" fill="#3b83f6" />
			<Bar dataKey="pv" fill="#82ca9d" />
		</BarChart>
    </ResponsiveContainer>
		
	);
};

export default SimpleBarChart;
