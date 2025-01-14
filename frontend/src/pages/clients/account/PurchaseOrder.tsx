import { formatQuantity, optimizeCloudinaryUrl } from "@/common/localFunction";
import { cn } from "@/lib/utils";
import { fetchOrderDetail, receivedClientOrder } from "@/service/order";
import { IListStatusOrderDate, IOrderItemDetail } from "@/types/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Banknote, FileText, Inbox, Star, Truck } from "lucide-react";
import { useState } from "react";
import { BsChevronLeft } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import LoadingTable from "./LoadingTable";

const PurchaseOrder = () => {
	const queryClient = useQueryClient();
	const [_, setStatus] = useState(null);
	// const [statusLists, setStatusLists] = useState<number[]>([0]);
	// const [paymentMethod, setPaymentMethod] = useState<number>(1)
	const statusIndex = [
		{
			index: 1,
			name: "Chờ xác nhận",
		},
		{
			index: 2,
			name: "Chờ lấy hàng",
		},
		{
			index: 3,
			name: "Đang giao hàng",
		},
		{
			index: 4,
			name: "Đã giao hàng",
		},
		{
			index: 5,
			name: "Đã nhận hàng",
		},
		{
			index: 6,
			name: "Đã hủy",
		},
	];

	const { id } = useParams();
	const { data, isLoading } = useQuery({
		queryKey: ["purchaseDetail", id],
		queryFn: async () => {
			const { data } = await fetchOrderDetail(id as string);
			setStatus(data?.data.status);
			// setStatusLists(data?.data?.statusList);
			// setPaymentMethod(data?.data?.paymentMethod);
			// handleStatus(data?.data.status)
			return data;
		},
		staleTime: 5 * 60 * 60,
	});
	const steps = [
		{
			status: 1,
			label: "Đơn hàng đã đặt",
			icon: FileText,
		},
		{
			status: 2,
			label: "Đã xác nhận",
			icon: Banknote,
		},
		{ status: 3, label: "Đang vận chuyển", icon: Truck },
		{ status: 4, label: "Đã giao hàng", icon: Inbox },
		{ status: 5, label: "Đã nhận", icon: Star },
	];
	const isStatusList = (stepStatus: number) => {
		return data?.data?.statusList.some(
			(status: number) => status === stepStatus,
		);
	};
	const { mutate } = useMutation({
		mutationFn: async (id: string) => {
			try {
				const data = await receivedClientOrder(id);
				return data;
			} catch (error) {
				console.log(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["purchaseDetail"],
			});
		},
	});
	return (
		<>
			<div className="w-full px-0 lg:px-20">
				<div className="h-[500px">
					{isLoading && (
						<div className="">
							<LoadingTable />
						</div>
					)}
				</div>
				<div className="">
					<div className="flex flex-row items-center justify-between px-2 py-3 bg-white border-b-2 border-gray-300 border-dotted rounded md:py-5 md:px-5 box-shadow">
						<div className="">
							<Link to={`/account/purchase`}>
								<button className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase md:text-base">
									<BsChevronLeft size={16} /> Trở lại
								</button>
							</Link>
						</div>
						<div className="flex uppercase md:gap-x-3 md:justify-center md:items-center xl:gap-x-5 ">
							<p className="items-center justify-center hidden gap-1 text-xs font-medium text-gray-900 md:flex md:text-base ">
								Mã đơn hàng:{" "}
								<span className="text-gray-600">{data?.data.code} </span>
							</p>
							<span className="hidden pb-1 md:block">|</span>
							<span
								className={cn(
									data?.data?.statusList.find((item: any) => item === 6)
										? "text-red-500 text-xs md:text-base font-medium"
										: "text-xs md:text-base font-medium text-custom",
								)}
							>
								{
									statusIndex.find((item) => item.index === data?.data.status)
										?.name
								}
							</span>
						</div>
					</div>
					{/* status */}
					{}
					<div
						className={cn(
							data?.data?.statusList.find((item: any) => item === 6)
								? "hidden"
								: "hidden md:block",
						)}
					>
						<div
							className={cn(
								"w-full overflow-x-auto scrollbar-hide border-b-2 box-shadow border-dotted border-gray-300 rounded",
							)}
						>
							<div className="min-w-[963px] py-10 px-6 bg-white border-t border-gray-300 border-dotted rounded">
								<div className="relative flex items-start justify-between ">
									{steps.map((step, index) => (
										<div
											key={index}
											className="z-10 max-w-[183px] w-full  flex flex-col justify-center items-center"
										>
											<div className="flex items-center justify-center ">
												<div
													className={cn(
														"w-14 h-14 bg-white flex items-center justify-center border-[4px]  rounded-full",
														isStatusList(step.status)
															? "bg-[#2dc258] border-none"
															: "border-gray-100",
													)}
												>
													{
														<step.icon
															size={30}
															className={cn(
																isStatusList(step.status)
																	? "text-white"
																	: "text-gray-200",
															)}
														/>
													}
												</div>
												<div
													className={cn(
														" ",
														steps.length - 1 === index && "hidden",
													)}
												>
													<span
														className={cn(
															isStatusList(step.status + 1)
																? " absolute h-1 w-[170px] bg-[#2dc258]"
																: "absolute h-1 w-[170px] bg-gray-100",
														)}
													></span>
												</div>
											</div>
											<div className="mt-5 text-center capitalize">
												<p className="text-wrap max-w-40">{step.label}</p>
												{/* <span className="text-xs text-[#00000042]">
                          {step?.time
                            ? new Date(step.time).toLocaleString("vi-VN")
                            : ""}
                        </span> */}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
						{/*  */}
					</div>

					{/*  */}
					<div
						className={cn(
							data?.data?.statusList.find((item: any) => item === 6)
								? "block"
								: "hidden",
						)}
					>
						<div className="bg-[#FFFCF5] px-5 py-6 mt-1 mb-4">
							<h3 className="text-sm md:text-[18px] text-red-500 font-medium pb-2 uppercase">
								Đơn hàng đã hủy
							</h3>
							<span className="text-[#000000]">
								{data?.data?.cancelOrderDate &&
									format(data?.data?.cancelOrderDate || "", "hh:mm dd/MM/yyyy")}
							</span>
						</div>
					</div>
					{/* information */}
					<div className="">
						{/* customer */}
						<div
							className={cn(
								data?.data?.statusList.find((item: any) => item === 6)
									? "hidden"
									: "block",
							)}
						>
							<div className="p-5 bg-white border-b-2 border-gray-300 border-dotted rounded">
								<h3 className="text-sm font-medium md:text-base md:pb-2 ">
									Địa Chỉ Nhận Hàng
								</h3>
								<div className="flex flex-col md:flex-row">
									<div className="min-w-[300px] pr-4 lg:pr-10 py-1 md:py-3">
										<p className=" text-[rgba(0,0,0,.68)] text-sm md:text-base  md:leading-[160%] uppercase py-1">
											{data?.data?.address?.username}
										</p>
										<p className="text-[rgba(0,0,0,.68)]  md:leading-[160%]">
											{data?.data?.address?.phone}
										</p>
										<p className="text-[rgba(0,0,0,.68)]  md:leading-[160%]">
											{data?.data?.address?.address}
										</p>
									</div>
									<div className="flex border-t-2 md:border-none border-dotted border-gray-200 flex-col w-full md:w-[60%] py-2 mt-2 md:mt-0">
										{data?.listStatusOrderDate?.map(
											(item: IListStatusOrderDate, index: number) => {
												if (!item) return null;
												return (
													<>
														<div className="flex gap-5 md:px-5 md:border-l md:order-gray-200 ">
															<div className="flex flex-col items-center">
																<div className="w-8 h-8 flex justify-center items-center border border-gray-200 bg-[#26aa99] rounded-full">
																	<FileText size={16} color="white" />
																</div>
																<div
																	className={cn(
																		"w-[2px] h-14 bg-gray-200",
																		data?.listStatusOrderDate.length - 2 ===
																			index && "hidden",
																	)}
																></div>
															</div>
															<div className="flex flex-col text-sm gap-y-1 md:flex-row md:gap-x-5 md:text-base">
																<div className="max-w-[130px]">
																	{item?.date &&
																		format(
																			new Date(item?.date),
																			"hh:mm dd/MM/yyyy",
																		)}
																</div>
																<div className="flex-1">
																	<h3 className="text-[#26aa99] font-semibold md:font-bold">
																		{item?.message}
																	</h3>
																	<p className="">{item?.sub}</p>
																</div>
															</div>
														</div>
													</>
												);
											},
										)}
									</div>
								</div>
							</div>
						</div>
						{/* product */}
						<div className="bg-white box-shadow">
							<div className="w-full bg-white">
								{data?.data?.orderItems?.map((itemOrder: IOrderItemDetail) => {
									return (
										<>
											<div
												key={itemOrder._id}
												className="flex justify-between w-full gap-3 px-5 py-4 border-b border-gray-300 border-dotted md:gap-5 "
											>
												<div className="size-[80px] md:size-[100px] ">
													<img
														src={optimizeCloudinaryUrl(
															itemOrder?.product.thumbnail,
															100,
															100,
														)}
														className="w-full h-full"
														alt=""
													/>
												</div>
												<div className="flex flex-col flex-1 gap-2 md:flex-row md:justify-between">
													<div className="flex-1">
														<h3 className="text-base md:text-[18px] font-medium line-clamp-1 ">
															{itemOrder?.product.name}
														</h3>
														<div className="flex flex-row md:flex-col gap-x-3">
															<p className="text-base text-[#0000008A] flex gap-x-1">
																<span className="hidden md:block">
																	Phân loại đơn hàng:
																</span>
																<span className="text-sm font-normal text-gray-600 md:text-base">
																	{itemOrder?.variant},
																</span>
															</p>
															<span className="text-sm text-gray-900 md:text-base">
																x{itemOrder?.quantity}
															</span>
														</div>
													</div>
													<div className="lg:w-[200px] text-red-500 text-sm md:text-base flex items-end md:items-center font-medium ">
														<span className="pr-3 text-gray-500 line-through">
															{formatQuantity(itemOrder?.product.price, "₫")}
														</span>
														<span className="">
															{formatQuantity(itemOrder?.price, "₫")}
														</span>
													</div>
												</div>
											</div>
										</>
									);
								})}
							</div>
							<div className="flex border-t border-gray-200 ">
								<div className="w-[65%] md:w-[75%] flex flex-col text-right ">
									<span className="py-2 md:py-4 px-3 border-b-2 border-r-2  border-dotted text-sm md:text-base rounded text-[rgba(0,0,0,.68)] leading-[160%]">
										Tổng tiền hàng
									</span>
									<span className="py-2 md:py-4 px-3 border-b-2  border-r-2 border-dotted text-sm md:text-base rounded text-[rgba(0,0,0,.68)] leading-[160%]">
										Phí vận chuyển
									</span>
									<span className="py-2 md:py-4 px-3 border-b-2 border-r-2 border-dotted text-sm md:text-base rounded text-[rgba(0,0,0,.68)] leading-[160%]">
										Voucher
									</span>
									<span className="py-2 md:py-4 px-3 border-b-2 border-r-2 border-dotted text-sm md:text-base rounded text-[rgba(0,0,0,.68)] leading-[160%]">
										Đã thanh toán
									</span>
									<span className="py-3 md:py-4 px-3 border-b-2 border-r-2 border-dotted rounded text-sm md:text-lg text-[rgba(0,0,0,.68)] leading-[160%]">
										Thành tiền
									</span>
								</div>
								<div className="w-[35%] md:w-[25%] flex flex-col text-right">
									<span className="py-2 md:py-4 px-3 border-b-2 border-r-2 border-dotted rounded text-sm md:text-base text-[rgba(0,0,0,.68)] leading-[160%]">
										{formatQuantity(
											data?.data?.totalMoney + (data?.data?.voucherAmount || 0),
											"₫",
										)}
									</span>
									<span className="py-2 md:py-4 px-3 border-b-2 border-r-2 border-dotted rounded text-sm md:text-base  text-[rgba(0,0,0,.68)] leading-[160%]">
										{" "}
										{formatQuantity(data?.data?.shippingCost, "₫")}
									</span>
									<span className="py-2 md:py-4 px-3 border-b-2 border-r-2 border-dotted rounded text-sm md:text-base  text-[rgba(0,0,0,.68)] leading-[160%]">
										{" "}
										- {formatQuantity(data?.data?.voucherAmount, "₫")}
									</span>
									<span className="py-2 md:py-4 px-3 border-b-2 border-r-2 border-dotted rounded text-sm md:text-base  text-[rgba(0,0,0,.68)] leading-[160%]">
										{" "}
										- {formatQuantity(data?.data?.paymentAmount, "₫")}
									</span>
									<span className="py-3 md:py-4 px-3 border-b-2 border-r-2 border-dotted rounded text-red-500 text-sm md:text-lg leading-[160%]">
										{formatQuantity(data?.data?.amountToPay, "₫")}
									</span>
								</div>
							</div>
							<div className="py-5">
								<div
									className={cn(
										data?.data?.paymentMethod === 1 ? "block" : "hidden",
									)}
								>
									<div className="text-xs md:text-base border border-[rgba(224,168,0,.4)] rounded w-full px-5 py-2 text-[rgba(0,0,0,.68)] leading-[160%]">
										Vui lòng thanh toán{" "}
										<span className="text-red-500">
											{formatQuantity(data?.data?.amountToPay, "₫")}
										</span>{" "}
										khi nhận hàng.
									</div>
								</div>
								<div
									className={cn(
										data?.data?.paymentMethod === 2 ? "block" : "hidden",
									)}
								>
									<div className="border border-[rgba(224,168,0,.4)] rounded w-full px-5 py-2 text-[rgba(0,0,0,.68)] leading-[160%]">
										<span className="">
											Đơn hàng của bạn đã được thanh toán!
										</span>
									</div>
								</div>
							</div>
							{data?.data?.statusList.includes(4) &&
								!data?.data?.statusList.includes(5) && (
									<div className="flex flex-col px-5 py-4 border-t-2 border-gray-200 border-dotted gap-y-3 md:flex-row md:justify-between md:items-center">
										<div className="text-sm font-normal md:text-base md:font-medium">
											Đã giao hàng:{" "}
											{data?.data?.shippedDate &&
												format(
													data?.data?.shippedDate || "",
													"hh:mm dd/MM/yyyy",
												)}
										</div>
										<button
											onClick={() => mutate(data?.data?._id)}
											className="px-3 max-w-[200px] mx-auto md:mx-0 py-2 lg:px-8 lg:py-3 focus:outline-none text-white bg-custom-500 border border-blue-600 hover:bg-custom-600 transition-all duration-300 rounded-sm text-xs lg:text-[16px]"
										>
											Đã nhận hàng
										</button>
									</div>
								)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PurchaseOrder;
