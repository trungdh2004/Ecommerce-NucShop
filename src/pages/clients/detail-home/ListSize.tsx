import LabelChecked from "@/components/common/LabelChecked";
import SkeletonVariant from "./SkeletonVariant";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type Size = {
	id?: string;
	sizeName?: string;
	listColor?: string[];
	quantity?: number;
};

type Props = {
	listSizeExist?: Size[];
	isLoading?: boolean;
	onChoose?: (value: string) => void;
	setExitsListColor?: (value: string[]) => void;
	exitsListSize?: string[];
	setTotalQuantity?: (value: number) => void;
	sizeInput?: "small" | "medium" | "large" | "responsive" | "mobile";
	widthLabel?: number;
	sizeIdChecked?: string;
	selectedSize?: string[];
	validExits?: boolean;
};

const ListSize: React.FC<Props> = ({
	isLoading = false,
	listSizeExist = [],
	exitsListSize = [],
	onChoose,
	setExitsListColor,
	setTotalQuantity,
	sizeInput,
	widthLabel,
	sizeIdChecked,
	selectedSize,
	validExits,
}) => {
	useEffect(() => {
		if (sizeIdChecked) {
			const size = listSizeExist.find((s) => s?.id == sizeIdChecked);
			onChoose?.(size?.id || "");
			setTotalQuantity?.(size?.quantity || 0);
			setExitsListColor?.(size?.listColor || []);
		}
	}, [sizeIdChecked]);
	const handleChange =
		(size: Size) => (e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.checked) {
				onChoose?.(size.id || "");
				setTotalQuantity?.(size.quantity || 0);
				setExitsListColor?.(size.listColor || []);
			} else {
				onChoose?.("");
				setExitsListColor?.([]);
			}
		};

	return (
		<div className="flex max-md:flex-col max-md:gap-3 items-start">
			<h3
				className={cn(
					"font-normal text-base text-gray-500",
					widthLabel ? `w-[${widthLabel}px]` : "min-w-28 max-w-28",
				)}
			>
				Kích thước
			</h3>
			{isLoading ? (
				<SkeletonVariant />
			) : (
				<div className="flex flex-wrap items-center gap-2 w-full">
					{listSizeExist.map((size) => (
						<LabelChecked
							disabled={
								validExits
									? selectedSize?.includes(size.id || "") ||
										(exitsListSize.length > 0 &&
											!exitsListSize.includes(size.id || ""))
									: exitsListSize.length > 0 &&
										!exitsListSize.includes(size.id || "")
							}
							defaultChecked={size?.id == sizeIdChecked}
							onChange={handleChange(size)}
							isOneChecked
							value={size.id || ""}
							key={size.id}
							nameInput="chooseSize"
							size={sizeInput || "responsive"}
						>
							{size.sizeName}
						</LabelChecked>
					))}
				</div>
			)}
		</div>
	);
};

export default ListSize;
