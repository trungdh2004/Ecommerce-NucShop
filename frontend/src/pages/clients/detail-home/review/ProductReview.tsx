import { IProductDetail } from "@/types/product";
import React from "react";
import { FaStar } from "react-icons/fa";
interface Props {
	dataReview: SearchRatingState | null;
	setSearchRating: React.Dispatch<
		React.SetStateAction<{
			pageIndex: number;
			rating: number | null;
		}>
	>;
	product: IProductDetail | undefined;
}
import Paginations from "@/components/common/Pagination";
import ListReview from "./ListReview";
import { SearchRatingState } from "@/types/review";
const ProductReview = ({ dataReview, setSearchRating, product }: Props) => {
	return (
		<div className="bg-white box-shadow py-4 px-7 mb-5 box-shadow rounded-md">
			<h3 className="text-xl py-4">Đánh giá sản phẩm</h3>
			<div className="border border-orange-100 bg-orange-100 py-4 px-3 bg-opacity-20 flex gap-8">
				<div className="flex items-center gap-2">
					<p className="text-3xl text-orange-600">{product?.rating}</p>
					<span className="mt-[10px] text-lg text-orange-600">trên 5</span>
				</div>
				<div className="flex flex-wrap md:flex-nowrap gap-2 pt-1">
					<label
						onClick={() =>
							setSearchRating((prev) => {
								return { ...prev, rating: null, pageIndex: 1 };
							})
						}
						className="flex-1 md:flex-none"
					>
						<input
							type="radio"
							name="rating"
							defaultValue="null"
							className="hidden peer"
							defaultChecked
						/>
						<div className="border peer-checked:text-red-500 px-2 md:px-4 py-1 cursor-pointer peer-checked:border-orange-500 text-sm text-center">
							Tất Cả
						</div>
					</label>
					<label
						onClick={() =>
							setSearchRating((prev) => {
								return { ...prev, rating: 5, pageIndex: 1 };
							})
						}
						className="flex-1 md:flex-none"
					>
						<input
							type="radio"
							name="rating"
							defaultValue={5}
							className="hidden peer"
						/>
						<div className="flex items-center justify-center gap-1 border peer-checked:text-red-500 px-2 md:px-4 py-1 cursor-pointer peer-checked:border-orange-500 text-sm">
							<span>5</span> <FaStar size={12} className="text-orange-400" />
						</div>
					</label>
					<label
						onClick={() =>
							setSearchRating((prev) => {
								return { ...prev, rating: 4, pageIndex: 1 };
							})
						}
						className="flex-1 md:flex-none"
					>
						<input
							type="radio"
							name="rating"
							defaultValue={4}
							className="hidden peer"
						/>
						<div className="flex items-center justify-center gap-1 border peer-checked:text-red-500 px-2 md:px-4 py-1 cursor-pointer peer-checked:border-orange-500 text-sm">
							<span>4</span> <FaStar size={12} className="text-orange-400" />
						</div>
					</label>
					<label
						onClick={() =>
							setSearchRating((prev) => {
								return { ...prev, rating: 3, pageIndex: 1 };
							})
						}
						className="flex-1 md:flex-none"
					>
						<input
							type="radio"
							name="rating"
							defaultValue={3}
							className="hidden peer"
						/>
						<div className="flex items-center justify-center gap-1 border peer-checked:text-red-500 px-2 md:px-4 py-1 cursor-pointer peer-checked:border-orange-500 text-sm">
							<span>3</span> <FaStar size={12} className="text-orange-400" />
						</div>
					</label>
					<label
						onClick={() =>
							setSearchRating((prev) => {
								return { ...prev, rating: 2, pageIndex: 1 };
							})
						}
						className="flex-1 md:flex-none"
					>
						<input
							type="radio"
							name="rating"
							defaultValue={2}
							className="hidden peer"
						/>
						<div className="flex items-center justify-center gap-1 border peer-checked:text-red-500 px-2 md:px-4 py-1 cursor-pointer peer-checked:border-orange-500 text-sm">
							<span>2</span> <FaStar size={12} className="text-orange-400" />
						</div>
					</label>
					<label
						onClick={() =>
							setSearchRating((prev) => {
								return { ...prev, rating: 1, pageIndex: 1 };
							})
						}
						className="flex-1 md:flex-none"
					>
						<input
							type="radio"
							name="rating"
							defaultValue={1}
							className="hidden peer"
						/>
						<div className="flex items-center justify-center gap-1 border peer-checked:text-red-500 px-2 md:px-4 py-1 cursor-pointer peer-checked:border-orange-500 text-sm">
							<span>1</span> <FaStar size={12} className="text-orange-400" />
						</div>
					</label>
				</div>
			</div>

			<ListReview dataReview={dataReview} />
			<div className="flex justify-center py-4">
				{(dataReview?.content?.length as number) > 0 && (
					<Paginations
						pageCount={dataReview?.totalPage as number}
						handlePageClick={(event: any) => {
							setSearchRating((prev) => {
								return { ...prev, pageIndex: event.selected + 1 };
							});
						}}
						forcePage={0}
					/>
				)}
			</div>
		</div>
	);
};

export default ProductReview;
