import { TooltipComponent } from "@/components/common/TooltipComponent";
import MapComponent from "@/components/map/Map";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getLocation, updateLocation } from "@/service/location";
import { useProcessBarLoadingEventNone } from "@/store/useSidebarAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiLocationOn } from "react-icons/ci";
import { FaMapMarkerAlt } from "react-icons/fa";
import { SlNote } from "react-icons/sl";
import { Marker, MarkerDragEvent } from "react-map-gl";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
	long: z.string().nonempty(),
	lat: z.string().nonempty(),
});

interface IViewState {
	longitude: number;
	latitude: number;
	zoom: number;
}

const LocationIndex = () => {
	const { setOpenProcessLoadingEventNone, setCloseProcessLoadingEventNone } =
		useProcessBarLoadingEventNone();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			long: "",
			lat: "",
		},
	});

	const [viewState, setViewState] = useState<IViewState>({
		latitude: 21.046006645820455,
		longitude: 105.62583879555804,
		zoom: 15.5,
	});

	const [marker, setMarker] = useState({
		latitude: 21.046006645820455,
		longitude: 105.62583879555804,
		zoom: 15,
	});
	const onMarkerDragStart = useCallback(() => {}, []);

	const onMarkerDrag = useCallback((event: MarkerDragEvent) => {
		setMarker({
			longitude: event.lngLat.lng,
			latitude: event.lngLat.lat,
			zoom: 15,
		});
	}, []);

	const onMarkerDragEnd = useCallback((event: MarkerDragEvent) => {
		// handleGetLocation([event?.lngLat?.lng, event?.lngLat?.lat]);
		const value = event.lngLat;
		form.setValue("long", `${value?.lng}`);
		form.setValue("lat", `${value?.lat}`);
	}, []);

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
		setMarker({
			longitude: +values?.long,
			latitude: +values?.lat,
			zoom: 15,
		});

		setViewState({
			longitude: +values?.long,
			latitude: +values?.lat,
			zoom: 15,
		});
	}

	const handleUpdate = async () => {
		setOpenProcessLoadingEventNone();
		try {
			 await updateLocation({
				long: marker.longitude,
				lat: marker.latitude,
			});
			toast.success("Cập nhập vị trí thành công");
		} catch (error) {
			toast.error("Cập nhập vị trí thất bại");
		} finally {
			setCloseProcessLoadingEventNone();
		}
	};

	useEffect(() => {
		(async () => {
			try {
				const { data } = await getLocation();
				console.log({ data });
				form.reset({
					long: data?.long,
					lat: data?.lat,
				});
				setMarker({
					longitude: data?.long,
					latitude: data?.lat,
					zoom: 15,
				});
				setViewState({
					longitude: data?.long,
					latitude: data?.lat,
					zoom: 15,
				});
			} catch (error) {}
		})();
	}, []);
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between w-full gap-3">
				<div className="flex items-center gap-2">
					<h4 className="text-base font-medium md:text-xl">Vị trí cửa hàng</h4>

					<TooltipComponent label="Tìm vị trí trên google map và copy kinh độ vĩ độ chính xác cửa hàng">
						<div className="cursor-pointer">
							<SlNote size={20} />
						</div>
					</TooltipComponent>
				</div>
				<div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex items-center gap-2 "
						>
							<FormField
								control={form.control}
								name="lat"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												{...field}
												type="string"
												onChange={(event) => {
													let value = event?.target?.value;
													console.log("value", value);

													if (value) {
														value = value.replace(/[^0-9.,]/g, "");
													}
													const reslip = value?.split(",");
													if (reslip?.length > 1) {
														field.onChange(reslip[0]);
														form.setValue("long", reslip[1]);
													} else {
														field.onChange(reslip[1]);
													}
												}}
												placeholder="Vĩ độ"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<div>-</div>
							<FormField
								control={form.control}
								name="long"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												{...field}
												type="string"
												onChange={(event) => {
													let value = event?.target?.value;
													if (value) {
														value = value.replace(/[^0-9.,]/g, "");
													}
													const reslip = value?.split(",");
													if (reslip?.length > 1) {
														field.onChange(reslip[1]);
														form.setValue("lat", reslip[0]);
													} else {
														field.onChange(reslip[0]);
													}
												}}
												placeholder="Kinh độ"
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								variant={"outline"}
								className="border-blue-500 "
							>
								<CiLocationOn className="mr-2 text-blue-500" size={20} />{" "}
								<span className="text-blue-500">Tìm kiếm</span>
							</Button>
						</form>
					</Form>
				</div>
			</div>
			{/* <div className="flex items-center gap-2">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex items-center gap-2 "
					>
						<FormField
							control={form.control}
							name="long"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Kinh độ</FormLabel>
									<FormControl>
										<Input
											{...field}
											onChange={(value) => {
												field.onChange(+value.target.value);
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lat"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Vĩ độ</FormLabel>
									<FormControl>
										<Input
											{...field}
											onChange={(value) => {
												field.onChange(+value.target.value);
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button type="submit" variant={"outline"} className="border-blue">
							Tìm kiếm
						</Button>
					</form>
				</Form>
			</div> */}
			<div className="border w-full min-h-[500px] border-blue-500">
				<MapComponent
					height="500px"
					longitude={viewState.longitude}
					latitude={viewState.latitude}
					zoom={viewState.zoom}
				>
					<Marker
						longitude={marker.longitude}
						latitude={marker.latitude}
						anchor="bottom"
						draggable
						onDragStart={onMarkerDragStart}
						onDrag={onMarkerDrag}
						onDragEnd={onMarkerDragEnd}
					>
						<FaMapMarkerAlt size={20} />
					</Marker>
				</MapComponent>
			</div>

			<div className="flex justify-between w-full gap-4">
				<div className="flex-1">
					Tọa độ hiện tại : {marker?.latitude} - {marker?.longitude}
				</div>
				<Button
					className="bg-blue-500 hover:bg-blue-400"
					onClick={handleUpdate}
				>
					<CiLocationOn size={20} className="mr-2" /> Lưu vị trí
				</Button>
			</div>
		</div>
	);
};

export default LocationIndex;
