import { cn } from "@/lib/utils";
import { SearchObjectTypeProduct } from "@/types/searchObjecTypes";
import { Dispatch, SetStateAction, useState } from "react";
import { FaAngleDown, FaAngleUp, FaRegStar, FaStar } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
interface Props {
	setSearchParamsObject: Dispatch<SetStateAction<SearchObjectTypeProduct>>;
}
const SortFilterStar = ({ setSearchParamsObject }: Props) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [check, setCheck] = useState(false);
	const [rating, setRating] = useState<number>(0);

	const handleRatingChange = (rating: string) => {
		setRating(parseInt(rating));
		searchParams.set("rating", rating);
		searchParams.set("pageIndex", "1");
		setSearchParams(searchParams);
		const paramsObject: any = Object.fromEntries(searchParams.entries());
		setSearchParamsObject((prev) => ({
			...prev,
			rating: parseInt(paramsObject.rating),
			pageIndex: 1,
		}));
	};
	return (
		<div className="flex flex-col w-full pb-8 lg:py-2">
			<div
				className="flex items-center justify-between cursor-pointer"
				onClick={!check ? () => setCheck(true) : () => setCheck(false)}
			>
				<h3 className="py-2 font-semibold leading-7 tracking-wide text-uppercase lg:text-base md:text-sm sm:text-xs">
					Đánh giá
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
					"transition-all duration-200 overflow-hidden flex flex-col gap-y-3",
					check ? "max-h-full opacity-100" : "max-h-0 opacity-0",
				)}
			>
				<div
					className={cn(
						"flex cursor-pointer gap-1 rounded-full p-2 pr-6",
						rating === 5 && "bg-gray-100 ",
					)}
					onClick={() => handleRatingChange("5")}
				>
					<FaStar className="text-yellow-400" size={15} />
					<FaStar className="text-yellow-400" size={15} />
					<FaStar className="text-yellow-400" size={15} />
					<FaStar className="text-yellow-400" size={15} />
					<FaStar className="text-yellow-400" size={15} />
				</div>
				<div
					className={cn(
						"flex cursor-pointer gap-1 rounded-full p-2 pr-6",
						rating === 4 && "bg-gray-100 ",
					)}
					onClick={() => handleRatingChange("4")}
				>
					<FaStar className="text-yellow-400" size={15} />
					<FaStar className="text-yellow-400" size={15} />
					<FaStar className="text-yellow-400" size={15} />
					<FaStar className="text-yellow-400" size={15} />
					<FaRegStar className="text-yellow-400" size={15} />
				</div>
				<div
					className={cn(
						"flex cursor-pointer gap-1 rounded-full p-2 pr-6",
						rating === 3 && "bg-gray-100 ",
					)}
					onClick={() => handleRatingChange("3")}
				>
					<FaStar className="text-yellow-400" size={15} />
					<FaStar className="text-yellow-400" size={15} />
					<FaStar className="text-yellow-400" size={15} />
					<FaRegStar className="text-yellow-400" size={15} />
					<FaRegStar className="text-yellow-400" size={15} />
				</div>
				<div
					className={cn(
						"flex cursor-pointer gap-1 rounded-full p-2 pr-6",
						rating === 2 && "bg-gray-100 ",
					)}
					onClick={() => handleRatingChange("2")}
				>
					<FaStar className="text-yellow-400" size={15} />
					<FaStar className="text-yellow-400" size={15} />
					<FaRegStar className="text-yellow-400" size={15} />
					<FaRegStar className="text-yellow-400" size={15} />
					<FaRegStar className="text-yellow-400" size={15} />
				</div>
				<div
					className={cn(
						"flex cursor-pointer gap-1 rounded-full p-2 pr-6",
						rating === 1 && "bg-gray-100",
					)}
					onClick={() => handleRatingChange("1")}
				>
					<FaStar className="text-yellow-400" size={15} />
					<FaRegStar className="text-yellow-400" size={15} />
					<FaRegStar className="text-yellow-400" size={15} />
					<FaRegStar className="text-yellow-400" size={15} />
					<FaRegStar className="text-yellow-400" size={15} />
				</div>
			</div>
		</div>
	);
};

export default SortFilterStar;
