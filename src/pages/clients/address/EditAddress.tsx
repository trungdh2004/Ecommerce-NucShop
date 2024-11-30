import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
	callCity,
	callCommune,
	callDistrict,
	editAddress,
	getAddressById,
} from "@/service/address";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AddressLocation from "./AddressLocation";
import MapComponent from "@/components/map/Map";
import MapSearchLocation from "@/components/map/MapSearchLocation";
import { ICity, ICommune, IDistrict } from "@/types/address";

const formSchema = z.object({
	username: z
		.string({
			message: "Bạn phải nhập họ tên",
		})
		.min(0, {
			message: "Bạn phải nhập họ tên",
		}),
	phone: z
		.string({
			message: "Bạn phải nhập số điện thoại",
		})
		.min(10, {
			message: "Bạn phải nhập ít nhất 10 kí tự",
		})
		.max(10, {
			message: "Bạn phải nhập ít nhất 10 kí tự",
		})
		.startsWith("0", {
			message: "Không hợp lệ",
		})
		.trim(),
	address: z.string({
		message: "Bạn phải nhập địa chỉ",
	}),
	city: z.object({
		idProvince: z.string(),
		name: z.string(),
	}),
	district: z.object({
		idDistrict: z.string(),
		name: z.string(),
	}),
	commune: z.object({
		idCommune: z.string(),
		name: z.string(),
	}),
	detailAddress: z.string({
		message: "Bạn chưa nhập chi tiết",
	}),
	location: z.array(z.number()),
});

interface IProps {
	open: boolean;
	id: string;
	handleClose: () => void;
}

const EditAddress = ({ open, handleClose, id }: IProps) => {
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: async (dataNew: any) => editAddress({ id, dataNew }),
		onSuccess: () => {
			toast.success("Bạn cập nhật địa chỉ thành công");
			queryClient.invalidateQueries({
				queryKey: ["address"],
			});
			handleClose();
		},
		onError: () => {
			handleClose();
			toast.error("Bạn cập nhật địa chỉ thất bại");
		},
	});
	const { data: citys = [], isLoading } = useQuery<ICity[]>({
		queryKey: ["city"],
		queryFn: async () => {
			const { data } = await callCity();
			return data;
		},
		staleTime: Infinity,
	});
	const [districts, setDistricts] = useState<IDistrict[]>([]);
	const [commune, setCommune] = useState<ICommune[]>([]);
	const form = useForm({
		resolver: zodResolver(formSchema),
	});
	const [query, setQuery] = useState("");
	const [initView, setInitView] = useState({
		longitudeInit: null,
		latitudeInit: null,
	});

	useEffect(() => {
		const fetchAlldata = async () => {
			const { data } = await getAddressById(id);
			form.reset({
				username: data.data.username,
				phone: data.data.phone,
				address: data.data.address,
				city: data.data.city,
				district: data.data.district,
				commune: data.data.commune,
				detailAddress: data.data.detailAddress,
				location: data.data.location.coordinates,
			});
			if (Array.isArray(data.data.location.coordinates)) {
				setInitView({
					longitudeInit: data.data.location.coordinates[0],
					latitudeInit: data.data.location.coordinates[1],
				});
			}
			const [{ data: district }, { data: commune }] = await Promise.all([
				callDistrict(data?.data?.city.idProvince),
				callCommune(data?.data?.district.idDistrict),
			]);
			setDistricts(district);
			setCommune(commune);
		};
		fetchAlldata();
	}, [id]);

	const onSubmit = async (dataForm: any) => {
		mutate(dataForm);
	};

	const handleOnChangeCity = async (value: ICity) => {
		try {
			form.setValue("city", value);
			form.setValue("address", value.name);
			setDistricts([]);
			const { data } = await callDistrict(value.idProvince);
			setDistricts(data);
			setCommune([]);
		} catch (error: any) {
			toast.error(error.response!.data!.message);
		}
	};

	const handleOnChangeDistrict = async (value: IDistrict) => {
		try {
			form.setValue("district", value);
			form.setValue("commune", null);
			const address = form.getValues("city")?.name;
			form.setValue("address", `${value.name},${address}`);
			const { data } = await callCommune(value.idDistrict);
			setCommune(data);
		} catch (error: any) {
			toast.error(error.response!.data!.message);
		}
	};

	const handleOnChangeCommune = (value: ICommune) => {
		const address = `${value.name},${form.watch("district")?.name},${form.watch("city").name}`;
		setQuery(address);
		form.setValue("address", address);
		form.setValue("commune", value);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="w-[90%] sm:max-w-[660px] rounded-md max-h-[90vh] p-2 sm:p-4 overflow-y-auto">
				<h2 className="text-xl font-bold mb-2">Cập nhật địa chỉ</h2>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
						<div className="flex flex-row gap-3 w-full">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel className="">Tên người nhận</FormLabel>
										<FormControl>
											<Input
												placeholder="Họ và Tên"
												{...field}
												className="border rounded-xl"
											/>
										</FormControl>
										<FormMessage className="" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel className="">Số điện thoại</FormLabel>
										<FormControl>
											<Input
												placeholder="Số điện thoại"
												{...field}
												className="border rounded-xl"
											/>
										</FormControl>
										<FormMessage className="" />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="address"
							render={({ field }) => {
								return (
									<FormItem className="">
										<FormLabel className="">Xã, Huyện, Thành phố </FormLabel>
										<AddressLocation
											field={field}
											citys={citys}
											districts={districts}
											commune={commune}
											iCity={form.watch("city")}
											idDistrict={form.watch("district")}
											idCommune={form.watch("commune")}
											handleOnChangeCity={handleOnChangeCity}
											handleOnChangeDistrict={handleOnChangeDistrict}
											handleOnChangeCommune={handleOnChangeCommune}
											classContent={"max-[350px]:w-[260px]"}
										/>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="location"
							render={({ field }) => {
								return (
									<FormItem className="">
										<div className="w-full h-[240px]">
											<MapSearchLocation
												height="240px"
												query={query}
												handleGetLocation={(value) => {
													form.setValue("location", value);
												}}
												longitudeInit={initView.longitudeInit}
												latitudeInit={initView.latitudeInit}
											/>
										</div>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="detailAddress"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel className="">Địa chỉ chi tiết</FormLabel>
									<FormControl>
										<Input
											placeholder="Nhập địa chỉ chi tiết"
											{...field}
											className="border rounded-xl"
										/>
									</FormControl>
									<FormMessage className="" />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="border rounded-full w-[170px] bg-slate-950"
						>
							Cập nhật địa chỉ
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default EditAddress;
