import { IColor, IProduct } from "@/types/typeProduct";
import { ISize } from "@/types/variants";
import { TooltipComponent } from "./TooltipComponent";
import ProductV2 from "./ProductV2";

const Product = ({ productShop }: any) => {
	return (
		<div className="w-full pt-9">
			<div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-4 md:grid-cols-3 lg:gap-9 md:gap-7">
				{productShop?.content?.map((product: IProduct) => {
					return <ProductV2 product={product} key={product?._id} />;
				})}
			</div>
		</div>
	);
};

export default Product;

export function ListColorComponent({ listColor }: { listColor: IColor[] }) {
	const count = listColor?.length > 4 ? listColor?.length - 4 : 0;

	return (
		<div className="flex items-center">
			<div className="flex items-center justify-start -space-x-[6px]  *:inline-block  *:rounded-full">
				{listColor?.splice(0, 4)?.map((color: any) => (
					<div key={color._id} className="cursor-pointer">
						<TooltipComponent label={color?.name}>
							<div className="flex items-center justify-center w-4 h-4 bg-white rounded-full ">
								<div
									className="w-3 h-3 rounded-full shadow-[inset_-1px_1px_2px_rgba(0,0,0,0.25)]"
									style={{ backgroundColor: color.code }}
								/>
							</div>
						</TooltipComponent>
					</div>
				))}
			</div>
			{count > 0 && <span className="text-sm font-semibold">+{count}</span>}
		</div>
	);
}
export function ListSizeComponent({ listSize }: { listSize: ISize[] }) {
	const count = listSize?.length > 3 ? listSize?.length - 3 : 0;
	return (
		<div className="flex items-center">
			<div className="flex items-center justify-start gap-x-1">
				{listSize?.slice(0, 3)?.map((size) => (
					<div
						key={size?._id}
						className="flex items-center justify-center px-1.5 border border-gray-500 rounded "
					>
						<p className="text-xs text-gray-500">{size?.name}</p>
					</div>
				))}
			</div>
			{count > 0 && <span className="text-sm font-semibold">+{count}</span>}
		</div>
	);
}
