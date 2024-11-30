import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React, { useEffect, useState } from "react";
import { IoFilter } from "react-icons/io5";
import { useMediaQuery } from "usehooks-ts";
import Category from "./Category";
import Price from "./Price";
import Color from "./Color";
import Size from "./Size";
import { ScrollArea } from "@/components/ui/scroll-area";
import SortFilterStar from "./SortFilterStar";

const SearchProductMobile = ({
	setSearchParamsObject,
	searchParamsObject,
}: any) => {
	const matches = useMediaQuery("(min-width: 768px)");
	const [isOpen, setClose] = useState(false);
	useEffect(() => {
		if (matches) {
			setClose(false);
		}
	}, [matches]);
	return (
		<div className="mb-7">
			<Sheet open={isOpen} onOpenChange={() => setClose(false)}>
				<div onClick={() => setClose(true)} className="text-2xl cursor-pointer">
					<IoFilter />
				</div>

				<SheetContent side={"top"} className="px-0">
					<ScrollArea className="h-screen rounded-md px-4">
						<Category setSearchParamsObject={setSearchParamsObject} />
						<Price
							setSearchParamsObject={setSearchParamsObject}
							searchParamsObject={searchParamsObject}
						/>
						<Color
							setSearchParamsObject={setSearchParamsObject}
							searchParamsObject={searchParamsObject}
						/>
						<Size setSearchParamsObject={setSearchParamsObject} />
						<SortFilterStar setSearchParamsObject={setSearchParamsObject} />
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default SearchProductMobile;
