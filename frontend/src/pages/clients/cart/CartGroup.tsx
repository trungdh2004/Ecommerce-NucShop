import { Checkbox } from "@/components/ui/checkbox";
import useCart from "@/store/cart.store";
import { ICart } from "@/types/cart";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import CartItem from "./CartItem";

interface CartGroupProps {
	cart: ICart;
	groupChecked: boolean;
	onGroupCheckedChange: (productId: string) => void;
	onItemCheckedChange: (productId: string, itemId: string) => void;
	checkedState: Record<string, boolean>;
}

const CartGroup = ({
	cart,
	groupChecked,
	onGroupCheckedChange,
	onItemCheckedChange,
	checkedState,
}: CartGroupProps) => {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [editingItemId, setEditingItemId] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const { setItemCart } = useCart();
	const toggleEdit = useCallback(
		(id: string) => {
			setIsEditing((prev) => !prev);
			if (isEditing) {
				setEditingItemId(id);
			}
		},
		[isEditing],
	);

	const handleDragEnd = useCallback(
		(itemId: string, info: any) => {
			if (isMobile && info.offset.x < -40) {
				setEditingItemId(itemId);
			} else {
				setEditingItemId(null);
			}
		},
		[isMobile],
	);

	return (
		<div className="mb-3 bg-white">
			<div className="flex items-center px-3 py-2 border-b border-gray-200 h-14 md:px-5">
				<div className="group flex md:flex-row-reverse min-w-[36px] md:min-w-[58px] md:pl-5 md:pr-3">
					<Checkbox
						checked={groupChecked}
						onCheckedChange={() =>
							onGroupCheckedChange(cart.product._id as string)
						}
						className="data-[state=checked]:bg-custom-500 border-gray-300 data-[state=checked]:border-red-500"
					/>
				</div>
				<div className="flex items-center justify-between w-full min-w-0">
					<Link
						to={`/shop/detail/${decodeURI(cart?.product?.slug as string)}`}
						className="truncate text-sm md:text-base max-w-[70%] sm:max-w-[80%] md:max-w-full text-black hover:underline "
					>
						{cart?.product?.name}
					</Link>
					<button
						onClick={() => toggleEdit(cart?.product?._id as string)}
						className="text-sm text-custom md:hidden"
					>
						{editingItemId == cart?.product?._id ? "Xong" : "Sửa"}
					</button>
				</div>
			</div>
			<div className="space-y-2">
				{cart?.items?.map((item) => {
					const attributeAlreadyExists = cart?.items?.reduce(
						(acc, p) => {
							if (p._id !== item._id) {
								const colorId = (p?.attribute?.color as any)?._id;
								const sizeId = (p?.attribute?.size as any)?._id;
								if (
									colorId &&
									colorId !== (item?.attribute?.color as any)?._id &&
									!acc.listColor.includes(colorId)
								) {
									acc.listColor.push(colorId);
								}
								if (
									sizeId &&
									sizeId !== (item?.attribute?.size as any)?._id &&
									!acc.listSize.includes(sizeId)
								) {
									acc.listSize.push(sizeId);
								}
							}
							return acc;
						},
						{ listColor: [] as string[], listSize: [] as string[] },
					);

					return (
						<div
							className="relative w-full overflow-hidden shadow-sm bg-gray-50"
							key={item?._id}
						>
							<div
								onClick={() => setItemCart(item)}
								className="absolute inset-y-0 top-[1.5px] bottom-[1.5px] right-0 w-20 bg-custom-500 flex items-center justify-center"
							>
								<button className="w-full h-full text-white">Xoá</button>
							</div>

							<motion.div
								drag={isMobile ? "x" : false}
								dragConstraints={{ left: -80, right: 0 }}
								dragElastic={0.1}
								onDragEnd={(_, info) => handleDragEnd(item._id as string, info)}
								animate={{
									x: isEditing || editingItemId === item._id ? -80 : 0,
								}}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 30,
								}}
								className="relative p-3 bg-white md:px-5"
							>
								<CartItem
									cart={cart}
									listSizeAndColor={{
										listSize: cart?.listSize as any,
										listColor: cart?.listColor as any,
									}}
									attributeAlreadyExists={attributeAlreadyExists}
									item={item}
									productId={cart.product._id as string}
									checked={checkedState[item._id as string]}
									onCheckedChange={onItemCheckedChange}
									checkAttribute={cart.attributes.length > 0}
								/>
							</motion.div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default CartGroup;
