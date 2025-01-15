import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { callCity } from "@/service/address";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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

interface IProps {
	field: FieldValues;
	citys: ICity[];
	districts: IDistrict[];
	commune: ICommune[];
	handleOnChangeCity: (value: ICity) => void;
	handleOnChangeDistrict: (value: IDistrict) => void;
	handleOnChangeCommune: (value: ICommune) => void;
	classContent?: string;
	iCity?: ICity;
	idDistrict?: IDistrict | null;
	idCommune?: ICommune | null;
}

const AddressLocation = ({
	field,
	districts,
	commune,
	classContent,
	iCity,
	idDistrict,
	idCommune,
	handleOnChangeCity,
	handleOnChangeDistrict,
	handleOnChangeCommune,
}: IProps) => {
	const { data: citys = [] } = useQuery<ICity[]>({
		queryKey: ["city"],
		queryFn: async () => {
			const { data } = await callCity();
			return data;
		},
		staleTime: Infinity,
	});
	const [initValue, setInitValue] = useState("idDistrict");

	useEffect(() => {
		handleOnChangeCity(citys[0]);
	}, [citys]);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div className="w-full cursor-pointer">
					<Input
						{...field}
						readOnly
						placeholder="Nhập vị trí"
						className="w-full cursor-pointer"
					/>
				</div>
			</PopoverTrigger>
			<PopoverContent
				className={cn(
					"max-[350px]:w-[300px]  w-[320px] sm:w-[400px] lg:w-[500px] max-w-full p-1 z-[1000]",
					classContent,
				)}
			>
				<Tabs value={initValue} className="w-full">
					<TabsList className="grid w-full grid-cols-2  bg-white">
						<TabsTrigger
							onClick={() => setInitValue("idDistrict")}
							value="idDistrict"
							disabled={!iCity}
							className="border-b data-[state=active]:border-custom data-[state=active]:text-custom rounded-none"
						>
							Huyện
						</TabsTrigger>
						<TabsTrigger
							onClick={() => setInitValue("idCommune")}
							disabled={!idDistrict}
							value="idCommune"
							className="border-b data-[state=active]:border-custom data-[state=active]:text-custom rounded-none"
						>
							Xã
						</TabsTrigger>
					</TabsList>
					<TabsContent
						value="idDistrict"
						className="max-h-[240px] w-full overflow-y-auto scroll-custom px-1"
					>
						<div>
							{districts?.length > 0 &&
								districts?.map((row) => (
									<button
										className={cn(
											"w-full text-start border-b p-1 cursor-pointer hover:bg-gray-50 text-sm",
											row?.idDistrict === idDistrict?.idDistrict &&
												"bg-gray-100 text-slate-400",
										)}
										onClick={() => {
											handleOnChangeDistrict(row);
											setInitValue("idCommune");
										}}
										disabled={row?.idDistrict === idDistrict?.idDistrict}
									>
										{row?.name}
									</button>
								))}
							{districts?.length === 0 && (
								<div className="h-10 w-full flex items-center justify-center">
									<AiOutlineLoading3Quarters
										size={20}
										className="animate-spin"
									/>
								</div>
							)}
						</div>
					</TabsContent>

					<TabsContent
						value="idCommune"
						className="max-h-[240px] w-full overflow-y-auto scroll-custom px-1"
					>
						<div>
							{commune?.map((row) => (
								<PopoverClose asChild>
									<button
										className={cn(
											"w-full text-start border-b p-1 cursor-pointer hover:bg-gray-50 text-sm",
											row?.idCommune === idCommune?.idCommune &&
												"bg-gray-100 text-slate-400",
										)}
										onClick={() => {
											handleOnChangeCommune(row);
										}}
										disabled={row?.idCommune === idCommune?.idCommune}
									>
										{row?.name}
									</button>
								</PopoverClose>
							))}

							{commune?.length === 0 && (
								<div className="h-10 w-full flex items-center justify-center">
									<AiOutlineLoading3Quarters
										size={20}
										className="animate-spin"
									/>
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</PopoverContent>
		</Popover>
	);
};

export default AddressLocation;
