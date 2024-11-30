import {
	getCountMyShoppingCart,
	pagingNewCart,
	updateCartItem,
} from "@/service/cart";
import useCart from "@/store/cart.store";
import { ICart, ICartItem } from "@/types/cart";
import { IListColorAttribute, IListSizeAttribute } from "@/types/product";
import { AxiosError } from "axios";
import { useMemo } from "react";
import { toast } from "sonner";
import useDebounce from "./shared";

type TypeExitsColorSizeAttribute = {
	_id?: string;
	listColor?: IListColorAttribute[];
	listSize?: IListSizeAttribute[];
};

const useExitsColorSizeAttribute = (product: TypeExitsColorSizeAttribute) => {
	const listAttribute = useMemo(() => {
		if (!product) return { listColorExist: [], listSizeExist: [] };

		const uniqueList = <T extends { id: string }>(list: T[]) => {
			const map = new Map<string, T>();
			list.forEach((item) => {
				if (!map.has(item.id)) {
					map.set(item.id, item);
				}
			});
			return Array.from(map.values());
		};

		const listColorExist = uniqueList(
			product.listColor?.map((color) => ({
				id: color.colorId,
				colorCode: color.colorCode,
				colorName: color.colorName,
				listSize: Array.from(
					new Set(color.list?.map((item) => item.size?._id).filter(Boolean)),
				) as string[],
			})) || [],
		);

		const listSizeExist = uniqueList(
			product.listSize?.map((size) => ({
				id: size.sizeId,
				sizeName: size.sizeName,
				listColor: Array.from(
					new Set(size.list?.map((item) => item.color?._id).filter(Boolean)),
				) as string[],
			})) || [],
		);

		return { listColorExist, listSizeExist };
	}, [product?._id]);

	return listAttribute;
};
type useUpdateAttributeItemCartType = {
	colorId: string;
	sizeId: string;
	cart?: ICart;
	item: ICartItem;
	setIsOpen: (value: boolean) => void;
	setErrors: ({ color, size }: { color: boolean; size: boolean }) => void;
};
const useUpdateAttributeItemCart = () => {
	const { carts, setCarts } = useCart();
	const updateAttributeItemCart = async ({
		colorId,
		sizeId,
		item,
		cart,
		setIsOpen,
		setErrors,
	}: useUpdateAttributeItemCartType) => {
		try {
			const { color: currentColorId, size: currentSizeId } =
				item?.attribute ?? {};
			if (
				(currentColorId as any)?._id === colorId &&
				(currentSizeId as any)?._id === sizeId
			) {
				setIsOpen(false);
				return;
			}
			const errors = {
				color: !colorId,
				size: !sizeId,
			};

			if (errors.color || errors.size) {
				setErrors(errors);
				return;
			}
			const attribute = cart?.attributes?.find(
				(attr) =>
					(attr.color as any)?._id === colorId &&
					(attr.size as any)?._id === sizeId,
			);
			if (attribute?.quantity && attribute?.quantity == 0) {
				return toast.error(
					`Màu ${(attribute?.color as any)?.name}, Size ${(attribute?.size as any)?.name} tạm thời hết hàng.`,
				);
			}
			const { data } = await updateCartItem(item?._id as string, {
				attribute: attribute?._id,
			});
			const newCarts = carts?.map((cart) => ({
				...cart,
				items: cart?.items?.map((itemCart) =>
					itemCart?._id === item?._id
						? { ...itemCart, attribute: data?.data?.attribute }
						: itemCart,
				),
			}));
			setCarts(newCarts);
			setIsOpen(false);
			setErrors({ color: false, size: false });
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};
	return { updateAttributeItemCart };
};
const useFetchNewProductsInTheCart = () => {
	const { setCartsPreview } = useCart();
	const fetchNewProductsInTheCart = async () => {
		try {
			const { data } = await pagingNewCart({ pageSize: 5 });
			setCartsPreview(data?.content);
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};
	return {
		fetchNewProductsInTheCart,
	};
};

export {
	useExitsColorSizeAttribute,
	useUpdateAttributeItemCart,
	useFetchNewProductsInTheCart,
};
