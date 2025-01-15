import { formatCurrency } from "@/common/func";
import { TooltipComponent } from "@/components/common/TooltipComponent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { confirmOrder, updateIsShiper } from "@/service/order";
import { pagingShipper } from "@/service/shipper";
import { SearchShipperOrder } from "@/types/shipper.interface";
import { formatInTimeZone } from "date-fns-tz";
import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { toast } from "sonner";
import OrderCancelConfirm from "./OrderCancelConfirm";
import OrderSelectShipper from "./OrderSelectShipper";

const OrderInforAddress = ({ data, getOrderById }: any) => {
	const handleChangeOrder = async (id: string) => {
		try {
			const data = await confirmOrder(id);
			getOrderById();
			return data;
		} catch (error: any) {
			toast.error(error?.response?.data?.message);
			console.log(error);
		}
	};
	const [searchObjecOrder, setSearchObjectOrder] = useState<SearchShipperOrder>(
		{
			pageIndex: 1,
			pageSize: 3,
			active: null,
			keyword: "",
			isBlock: null,
		},
	);
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
	const handleUpdateShipper = async (id: string) => {
		try {
			await updateIsShiper(id);
			getOrderById();
			toast.success("Chuyển thành công");
		} catch (error) {
			toast.error("Chuyển thất bại");
		}
	};
	return (
		<div className="col-span-1">
			<div className="flex flex-col gap-5">
				<div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-md bg-main border-1 box-shadow">
					<h3 className="font-medium">Chi tiết</h3>
					<div className="flex justify-between">
						<p className="text-sm font-medium text-black">Mã đơn hàng</p>
						<p className="text-sm">{data.code}</p>
					</div>
					<div className="flex justify-between">
						<p className="text-sm font-medium text-black">Ngày đặt hàng</p>
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
						<p className="text-sm font-medium text-black">Tổng tiền đơn hàng</p>
						<p className="text-sm font-medium text-red-500">
							{formatCurrency(data.totalMoney + data?.shippingCost)}
						</p>
					</div>
				</div>
				<div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-md bg-main border-1 box-shadow">
					<h3 className="font-medium">Ghi chú</h3>
					<p className="w-40 text-sm break-words">{data.note}</p>
				</div>
				<div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-md bg-main border-1 box-shadow">
					<h3 className="font-medium">Địa chỉ đặt hàng</h3>
					<div className="flex justify-between">
						<p className="text-sm font-medium text-black">Họ và tên</p>
						<p className="text-sm">{data?.address?.username}</p>
					</div>
					<div className="flex justify-between">
						<p className="text-sm font-medium text-black">Số điện thoại</p>
						<p className="text-sm">{data?.address?.phone}</p>
					</div>
					<div className="flex justify-between">
						<p className="text-sm font-medium text-black">Địa chỉ</p>
						<p className="text-sm break-words w-44">{data?.address?.address}</p>
					</div>
				</div>
				<div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-md bg-main border-1 box-shadow">
					<h3 className="font-medium">Phương thức thanh toán</h3>
					<div className="flex justify-between">
						<p className="text-sm font-medium text-black">Phương thức</p>
						<p className="text-sm">
							{data.paymentMethod === 1
								? "Thanh toán khi nhận hàng"
								: data.paymentMethod === 2
									? "Thanh toán bằng VNPAY"
									: data.paymentMethod === 3
										? "Thanh toán bằng Momo"
										: "Phương thức thanh toán không hợp lệ"}
						</p>
					</div>
					{(data.paymentMethod === 2 || data.paymentMethod === 3) && (
						<div className="flex flex-col gap-3">
							<div className="flex justify-between">
								<p className="text-sm font-medium text-black">Ngân hàng</p>
								<p className="text-sm">{data.payment.bankCode}</p>
							</div>
							<div className="flex justify-between">
								<p className="text-sm font-medium text-black">Thẻ</p>
								<p className="text-sm">{data.payment.cardType}</p>
							</div>
							<div className="flex justify-between">
								<p className="text-sm font-medium text-black">Mã giao dịch</p>
								<p className="text-sm">{data.payment.transactionId}</p>
							</div>
							<div className="flex justify-between">
								<p className="text-sm font-medium text-black">Ngày giao dịch</p>
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
					<div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-md bg-main border-1 box-shadow">
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
						"bg-main rounded-md border flex gap-4 flex-col border-1 border-gray-200 box-shadow p-4",
						(data.status === 1 || data.status === 6) && "hidden",
					)}
				>
					<div className="flex items-center justify-between">
						<h3 className="font-medium">
							{data.is_shipper
								? "Lựa chọn giao hàng"
								: "Chuyển đến đơn vị vận chuyển"}
						</h3>
						{data?.status === 2 && data.shipper !== null && (
							<TooltipComponent label="Đổi shipper">
								<div onClick={() => setOpen(true)}>
									<FaUserEdit
										size={20}
										className="text-blue-500 cursor-pointer"
									/>
								</div>
							</TooltipComponent>
						)}
					</div>
					{data.status === 2 ? (
						data.is_shipper === false ? (
							<Button
								className="bg-[#36e762] hover:bg-[#5ef083]"
								onClick={() => handleUpdateShipper(data._id)}
							>
								Chuyển
							</Button>
						) : data.shipper === null ? (
							<Button
								className="bg-[#369de7] hover:bg-[#5eb3f0]"
								onClick={() => setOpen(true)}
							>
								Lựa chọn
							</Button>
						) : (
							<div className="flex flex-col gap-4">
								<div className="flex items-center gap-5">
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
							</div>
						)
					) : [3, 4, 5].includes(data.status) && data.shipper !== null ? (
						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-5">
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
						</div>
					) : (
						"Lỗi giá trị"
					)}
				</div>
				<div
					className={cn(
						"bg-main rounded-md border flex gap-4 flex-col border-1 border-gray-200 box-shadow p-4",
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
					dataShipper={dataShipper}
					dataOrderId={data}
					getOrderById={getOrderById}
					searchObjecOrder={searchObjecOrder}
					setSearchObjectOrder={setSearchObjectOrder}
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
