import { formatCurrency } from "@/common/func";
import { optimizeCloudinaryUrl } from "@/common/localFunction";
import { IProductSearch } from "@/types/product";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
type Props = {
	product: IProductSearch;
};
const SearchProductPage = ({ product }: Props) => {
	return (
		<Link to={`/shop/detail/${encodeURIComponent(product?.slug || "")}`}>
			<div className="overflow-hidden rounded-sm ">
				<div>
					<div className="relative overflow-hidden border bg-[#F4F4F4] flex justify-center items-center max-w-full min-w-full box-shadow rounded-xl ">
						<div className="relative inline-block w-full aspect-square">
							<div className="transition duration-500 transform bg-white ">
								<img
									className="object-cover w-full h-full aspect-square"
									src={
										product?.thumbnail &&
										optimizeCloudinaryUrl(product?.thumbnail, 350, 370)
									}
									alt="Image 1"
								/>
							</div>
						</div>
						<div className="absolute left-3 top-5 text-center rounded-full w-[35px] h-[35px]  p-1 bg-[#f54040]">
							<p className="lg:text-[12px] text-xs pt-1 text-white">
								{Math.floor((product.discount * 100) / product.price)}%
							</p>
						</div>
					</div>
					<div className="flex flex-col gap-1 py-2 sm:gap-2">
						<h3 className=" md:text-base text-sm text-[#1A1E26] font-semibold truncate">
							{product.name}
						</h3>
						<div className="flex justify-between lg:h-[20px] h-[15px] gap-4">
							<div className="flex items-center gap-1 ">
								<span className="text-sm font-semibold">{product.rating}</span>
								<FaStar className="text-yellow-400" size={10} />
							</div>
						</div>
						<div className="flex items-end justify-between gap-2 ">
							<div className="flex flex-col items-center">
								<span className="lg:text-[13px] md:text-[13px] text-[10px] font-normal hidden sm:block">
									<del>{formatCurrency(product?.price || 0)}</del>
								</span>
								<span className="md:text-base text-xs justify-start font-[500] text-red-500">
									{formatCurrency(product?.discount || 0)}
								</span>
							</div>
							<div>
								<p className="text-xs lg:text-sm">
									Đã bán {product.quantitySold}
								</p>
							</div>
						</div>
						<div></div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default SearchProductPage;
