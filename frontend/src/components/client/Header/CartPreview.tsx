import { formatCurrency } from "@/common/func";
import { optimizeCloudinaryUrl } from "@/common/localFunction";
import { cn } from "@/lib/utils";
import { ICartPreview } from "@/types/cart";
import { Link } from "react-router-dom";
type Props = {
	totalCart?: number;
	carts?: ICartPreview[];
};
const CartPreview = ({ totalCart, carts }: Props) => {
	return (
		<div className="">
			<div className="mb-5">
				<p className="text-xs">Sản phẩm mới thêm</p>
			</div>
			<div className="h-auto space-y-3 overflow-x-hidden overflow-y-auto max-h-96">
				{carts?.map((cart) => {
					return (
						<div key={cart?._id} className="flex items-start justify-between">
							<div className="flex items-start gap-1">
								<div className="w-10 h-10 min-w-10 min-h-10 max-w-10 max-h-10">
									<img
										src={optimizeCloudinaryUrl(
											cart?.product?.thumbnail,
											40,
											40,
										)}
										alt=""
										className="object-cover w-full h-full"
									/>
								</div>
								<div>
									<p className="text-sm truncate max-w-40">
										{cart?.product?.name}
									</p>
									<span
										className={cn(
											"text-xs text-gray-400 hidden",
											cart?.attribute && "hidden",
										)}
									>
										Màu {cart?.attribute?.color?.name}, kích thước{" "}
										{cart?.attribute?.size?.name}.
									</span>
								</div>
							</div>
							<p className="text-sm text-red-500">
								{formatCurrency(
									cart?.attribute?.discount || cart?.product?.price,
								)}
							</p>
						</div>
					);
				})}
			</div>
			<div className="flex items-center justify-between mt-3">
				<p className="text-xs capitalize">{totalCart} thêm vào giỏ hàng</p>
				<Link
					to={"/cart"}
					className="text-white text-sm px-5  py-1.5  bg-custom-500 hover:bg-custom-600 rounded"
				>
					Xem giỏ hàng
				</Link>
			</div>
		</div>
	);
};

export default CartPreview;
