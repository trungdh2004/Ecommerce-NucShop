import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SearchObjectTypeProduct } from "@/types/searchObjecTypes";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
interface Props {
	setSearchParamsObject: Dispatch<SetStateAction<SearchObjectTypeProduct>>;
}
const SelectSort = ({ setSearchParamsObject }: Props) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectValue, setSelectValue] = useState("");
	const query = useQueryClient();
	const navigate = useNavigate();
	const handleReset = () => {
		const defaultParams:SearchObjectTypeProduct = {
			pageIndex: 1,
			pageSize: 12,
			keyword: "",
			color: [],
			size: [],
			sort: 1,
			fieldSort: "",
			category: "",
			min: 0,
			max: 5000000,
			tab: 1,
		};
		setSearchParams(new URLSearchParams({}));
		setSearchParamsObject(defaultParams);
		navigate("/shop", { replace: true });
		setSelectValue("");
		query.invalidateQueries({ queryKey: ["productShop", defaultParams] });
	};
	const handleOnChangeSelect = (value: string) => {
		setSelectValue(value);
		switch (value) {
			case "reset":
				handleReset();
				break;
			case "1":
				searchParams.set("sort", "1");
				setSearchParams(searchParams);
				setSearchParamsObject((prev) => ({ ...prev, sort: 1,fieldSort:"discount" }));
				break;
			case "-1":
				searchParams.set("sort", "-1");
				setSearchParams(searchParams);
				setSearchParamsObject((prev) => ({ ...prev, sort: -1,fieldSort:"discount" }));
				break;
			default:
				break;
		}
	};
	return (
		<div>
			<Select value={selectValue} onValueChange={handleOnChangeSelect}>
				<SelectTrigger className="lg:w-[180px] w-full rounded-full">
					<SelectValue placeholder="Sắp xếp theo" />
				</SelectTrigger>
				<SelectContent updatePositionStrategy={'always'}>
					<SelectGroup>
						<SelectItem
							value="reset"
							className="cursor-pointer hover:font-semibold"
						>
							Mặc định
						</SelectItem>
						<SelectItem
							value="1"
							className="cursor-pointer hover:font-semibold"
						>
							Giá : thấp đến cao
						</SelectItem>
						<SelectItem
							value="-1"
							className="cursor-pointer hover:font-semibold"
						>
							Giá : cao đến thấp
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};

export default SelectSort;
