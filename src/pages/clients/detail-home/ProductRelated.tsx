import React, { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { IoIosHeartEmpty } from "react-icons/io";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { FaStar } from "react-icons/fa";
import { formatCurrency } from "@/common/func";
import { IColor, IProduct } from "@/types/typeProduct";
import { optimizeCloudinaryUrl } from "@/common/localFunction";
import { IoEyeOutline } from "react-icons/io5";
import {
	ListColorComponent,
	ListSizeComponent,
} from "@/components/common/Product";
import OutOfStock from "@/assets/OutofStock.png";
import { ISize } from "@/types/variants";
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
				<div className="relative pb-6">
					<Swiper
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
							const listColor = product?.attributes?.reduce(
								(acc: IColor[], item: any) => {
									if (!item.color?._id) return acc;
									let group = acc.find(
										(g) => g._id === (item.color as IColor)?._id,
									);

									// Nếu nhóm không tồn tại, tạo nhóm mới
									if (!group) {
										group = {
											_id: (item.color as IColor)._id as string,
											name: (item.color as IColor).name as string,
											code: (item.color as IColor).code as string,
										};
										acc.push(group);
										return acc;
									}
									return acc;
								},
								[],
							);
							const listSize = product.attributes.reduce(
								(acc: ISize[], item: any) => {
									if (!item?.size?._id) return acc;
									let group = acc.find(
										(g) => g._id === (item.color as ISize)?._id,
									);

									// Nếu nhóm không tồn tại, tạo nhóm mới
									if (!group) {
										group = {
											_id: (item.size as ISize)._id as string,
											name: (item.size as ISize).name as string,
										};
										acc.push(group);
										return acc;
									}
									return acc;
								},
								[],
							);
							return (
								<SwiperSlide className="lg:w-[260px] w-[240px] group">
									<Link
										key={product?._id}
										to={`/shop/detail/${encodeURIComponent(product?.slug || "")}`}
										className="relative flex flex-col overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl group hover:shadow-lg"
									>
										<div className="relative overflow-hidden border bg-[#F4F4F4] flex justify-center items-center max-w-full min-w-full box-shadow">
											<div className="relative inline-block w-full group aspect-square">
												<div className="transition duration-500 transform bg-white group-hover:scale-50">
													<img
														className="object-cover w-full h-full aspect-square"
														src={optimizeCloudinaryUrl(
															product.thumbnail,
															350,
															370,
														)}
														alt="Image 1"
													/>
												</div>
												<div className="absolute top-0 left-0 transition duration-500 bg-white opacity-0 group-hover:opacity-100">
													<img
														className="object-cover w-full h-full aspect-square"
														src={optimizeCloudinaryUrl(
															product?.images[0]?.url || "",
															350,
															370,
														)}
														alt="Image 2"
													/>
												</div>

												{product?.quantity <= 0 && (
													<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center transition duration-500 bg-[#f0dddd] bg-opacity-0 opacity-0 group-hover:opacity-100 group-hover:bg-opacity-50">
														<img
															src={optimizeCloudinaryUrl(OutOfStock)}
															alt=""
															className="lg:w-[140px] lg:h-[140px] md:w-[110px] md:h-[110px] w-[80px] h-[80px] aspect-square"
														/>
													</div>
												)}
											</div>
											<div className="absolute flex items-center justify-center w-full transition-all duration-300 ease-in-out rounded -bottom-10 group-hover:bottom-8">
												<div className="flex justify-center gap-1 items-center lg:w-[200px] w-[150px] lg:text-base text-sm lg:py-2 py-1 bg-opacity-30 border text-white bg-[#232323] text-center leading-[40px] border-none transition-transform hover:scale-90 hover:bg-[#f5f5f5] hover:text-[#262626] duration-300">
													<IoEyeOutline />
													<p className="text-xs lg:text-sm">Xem chi tiết</p>
												</div>
											</div>
											{product?.is_hot && (
												<div className="absolute left-3 top-5 text-center rounded-full w-[35px] h-[35px]  p-1 bg-[#f54040]">
													<p className="lg:text-[12px] text-xs pt-1 text-white">
														HOT
													</p>
												</div>
											)}
										</div>
										<div className="flex flex-col gap-1 p-2 sm:gap-2">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-1 ">
													<FaStar className="text-yellow-400" size={10} />
													<FaStar className="text-yellow-400" size={10} />
													<FaStar className="text-yellow-400" size={10} />
													<FaStar className="text-yellow-400" size={10} />
													<FaStar className="text-yellow-400" size={10} />
												</div>
												<div>
													<p className="text-xs lg:text-sm">
														Đã bán {product.quantitySold}
													</p>
												</div>
											</div>
											<h3 className=" md:text-[18px] text-sm text-[#1A1E26] font-semibold min-w-0 truncate">
												{product.name}
											</h3>

											<div className="flex items-center gap-2">
												<span className="md:text-base text-xs justify-start font-[500] text-red-500">
													{formatCurrency(product?.discount || 0)}
												</span>
												<span className="lg:text-[13px] md:text-[13px] text-[10px] font-normal hidden sm:block">
													<del>{formatCurrency(product?.price || 0)}</del>
												</span>
											</div>
											<div
												className={cn(
													"flex items-center justify-between",
													!product?.attributes && "hidden",
												)}
											>
												<ListColorComponent listColor={listColor} />
												<ListSizeComponent listSize={listSize} />
											</div>
											{product?.is_simple && <div className="h-[11px]"></div>}
										</div>
									</Link>
								</SwiperSlide>
							);
						})}
					</Swiper>

					<button
						className={`btn-next ${!isBlock && "hidden"} absolute z-20 top-[39%] right-4 text-black w-[50px] h-[50px] border flex justify-center items-center rounded-full p-3 hover:text-white hover:bg-[#585858] duration-300 cursor-pointer`}
					>
						<GrLinkNext />
					</button>
					<button
						className={`btn-prev ${!isBlock && "hidden"} absolute z-20 top-[39%] left-4 text-black w-[50px] h-[50px] border flex justify-center items-center rounded-full p-3 hover:text-white hover:bg-[#585858] duration-300 cursor-pointer`}
					>
						<GrLinkPrevious />
					</button>
				</div>
			)}
		</div>
	);
};

export default ProductRelated;
