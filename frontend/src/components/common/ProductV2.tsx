import OutOfStock from "@/assets/OutofStock.png";
import { formatCurrency } from "@/common/func";
import { optimizeCloudinaryUrl } from "@/common/localFunction";
import { cn } from "@/lib/utils";
import { IColor, IProduct } from "@/types/typeProduct";
import { ISize } from "@/types/variants";
import { IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { ListColorComponent, ListSizeComponent } from "./Product";

interface Props {
	product: IProduct;
}

const ProductV2 = ({ product }: Props) => {
	const listColor = !product?.is_simple
		? product?.attributes?.reduce((acc: IColor[], item: any) => {
				if (!item?.color?._id) return acc;
				let group = acc.find((g) => g._id === (item.color as IColor)?._id);

				if (!group) {
					group = {
						_id: (item.color as IColor)._id as string,
						name: (item.color as IColor).name as string,
						code: (item.color as IColor).code as string,
					};
					acc.push(group);
				}
				return acc;
			}, [])
		: [];

	const listSize = !product?.is_simple
		? product?.attributes?.reduce((acc: ISize[], item: any) => {
				if (!item?.size?._id) return acc;
				let group = acc.find((g) => g._id === (item.size as ISize)?._id);

				if (!group) {
					group = {
						_id: (item.size as ISize)._id as string,
						name: (item.size as ISize).name as string,
					};
					acc.push(group);
				}
				return acc;
			}, [])
		: [];

	return (
		<Link
			to={`/shop/detail/${encodeURIComponent(product?.slug || "")}`}
			className="relative flex flex-col overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-md group/product rounded-xl hover:shadow-lg"
		>
			<div className="relative overflow-hidden">
				<div className="relative inline-block w-full group aspect-square">
					<div className="transition duration-500 transform bg-white group-hover:scale-90">
						<img
							className="object-cover w-full h-full"
							src={optimizeCloudinaryUrl(product.thumbnail, 350, 370)}
							alt="Product Image"
						/>
					</div>

					<div className="absolute top-0 left-0 w-full h-full transition duration-500 opacity-0 group-hover:opacity-100">
						<img
							className="object-cover w-full h-full"
							src={optimizeCloudinaryUrl(
								product?.images?.[0]?.url || "",
								350,
								370,
							)}
							alt="Product Image Hover"
						/>
					</div>

					{/* Out of Stock */}
					{product?.quantity <= 0 && (
						<div className="absolute top-0 left-0 flex items-center justify-center w-full h-full transition-opacity duration-500 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">
							<img
								src={optimizeCloudinaryUrl(OutOfStock)}
								alt="Out of Stock"
								className="lg:w-[140px] md:w-[110px] w-[80px] aspect-square"
							/>
						</div>
					)}

					{/* Hot Badge */}
					{product?.is_hot && (
						<div className="absolute flex items-center justify-center text-xs text-white bg-red-500 rounded-full left-3 top-5 w-7 h-7">
							HOT
						</div>
					)}
				</div>
				<div className="absolute justify-center hidden w-full group/product-hover:flex bottom-5">
					<div className="flex items-center justify-center gap-2 px-4 py-2 bg-[#232323] text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-[#f5f5f5] hover:text-[#262626] transition-all">
						<IoEyeOutline className="text-lg" />
						<p>Xem chi tiết</p>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2 p-3">
				<div className="flex items-center justify-between">
					<StarRatings
						rating={product?.rating}
						numberOfStars={5}
						starDimension="14px"
						starSpacing="0.5px"
						starRatedColor="#facc15"
					/>
					<div>
						<p className="text-xs">Đã bán {product.quantitySold}</p>
					</div>
				</div>

				<h3 className="text-lg font-semibold text-[#1A1E26] truncate">
					{product.name}
				</h3>

				<div className="flex items-center gap-2">
					<span className="text-base font-bold text-red-500">
						{formatCurrency(product?.discount || 0)}
					</span>
					<span className="text-sm text-gray-500 line-through">
						{formatCurrency(product?.price || 0)}
					</span>
				</div>

				<div
					className={cn(
						"flex items-center justify-between gap-2",
						product?.is_simple && "hidden",
					)}
				>
					<ListColorComponent listColor={listColor} />
					<div className="hidden md:block">
						<ListSizeComponent listSize={listSize} />
					</div>
				</div>
				{product?.is_simple && (
					<div className="flex items-center justify-center h-5 gap-1 p-1 text-xs text-gray-500 border border-gray-500 rounded max-w-max">
						Đơn giản
					</div>
				)}
			</div>
		</Link>
	);
};

export default ProductV2;
