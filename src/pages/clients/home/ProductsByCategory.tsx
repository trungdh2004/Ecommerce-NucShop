import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import { getCateById } from "@/service/category-admin";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { formatCurrency, formatQuantitySort } from "@/common/func";
import { IProduct } from "@/types/typeProduct";
const ProductsByCategory = ({ id }: { id: string }) => {
	const [products, setProducts] = useState<IProduct[]>();
	useEffect(() => {
		(async () => {
			if (id) {
				const { data } = await getCateById(id);
				console.log(data);
				setProducts(data?.data);
			}
		})();
	}, [id]);

	return (
		<Swiper
			slidesPerView={2}
			spaceBetween={20}
			freeMode={true}
			// loop={true}
			slidesOffsetAfter={40}
			slidesOffsetBefore={40}
			className="swiper-wrapper  cursor-pointer"
			modules={[FreeMode]}
			breakpoints={{
				320: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				480: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
				640: {
					slidesPerView: 4,
					spaceBetween: 40,
				},
			}}
		>
			{products?.map((product) => (
				<SwiperSlide
					key={product?._id}
					className="max-w-[230px] min-w-[230px] box-shadow rounded-lg overflow-hidden  bg-white"
				>
					<div className="">
						<div className="w-full">
							<img
								src={product?.thumbnail}
								alt=""
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="p-3">
							<p>{product?.name}</p>
							<div className="flex items-center justify-start -space-x-1 *:size-3 *:inline-block  *:rounded-full my-1.5">
								{(product as any)?.listColor?.map((color:any) => (
									<span
										style={{ background: `${color?.colorCode}` }}
										className="box-shadow border border-black/40"
									/>
								))}
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-red-500">
									{formatCurrency(product?.price || 0)}
								</span>
								<span className="text-xs">
									Đã bán {formatQuantitySort(product?.quantitySold || 0)}
								</span>
							</div>
						</div>
					</div>
				</SwiperSlide>
			))}
		</Swiper>
	);
};

export default ProductsByCategory;
