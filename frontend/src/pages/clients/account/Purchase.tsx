import { formatQuantity, optimizeCloudinaryUrl } from "@/common/localFunction";
import Paginations from "@/components/common/Pagination";
import { cn } from "@/lib/utils";
import { fetchOrder, receivedClientOrder } from "@/service/order";
import { IItemOrder, IItemOrderList, IOrderList } from "@/types/order";
import { SearchObjectType } from "@/types/searchObjecTypes";
import { typeResponse } from "@/types/typeReponse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import CancelConfirm from "./CancelConfirm";
import Evaluate from "./Evaluate";
import LoadingTable from "./LoadingTable";

const OrderManagements = () => {
	const queryClient = useQueryClient();
	const [active, setActive] = useState(7);
	const [status, setStatus] = useState(null);
	const [, setShowLoader] = useState(true);
	const [openId, setOpenId] = useState<string | boolean>(false);
	const [openEvaluate, setOpenEvaluate] = useState<string[] | null>(null);
	const [, setResponse] = useState<typeResponse>({
		pageCount: 0,
		totalElement: 0,
		totalOptionPage: 0,
	});
	const [searchObject, setSearchObject] = useState<SearchObjectType>({
		pageIndex: 1,
		pageSize: 6,
		keyword: "",
		fieldSort: "",
		sort: 1,
	});
	const refBottom = useRef<HTMLDivElement>(null);
	const menuList = [
		{
			index: 7,
			name: "Tất cả",
		},
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
			name: "Chờ giao hàng",
		},
		{
			index: 8,
			name: "Đã giao",
		},
		{
			index: 6,
			name: "Đã hủy",
		},
	];
	const statusList = [
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
	const handleMenuClick = (item: any) => {
		setActive(item.index);
		setStatus(item.index === 7 ? null : item.index);
		setSearchObject((prev) => ({
			...prev,
			pageIndex: 1,
		}));
	};
	const handleFetchOrder = async () => {
		const { data } = await fetchOrder({ ...searchObject, status: status });
		console.log("data", data);
		setResponse({
			pageCount: data?.data?.totalPage,
			totalElement: data?.data?.totalAllOptions,
			totalOptionPage: data?.data?.totalOptionPage,
		});

		return data?.data;
	};
	const { data: orderData, isLoading } = useQuery({
		queryKey: ["purchase", status, searchObject],
		queryFn: handleFetchOrder,
		staleTime: 5 * 60 * 60,
	});
	useEffect(() => {
		handleFetchOrder();
	}, [searchObject]);
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowLoader(false);
		}, 5000);
		return () => clearTimeout(timer);
	}, [isLoading]);
	// console.log("orderData", orderData);
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
				queryKey: ["purchase"],
			});
		},
	});
	const handleChangePag = async (value: any) => {
		setSearchObject((prev) => ({
			...prev,
			pageIndex: value.selected + 1,
		}));
		scrollBottom();
	};

	const scrollBottom = async () => {
		refBottom.current?.scrollIntoView({ behavior: "smooth", block: "center" });
	};

	return (
		<>
			<div className="">
				<div className="w-full">
					<div className="sticky top-0">
						<ul className="flex overflow-x-auto text-base bg-white rounded scroll-custom no-scrollbar md:border md:border-gray-200 box-shadow">
							{menuList.map((item: any) => (
								<li
									key={item.index}
									onClick={() => handleMenuClick(item)}
									className={cn(
										`flex-1 text-nowrap text-sm md:text-base px-5 cursor-pointer font-medium flex justify-center py-3 md:py-5 border-b-2 border-gray-200 hover:border-b-2
                                 hover:border-custom hover:text-custom transition-all duration-300 `,
										active === item.index && `border-custom text-custom`,
									)}
								>
									{item.name}
								</li>
							))}
						</ul>
					</div>
					{isLoading && (
						<div className="h-[500px]">
							<div className="">
								<LoadingTable />
							</div>
						</div>
					)}
					<div className="" ref={refBottom}></div>
					{!isLoading &&
						orderData?.content &&
						orderData?.content.map((item: IOrderList) => {
							// console.log("1111111", item.status)
							return (
								<>
									<div key={item._id} className="my-5">
										<div className="">
											{/* head-order */}
											<div className="flex items-center justify-between w-full px-2 py-5 bg-white border border-gray-200 rounded-sm box-shadow md:px-5">
												<div className="text-xs font-semibold md:text-base">
													Mã đơn hàng:{" "}
													<span className="font-medium text-gray-900">
														{item?.code}{" "}
													</span>
												</div>
												<div
													className={cn(
														item.status == 6
															? "text-red-500 text-xs md:text-base font-medium"
															: "text-xs md:text-base text-custom font-medium ",
													)}
												>
													{
														statusList.find(
															(status) => status.index === item.status,
														)?.name
													}
												</div>
											</div>
											{/* end head */}

											{/*  order item*/}

											{item?.itemList?.map((itemOrderList: IItemOrderList) => {
												// console.log("itemOrderList: ", itemOrderList)
												return (
													<div
														key={itemOrderList.productId}
														className="w-full px-2 bg-white border border-gray-200 rounded-sm box-shadow lg:px-8 "
													>
														<div className="">
															{itemOrderList?.items?.map(
																(itemOrder: IItemOrder) => {
																	// console.log("itemOrderList: ", itemOrder)
																	return (
																		<Link
																			to={`/account/purchase/order/${item?._id}`}
																		>
																			<div
																				key={itemOrder._id}
																				className="flex justify-between w-full gap-3 py-3 border-b border-gray-300 md:gap-5 "
																			>
																				<div className="size-[80px] md:size-[100px] ">
																					<img
																						src={optimizeCloudinaryUrl(itemOrder?.product.thumbnail,100,100)}
																						className="w-full h-full"
																						alt=""
																					/>
																				</div>
																				<div className="flex flex-col flex-1 gap-2 md:flex-row md:justify-between">
																					<div className="w-full md:w-[65%]">
																						<h3 className="text-sm md:text-[16px] font-medium line-clamp-2 ">
																							{itemOrder?.product.name}
																						</h3>
																						<div className="flex flex-row items-end md:items-start md:flex-col gap-x-3">
																							<p className="text-base text-[#0000008A] flex gap-x-1 pt-1">
																								<span className="hidden md:block">
																									Phân loại hàng:
																								</span>
																								<span className="text-sm font-normal text-gray-500 md:text-base">
																									{itemOrder?.variant}
																								</span>
																							</p>
																							<span className="text-sm text-gray-900 md:text-base">
																								x{itemOrder?.quantity}
																							</span>
																						</div>
																					</div>
																					<div className="w-full md:w-[25%] text-red-500 text-xs md:text-sm flex items-end md:items-center font-medium ">
																						<span className="w-full pr-3 md:text-right">
																							{formatQuantity(
																								itemOrder?.price,
																								"₫",
																							)}
																						</span>
																					</div>
																				</div>
																			</div>
																		</Link>
																	);
																},
															)}

															<div className="flex items-center justify-between w-full py-3">
																{item.status === 5 && (
																	<div className="w-full">
																		{itemOrderList?.is_evaluate === true ? (
																			<div className="">
																				<span className="text-sm text-custom">
																					Đã đánh giá
																				</span>
																			</div>
																		) : (
																			<button
																				onClick={() => {
																					console.log(
																						"itemOrderList.productId",
																						itemOrderList.items.map(
																							(itemOrder: IItemOrder) =>
																								itemOrder._id,
																						),
																					),
																						setOpenEvaluate(
																							itemOrderList.items.map(
																								(itemOrder: IItemOrder) =>
																									itemOrder._id,
																							),
																						);
																				}}
																				className="flex items-center px-3 py-2 text-sm border rounded-sm cursor-pointer text-custom border-custom hover:bg-custom-100 "
																			>
																				<FaStar className="mr-1 text-orange-500" />{" "}
																				<span className="">Đánh giá</span>
																			</button>
																		)}
																	</div>
																)}
																<div className="flex justify-end w-full item-center">
																	<p className="text-sm text-right md:text-base lg:font-medium md:flex md:items-center ">
																		Tổng số tiền{" "}
																		<span className="hidden mr-1 md:block">
																			({itemOrderList?.items.length as number}{" "}
																			sản phẩm):
																		</span>
																		<span className="text-red-500 font-medium lg:font-semibold text-sm lg:text-[16px]">
																			{formatQuantity(
																				itemOrderList.totalMoney,
																				"₫",
																			)}
																		</span>
																	</p>
																</div>
															</div>
														</div>
													</div>
												);
											})}
										</div>
										<div className="bg-[#FFFCF5] box-shadow border border-gray-200 px-2 md:px-4 lg:px-8 py-3 md:py-6">
											<div className="flex flex-col items-end md:flex-row gap-y-2 md:justify-between md:items-center">
												{/* change */}
												{[1].includes(item.status) && (
													<button
														onClick={() => setOpenId(item._id)}
														className="px-3 py-2 cursor-pointer  border
                           border-red-600 text-red-600 hover:bg-custom-100 transition-all  duration-300    rounded-sm text-xs lg:text-[16px]"
													>
														Hủy đơn hàng
													</button>
												)}
												{[4].includes(item.status) && (
													<button
														onClick={() => mutate(item._id)}
														className="max-w-[200px] px-3 py-2 lg:px-8 lg:py-3 text-white bg-custom-500 border border-blue-600 hover:bg-custom-600 transition-all  duration-300    rounded-sm text-xs lg:text-[16px]"
													>
														Đã nhận hàng
													</button>
												)}
												{[2, 3].includes(item.status) && (
													<div className="text-sm font-medium lg:text-base">
														Thời gian nhận hàng dự kiến:{" "}
														<span className="">
															{format(
																item?.estimatedDeliveryDate || "",
																"dd/MM/yyyy",
															)}
														</span>
													</div>
												)}
												{[5].includes(item.status) && (
													<div className="text-sm font-medium lg:text-base">
														Đã nhận hàng:{" "}
														<span className="">
															{format(
																item?.shippedDate || "",
																"hh:mm  dd/MM/yyyy",
															)}
														</span>
													</div>
												)}
												<div className="text-sm font-medium lg:text-base">
													Thành tiền:{" "}
													<span className="text-red-500 font-medium lg:font-semibold text-sm lg:text-[16px]">
														{formatQuantity(item.totalMoney, "₫")}
													</span>
												</div>
											</div>
										</div>
									</div>
								</>
							);
						})}
					{orderData?.totalPage > 1 && (
						<div className="flex justify-center w-full pt-5">
							<Paginations
								forcePage={searchObject.pageIndex - 1}
								pageCount={orderData?.totalPage}
								handlePageClick={handleChangePag}
							/>
						</div>
					)}
					{orderData?.content.length === 0 && (
						<div className="w-full h-[300px] box-shadow rounded-sm flex flex-col justify-center items-center bg-white my-5">
							<div className="w-20">
								<img
									src="https://toinh-ecommerce.vercel.app/images/no-order.png"
									alt=""
									className=""
								/>
							</div>
							<h3 className="">Chưa có đơn hàng.</h3>
						</div>
					)}
				</div>
				{openId && (
					<CancelConfirm
						open={openId}
						handleClose={() => setOpenId(false)}
						handleFetchOrder={handleFetchOrder}
					/>
				)}
				{openEvaluate && (
					<Evaluate
						open={openEvaluate}
						handleClose={() => setOpenEvaluate(null)}
					/>
				)}
			</div>
		</>
	);
};

export default OrderManagements;
