import { TooltipComponent } from "@/components/common/TooltipComponent";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { getAllColor } from "@/service/color";
import { SearchObjectTypeProduct } from "@/types/searchObjecTypes";
import { IColor } from "@/types/typeProduct";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useQueryClient } from "@tanstack/react-query";
import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

interface Props {
	setSearchParamsObject: Dispatch<SetStateAction<SearchObjectTypeProduct>>;
	searchParamsObject: SearchObjectTypeProduct;
}
const Color = ({ setSearchParamsObject, searchParamsObject }: Props) => {
	const [colors, setColors] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [check, setCheck] = useState(false);
	// const paramsObject: any = Object.fromEntries(searchParams.entries());
	const query = useQueryClient();
	useEffect(() => {
		(async () => {
			try {
				const { data } = await getAllColor();
				setColors(data.data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);
	// useEffect(() => {
	// 	const paramsObject = Object.fromEntries(searchParams.entries());
	// 	const colorCheck =
	// 		paramsObject?.color
	// 			?.split(",")
	// 			.map((c) => c.trim())
	// 			.filter(Boolean) ?? [];
	// 	setSearchParamsObject((prev) => ({
	// 		...prev,
	// 		color: colorCheck,
	// 	}));
	// }, [searchParams, setSearchParamsObject]);

	const handleCheckedColor = useCallback(
		(color: string) => (checked: CheckedState) => {
			let colors = searchParams.get("color")?.split(",") ?? [];
			if (checked) {
				colors.push(color);
			} else {
				colors = colors.filter((_color) => _color !== color);
			}
			searchParams.set("color", colors.join());
			setSearchParams(searchParams);

			const paramsObject: any = Object.fromEntries(searchParams.entries());
			const colorCheck =
				paramsObject?.color
					?.split(",")
					.map((c: string) => c.trim())
					.filter(Boolean) ?? [];
			setSearchParamsObject((prev) => ({
				...prev,
				color: colorCheck,
			}));
			query.invalidateQueries({ queryKey: ["productShop"] });
		},
		[searchParams, setSearchParams, setSearchParamsObject, query],
	);
	return (
		<div className="flex flex-col w-full gap-3 py-1 lg:py-2">
			<div
				className="flex items-center justify-between cursor-pointer"
				onClick={!check ? () => setCheck(true) : () => setCheck(false)}
			>
				<h3 className="py-1 font-semibold leading-7 tracking-wide text-uppercase lg:text-base md:text-sm sm:text-xs">
					Màu sắc
				</h3>
				{!check ? (
					<FaAngleDown
						className="transition-transform cursor-pointer"
						onClick={() => setCheck(true)}
					/>
				) : (
					<FaAngleUp
						className="transition-transform cursor-pointer"
						onClick={() => setCheck(false)}
					/>
				)}
			</div>
			<div
				className={cn(
					"transition-all duration-200 overflow-hidden",
					check ? "max-h-full opacity-100" : "max-h-0 opacity-0",
				)}
			>
				<div className="grid grid-cols-4 gap-1">
					{colors?.map((color: IColor) => {
						return (
							<TooltipComponent
								key={color?._id}
								label={color.name}
								side="bottom"
							>
								<div
									className="flex flex-col items-center gap-3"
									key={color._id}
								>
									<Checkbox
										className={cn(
											`data-[state=checked]:bg-white data-[state=checked]:text-[#ffffff] rounded-full lg:w-7 lg:h-7 w-6 h-6 border-[#eee] p-1 text-[10px] font-bold `,
											color.code === "#ffffff" &&
												"data-[state=checked]:text-black",
										)}
										style={{ backgroundColor: color.code }}
										value={color._id}
										checked={
											searchParams
												.get("color")
												?.split(",")
												.includes(color._id) || false
										}
										onCheckedChange={handleCheckedColor(color._id)}
									/>

									{/* <span className="text-xs font-medium lg:text-sm">
									{color.name}
								</span> */}
								</div>
							</TooltipComponent>
						);
					})}
				</div>
			</div>
			<hr />
		</div>
	);
};

export default Color;
