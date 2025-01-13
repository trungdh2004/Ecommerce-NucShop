import { ReactNode, useEffect, useState } from "react";
import { optimizeCloudinaryUrl } from "@/common/localFunction";
import { getDetailShipperById, updateActionShippers } from "@/service/shipper";
import { IShipperDetail } from "@/types/shipper.interface";
import { AxiosError } from "axios";
import {
	FaMapMarkerAlt,
	FaRegAddressCard,
	FaLock,
	FaUnlockAlt,
} from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { LiaBirthdayCakeSolid, LiaMapMarkedAltSolid } from "react-icons/lia";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { FaTruckFast } from "react-icons/fa6";
import { TbBasketCancel, TbClipboardPlus } from "react-icons/tb";
import ListOrder from "./ListOrder";
import { cn } from "@/lib/utils";

const UserShipperDetail = () => {
	const { id } = useParams();
	const [infoDetailShipper, setInfoDetailShipper] = useState<IShipperDetail>();
	useEffect(() => {
		(async () => {
			try {
				const { data } = await getDetailShipperById(id as string);
				delete data.message;
				setInfoDetailShipper(data);
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(error?.response?.data?.message);
				}
			}
		})();
	}, [id]);

	const handleBlock = async () => {
		try {
			await updateActionShippers({
				listId: [id as string],
				type: 1,
				isBlock: true,
			});
			const { data } = await getDetailShipperById(id as string);
			delete data.message;
			setInfoDetailShipper(data);
			toast.success("Đã cấm người dùng thành công");
		} catch (error) {
			toast.error("Cấm người dùng thất bại");
		}
	};

	const handleUnBlock = async () => {
		try {
			await updateActionShippers({
				listId: [id as string],
				type: 2,
				isBlock: true,
			});
			const { data } = await getDetailShipperById(id as string);
			delete data.message;
			setInfoDetailShipper(data);
			toast.success("Bỏ cấm người dùng thành công");
		} catch (error) {
			toast.error("Bỏ Cấm người dùng thất bại");
		}
	};

	return (
		<div className="">
			<h4 className="text-base font-medium md:text-xl">
				Thông tin chi tiết người giao hàng
			</h4>
			<div className="flex flex-col items-start gap-4 mt-3 md:flex-row">
				<div className="overflow-hidden border max-md:w-full md:w-3/5 md:min-w-[60%] rounded-xl box-shadow">
					<div className="p-6 ">
						<div className="flex flex-col items-start justify-between lg:flex-row">
							<div className="flex flex-col items-center w-4/5 mb-6">
								<div>
									<img
										src={optimizeCloudinaryUrl(
											infoDetailShipper?.shipper?.avatar as string,
											110,
											110,
										)}
										alt=""
										className={cn(
											"object-cover w-32 h-32 mb-4 border-4  rounded-full",
											infoDetailShipper?.shipper?.block_at
												? "border-[#cf4040]"
												: "border-green-500",
										)}
									/>
								</div>
								{infoDetailShipper?.shipper?.is_block ? (
									<button
										onClick={handleUnBlock}
										className="flex items-center px-2.5 py-1.5 font-bold text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:shadow-outline"
									>
										<FaUnlockAlt className="mr-2" />
										<span className="text-xs">Mở khoá tài khoản</span>
									</button>
								) : (
									<button
										onClick={handleBlock}
										className="flex items-center  px-2.5 py-1.5 font-bold text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:shadow-outline"
									>
										<FaLock className="mr-2" />
										<span className="text-xs">Khóa tài khoản</span>
									</button>
								)}
							</div>
							<div className="grid grid-cols-2 gap-7">
								<InfoField
									icon={<FaRegAddressCard className="text-gray-400" />}
									label="Họ tên"
									value={infoDetailShipper?.shipper?.fullName as string}
								/>
								<InfoField
									icon={<FaRegAddressCard className="text-gray-400" />}
									label="Số căn cước"
									value={infoDetailShipper?.shipper?.idCitizen as string}
								/>
								<InfoField
									icon={<FiPhone className="text-gray-400" />}
									label="Điện thoại"
									value={infoDetailShipper?.shipper?.phone as string}
								/>
								<InfoField
									icon={<LiaBirthdayCakeSolid className="text-gray-400" />}
									label="Ngày sinh"
									value={new Date(
										infoDetailShipper?.shipper?.birthDate as string,
									).toLocaleDateString()}
								/>
								<div className="col-span-2">
									<InfoField
										icon={<FaMapMarkerAlt className="text-gray-400" />}
										label="Địa chỉ"
										value={
											infoDetailShipper?.shipper?.address
												.concat(infoDetailShipper?.shipper?.address)
												.concat(infoDetailShipper?.shipper?.address) as string
										}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="grid flex-grow w-full grid-cols-2 gap-5">
					<StatCard
						icon={<TbClipboardPlus size={40} className="text-blue-300" />}
						count={infoDetailShipper?.countOrderConfirm as number}
						label="Đơn hàng mới"
					/>
					<StatCard
						icon={<FaTruckFast size={40} className="text-blue-500" />}
						count={infoDetailShipper?.countOrderRunning as number}
						label="Đơn hàng đang giao"
					/>
					<StatCard
						icon={<LiaMapMarkedAltSolid size={40} className="text-green-500" />}
						count={infoDetailShipper?.countOrderSuccess as number}
						label="Đơn hàng giao thành công"
					/>

					<StatCard
						icon={<TbBasketCancel size={40} className="text-red-500" />}
						count={infoDetailShipper?.countOrderCancel as number}
						label="Đơn hàng giao thất bại"
					/>
				</div>
				{/* <div className="p-6 border rounded-xl box-shadow">
					<h5 className="mb-6 text-base font-medium md:text-lg">
						Biểu đồ thống kê đơn hàng
					</h5>
					<ChartOrderShipper />
					<div className="flex items-center justify-center gap-6 mt-6">
						<LegendItem color="bg-green-500" label="Thành công" />
						<LegendItem color="bg-blue-500" label="Đang giao" />
						<LegendItem color="bg-red-500" label="Thất bại" />
					</div>
				</div> */}
			</div>
			<div className="mt-3">
				<ListOrder id={id as string} />
				{/* <h4 className="text-base font-medium md:text-xl">Thông tin được hàng</h4>
			<div className="grid grid-cols-1 gap-6 mt-3 md:grid-cols-3">
				<StatCard
					icon={<LiaMapMarkedAltSolid size={40} className="text-green-500" />}
					count={orderStats.successful}
					label="Đơn hàng giao thành công"
				/>
				<StatCard
					icon={<FaTruckFast size={40} className="text-blue-500" />}
					count={orderStats.inProgress}
					label="Đơn hàng đang giao"
				/>
				<StatCard
					icon={<TbBasketCancel size={40} className="text-red-500" />}
					count={orderStats.failed}
					label="Đơn hàng giao thất bại"
				/>
			</div> */}
			</div>
		</div>
	);
};

const InfoField = ({
	icon,
	label,
	value,
}: {
	icon: ReactNode;
	label: string;
	value: string;
}) => (
	<div className="flex items-center w-full">
		<div className="mr-3 text-xl">{icon}</div>
		<div className="flex-grow min-w-0">
			<p className="text-sm font-medium text-gray-500">{label}</p>
			<p className="flex-grow text-base text-gray-800 truncate">{value}</p>
		</div>
	</div>
);

// const LegendItem = ({ color, label }: { color: string; label: string }) => (
// 	<div className="flex items-center gap-2">
// 		<div className={`w-4 h-4 rounded-full ${color}`}></div>
// 		<p className="text-sm text-gray-600">{label}</p>
// 	</div>
// );

const StatCard = ({
	icon,
	count,
	label,
}: {
	icon: ReactNode;
	count: number;
	label: string;
}) => (
	<div className="flex items-center gap-4 p-6 border rounded-xl box-shadow">
		{icon}
		<div>
			<p className="text-base font-medium md:text-lg">{count} Đơn hàng</p>
			<p className="text-sm text-gray-600">{label}</p>
		</div>
	</div>
);

export default UserShipperDetail;
