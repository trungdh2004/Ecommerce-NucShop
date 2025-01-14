import { formatCurrency } from "@/common/func";
import { findProductActive } from "@/service/product";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import React from "react";
import { toast } from "sonner";
import Countdown from "./CoutDown";
import { Link } from "react-router-dom";
const DealProductSection: React.FC = () => {
	const { data: dealProduct } = useQuery({
		queryKey: ["activeProductHome"],
		queryFn: async () => {
			try {
				const { data } = await findProductActive();
				// setDealProduct(data);
				return data;
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(error?.response?.data?.message);
				}
			}
		},
	});

	console.log({ dealProduct });

	return (
		<section className="relative py-6 md:py-12 mt-14">
			{/* <div className="bg-magic"></div> */}
			<div className="absolute inset-0 z-[0] ">
				<div className="absolute inset-0 bg-white z-[-2]"></div>
				<div className="absolute inset-0 opacity-[0.08] bg-magic-img z-[-1]"></div>
			</div>
			<div className="padding z-[1]">
				<div className="flex flex-col items-center gap-5 md:gap-10 lg:flex-row">
					{/* Nội dung sản phẩm */}
					<div className="relative flex flex-col gap-6 lg:w-1/2">
						<span className="text-xs font-medium tracking-wide text-gray-500 uppercase md:text-sm">
							Sản phẩm nổi bật
						</span>

						<h2 className="text-custom text-[18px] sm:text-xl md:text-2xl lg:text-4xl font-medium leading-tight">
							{dealProduct?.product?.name}
						</h2>

						<div className="flex flex-wrap items-center gap-4 mt-2 max-sm:flex-col max-sm:items-start md:gap-8">
							<div className="flex items-center">
								<span className="text-xl font-medium text-custom sm:text-2xl md:text-3xl lg:text-4xl">
									{formatCurrency(dealProduct?.product?.discount || 0)}
								</span>
								<span className="ml-4 text-base text-gray-400 line-through sm:text-xl">
									{formatCurrency(dealProduct?.product?.price || 0)}
								</span>
							</div>

							<Link to={`/shop/detail/${dealProduct?.product?.slug}`} className="px-2 py-1 text-white transition-colors rounded md:px-8 md:py-3 bg-custom hover:bg-custom-600">
								Mua ngay
							</Link>
						</div>
						<div className="flex flex-col items-start gap-2 countDownWrap">
							<h6 className="text-lg font-medium text-gray-500">
								Kết thúc vào
							</h6>
							<Countdown date={new Date(dealProduct?.date)} />
						</div>
					</div>
					<div className="relative flex justify-center w-full lg:w-1/2 ">
						<motion.div
							className="absolute bg-gradient-to-br from-[#9cffe97d] to-[#6b6bd56b] inset-x-6 inset-y-14 md:inset-y-5  md:inset-x-12 "
							initial={{ scale: 1 }}
							animate={{ scale: 1.05 }}
							transition={{
								duration: 2.5,
								repeat: Infinity,
								repeatType: "reverse",
							}}
							style={{
								borderRadius: "34% 66% 67% 33% / 45% 41% 59% 55%",
							}}
						></motion.div>

						<div className="relative z-10 h-auto max-md:w-1/2 max-w-96">
							<img
								src={dealProduct?.product?.thumbnail}
								alt={dealProduct?.product?.name}
								className="w-full h-full mix-blend-multiply"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default DealProductSection;
