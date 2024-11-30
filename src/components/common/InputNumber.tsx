import React from "react";
import { Input } from "@/components/ui/input";

interface IProps {
	value: string;
	type?: string;
	onChange: (value:string) => void;
	name: string;
	isNumeric?: boolean;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

const InputNumber = ({ value, type, onChange, name, isNumeric,disabled,className,placeholder }: IProps) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let value = event?.target?.value;
		if (isNumeric) {
			value = value.replace(/[^0-9]/g, "");
		}
        onChange(value)
	};
	return (
		<Input
            type={type || "text"}
			placeholder={placeholder}
			name={name}
			value={value}
			onChange={handleChange}
            disabled={disabled || false}
            className={className}
		/>
	);
};

export default InputNumber;
