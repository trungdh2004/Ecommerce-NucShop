import { formatQuantity } from "@/common/localFunction";
import React from "react";

interface CustomLabelProps {
	x?: number;
	y?: number;
	value?: any;
	categoryName?: string;
}

const CustomLabel: React.FC<CustomLabelProps> = ({
	x,
	y,
	value,
	categoryName,
}) => {
	return (
		<g>
			<foreignObject x={x} y={y} width={100} height={50}>
				<div className="flex flex-col items-start text-sm">
					<span className="font-medium">{categoryName}</span>
					<span>{formatQuantity(value, "đ")}</span>
				</div>
			</foreignObject>
		</g>
	);
};

export default CustomLabel;
