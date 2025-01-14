import SelectComponent from "@/components/common/SelectComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { getAllCate } from "@/service/category-admin";
import { getAllColor } from "@/service/color";
import { getAllSize } from "@/service/size-admin";
import { ICategory } from "@/types/category";
import { IColor, ISize } from "@/types/variants";
import { useEffect, useState } from "react";
import { IoFilter } from "react-icons/io5";
import numeral from "numeral";
import { IFilterProduct } from "@/types/product";
import { GrPowerReset } from "react-icons/gr";
import { TooltipComponent } from "@/components/common/TooltipComponent";
import { FaSortAmountDownAlt, FaSortAmountUp } from "react-icons/fa";

interface IProps {
	onSubmit: (obj: IFilterProduct) => void;
}

interface IListName {
	value: string;
	label: string;
}

interface IData {
	category: {
		_id: string;
		name: string;
	};
	min: string;
	max: string;
	color: IColor[] | [];
	size: ISize[] | [];
	sort: -1 | 1;
	fieldSort: IListName;
}

const listField: IListName[] = [
	{
		value: "price",
		label: "Giá",
	},
	{
		value: "discount",
		label: "Giá KM",
	},
	{
		value: "quantity",
		label: "Số lượng",
	},
	{
		value: "quantitySold",
		label: "Số lượng bán",
	},
];

const ProductFilter = ({ onSubmit }: IProps) => {
	const [categorys, setCategorys] = useState<ICategory[]>([]);
	const [colors, setColors] = useState<IColor[]>([]);
	const [sizes, setSize] = useState<ISize[]>([]);
	const [data, setData] = useState<IData>({
		category: {
			_id: "",
			name: "",
		},
		min: "",
		max: "",
		color: [],
		size: [],
		sort: -1,
		fieldSort: {
			value: "",
			label: "",
		},
	});

	useEffect(() => {
		(async () => {
			const { data } = await getAllCate();
			setCategorys(data.data);
		})();
	}, []);
	useEffect(() => {
		(async () => {
			const { data } = await getAllColor();
			setColors(data.data);
		})();
	}, []);
	useEffect(() => {
		(async () => {
			const { data } = await getAllSize();
			setSize(data.data);
		})();
	}, []);

	const handleSubmit = () => {
		const value = {
			category: data.category?._id || null,
			min: data.min ? +data.min.replace(/,/g, "") : null,
			max: data.max ? +data.max.replace(/,/g, "") : null,
			color: data.color?.map((item) => item._id),
			size: data.size?.map((item) => item._id),
			fieldSort: data.fieldSort.value,
			sort: data.sort,
		};
		onSubmit(value as IFilterProduct);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div className="p-2 rounded-full hover:bg-[#e9e9e9]">
					<IoFilter size={20} className="cursor-pointer" />
				</div>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				side="bottom"
				className="md:min-w-[400px] max-w-[80wh] p-2 "
			>
				<div className="grid grid-cols-2 gap-2">
					<SelectComponent<ICategory>
						value={data?.category as any}
						label="Danh mục"
						onChange={(newValue: ICategory | null, action) => {
							if (action.action === "select-option") {
								setData((prev) => ({
									...prev,
									category: {
										_id: newValue?._id as string,
										name: newValue?.name as string,
									},
								}));
							}
							if (action.action === "clear") {
								setData((prev) => ({
									...prev,
									category: {
										_id: "",
										name: "",
									},
								}));
							}
						}}
						options={categorys}
						getOptionLabel={(option) => option?.name}
						getOptionValue={(option) => option?._id}
					/>
					<div className="">
						<Label htmlFor="category">Giá tiền</Label>
						<div className="grid grid-cols-5 ">
							<Input
								className="col-span-2 p-1 rounded"
								value={data.min}
								onChange={(e) => {
									const numericValue = e.target.value.replace(/[^0-9]/g, "");
									const rawValue = numericValue.replace(/,/g, "");
									setData((prev) => ({
										...prev,
										min: numeral(rawValue).format("0,0"),
									}));
								}}
							/>
							<div className="flex items-center justify-center col-span-1">
								-&gt;
							</div>
							<Input
								className="col-span-2 p-1 rounded"
								value={data.max}
								onChange={(e) => {
									const numericValue = e.target.value.replace(/[^0-9]/g, "");
									const rawValue = numericValue.replace(/,/g, "");
									setData((prev) => ({
										...prev,
										max: numeral(rawValue).format("0,0"),
									}));
								}}
							/>
						</div>
					</div>
					<div className="col-span-2">
						<SelectComponent<IColor>
							value={data.color}
							label="Màu"
							isMulti
							onChange={(newValue: IColor[]) => {
								setData((prev) => ({
									...prev,
									color: newValue,
								}));
							}}
							placeholder="Màu"
							options={colors}
							getOptionLabel={(option) => {
								return (
									<div className="flex items-center justify-between w-full">
										{option.name}{" "}
										<p
											className="w-2 h-2 ml-1 rounded-full"
											style={{
												backgroundColor: option.code,
											}}
										></p>
									</div>
								);
							}}
							getOptionValue={(option) => option?._id as string}
						/>
					</div>
					<div className="col-span-2">
						<SelectComponent<ISize>
							value={data.size}
							label="Màu"
							isMulti
							onChange={(newValue: ISize[]) => {
								setData((prev) => ({
									...prev,
									size: newValue,
								}));
							}}
							placeholder="Kích cỡ"
							options={sizes}
							getOptionLabel={(option) => option?.name}
							getOptionValue={(option) => option?._id as string}
						/>
					</div>
					<div className="col-span-1">
						<SelectComponent<IListName>
							value={data.fieldSort}
							label="Sắp xếp theo"
							onChange={(newValue: IListName | null, action) => {
								if (action.action === "select-option") {
									setData((prev) => ({
										...prev,
										fieldSort: {
											value: newValue?.value as string,
											label: newValue?.label as string,
										},
									}));
								}
								if (action.action === "clear") {
									setData((prev) => ({
										...prev,
										fieldSort: {
											value: "",
											label: "",
										},
									}));
								}
							}}
							options={listField}
						/>
					</div>
					<div className="col-span-1">
						<Label>Sắp xếp</Label>
						<Button
							variant={"ghost"}
							className="w-full space-x-1 h-[38px] border"
							onClick={() => {
								setData((prev) => ({
									...prev,
									sort: prev.sort === 1 ? -1 : 1,
								}));
							}}
						>
							{data.sort === -1 ? (
								<FaSortAmountDownAlt size={20} />
							) : (
								<FaSortAmountUp size={20} />
							)}
							<span className="">
								{data.sort === -1 ? "Giảm dần" : "Tăng dần"}
							</span>
						</Button>
					</div>
					<div className="flex justify-end col-span-2 gap-2">
						<TooltipComponent label="Mặc định">
							<Button
								variant={"destructive"}
								onClick={() => {
									setData({
										category: {
											_id: "",
											name: "",
										},
										min: "",
										max: "",
										color: [],
										size: [],
										fieldSort: {
											label: "",
											value: "",
										},
										sort: data.sort,
									});
									onSubmit({
										category: "",
										min: null,
										max: null,
										size: [],
										color: [],
										fieldSort: "",
										sort: data.sort,
									});
								}}
							>
								<GrPowerReset className="" size={20} />
							</Button>
						</TooltipComponent>
						<Button
							className="text-white bg-blue-500 hover:bg-blue-600"
							onClick={handleSubmit}
						>
							Tìm kiếm
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default ProductFilter;
