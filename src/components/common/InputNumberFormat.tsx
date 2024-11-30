import React from "react";
import { NumericFormat } from "react-number-format";
import { Input } from "../ui/input";

export interface NumberFormatValues {
	floatValue: number | undefined;
	formattedValue: string;
	value: string;
}

interface IProps {
	value: number | string;
	onChange: (value: NumberFormatValues) => void;
	suffix?: string;
	option?: any;
	allowNegative?: boolean;
	isAllowed?: (value: NumberFormatValues) => void;
	disabled?: boolean;
}

const InputNumberFormat = ({
	value,
	onChange,
	suffix = "đ",
	option,
	allowNegative = false,
	isAllowed,
	disabled = false,
}: IProps) => {
	return (
		<NumericFormat
			value={value}
			allowLeadingZeros
			thousandSeparator=","
			onValueChange={onChange}
			customInput={Input}
			suffix={suffix}
			{...option}
			allowNegative={allowNegative}
			onChange={(e) => {
				console.log(e);
			}}
			isAllowed={isAllowed}
			disabled={disabled}
		/>
	);
};

export default InputNumberFormat;
