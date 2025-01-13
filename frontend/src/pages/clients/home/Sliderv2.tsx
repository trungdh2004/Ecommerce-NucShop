import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Sliderv2 = () => {
	return (
		<div className=" bg-[#fefff9] md:h-screen sm:h-[500px] h-[350px] max-[420px]:h-[320px] w-full">
			<div className="w-full h-full">
				<div className="relative h-full">
					<Swiper
						className="h-full"
						modules={[Pagination, Autoplay]}
						pagination={{ clickable: true }}
						autoplay={{
							delay: 4000,
							disableOnInteraction: false,
						}}
					>
						<SwiperSlide>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5 }}
								className="relative w-full h-full"
							>
								<div className=" relative flex items-center  w-full h-full padding">
									<motion.div
										initial={{ x: -160, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ duration: 0.8 }}
										className="w-1/2"
									>
										<motion.div
											className="mt-2 text-2xl font-bold capitalize md:mt-5 md:text-3xl lg:text-4xl xl:text-6xl"
											initial={{ x: -160, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ duration: 1, delay: 0.2 }}
										>
											<motion.div
												className="mt-2 text-sm font-medium capitalize md:mt-5 md:text-3xl lg:text-4xl xl:text-5xl"
												initial={{ x: -160, opacity: 0 }}
												animate={{ x: 0, opacity: 1 }}
												transition={{ duration: 1, delay: 0.2 }}
											>
												<div className="flex flex-col gap-2">
													<img
														src="/NUC.svg"
														alt=""
														className="lg:w-32 lg:h-32 md:w-28 md:h-28 w-12 h-12"
													/>
													<div className="bg-[#000] p-3 text-white">
														<i>
															<h3 className="font-style">THỜI TRANG DẪN ĐẦU</h3>
														</i>
													</div>
													<div className="bg-[#000] p-3 text-white">
														<i>
															<h3 className="font-style">
																PHONG CÁCH TỎA SÁNG
															</h3>
														</i>
													</div>
												</div>
											</motion.div>
										</motion.div>

										{/* <motion.div
											className="text-xs font-semibold tracking-wider uppercase md:text-sm lg:text-lg"
											initial={{ x: -160, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ duration: 0.8, delay: 0.1 }}
										>
											NUC Shop!
										</motion.div> */}
										<motion.div
											initial={{ x: -160, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ duration: 1.2, delay: 0.3 }}
										>
											<Link
												to="/shop"
												className="relative text-xs lg:text-base font-semibold md:text-sm bg-transparent px-4 py-2 top-3 md:top-8 md:px-10 md:py-4 uppercase transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-y-0 before:bg-custom-600 before:transition-transform before:duration-300 before:content-[''] before:hover:scale-y-100 before:text-black  hover:text-white border-2 border-red-600"
											>
												Mua Ngay
											</Link>
										</motion.div>
									</motion.div>
									<motion.div
										className="absolute bottom-0 right-0 max-h-[90%] w-2/5 sm:w-2/5 md:-right-4 xl:-right-16"
										initial={{ scale: 1.2 }}
										animate={{ scale: 1 }}
										transition={{ duration: 0.8 }}
									>
										<img
											src="https://toinh-ecommerce.vercel.app/images/sliders/slide-1.png"
											alt="bg1-1"
											className="object-cover w-full h-full"
										/>
									</motion.div>
								</div>
							</motion.div>
						</SwiperSlide>

						<SwiperSlide>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5 }}
								className="relative w-full h-full"
							>
								<div className=" relative flex items-center w-full h-full padding mx-auto">
									<motion.div
										initial={{ x: -160, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ duration: 0.8 }}
										className="w-1/2"
									>
										<motion.div
											className="mt-2 text-sm font-medium capitalize md:mt-5 md:text-3xl lg:text-4xl xl:text-5xl"
											initial={{ x: -160, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ duration: 1, delay: 0.2 }}
										>
											<div className="bg-[#ffeffe] gap-6 flex flex-col justify-center items-center lg:py-20 md:py-14 py-9 w-4/5 rounded-full">
												<div className="flex flex-col gap-2">
													<i>
														<h3 className="font-style">ĐÓN GIÓ ĐÔNG VỀ</h3>
													</i>
													<i>
														<h3 className="font-style">NGẬP TRÀN ƯU ĐÃI</h3>
													</i>
												</div>

												<div className="flex gap-3">
													<div className="flex flex-col">
														<i className="lg:text-6xl md:text-3xl text-xl font-bold text-gray-800 w-40 lg:text-left md:text-center text-center">
															GIẢM
														</i>
														<i className="lg:text-6xl md:text-3xl text-xl font-bold text-gray-800 w-40 lg:text-left md:text-center text-center">
															GIÁ
														</i>
													</div>
													<div className="flex flex-col">
														<div className="bg-white rounded-full p-6 gap-2 justify-center items-center">
															<span className="lg:text-5xl md:text-3xl text-xl font-bold text-red-500">
																35%
															</span>
														</div>
														<i className="lg:text-xl md:text-base sm:text-xs font-semibold text-gray-700">
															tại NUCSHOP
														</i>
													</div>
												</div>

												{/* Container để giữ phần tử "WINTER" và "SALE" */}
												<div className="relative w-full flex justify-center items-center mt-4">
													<div className="relative inline-block px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-3 font-bold text-white uppercase cursor-pointer">
														<div className="absolute inset-0 bg-custom-500 transform skew-x-12"></div>
														<span className="relative z-10 text-xl md:text-2xl lg:text-3xl px-2 md:px-4">
															WINTER
														</span>
													</div>
													<div className="absolute lg:top-12 md:top-9 top-8 left-11 md:left-[51px] lg:left-16">
														<div className="relative inline-block px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-3 font-bold text-white uppercase cursor-pointer">
															<div className="absolute inset-0 bg-black transform skew-x-12"></div>
															<span className="relative z-10 text-xl md:text-2xl lg:text-3xl px-2 md:px-4">
																SALE
															</span>
														</div>
													</div>
												</div>
											</div>
										</motion.div>
										{/* <motion.div
											className=""
											initial={{ x: -160, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ duration: 1.2, delay: 0.3 }}
										>
											<Link
												to="/shop"
												className="relative z-10 text-sm font-semibold md:text-sm bg-transparent px-4 py-2 top-3 md:top-8 md:px-10 md:py-4 uppercase transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-y-0 before:bg-custom-600 before:transition-transform before:duration-300 before:content-[''] before:hover:scale-y-100 before:text-black  hover:text-white border-2 border-red-600"
											>
												Mua Ngay
											</Link>
										</motion.div> */}
										<motion.div
											className=""
											initial={{ x: -160, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ duration: 1, delay: 0.2 }}
										></motion.div>
									</motion.div>

									<motion.div
										className="absolute bottom-0 right-0 max-h-[90%] w-2/5 lg:w-2/5 sm:w-1/2 md:-right-4 xl:-right-16"
										initial={{ scale: 1.2 }}
										animate={{ scale: 1 }}
										transition={{ duration: 0.8 }}
									>
										<img
											src="https://toinh-ecommerce.vercel.app/images/sliders/slide-2.png"
											alt="bg1-1"
											className="object-cover w-full h-full"
										/>
									</motion.div>
								</div>
							</motion.div>
						</SwiperSlide>
					</Swiper>
				</div>
			</div>
		</div>
	);
};

export default Sliderv2;

// inline-block px-4 py-2 mt-3 text-xs font-semibold text-white uppercase transition duration-300 bg-custom-500 rounded-lg md:mt-8 md:px-10 md:py-4 hover:bg-custom-600 md:text-sm md:rounded-xl
{
	/* <motion.div
	className="mt-2 text-2xl font-medium capitalize md:mt-5 md:text-4xl lg:text-6xl xl:text-7xl"
	initial={{ x: -160, opacity: 0 }}
	animate={{ x: 0, opacity: 1 }}
	transition={{ duration: 1, delay: 0.2 }}
>
	Nâng tầm phong cách của bạn
</motion.div>; */
}

// bg-gradient-to-br from-[#9cffe97d] to-[#6b6bd56b]
