import React, { useState } from "react";
import SelectPagingComponent from "@/components/common/SelectPagingComponent";
const Test = () => {
	const [value, setValue] = useState<any>();
	return (
		<div className="w-[500px]">
			<SelectPagingComponent<any>
				value={value}
				onChange={(e) => {
					console.log(e);
				}}
				url="product/paging"
				label="test.1-100"
				getOptionLabel={(option) => {
					return (
            <div className="flex
            ">
              <img src={option.thumbnail} alt="" className="w-8 h-8" />
              <span className="ml-2">{option.name}</span>
						</div>
					);
				}}
				getOptionValue={(option) => {
					return option._id;
				}}
				
			/>
		</div>
	);
};

export default Test;
