import {
  convertMeter,
  convertTimeSection,
  formatQuantity,
} from "@/common/localFunction";
import MapComponent from "@/components/map/Map";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Marker } from "react-map-gl";

import DialogConfirm from "@/components/common/DialogConfirm";
import SourcePage from "@/components/map/Source";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { cancelOrder } from "@/service/order";
import { getOrderMapByCode, updateStatusShippedOrder } from "@/service/shipper";
import { AiFillHome } from "react-icons/ai";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";

const ShipperTranSport = () => {
	const { code } = useParams();
	const [isOpen, setIsOpen] = useState(false);
	const matches = useMediaQuery("(min-width: 1024px)");
	const [openConfirm, setOpenConfirm] = useState(false);

	const router = useNavigate();
	const { data, isError } = useQuery({
		queryKey: ["listOrder", code],
		queryFn: async () => {
			try {
				const { data } = await getOrderMapByCode(
					decodeURIComponent(code as string),
				);
				return data;
			} catch (error) {
				router("/shipper");
			}
		},
	});

	const [locationCurrent, setLocationCurrent] = useState(() => {
		let current = {
			longitude: 105.62583879555804,
			latitude: 21.046006645820455,
			zoom: 15.5,
			isLoading: false,
		};

		navigator.geolocation.getCurrentPosition((data) => {
			current = {
				longitude: data.coords.longitude,
				latitude: data.coords.latitude,
				zoom: 15.5,
				isLoading: true,
			};
		});

		return current;
	});
	const [directions, setDirections] = useState({
		distance: 0,
		coords: [],
		duration: 0,
	});
	useEffect(() => {
		if (matches) {
			setIsOpen(false);
		}
	}, [matches]);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((data) => {
			setLocationCurrent({
				longitude: data.coords.longitude,
				latitude: data.coords.latitude,
				zoom: 15.5,
				isLoading: true,
			});
		});
	}, []);

	const getRoute = async (start: number[], end: number[]) => {
		try {
			const res = await fetch(
				`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=pk.eyJ1IjoiZG9odXV0cnVuZyIsImEiOiJjbHVwa20zaDMyZ2ppMmtuem93aDN1eXl3In0.O33vYvx7VEUo7mrZGRbqgA`,
			);
			const data = await res.json();
			const coords = data.routes[0].geometry.coordinates;
			const distance = data.routes[0]?.distance;
			const duration = data.routes[0]?.duration;
			setDirections({
				distance: distance,
				duration: duration,
				coords: coords,
			});
		} catch (error) {}
	};

	useEffect(() => {
		if (locationCurrent.isLoading && data) {
			(async () => {
				try {
					await getRoute(
						[locationCurrent.longitude, locationCurrent.latitude],
						[...data?.data?.address?.location?.coordinates],
					);
				} catch (error) {}
			})();
		}
	}, [locationCurrent.isLoading, data]);

	const location = data?.data?.address?.location?.coordinates;

	const listStatus = [
		{
			status: 1,
			name: "Chưa xác nhận",
		},
		{
			status: 2,
			name: "Giao hàng",
		},
		{
			status: 3,
			name: "Đang giao hàng",
		},
		{
			status: 4,
			name: "Giao hàng lại",
		},
		{
			status: 5,
			name: "Giao thành công",
		},
	];

	if (isError) {
		return <Navigate to={"/shipper"} />;
	}

	const handleSuccessOrder = async () => {
		try {
			 await updateStatusShippedOrder(
				data?.data?._id,
			);
			router("/shipper");
			toast.success("Giao hàng thành công");
		} catch (error) {
			toast.error("Lỗi ");
		}
	};

	const handleCancelOrder = async () => {
		try {
			await cancelOrder(data?.data?._id, null, 3);
			router("/shipper");
		} catch (error) {
			console.log(error);
			toast.error("Lỗi không thể hủy đơn hàng");
		}
	};
	return (
		<div className="relative flex w-full h-full overflow-hidden">
			<Link to={"/shipper"}>
				<div className="fixed z-10 flex items-center justify-center bg-blue-500 rounded-full cursor-pointer top-4 left-4 size-10">
					<AiFillHome size={20} className="text-white" />
				</div>
			</Link>

			<div className={cn("w-full lg:w-4/5 h-full relative overflow-hidden")}>
				<MapComponent
					height="100vh"
					longitude={locationCurrent.longitude}
					latitude={locationCurrent.latitude}
				>
					<SourcePage coord={directions?.coords} />

					<Marker
						longitude={locationCurrent.longitude}
						latitude={locationCurrent.latitude}
						anchor="bottom"
					>
						<FaMapMarkerAlt size={20} className="text-red-500" />
					</Marker>
					{location && (
						<Marker
							longitude={location[0]}
							latitude={location[1]}
							anchor="bottom"
						>
							<FaMapMarkerAlt size={20} className="text-blue-500" />
						</Marker>
					)}
				</MapComponent>
			</div>
			<div
				className={cn(
					"absolute -right-[280px] w-[280px] lg:static flex lg:w-1/5 h-screen bg-blue-200 p-2 sm:p-4 space-y-2  flex-col duration-1000 ease-in-out z-50 border-l border-blue-500",
					isOpen && "right-0",
				)}
			>
				{/* user */}
				<div className="flex w-full p-2 bg-white rounded-md">
					<div className="flex-1">
						<p className="text-sm leading-5 ">
							Tên:{" "}
							<span className="font-medium">
								{data?.data?.address?.username}
							</span>
						</p>
						<p className="text-sm leading-5">
							SĐT:{" "}
							<span className="font-medium">{data?.data?.address?.phone}</span>
						</p>
						<p className="text-sm leading-5">
							Quãng đường:{" "}
							<span className="font-medium">
								{convertMeter(directions.distance)} km
							</span>
						</p>
						<p className="text-sm leading-5">
							Thời gian ước tính:{" "}
							<span className="font-medium">
								{convertTimeSection(directions.duration)}
							</span>
						</p>
					</div>
				</div>

				<div className="w-full p-2 bg-white rounded-md ">
					<p className="text-sm">
						Mã đơn hàng: <span className="font-medium">{data?.data?.code}</span>
					</p>
					<p className="text-sm">
						Tổng giá trị đơn hàng:{" "}
						<span className="font-medium text-red-500">
							{formatQuantity(data?.data?.totalMoney, "đ")}
						</span>
					</p>
					<p className="text-sm">
						Tiền khách trả khi nhận :{" "}
						<span className="font-medium text-red-500">
							{formatQuantity(data?.data?.amountToPay, "đ")}
						</span>
					</p>
					<p className="text-sm">
						Giá ship :{" "}
						<span className="font-medium text-red-500">
							{formatQuantity(data?.data?.shippingCost, "đ")}
						</span>
					</p>
					<p className="text-sm">
						Địa chỉ:{" "}
						<span className="font-medium">{data?.data?.address.address}</span>
					</p>
					<p className="text-sm">
						Trạng thái đơn hàng :{" "}
						<span className="font-medium">
							{
								listStatus?.find((item) => item.status === data?.data.status)
									?.name
							}
						</span>
					</p>
					<p className="text-sm">
						Lời nhắn: <span>{data?.data.note}</span>
					</p>
				</div>

				<div className="flex flex-col flex-1 w-full p-2 overflow-hidden bg-white rounded-md">
					<div className="pb-1 mb-1 text-sm font-medium border-b">
						Tổng số sản phẩm: {data?.data?.orderItems.length} sp
					</div>
					<ScrollArea className="flex-1 w-full ">
						{data?.data?.orderItems.map((itemOrder: any) => (
							<div className="flex py-1">
								<div className="mr-1 size-12">
									<img
										src={itemOrder?.product?.thumbnail}
										alt=""
										className="object-cover w-full h-full"
									/>
								</div>
								<div className="flex flex-col justify-between flex-1">
									<p className="text-sm font-medium leading-3 line-clamp-1">
										{itemOrder?.product?.name}
									</p>
									<p className="text-xs line-clamp-1">
										Loại: {`${itemOrder?.variant}`}
									</p>
									<p className="flex justify-between text-xs line-clamp-1">
										<span>Số lượng: {itemOrder?.quantity}</span>
										<span className="font-medium text-red-500">
											{formatQuantity(itemOrder?.totalMoney, "đ")}
										</span>
									</p>
								</div>
							</div>
						))}
					</ScrollArea>
				</div>

				<Button
					variant={"success"}
					className="w-full"
					onClick={handleSuccessOrder}
				>
					Giao hàng thành công
				</Button>
				<Button
					variant={"danger"}
					className="w-full"
					onClick={() => {
						setOpenConfirm(true);
					}}
				>
					Giao hàng thất bại
				</Button>

				<div
					className="absolute w-6 h-10 -translate-y-1/2 bg-blue-200 border-l border-blue-500 cursor-pointer top-1/2 -left-5 rounded-s-full"
					onClick={() => {
						setIsOpen((prev) => !prev);
					}}
				></div>
			</div>
			<div
				className={cn(
					"absolute w-full h-full z-20 bg-gray-500/30 hidden duration-1000 ease-in-out ",
					isOpen && "block lg:hidden",
				)}
				onClick={() => {
					setIsOpen(false);
				}}
			></div>

			<DialogConfirm
				open={openConfirm}
				handleClose={() => {
					setOpenConfirm(false);
				}}
				title="Xác nhận hủy đơn hàng"
				content="Bạn có chắc chắn muốn hủy đơn hàng do giao hàng thất bại ?"
				status="danger"
				handleSubmit={handleCancelOrder}
				labelConfirm="Xác nhận"
			/>
		</div>
	);
};

export default ShipperTranSport;
