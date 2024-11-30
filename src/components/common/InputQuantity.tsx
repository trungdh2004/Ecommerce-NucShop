import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import { HiMiniMinus } from "react-icons/hi2";

interface InputQuantityProps {
	maxTotal?: number;
	getValue?: (value: number) => void;
	defaultValue?: number;
	disabled?: boolean;
	className?: string;
	size?: "small" | "medium" | "large" | "responsive" | "mobile";
}

const InputQuantity: React.FC<InputQuantityProps> = ({
	maxTotal = Infinity,
	getValue,
	defaultValue = 1,
	disabled = false,
	className,
	size = "medium",
}) => {
	const [value, setValue] = useState(defaultValue);
	const inputRef = useRef<HTMLInputElement>(null);

	const updateValue = useCallback(
		(newValue: number) => {
			const clampedValue = Math.max(1, Math.min(newValue, maxTotal));
			setValue(clampedValue);
			getValue?.(clampedValue);
		},
		[maxTotal, getValue],
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			updateValue(Number(e.target.value));
		},
		[updateValue],
	);

	const handleButtonClick = useCallback(
		(increment: number) => {
			updateValue(value + increment);
		},
		[value, updateValue],
	);
useEffect(() => {
	setValue(defaultValue);
	}, [defaultValue]);
	// useEffect(() => {
	// 	updateValue(defaultValue);
	// }, [defaultValue, updateValue]);

	const sizeClasses = {
		small: "h-8 text-sm",
		medium: "h-10 text-base",
		large: "h-12 text-lg",
		mobile: "h-5 text-sm",
		responsive:
			"h-8 text-sm sm:h-9 sm:text-base md:h-10 md:text-base lg:h-12 lg:text-lg",
	};

	const buttonClasses = cn(
		"flex items-center justify-center w-8 sm:w-9 md:w-10 lg:w-12 border-gray-400 cursor-pointer bg-transparent transition-opacity",
		sizeClasses[size],
		{
			"opacity-60 cursor-not-allowed": disabled,
		},
	);

	const containerClasses = cn(
		"flex items-center border border-gray-400 rounded w-full",
		size === "responsive"
			? "max-w-24 sm:max-w-28 md:max-w-32 lg:max-w-36"
			: "max-w-32",
		sizeClasses[size],
		disabled && "pointer-events-none bg-black/5",
		className,
	);

	return (
		<div className={containerClasses}>
			<button
				onClick={() => handleButtonClick(-1)}
				className={cn(buttonClasses, "border-r", { "opacity-60": value <= 1 })}
				disabled={disabled || value <= 1}
			>
				<HiMiniMinus />
			</button>
			<input
				ref={inputRef}
				type="number"
				value={value}
				onChange={handleInputChange}
				disabled={disabled}
				max={maxTotal}
				min={1}
				className={cn(
					"flex-1  w-full text-center outline-none appearance-none bg-transparent [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
					sizeClasses[size],
					size === "mobile" ? " min-w-7" : "min-w-12",
				)}
			/>
			<button
				onClick={() => handleButtonClick(1)}
				className={cn(buttonClasses, "border-l", {
					"opacity-60": value >= maxTotal,
				})}
				disabled={disabled || value >= maxTotal}
			>
				<GoPlus />
			</button>
		</div>
	);
};

export default InputQuantity;
