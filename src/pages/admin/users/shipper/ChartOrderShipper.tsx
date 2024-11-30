import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const ChartOrderShipper = () => {
    const data = [
        { name: "Group A", value: 400 },
        { name: "Group B", value: 300 },
        { name: "Group C", value: 300 },
    ];
    
    const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];
    
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index
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
            {` ${(percent * 100).toFixed(0)}%`}
        </text>
        );
    };
    
    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width={'100%'} height={'100%'}>
                <PieChart >
                    <Pie
                        data={data}
                        cx="50%"
            cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        // outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ChartOrderShipper;
