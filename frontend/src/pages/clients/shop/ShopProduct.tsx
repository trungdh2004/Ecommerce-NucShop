import Paginations from "@/components/common/Pagination";
import Product from "@/components/common/Product";
import { ScrollArea } from "@/components/ui/scroll-area";
import { pagingProduct } from "@/service/product";
import { SearchObjectTypeProduct } from "@/types/searchObjecTypes";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Category from "./Category";
import Color from "./Color";
import Price from "./Price";
import ProductEmpty from "./ProductEmpty";
import ProductSkeleton from "./ProductSkeleton";
import SearchProductMobile from "./SearchProductMobile";
import SelectSort from "./SelectSort";
import Size from "./Size";
import SortFilterStar from "./SortFilterStar";

const ShopProduct = () => {
	const [_, setPageIndex] = useState(1);
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchParamsObject, setSearchParamsObject] =
		useState<SearchObjectTypeProduct>(() => {
      const paramsObject: any = Object.fromEntries(searchParams.entries());
      console.log(paramsObject);
      
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
				pageIndex: paramsObject?.pageIndex | 1,
				pageSize: 12,
				keyword: "",
				color: colorCheck,
				size: sizeCheck,
				sort: 1,
				fieldSort: "",
				category: paramsObject?.category,
				min: parseInt(paramsObject?.min) ?? 0,
				max: parseInt(paramsObject?.max) ?? 5000000,
				tab: 1,
				rating: null,
			};
		});
	useEffect(() => {
		if (!searchParams.toString()) {
			setSearchParamsObject(() => {
				return {
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
					rating: null,
				};
			});
		}
	}, [searchParams]);

	const {
		data: productShop,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["productShop", searchParamsObject],
		queryFn: async () => {
			const { data } = await pagingProduct(searchParamsObject);
			return data;
		},
	});
	if (isError) return <p>Error occurred!</p>;
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
								}}
								forcePage={searchParamsObject.pageIndex - 1}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ShopProduct;
