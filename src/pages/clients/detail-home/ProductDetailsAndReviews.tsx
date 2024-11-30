import { cn } from "@/lib/utils";
import { IProductDetail } from "@/types/product";
import { useEffect, useState } from "react";
import Comments from "./Comments/page";
import DescProduct from "./DescProduct";
import ProductReview from "./review/ProductReview";
import { getReviewProduct } from "@/service/review";
import { SearchRatingState } from "@/types/review";
import ProductRelated from "./ProductRelated";
type Props = {
	product?: IProductDetail;
	isLoading?: boolean;
};
const ProductDetailsAndReviews = ({ product, isLoading }: Props) => {
	const [step, setStep] = useState(1);
	const steps = ["Mô tả", "Bình luận", "Đánh giá"];
	const [searchRating, setSearchRating] = useState<{
		pageIndex: number;
		rating: number | null;
	}>(() => ({
		pageIndex: 1,
		rating: null,
	}));

	const [dataReview, setDataReview] = useState<SearchRatingState | null>(null);
	const handleRating = async () => {
		if (!product?._id) return;

		try {
			const { data } = await getReviewProduct(
				product._id as string,
				searchRating,
			);
			setDataReview(data);
			return data;
		} catch (error) {
			console.error("Error fetching review product", error);
		}
	};

	useEffect(() => {
		handleRating();
	}, [product?._id, searchRating?.pageIndex, searchRating?.rating]);
	return (
		<div>
			<ul className="flex items-center justify-center text-xl font-medium py-3 *:cursor-pointer *:px-5 [&>li+li]:border-l [&>li]:border-gray-200 last:border-none">
				{steps?.map((item, index) => (
					<li
						key={index + new Date().toISOString()}
						onClick={() => setStep(index + 1)}
						className={cn(step == index + 1 && "text-blue-500")}
					>
						{item}
					</li>
				))}
			</ul>
			{step == 1 && (
				<DescProduct
					description={product?.description as string}
					isLoading={isLoading}
				/>
			)}
			{step == 2 && <Comments product={product} />}
			{step === 3 && (
				<ProductReview
					dataReview={dataReview}
					setSearchRating={setSearchRating}
					product={product}
				/>
			)}
		</div>
	);
};

export default ProductDetailsAndReviews;
