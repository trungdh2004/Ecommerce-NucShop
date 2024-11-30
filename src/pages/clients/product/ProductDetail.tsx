import React from "react";
import { FaStar } from "react-icons/fa6";
import { MdOutlineAdd } from "react-icons/md";
import { FaMinus } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa";

type Props = {};

const ProductDetail = (props: Props) => {
	return (
		<div className="w-full lg:px-[150px] px-5 py-8">
			<div className="grid lg:grid-cols-12 grid-rows-15 lg:gap-[60px] gap-5">
				<div className="flex flex-col gap-3 lg:col-span-6 row-span-6 px-2">
					<div className="lg:col-span-3 bg-gray-100 rounded-[20px] w-full top-0 text-center">
						<img
							src="https://readymadeui.com/images/coffee1.webp"
							alt="Product"
							className="lg:w-[450px] lg:h-[450px] w-[200px] h-[200px] rounded object-cover mx-auto"
						/>
					</div>
					<div className="grid grid-cols-4 gap-x-12 gap-y-6 justify-center">
						<div className="bg-gray-100 rounded-[20px] top-0 text-center p-8">
							<img
								src="https://readymadeui.com/images/coffee6.webp"
								alt="Product1"
								className="w-20 cursor-pointer"
							/>
						</div>
						<div className="bg-gray-100 rounded-[20px] top-0 text-center p-8">
							<img
								src="https://readymadeui.com/images/coffee3.webp"
								alt="Product2"
								className="w-20 cursor-pointer"
							/>
						</div>
						<div className="bg-gray-100 rounded-[20px] top-0 text-center p-8">
							<img
								src="https://readymadeui.com/images/coffee4.webp"
								alt="Product3"
								className="w-20 cursor-pointer"
							/>
						</div>
						<div className="bg-gray-100 rounded-[20px] top-0 text-center p-8">
							<img
								src="https://readymadeui.com/images/coffee5.webp"
								alt="Product4"
								className="w-20 cursor-pointer"
							/>
						</div>
					</div>
				</div>
				<div className="lg:col-span-1 row-span-1"></div>
				<div className="flex flex-col gap-[38px] lg:col-span-5 row-span-7">
					<h2 className="font-bold text-[24px] lg:text-[32px]">
						Heavy Weight Shoes
					</h2>
					<div className="flex justify-between gap-8 flex-col">
						<div className="flex items-center lg:gap-8 justify-between">
							<div className="flex items-center gap-3">
								<span className="font-thin text-[16px] text-[#A29A9A]">
									<del>600.000đ</del>
								</span>
								<h4 className="font-semibold lg:text-[24px] text-black">
									600.000đ
								</h4>
							</div>
							<div className="lg:w-[90px] lg:h-[30px] w-[70px] bg-[#EA5E5E] text-center rounded-2xl p-1 flex justify-center">
								<span className="lg:text-base text-[12px]">50% giảm</span>
							</div>
						</div>
						<div className="flex items-center lg:gap-2 lg:justify-between">
							<div className="flex items-center gap-2">
								<FaStar className="text-yellow-500 pt-[2px]" />
								<h3 className="font-medium text-[18px]">4.9 / 5</h3>
							</div>
							<p className="font-medium text-[18px] flex items-center gap-3">
								<span className="text-[14px] text-[#A29A9A]">|</span> 135
								<span className="text-[14px] text-[#A29A9A]">Review</span>
								<span className="text-[14px] text-[#A29A9A]">|</span> 255{" "}
								<span className="text-[14px] text-[#A29A9A]">Đã bán</span>
							</p>
						</div>
					</div>
					<div className="flex lg:gap-[55px] gap-[70px]">
						<h3 className="lg:text-[15px] text-[13px] font-bold ">Color</h3>
						<div className="flex gap-3 items-center">
							<button className="lg:w-[65px] lg:h-[25px] w-[40px] h-[15px] bg-red-500 rounded-full align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"></button>
							<button className="lg:w-[65px] lg:h-[25px] w-[40px] h-[15px] bg-blue-500 rounded-full align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"></button>
							<button className="lg:w-[65px] lg:h-[25px] w-[40px] h-[15px] bg-yellow-500 rounded-full align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"></button>
							<button className="lg:w-[65px] lg:h-[25px] w-[40px] h-[15px] bg-green-500 rounded-full align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"></button>
						</div>
					</div>

					<div className="flex flex-col gap-7">
						<div className="flex gap-[80px] lg:gap-[65px]">
							<h3 className="lg:text-[15px] text-[13px] font-bold ">Size</h3>
							<div className="grid lg:grid-cols-4 grid-cols-3 gap-4 w-full">
								<button className="lg:w-full rounded-[7px] border-2 border-gray-300 inline-block bg-primary-100 text-xs font-medium uppercase leading-normal text-primary-700 transition ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 motion-reduce:transition-none dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400 py-1 duration-200 lg:text-[14px] text-[10px]">
									S
								</button>
								<button className="lg:w-full rounded-[7px] border-2 border-gray-300 hover:border-gray-300 hover:bg-slate-100/70 py-1 duration-200 lg:text-[14px] text-[10px]">
									M
								</button>
								<button className="lg:w-full rounded-[7px] border-2 border-gray-300 hover:border-gray-300 hover:bg-slate-100/70 py-1 duration-200 lg:text-[14px] text-[10px]">
									XL
								</button>
								<button className="lg:w-full rounded-[7px] border-2 border-gray-300 hover:border-gray-300 hover:bg-slate-100/70 py-1 duration-200 lg:text-[14px] text-[10px]">
									XXL
								</button>
								<button className="lg:w-full rounded-[7px] border-2 border-gray-300 hover:border-gray-300 hover:bg-slate-100/70 py-1 duration-200 lg:text-[14px] text-[10px]">
									3XL
								</button>
								<button className="lg:w-full rounded-[7px] border-2 border-gray-300 hover:border-gray-300 hover:bg-slate-100/70 py-1 duration-200 lg:text-[14px] text-[10px]">
									4XL
								</button>
								<button className="lg:w-full rounded-[7px] border-2 border-gray-300 hover:border-gray-300 hover:bg-slate-100/70 py-1 duration-200 lg:text-[14px] text-[10px]">
									5XL
								</button>
								<button className="lg:w-full rounded-[7px] border-2 border-gray-300 hover:border-gray-300 hover:bg-slate-100/70 py-1 duration-200 lg:text-[14px] text-[10px]">
									6XXL
								</button>
							</div>
						</div>

						<div className="flex flex-col gap-6 ">
							<div className="flex lg:gap-7 items-center gap-12">
								<h3 className="lg:text-[15px] text-[13px] font-bold ">
									Số lượng
								</h3>
								<div className="flex items-center" >
									<div className="flex lg:w-[140px] lg:h-[40px] w-[80px] h-[25px] border-2 items-center justify-between lg:px-2 px-1 lg:py-[24px] py-[14px] rounded-full bg-slate-100/70">
										<button className="border-2 rounded-full lg:p-2 p-[2px]">
											<MdOutlineAdd />
										</button>
										<div>1</div>
										<button className="border-2 rounded-full lg:p-2 p-[2px]">
											<FaMinus />
										</button>
									</div>
									<p className="lg:text-base text-[11px]">
										111 sản phẩm có sẵn
									</p>
								</div>
							</div>

							{/* <div className="flex lg:gap-5 justify-between">
								<div className="flex lg:w-[360px] lg:h-[45px] w-[170px] h-[30px] bg-[#0F172A] rounded-full justify-center items-center">
									<FaCartPlus className="text-white lg:w-[35px] w-[20px] lg:h-[25px] h-[15px]" />
									<button className="text-white font-medium lg:text-base text-[10px]">
										Thêm giỏ hàng
									</button>
								</div>
								<div className="flex lg:w-[260px] lg:h-[45px] w-[130px] h-[30px] bg-red-500 rounded-full justify-center items-center">
									<button className="text-white font-medium lg:text-base text-[10px]">
										Mua ngay
									</button>
								</div>
							</div> */}
							<div className="hidden lg:flex lg:gap-5 justify-between">
								<div className="flex lg:w-[360px] lg:h-[45px] w-[170px] h-[30px] bg-[#0F172A] rounded-full justify-center items-center">
									<FaCartPlus className="text-white lg:w-[35px] w-[20px] lg:h-[25px] h-[15px]" />
									<button className="text-white font-medium lg:text-base text-[10px]">
										Thêm giỏ hàng
									</button>
								</div>
								<div className="flex lg:w-[260px] lg:h-[45px] w-[130px] h-[30px] bg-red-500 rounded-full justify-center items-center">
									<button className="text-white font-medium lg:text-base text-[10px]">
										Mua ngay
									</button>
								</div>
							</div>

							<div className="fixed bottom-0 left-0 right-0 bg-white lg:hidden">
								<div className="flex justify-between px-5 py-3 gap-4">
									<div className="flex w-1/2 h-[50px] bg-[#0F172A] rounded-full justify-center items-center">
										<FaCartPlus className="text-white w-[20px] h-[15px]" />
										<button className="text-white font-medium text-[10px]">
											Thêm giỏ hàng
										</button>
									</div>
									<div className="flex w-1/2 bg-red-500 rounded-full justify-center items-center">
										<button className="text-white font-medium text-[10px]">
											Mua ngay
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetail;
