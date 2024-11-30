import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/common/func";
import Countdown from "./CoutDown";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { pagingProductComing } from "@/service/product";
import { IProduct } from "@/types/typeProduct";
type DealProductType = {
	active: boolean;
	createdAt: string;
	date: string;
	product: IProduct;
	updatedAt: string;
	__v: number;
	_id: string;
};
const DealProductSection: React.FC = () => {
	const [dealProduct, setDealProduct] = useState<DealProductType>();
	useEffect(() => {
		(async () => {
			try {
				const { data } = await pagingProductComing({
					pageIndex: 1,
					pageSize: 1,
				});
				setDealProduct(data?.content?.[0]);
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(error?.response?.data?.message);
				}
			}
		})();
	}, []);
	console.log(dealProduct);

	return (
		<section className="py-12 ">
			<div className="padding">
				<div className="flex flex-col items-center gap-10 lg:flex-row">
					{/* Nội dung sản phẩm */}
					<div className="flex flex-col gap-6 lg:w-1/2">
						<span className="text-sm font-medium tracking-wide text-gray-500 uppercase">
							Sản phẩm nổi bật
						</span>

						<h2 className="text-[#2c3f58] text-4xl font-medium leading-tight">
							{dealProduct?.product?.name}
						</h2>

						{/* <p className="pr-0 text-gray-600 lg:pr-20">
            {dealProduct?.}
            </p> */}

						<div className="flex flex-wrap items-center gap-8 mt-2">
							<div className="flex items-center">
								<span className="text-[#2c3f58] text-4xl font-medium">
									{formatCurrency(dealProduct?.product?.discount || 0)}
								</span>
								<span className="ml-4 text-xl text-gray-400 line-through">
									{formatCurrency(dealProduct?.product?.price || 0)}
								</span>
							</div>

							<button className="bg-[#2c3f58] text-white px-8 py-3 rounded hover:bg-[#1f2937] transition-colors">
								Mua ngay
							</button>
						</div>
						<div className="flex flex-col items-start gap-2 countDownWrap">
							<h6 className="text-lg font-medium text-gray-500">
								Kết thúc vào
							</h6>
							<Countdown date={new Date(dealProduct?.date as string).toLocaleDateString() }/>
						</div>
					</div>
					<div className="relative flex justify-center lg:w-1/2 ">
						<motion.div
							className="absolute bg-gradient-to-br from-[#9cffe97d] to-[#6b6bd56b] rounded-full inset-x-6 inset-y-14 md:inset-y-5  md:inset-x-12"
							initial={{ scale: 1 }}
							animate={{ scale: 1.05 }}
							transition={{
								duration: 2.5,
								repeat: Infinity,
								repeatType: "reverse",
							}}
						></motion.div>

						<div className="relative z-10 h-auto max-w-96">
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
