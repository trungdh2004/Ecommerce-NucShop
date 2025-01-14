import ProductV2 from "@/components/common/ProductV2";
import { pagingProduct } from "@/service/product";
import { IProduct } from "@/types/typeProduct";
import { useQuery } from "@tanstack/react-query";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ProductsList = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["productHomeList"],
		queryFn: async () => {
			const { data } = await pagingProduct({
				pageIndex: 1,
				pageSize: 8,
				keyword: "",
			});

			return data?.content;
		},
	});

	return (
		<div className="padding">
			<div className="relative w-full pt-10 pb-6 group/parrent [&>.swiper-button-disabled]:opacity-50 [&>.swiper-button-disabled]:pointer-events-none">
				<div className="flex-1 pb-10 text-header">
					Tháng vàng nhận nhiều ưu đãi
				</div>
				<Swiper
					className="[&>.swiper-wrapper]:p-1.5"
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
					{!isLoading &&
						data?.map((product: IProduct) => (
							<SwiperSlide className="lg:w-[260px] w-[240px] group">
								<ProductV2 product={product} key={product?._id} />
							</SwiperSlide>
						))}
				</Swiper>

				<button
					className={`btn-next    absolute z-10 top-[39%] right-0 translate-x-1/2 group-hover/parrent:size-12 text-[#0000008a] bg-white shadow-[0_1px_12px_0_rgba(0,0,0,.12)] size-7 border flex justify-center items-center rounded-full   duration-300 cursor-pointer`}
				>
					<GrLinkNext className="text-sm group-hover/parrent:text-base" />
				</button>
				<button
					className={`btn-prev  absolute z-10 top-[39%] left-0 -translate-x-1/2 group-hover/parrent:size-12 text-[#0000008a] bg-white shadow-[0_1px_12px_0_rgba(0,0,0,.12)] size-7 border flex justify-center items-center rounded-full   duration-300 cursor-pointer`}
				>
					<GrLinkPrevious className="text-sm group-hover/parrent:text-base" />
				</button>
			</div>
		</div>
	);
};

export default ProductsList;
