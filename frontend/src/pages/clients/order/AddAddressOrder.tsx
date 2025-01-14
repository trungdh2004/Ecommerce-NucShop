import { Dialog, DialogContent } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  addAddress,
  callCity,
  callCommune,
  callDistrict,
} from "@/service/address";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// import MapSearchLocation from "@/components/map/MapSearchLocation";
import MapSearchLocation from "@/components/map/MapSearchLocation";
import AddressLocation from "../address/AddressLocation";

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

interface ICity {
	idProvince: string;
	name: string;
}

interface IDistrict {
	idDistrict: string;
	name: string;
}
interface ICommune {
	idCommune: string;
	name: string;
}
interface Props {
	open: boolean;
	closeOpen: (isOpen: boolean) => void;
	handleChangeAddress: (id: string) => void;
	address: any;
}
const AddAddressOrder = ({
	open,
	closeOpen,
	handleChangeAddress,
	address,
}: Props) => {
	const { data: citys } = useQuery<ICity[]>({
		queryKey: ["city"],
		queryFn: async () => {
			const { data } = await callCity();
			return data;
		},
		staleTime: Infinity,
	});

	const { mutate } = useMutation({
		mutationFn: async (dataNew: any) => addAddress(dataNew),
		onSuccess: ({ data }) => {
			queryClient.invalidateQueries({
				queryKey: ["address"],
			});
			toast.success("Bạn thêm địa chỉ thành công");
			if (address?.content?.length === 0) {
				handleChangeAddress(data?.data?._id);
			}
			closeOpen(false);
		},
		onError: () => {
			toast.error("Bạn thêm địa chỉ thất bại");
		},
	});
	const [districts, setDistricts] = useState<IDistrict[]>([]);
	const [commune, setCommune] = useState<ICommune[]>([]);
	const [query, setQuery] = useState("");
	const queryClient = useQueryClient();
	const form = useForm({
		resolver: zodResolver(formSchema),
	});

	const onSubmit = (dataForm: any) => {
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
		form.setValue("address", address);
		form.setValue("commune", value);
		setQuery(address);
	};
	return (
		<Dialog open={open} onOpenChange={closeOpen}>
			<DialogContent className="w-[90%] sm:max-w-[660px] rounded-md max-h-[90vh] p-2 sm:p-4 overflow-y-auto">
				<div className="">
					<h2 className="text-xl font-bold">Thêm địa chỉ</h2>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<div className="flex flex-row w-full gap-3">
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
												citys={citys || []}
												districts={districts}
												commune={commune}
												iCity={form.watch("city")}
												idDistrict={form.watch("district")}
												idCommune={form.watch("commune")}
												handleOnChangeCity={handleOnChangeCity}
												handleOnChangeDistrict={handleOnChangeDistrict}
												handleOnChangeCommune={handleOnChangeCommune}
											/>
											<FormMessage />
										</FormItem>
									);
								}}
							/>

							<FormField
								control={form.control}
								name="location"
								render={() => {
									return (
										<FormItem className="">
											<div className="w-full h-[240px] border">
												<MapSearchLocation
													height="240px"
													query={query}
													handleGetLocation={(value) => {
														form.setValue("location", value);
													}}
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
								Thêm địa chỉ
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddAddressOrder;
