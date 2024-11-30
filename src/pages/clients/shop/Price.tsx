import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReactSlider from "react-slider";
import { SearchObjectTypeProduct } from "@/types/searchObjecTypes";
import { useDebounceValue } from "usehooks-ts";
import { useQueryClient } from "@tanstack/react-query";
interface Props {
	setSearchParamsObject: Dispatch<SetStateAction<SearchObjectTypeProduct>>;
	searchParamsObject: SearchObjectTypeProduct;
}
const Price = ({ setSearchParamsObject, searchParamsObject }: Props) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const query = useQueryClient();
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
		setSearchParams(searchParams);
		setSearchParamsObject((prev) => ({
			...prev,
			min: minPriceSearch,
			max: maxPriceSearch,
		}));
		query.invalidateQueries({ queryKey: ["productShop"] });
	}, [debouncedValues]);
	return (
		<div className="w-full flex flex-col gap-3 lg:py-2 py-1">
			<h3 className="text-uppercase py-1 font-semibold leading-7 tracking-wide lg:text-base md:text-sm sm:text-xs">
				Khoảng giá
			</h3>
			<div className="py-5">
				<ReactSlider
					step={1000}
					className="horizontal-slider"
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
				<p className="lg:text-sm text-xs">{debouncedValues[0].toLocaleString()}đ</p>
				<p className="lg:text-sm text-xs">{debouncedValues[1].toLocaleString()}đ</p>
      </div>
      <hr />
		</div>
	);
};

export default Price;
