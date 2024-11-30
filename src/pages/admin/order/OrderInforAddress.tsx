import { formatCurrency } from "@/common/func";
import { Button } from "@/components/ui/button";
import { confirmOrder } from "@/service/order";
import { pagingShipper } from "@/service/shipper";
import { SearchShipperOrder } from "@/types/shipper.interface";
import { formatInTimeZone } from "date-fns-tz";
import React, { useEffect, useState } from "react";
import OrderSelectShipper from "./OrderSelectShipper";
import { cn } from "@/lib/utils";
import OrderCancelConfirm from "./OrderCancelConfirm";
import { toast } from "sonner";

const OrderInforAddress = ({ data, getOrderById }: any) => {
	const [pageIndex, setPageIndex] = useState(1);
	const handleChangeOrder = async (id: string) => {
		try {
			const data = await confirmOrder(id);
			getOrderById();
			return data;
		} catch (error:any) {
			toast.error(error?.response?.data?.message);
			console.log(error);
		}
	};
	const [searchObjecOrder, setSearchObjecOrder] = useState<SearchShipperOrder>({
		pageIndex: pageIndex,
		pageSize: 5,
		active: null,
		keyword: "",
		isBlock: null,
	});
	const [dataShipper, setDataShipper] = useState({});
	const [open, setOpen] = useState(false);
	const [openCancel, setOpenCancel] = useState(false);
	useEffect(() => {
		(async () => {
			try {
				const { data } = await pagingShipper(searchObjecOrder);
				setDataShipper(data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [searchObjecOrder]);
	return (
		<div className="col-span-1">
			<div className="flex flex-col gap-5">
				<div className="bg-main rounded-md border flex gap-4 flex-col border-1 border-gray-100 box-shadow p-4">
					<h3 className="font-medium">Chi tiết</h3>
					<div className="flex justify-between">
						<p className="font-medium text-sm text-black">Mã đơn hàng</p>
						<p className="text-sm">{data.code}</p>
					</div>
					<div className="flex justify-between">
						<p className="font-medium text-sm text-black">Ngày đặt hàng</p>
						<p className="text-sm">
							{data?.createdAt
								? formatInTimeZone(
										new Date(data.createdAt),
										"Asia/Ho_Chi_Minh",
										"dd/MM/yyyy HH:mm:ss",
									)
								: "Ngày giờ không hợp lệ"}
						</p>
					</div>

					<div className="flex justify-between">
						<p className="font-medium text-sm text-black">Tổng tiền</p>
						<p className="font-medium text-sm text-red-500">
							{formatCurrency(data.amountToPay)}
						</p>
					</div>
				</div>
				<div className="bg-main rounded-md border flex gap-4 flex-col border-1 border-gray-100 box-shadow p-4">
					<h3 className="font-medium">Ghi chú</h3>
					<p className="text-sm w-40 break-words">{data.note}</p>
				</div>
				<div className="bg-main rounded-md border flex gap-4 flex-col border-1 border-gray-100 box-shadow p-4">
					<h3 className="font-medium">Địa chỉ đặt hàng</h3>
					<div className="flex justify-between">
						<p className="font-medium text-sm text-black">Họ và tên</p>
						<p className="text-sm">{data?.address?.username}</p>
					</div>
					<div className="flex justify-between">
						<p className="font-medium text-sm text-black">Số điện thoại</p>
						<p className="text-sm">{data?.address?.phone}</p>
					</div>
					<div className="flex justify-between">
						<p className="font-medium text-sm text-black">Địa chỉ</p>
						<p className="text-sm w-44 break-words">{data?.address?.address}</p>
					</div>
				</div>
				<div className="bg-main rounded-md border flex gap-4 flex-col border-1 border-gray-100 box-shadow p-4">
					<h3 className="font-medium">Phương thức thanh toán</h3>
					<div className="flex justify-between">
						<p className="font-medium text-sm text-black">Phương thức</p>
						<p className="text-sm">
							{data.paymentMethod === 1
								? "Thanh toán khi nhận hàng"
								: "Thanh toán bằng VNPAY"}
						</p>
					</div>
					{data.paymentMethod === 2 && (
						<div className="flex flex-col gap-3">
							<div className="flex justify-between">
								<p className="font-medium text-sm text-black">Ngân hàng</p>
								<p className="text-sm">{data.payment.bankCode}</p>
							</div>
							<div className="flex justify-between">
								<p className="font-medium text-sm text-black">Thẻ</p>
								<p className="text-sm">{data.payment.cardType}</p>
							</div>
							<div className="flex justify-between">
								<p className="font-medium text-sm text-black">Mã giao dịch</p>
								<p className="text-sm">{data.payment.transactionId}</p>
							</div>
							<div className="flex justify-between">
								<p className="font-medium text-sm text-black">Ngày giao dịch</p>
								<p className="text-sm">
									{data.payment.createdAt &&
										formatInTimeZone(
											new Date(data.payment.createdAt),
											"Asia/Ho_Chi_Minh",
											"dd/MM/yyyy HH:mm:ss",
										)}
								</p>
							</div>
						</div>
					)}
				</div>
				{data.status === 1 && (
					<div className="bg-main rounded-md border flex gap-4 flex-col border-1 border-gray-100 box-shadow p-4">
						<h3 className="font-medium">Xác nhận</h3>
						<Button
							className="bg-[#369de7] hover:bg-[#5eb3f0]"
							onClick={() => handleChangeOrder(data._id)}
						>
							Xác nhận
						</Button>
					</div>
				)}

				<div
					className={cn(
						"bg-main rounded-md border flex gap-4 flex-col border-1 border-gray-100 box-shadow p-4",
						data.status !== 2 && "hidden",
					)}
				>
					<h3 className="font-medium">Lựa chọn giao hàng</h3>
					{data.status === 2 &&
						(data.shipper === null ? (
							<Button
								className="bg-[#369de7] hover:bg-[#5eb3f0]"
								onClick={() => setOpen(true)}
							>
								Lựa chọn
							</Button>
						) : (
							<div className="flex gap-5 items-center">
								<img
									src={data?.shipper?.avatar}
									alt="Shipper Avatar"
									className="w-20 h-20"
								/>
								<div className="flex flex-col gap-1">
									<span className="text-sm">
										Họ tên:{" "}
										<span className="font-semibold">
											{data?.shipper?.fullName}
										</span>
									</span>
									<span className="text-sm">
										Số điện thoại:{" "}
										<span className="font-semibold">
											{data?.shipper?.phone}
										</span>
									</span>
									<span className="text-sm">
										Địa chỉ: {data?.shipper?.city?.name} -{" "}
										{data?.shipper?.district?.name} -{" "}
										{data?.shipper?.commune?.name}
									</span>
								</div>
							</div>
						))}
				</div>
				<div
					className={cn(
						"bg-main rounded-md border flex gap-4 flex-col border-1 border-gray-100 box-shadow p-4",
						data.status !== 1 && "hidden",
					)}
				>
					<h3 className="font-medium">Hủy đơn hàng</h3>
					{data.status === 1 && (
						<Button
							className="bg-[#e74b36] hover:bg-[#f05e5e]"
							onClick={() => setOpenCancel(true)}
						>
							Hủy đơn hàng
						</Button>
					)}
				</div>
			</div>
			{!!open && (
				<OrderSelectShipper
					open={open}
					closeOpen={() => setOpen(false)}
					pageIndex={pageIndex}
					setPageIndex={setPageIndex}
					dataShipper={dataShipper}
					dataOrderId={data}
					getOrderById={getOrderById}
				/>
			)}
			{!!openCancel && (
				<OrderCancelConfirm
					open={openCancel}
					closeOpen={() => setOpenCancel(false)}
					getOrderById={getOrderById}
					dataOrderId={data}
				/>
			)}
		</div>
	);
};

export default OrderInforAddress;
