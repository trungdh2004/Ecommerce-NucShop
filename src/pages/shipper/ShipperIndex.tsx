import MapComponent from "@/components/map/Map";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Marker } from "react-map-gl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useSearchParams } from "react-router-dom";
import { getListOrderMap } from "@/service/shipper";
import { cn } from "@/lib/utils";
import { IOrderShipper } from "@/types/shipper.interface";
import MarketItem from "@/components/shipper/shipperMap/MarketItem";
import useStoreShipper from "@/store/useCurrentShipper";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

const ShipperIndex = () => {
	const {current} = useStoreShipper()
	const [data,setData] = useState<any[]>([])
	const {socket} = useAuth()
	
	const { mutate } = useMutation<IOrderShipper[]>({
		
		mutationFn: async () => {
			try {
				const { data } = await getListOrderMap();
				setData(data);
				return data
			} catch (error) {
				return [];
			}
		},
	});
	
	const [locationCurrent, setLocationCurrent] = useState({
		longitude: 105.62583879555804,
		latitude: 21.046006645820455,
		zoom: 15.5,
	});

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((data) => {
			setLocationCurrent({
				longitude: data.coords.longitude,
				latitude: data.coords.latitude,
				zoom: 15.5,
			});
		});
		mutate()

		if(socket) {
			socket.on("newOrderShipper",(order:any) => {
				setData(prev => {
					return [...prev,order]
				})
				toast.success("Bạn vừa có đơn hàng mới")
			})
		}
	}, []);


	return (
		<div className="w-full h-full relative">
			<MapComponent
				height="100vh"
				longitude={locationCurrent.longitude}
				latitude={locationCurrent.latitude}
			>
				<Marker
					longitude={locationCurrent.longitude}
					latitude={locationCurrent.latitude}
					anchor="bottom"
				>
					{/* <FaMapMarkerAlt size={20} className="text-red-500" /> */}
					<div className="relative flex items-center justify-center">
						<div className="relative size-10 rounded-full flex justify-center items-center bg-red-500 z-10">
							<img
								src={current?.avatar || "/avatar_25.jpg"}
								alt=""
								className="size-8 rounded-full object-cover"
							/>
						</div>
						<div className="absolute size-4 -bottom-1 bg-red-500 rotate-45 z-0"></div>
					</div>
				</Marker>
				{data &&
					data?.map((item: IOrderShipper) => {
						const location = item?.address?.location?.coordinates;
						return (
							<MarketItem order={item} location={location} />
						);
					})}
			</MapComponent>
		</div>
	);
};

export default ShipperIndex;
