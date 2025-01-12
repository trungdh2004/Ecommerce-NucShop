import { SearchObjectTypeProduct } from "@/types/searchObjecTypes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReactSlider from "react-slider";
import { useDebounceValue } from "usehooks-ts";
interface Props {
	setSearchParamsObject: Dispatch<SetStateAction<SearchObjectTypeProduct>>;
	searchParamsObject: SearchObjectTypeProduct;
}
const Price = ({ setSearchParamsObject, searchParamsObject }: Props) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [values, setValues] = useState([
		(searchParamsObject.min as number) || 0,
		(searchParamsObject.max as number) || 5000000,
	]);
	const [debouncedValues] = useDebounceValue(values, 1000);
	const [check, setCheck] = useState(true);
	const handleSearchPrice = (values: number[]) => {
		setValues(values);
	};
	useEffect(() => {
		if (check) {
			setCheck(false);
			return;
		} else {
			setValues([
				searchParamsObject.min as number,
				searchParamsObject.max as number,
			]);
			setCheck(true);
			return;
		}
	}, [searchParams, setSearchParams]);
	useEffect(() => {
		if (check) {
			setCheck(false);
			return;
		}
		const [minPriceSearch, maxPriceSearch] = debouncedValues;
		searchParams.set("min", (minPriceSearch as number).toString());
		searchParams.set("max", (maxPriceSearch as number).toString());
		searchParams.set("pageIndex", "1");
		setSearchParams(searchParams);
		setSearchParamsObject((prev) => ({
			...prev,
			min: minPriceSearch,
			max: maxPriceSearch,
			pageIndex: 1,
		}));
	}, [debouncedValues]);
	return (
		<div className="flex flex-col w-full gap-3 py-1 lg:py-2">
			<h3 className="py-1 font-semibold leading-7 tracking-wide text-uppercase lg:text-base md:text-sm sm:text-xs">
				Khoảng giá
			</h3>
			<div className="py-5">
				<ReactSlider
					step={1000}
					className="horizontal-slider [&>.example-track-1]:bg-custom [&>.example-thumb]:border-custom  [&>.example-thumb]:bg-custom-100"
					thumbClassName="example-thumb"
					trackClassName="example-track"
					min={0}
					max={5000000}
					value={values}
					onChange={handleSearchPrice}
					pearling
					minDistance={1}
				/>
			</div>
			<div className="flex justify-between">
				<p className="text-xs lg:text-sm">
					{debouncedValues[0].toLocaleString()}đ
				</p>
				<p className="text-xs lg:text-sm">
					{debouncedValues[1].toLocaleString()}đ
				</p>
			</div>
			<hr />
		</div>
	);
};

export default Price;
