import { formatCurrency } from "@/common/func";
import ButtonLoading from "@/components/common/ButtonLoading";
import InputQuantity from "@/components/common/InputQuantity";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { useFetchNewProductsInTheCart } from "@/hooks/cart";
import { useCurrentRouteAndNavigation } from "@/hooks/router";
import useCartAnimation from "@/hooks/useCartAnimation";
import { cn } from "@/lib/utils";
import { addProductToCart, buyNowSevices, pagingCartV2 } from "@/service/cart";
import useCart from "@/store/cart.store";
import { IProductDetail } from "@/types/product";
import { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { toast } from "sonner";
import ListColor from "./ListColor";
import ListSize from "./ListSize";

type Props = {
	product?: IProductDetail;
	isLoading?: boolean;
};

interface IStateInfoProduct {
	listColorExist: {
		id: string;
		colorCode: string;
		colorName: string;
		listSize: string[];
	}[];
	listSizeExist: {
		id: string;
		sizeName: string;
		listColor: string[];
	}[];
}

const InfoProduct: React.FC<Props> = ({ product, isLoading = false }) => {
	const { isLoggedIn } = useAuth();
	const navigate = useNavigate();
	const { startAnimation, RenderAnimation } = useCartAnimation();
	const navigateIsLogin = useCurrentRouteAndNavigation();
	const { updateTotalCart, setCarts } = useCart();
	const [stateInfoProduct, setStateInfoProduct] = useState<IStateInfoProduct>({
		listColorExist: [],
		listSizeExist: [],
	});
	const [exitsListSize, setExitsListSize] = useState<string[]>([]);
	const [exitsListColor, setExitsListColor] = useState<string[]>([]);
	const [totalQuantity, setTotalQuantity] = useState(0);
	const [price, setPrice] = useState({
		origin: product?.price,
		discount: product?.discount,
	});
	const [chooseColorId, setChooseColorId] = useState("");
	const [chooseSizeId, setChooseSizeId] = useState("");
	const [attributeId, setAttributeId] = useState("");
	const [purchaseQuantity, setPurchaseQuantity] = useState(1);
	const [isLoadingButton, setIsLoadingButton] = useState({
		isLoadingShopping: false,
		isLoadingBynow: false,
	});
	const [isErrorAttribute, setIsErrorAttribute] = useState<boolean>(false);
	const { fetchNewProductsInTheCart } = useFetchNewProductsInTheCart();
	useMemo(() => {
		const updateQuantityAndAttribute = () => {
			if (chooseColorId && chooseSizeId) {
				const currentAttribute = product?.attributes?.find(
					(attribute) =>
						attribute?.color?._id === chooseColorId &&
						attribute?.size?._id === chooseSizeId,
				);
				setPrice({
					origin: currentAttribute?.price as number,
					discount: currentAttribute?.discount as number,
				});
				setIsErrorAttribute(false);
				setAttributeId(currentAttribute?._id || "");
				setTotalQuantity(currentAttribute?.quantity as number);
			} else if (chooseSizeId) {
				const quantity = product?.listSize?.find(
					(size) => size?.sizeId === chooseSizeId,
				)?.quantity;
				setPrice({
					origin: product?.price as number,
					discount: product?.discount as number,
				});
				setAttributeId("");
				setTotalQuantity(quantity as number);
			} else if (chooseColorId) {
				const quantity = product?.listColor?.find(
					(color) => color?.colorId === chooseColorId,
				)?.quantity;
				setPrice({
					origin: product?.price as number,
					discount: product?.discount as number,
				});
				setTotalQuantity(quantity as number);
				setAttributeId("");
			} else {
				setPrice({
					origin: product?.price as number,
					discount: product?.discount as number,
				});
				setTotalQuantity(product?.quantity as number);
				setAttributeId("");
			}
		};
		updateQuantityAndAttribute();
	}, [chooseColorId, chooseSizeId, product]);

	const handleStateInfoProduct = useCallback(() => {
		if (!product) return { listColorExist: [], listSizeExist: [] };

		const listColorExist =
			product.listColor?.map((color) => ({
				id: color.colorId,
				colorCode: color.colorCode,
				colorName: color.colorName,
				listSize: color.list
					?.map((item) => item.size?._id)
					.filter(Boolean) as string[],
			})) || [];

		const listSizeExist =
			product.listSize?.map((size) => ({
				id: size.sizeId,
				sizeName: size.sizeName,
				listColor: size.list
					?.map((item) => item.color?._id)
					.filter(Boolean) as string[],
			})) || [];

		return { listColorExist, listSizeExist };
	}, [product]);

	useEffect(() => {
		setStateInfoProduct(handleStateInfoProduct());
		setTotalQuantity(product?.quantity || 0);
	}, [product, handleStateInfoProduct]);
	const handleOrderProduct = async (action: "add-to-cart" | "buy-now") => {
		if (!isLoggedIn) {
			return navigateIsLogin();
		}
		if (!attributeId && !product?.is_simple) {
			setIsErrorAttribute(true);
			return;
		}
		const isOutOfStock = (quantity: number) => quantity <= 0;
		const isSimpleProductOutOfStock =
			product?.is_simple && isOutOfStock(product.quantity);
		const currentProductAttribute = product?.attributes?.find(
			(attribute) => attribute._id === attributeId,
		);

		if (
			isSimpleProductOutOfStock ||
			(attributeId && isOutOfStock(currentProductAttribute?.quantity as number))
		) {
			toast.error("Sản phẩm này tạm thời hết hàng");
			return;
		}
		switch (action) {
			case "add-to-cart":
				try {
					setIsLoadingButton({
						isLoadingBynow: false,
						isLoadingShopping: true,
					});
					await addProductToCart({
						attribute: attributeId || null,
						productId: product?._id as string,
						quantity: purchaseQuantity,
					});
					const { data: dataCarts } = await pagingCartV2();
					setIsLoadingButton({
						isLoadingBynow: false,
						isLoadingShopping: false,
					});
					setCarts(dataCarts?.listData);
					document.querySelector(".ablum-detail-product");
					const itemElement = document.querySelector(
						".ablum-detail-product",
					) as HTMLDivElement;
					startAnimation(itemElement, product?.thumbnail as string);
					updateTotalCart(purchaseQuantity);
					fetchNewProductsInTheCart();
				} catch (error) {
					if (error instanceof AxiosError) {
						toast.error(error?.response?.data?.message);
					}
				}

				break;
			case "buy-now":
				try {
					const { data } = await buyNowSevices({
						attribute: attributeId || null,
						productId: product?._id as string,
						quantity: Number(purchaseQuantity),
					});
					navigate(`/order?state=${data?.url}`);
				} catch (error) {
					if (error instanceof AxiosError) {
						toast.error(error?.response?.data?.message);
					}
				}
				break;
			default:
				toast.error("Hành động không hợp lệ vui lòng thử lại!");
				break;
		}
	};
	return (
		<>
			{RenderAnimation()}
			<div className="w-full pt-10">
				<div className="w-full space-y-3 md:space-y-5">
					<div className="space-y-0.5 p-1.5 w-full">
						<p className="text-xs uppercase">
							Danh mục: <span>{product?.category?.name}</span>
						</p>
						<h2 className="w-full text-xl uppercase text-wrap">
							{product?.name}
						</h2>
						<div className="flex items-center capitalize text-sm text-[#767676] [&>p]:px-4  [&>*]:border-r [&>*]:border-[#00000024]">
							<div className="flex items-end gap-1 pr-4">
								<span className="font-medium text-blue-500 border-b border-blue-500">
									{product?.rating}
								</span>
								<div className="pb-0.5 flex w-max">
									<StarRatings
										rating={product?.rating}
										numberOfStars={5}
										starDimension="14px"
										starSpacing="0.5px"
										starRatedColor="#ee4d2d"
									/>
								</div>
							</div>
							<p className="flex items-center gap-1 text-nowrap max-md:border-none">
								<span className="font-medium text-black">
									{product?.ratingCount}
								</span>
								Đánh giá
							</p>
							<p className="items-center hidden gap-1 md:flex text-nowrap">
								<span className="font-medium text-black">
									{product?.quantitySold}
								</span>
								Đã bán
							</p>
							<p className="items-center hidden gap-1 border-none md:flex text-nowrap">
								<span className="font-medium text-black">
									{product?.viewCount}
								</span>
								Lượt xem
							</p>
						</div>
					</div>
					<div className="flex items-end gap-5 bg-[#fafafa] py-4 px-5 w-full">
						<span
							className={cn(
								"text-base text-gray-500 line-through",
								price?.origin == price?.discount && "hidden",
							)}
						>
							{formatCurrency(price?.origin || 0)}
						</span>
						<p className="text-2xl font-medium text-blue-500">
							{formatCurrency(price?.discount || 0)}
						</p>
						<span className=" hidden capitalize text-sm text-white font-medium bg-blue-500 px-1 py-0.5 rounded">
							34% giảm
						</span>
					</div>
					<div className="w-full space-y-3 md:space-y-5">
						<p
							className={cn(
								" p-1.5 text-red-500 hidden text-xs",
								product?.is_simple && "block",
							)}
						>
							*Lưu ý: Đây là Sản phẩm tiêu chuẩn, không có tùy chọn màu và kích
							thước sản phẩm
						</p>
						<div
							className={cn(
								"space-y-5 p-1.5 w-full",
								isErrorAttribute && "bg-red-50",
							)}
						>
							<div
								className={cn(
									"w-full block space-y-3 md:space-y-5",
									product?.is_simple && "hidden",
								)}
							>
								<ListColor
									listColorExist={stateInfoProduct?.listColorExist}
									onChoose={setChooseColorId}
									setExitsListSize={setExitsListSize}
									exitsListColor={exitsListColor}
									setTotalQuantity={setTotalQuantity}
								/>
								<ListSize
									listSizeExist={stateInfoProduct?.listSizeExist}
									onChoose={setChooseSizeId}
									exitsListSize={exitsListSize}
									setExitsListColor={setExitsListColor}
									setTotalQuantity={setTotalQuantity}
								/>
							</div>
							<div className="flex items-start max-md:flex-col max-md:gap-3 md:items-center">
								<h3 className="text-base font-normal text-gray-500 min-w-28 max-w-28">
									Số lượng
								</h3>
								<div className="flex items-center gap-3">
									<InputQuantity
										disabled={totalQuantity <= 0}
										defaultValue={1}
										maxTotal={totalQuantity}
										getValue={setPurchaseQuantity}
										className="bg-white"
										size="responsive"
									/>
									{totalQuantity > 0 ? (
										<span className="text-sm text-gray-600 md:text-base">
											{totalQuantity} sản phẩm có sẵn
										</span>
									) : (
										<span className="text-sm text-red-500 md:text-base">
											*Hết hàng
										</span>
									)}
								</div>
							</div>
							<span
								className={cn(
									"text-red-500 hidden",
									isErrorAttribute && "inline-block",
								)}
							>
								Vui lòng chọn Phân loại hàng
							</span>
						</div>
						<div className="flex items-center gap-3 p-1.5 w-full">
							<Button
								className={cn(
									"px-5 bg-blue-500 hover:bg-blue-700",
									totalQuantity <= 0 && "opacity-30",
								)}
								onClick={() => handleOrderProduct("buy-now")}
								disabled={totalQuantity <= 0}
							>
								{isLoadingButton.isLoadingBynow ? (
									<ButtonLoading type="white" />
								) : (
									"Mua ngay"
								)}
							</Button>
							<Button
								disabled={totalQuantity <= 0}
								className={cn(
									"bg-blue-100 hover:bg-blue-50 flex items-center gap-1.5 text-blue-500",
									totalQuantity <= 0 && "opacity-30",
								)}
								onClick={() => handleOrderProduct("add-to-cart")}
							>
								{isLoadingButton.isLoadingShopping ? (
									<ButtonLoading type="primary" />
								) : (
									<>
										<MdOutlineAddShoppingCart size={22} /> Thêm vào giỏ hàng{" "}
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default InfoProduct;
