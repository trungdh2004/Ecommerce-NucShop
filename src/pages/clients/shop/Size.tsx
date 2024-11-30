import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { getAllSize } from "@/service/size-admin";
import { SearchObjectTypeProduct } from "@/types/searchObjecTypes";
import { ISize } from "@/types/variants";
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
}
const Size = ({ setSearchParamsObject }: Props) => {
	const [size, setSize] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [check, setCheck] = useState(false);
	const query = useQueryClient();
	useEffect(() => {
		(async () => {
			try {
				const { data } = await getAllSize();
				setSize(data.data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);
	// useEffect(() => {
	// 	const paramsObject = Object.fromEntries(searchParams.entries());
	// 	const sizeCheck =
	// 		paramsObject?.size
	// 			?.split(",")
	// 			.map((c) => c.trim())
	// 			.filter(Boolean) ?? [];
	// 	setSearchParamsObject((prev) => ({
	// 		...prev,
	// 		size: sizeCheck,
	// 	}));
	// }, [searchParams, setSearchParamsObject]);

	const handleCheckedSize = useCallback(
		(size: string) => (checked: CheckedState) => {
			let sizes = searchParams.get("size")?.split(",") ?? [];
			if (checked) {
				sizes.push(size);
			} else {
				sizes = sizes.filter((_size) => _size !== size);
			}
			searchParams.set("size", sizes.join());
			setSearchParams(searchParams);

			const paramsObject: any = Object.fromEntries(searchParams.entries());
			const sizeCheck =
				paramsObject?.size
					?.split(",")
					.map((c: string) => c.trim())
					.filter(Boolean) ?? [];
			setSearchParamsObject((prev) => ({
				...prev,
				size: sizeCheck,
			}));
			query.invalidateQueries({ queryKey: ["productShop"] });
		},
		[searchParams, setSearchParams, setSearchParamsObject, query],
	);
	return (
		<div className="w-full flex flex-col gap-3 lg:py-2 pb-8">
			<div
				className="flex justify-between items-center cursor-pointer"
				onClick={!check ? () => setCheck(true) : () => setCheck(false)}
			>
				<h3 className="text-uppercase py-1 font-semibold leading-7 tracking-wide lg:text-base md:text-sm sm:text-xs">
					Kích thước
				</h3>
				{!check ? (
					<FaAngleDown
						className="cursor-pointer transition-transform"
						onClick={() => setCheck(true)}
					/>
				) : (
					<FaAngleUp
						className="cursor-pointer transition-transform"
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
					{size?.map((size: ISize) => {
						return (
							<div className="flex flex-col items-center gap-3" key={size._id}>
								<Checkbox
									className={cn(
										`data-[state=checked]:bg-white data-[state=checked]:text-[#000000] rounded-full lg:w-7 lg:h-7 w-6 h-6 border-[#909090] p-1 text-[10px]`,
									)}
									value={size._id}
									checked={
										searchParams
											.get("size")
											?.split(",")
											.includes(size._id as string) || false
									}
									onCheckedChange={handleCheckedSize(size._id as string)}
								/>
								<span className="font-medium lg:text-sm text-xs">
									{size.name}
								</span>
							</div>
						);
					})}
				</div>
			</div>
			<hr />
		</div>
	);
};

export default Size;
