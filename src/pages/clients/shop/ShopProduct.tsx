import { useSearchParams } from "react-router-dom";
import Category from "./Category";
import Color from "./Color";
import Size from "./Size";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pagingProduct } from "@/service/product";
import ProductDisPlay from "./ProductDisPlay";
import { SearchObjectTypeProduct } from "@/types/searchObjecTypes";
import Paginations from "@/components/common/Pagination";
import ProductSkeleton from "./ProductSkeleton";
import Price from "./Price";
import SelectSort from "./SelectSort";
import SearchProductMobile from "./SearchProductMobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import SortFilterStar from "./SortFilterStar";
import Product from "@/components/common/Product";
import ProductEmpty from "./ProductEmpty";

const ShopProduct = () => {
	const [pageIndex, setPageIndex] = useState(1);
	const query = useQueryClient();
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchParamsObject, setSearchParamsObject] =
		useState<SearchObjectTypeProduct>(() => {
			const paramsObject: any = Object.fromEntries(searchParams.entries());
			const colorCheck =
				paramsObject?.color
					?.split(",")
					.map((c: string) => c.trim())
					.filter(Boolean) ?? [];
			const sizeCheck =
				paramsObject?.size
					?.split(",")
					.map((c: string) => c.trim())
					.filter(Boolean) ?? [];
			return {
				pageIndex: pageIndex,
				pageSize: 12,
				keyword: "",
				color: colorCheck,
				size: sizeCheck,
				sort: 1,
				fieldSort: "",
				category: paramsObject?.category,
				min: 0,
				max: 5000000,
				tab: 1,
				rating: null,
			};
		});
	const {
		data: productShop,
		isLoading,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["productShop", searchParamsObject],
		queryFn: async () => {
			const { data } = await pagingProduct(searchParamsObject);
			return data;
		},
		staleTime: 1000 * 60 * 15,
		refetchInterval: 1000 * 60 * 15,
		retry: 2,
	});
	return (
		<div className="padding pt-[40px]">
			<div className="relative grid lg:grid-cols-12 gap-9">
				<div className="col-span-2 lg:col-span-2 lg:block hidden h-[88vh] sticky top-[100px]">
					<ScrollArea className="h-[88vh] rounded-md pb-5 pr-4">
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
				</div>

				<div className="items-center lg:col-span-10 md:col-span-12">
					<div className="flex justify-between">
						<div className="hidden lg:block"></div>
						<SelectSort setSearchParamsObject={setSearchParamsObject} />
						<div className="lg:hidden">
							<SearchProductMobile
								setSearchParamsObject={setSearchParamsObject}
								searchParamsObject={searchParamsObject}
							/>
						</div>
					</div>
					{isLoading ? (
						<ProductSkeleton />
					) : productShop?.content?.length > 0 ? (
						<Product productShop={productShop} />
					) : (
						<ProductEmpty />
					)}
					{/* <Product /> */}
					{productShop?.content?.length > 0 && (
						<div className="flex items-center justify-center py-4">
							<Paginations
								pageCount={productShop?.totalPage}
								handlePageClick={(event: any) => {
									setPageIndex(event.selected + 1);
									setSearchParamsObject((prev) => ({
										...prev,
										pageIndex: event.selected + 1,
									}));
									searchParams.set("pageIndex", event.selected + 1);
									setSearchParams(searchParams);
									query.invalidateQueries({ queryKey: ["productShop"] });
								}}
								forcePage={pageIndex - 1}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ShopProduct;
