import { formatCurrency } from "@/common/func";
import { ProductOrderItem } from "@/types/order";
import { IoIosResize } from "react-icons/io";
import { IoColorFillOutline } from "react-icons/io5";
interface Props {
	productItem: ProductOrderItem;
}
const ProductItemOrder = ({ productItem }: Props) => {
	return (
		<>
			<div className="flex items-center justify-between max-w-full">
				<div className="flex items-center gap-3">
					<img
						src={productItem?.thumbnail}
						alt=""
						className="w-[90px] lg:h-[90px] h-[110px] object-cover"
					/>
					<div className="flex flex-col gap-2">
						<h3 className="font-semibold w-[230px] truncate">
							{productItem?.name}
						</h3>
						{productItem?.is_simple === true ? (
							<h3 className="text-[#727272] text-sm">Sản phẩm đơn giản</h3>
						) : (
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-1">
									<IoColorFillOutline />
									<p className="text-sm lg:text-base">
										{productItem.attribute.color.name}
									</p>
								</div>
								<div className="w-[1px] h-5 bg-black"></div>
								<div className="flex items-center gap-1">
									<IoIosResize />
									<p className="text-sm lg:text-base">
										{productItem.attribute.size.name}
									</p>
								</div>
							</div>
						)}

						<div className="block lg:hidden md:block">
							<p className="text-sm">Số lượng : x{productItem.quantity}</p>
						</div>
						<div className="block lg:hidden md:block">
							<p className="text-sm">
								Giá tiền : {formatCurrency(productItem.discount)}
							</p>
						</div>
						<div className="block lg:hidden md:block">
							<p className="text-sm">
								Thành tiền :{" "}
								{formatCurrency(productItem.discount * productItem.quantity)}
							</p>
						</div>
					</div>
				</div>

				<div className="hidden lg:block md:hidden">
					<p>x{productItem.quantity}</p>
				</div>
				<div className="hidden lg:block md:hidden">
					<p>{formatCurrency(productItem.discount)}</p>
				</div>
				<div className="hidden lg:block md:hidden">
					<p>{formatCurrency(productItem.discount * productItem.quantity)}</p>
				</div>
			</div>
			<hr />
		</>
	);
};

export default ProductItemOrder;
