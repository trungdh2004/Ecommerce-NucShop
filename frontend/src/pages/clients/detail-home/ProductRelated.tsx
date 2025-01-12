import { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import ProductV2 from "@/components/common/ProductV2";
import { IProduct } from "@/types/typeProduct";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import "swiper/css";
import "swiper/css/navigation";
import { cn } from "@/lib/utils";
interface Props {
	product: IProduct[];
}
const ProductRelated = ({ product }: Props) => {
	const [isBlock, setIsBlock] = useState(false);
	useEffect(() => {
		if (product.length > 4) {
			setIsBlock(true);
		} else {
			setIsBlock(false);
		}
	}, [product]);
	return (
		<div>
			<div className="py-[40px] flex justify-center items-center gap-2 ">
				<div className="border-b-2 w-[100px] border-black"></div>
				<h3 className="lg:text-[30px] text-[16px] text-center">
					Sản phẩm liên quan
				</h3>
				<div className="border-b-2 w-[100px] border-black"></div>
			</div>
			{product?.length === 0 ? (
				<div>
					<p className="text-[14px] text-center py-6">
						Không tìm thấy sản phẩm nào
					</p>
				</div>
			) : (
				<div className="relative pb-6 group/parrent">
					<Swiper
						className="[&>.swiper-wrapper]:py-1.5"
						modules={[Navigation]}
						loop={false}
						spaceBetween={20}
						slidesPerView={4}
						pagination={{ clickable: true }}
						navigation={{
							nextEl: ".btn-next",
							prevEl: ".btn-prev",
						}}
						breakpoints={{
							0: {
								slidesPerView: 2,
								spaceBetween: 20,
							},
							480: {
								slidesPerView: 3,
								spaceBetween: 25,
							},
							768: {
								slidesPerView: 4,
								spaceBetween: 30,
							},
							1024: {
								slidesPerView: 5,
								spaceBetween: 40,
							},
						}}
					>
						{product?.map((product: IProduct) => {
							return (
								<SwiperSlide className="lg:w-[260px] w-[240px] group">
									<ProductV2 product={product} />
								</SwiperSlide>
							);
						})}
					</Swiper>
					<button
						className={cn(
							`btn-next    absolute z-10 top-[39%] right-0 translate-x-1/2 group-hover/parrent:size-12 text-[#0000008a] bg-white shadow-[0_1px_12px_0_rgba(0,0,0,.12)] size-7 border flex justify-center items-center rounded-full   duration-300 cursor-pointer`,
							!isBlock && "hidden",
						)}
					>
						<GrLinkNext className="text-sm group-hover/parrent:text-base" />
					</button>
					<button
						className={cn(
							`btn-prev  absolute z-10 top-[39%] left-0 -translate-x-1/2 group-hover/parrent:size-12 text-[#0000008a] bg-white shadow-[0_1px_12px_0_rgba(0,0,0,.12)] size-7 border flex justify-center items-center rounded-full   duration-300 cursor-pointer`,
							!isBlock && "hidden",
						)}
					>
						<GrLinkPrevious className="text-sm group-hover/parrent:text-base" />
					</button>
				</div>
			)}
		</div>
	);
};

export default ProductRelated;
