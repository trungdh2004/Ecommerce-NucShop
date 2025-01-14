import Coupon from "@/components/common/Coupon/Coupon";
import { getVoucherViewHome } from "@/service/voucher";
import { IVoucher } from "@/types/voucher";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FaAnglesRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ListCoupon = () => {
	const [vouchers, setVouchers] = useState<IVoucher[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await getVoucherViewHome(9999999999);
				setVouchers(data?.data);
			} catch (error) {
				if (error instanceof AxiosError) {
					toast?.error(error?.response?.data?.message);
				}
			}
		})();
	}, []);

	return (
		<div className="w-full pt-10 padding">
			<div className="flex items-center justify-between w-full mb-6">
				<div className="flex-1 text-header">Ưu đãi lớn</div>
				<Link
					to={"/vouchers"}
					className="flex items-center gap-1 text-gray-400 cursor-pointer hover:text-custom"
				>
					<span className="text-sm">Xem thêm </span>
					<FaAnglesRight size={14} />
				</Link>
			</div>
			<Swiper
				className="h-full [&>.swiper-wrapper]:p-1"
				modules={[Pagination]}
				spaceBetween={15}
				breakpoints={{
					320: {
						slidesPerView: 1,
					},
					768: { slidesPerView: 2 },
					1024: { slidesPerView: 3.5 },
				}}
				grabCursor={true}
				pagination={{
					el: ".custom-pagination",
					clickable: true,
				}}
			>
				{vouchers?.map((voucher) => (
					<SwiperSlide key={voucher?._id}>
						<Coupon
							voucher={voucher}
							className="w-full h-32 shadow-[rgba(0,0,0,0.05)_0px_3px_10px]"
						/>
					</SwiperSlide>
				))}
			</Swiper>

			{/* Custom Pagination */}
			<div className="flex items-center justify-center gap-1 custom-pagination [&>.swiper-pagination-bullet-active]:bg-custom mt-1"></div>
		</div>
	);
};

export default ListCoupon;
