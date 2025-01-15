import {
  createOrderPayUponReceipt,
  createOrderVNPayPayment,
  pagingOrder,
} from "@/service/order";
import { ObjectCheckoutOrder } from "@/types/ObjectCheckoutOrder";
import { IOrderMoneyValue } from "@/types/order";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import MoneyOrder from "./MoneyOrder";
import NoteOrder from "./NoteOrder";
import ProductOrderV2 from "./orderV2/ProductOrderV2";
import PaymentMethod from "./PaymentMethod";
import Vorcher from "./Vorcher";

const OrderPage = () => {
	const [searchParams] = useSearchParams();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const paramsObject = Object.fromEntries(searchParams.entries());
	const [spin, setSpin] = useState(false);
	const stateOrder = JSON.parse(paramsObject.state);
	const [orderParams, setOrderParams] = useState<any | {}>(stateOrder || {});
	const [order, setOrder] = useState<any>({});
	const { mutate } = useMutation({
		mutationKey: ["orderPagingCart"],
		mutationFn: async (valueOrder) => {
			try {
				const { data } = await pagingOrder(valueOrder);
				return data;
			} catch (error) {
				console.error("Error creating order:", error);
				throw error;
			}
		},
		onMutate: () => {
			setIsLoading(true);
		},
		onSuccess: (data) => {
			setOrder(data);
			setIsLoading(false);
		},
		onError: (error) => {
			console.error("Error in creating order:", error);
			setIsLoading(false);
		},
	});
	useEffect(() => {
		mutate(orderParams);
	}, []);

	const handleChangeAddress = (id: string) => {
		if (id) {
			setOrderParams({ ...orderParams, addressId: id });
			mutate({ ...orderParams, addressId: id });
		}
	};

	const [orderCheckout, setOrderCheckout] = useState<ObjectCheckoutOrder>(
		() => {
			return {
				listId: orderParams.listId,
				addressId: order?.address?._id,
				voucher: null,
				paymentMethod: 1,
				note: "",
				shippingCost: order?.shippingCost,
			};
		},
	);
	const [moneyVoucher, setMoneyVoucher] = useState<IOrderMoneyValue | null>(
		null,
	);
	useEffect(() => {
		if (order?.address) {
			setOrderCheckout((prev) => ({
				...prev,
				addressId: order?.address?._id,
				shippingCost: order?.shippingCost,
			}));
		}
	}, [order]);

	const navigate = useNavigate();
	const handleCheckout = async () => {
		if (order.data.length === 0) {
      toast.error("Vui lòng mua thêm hàng");
      setSpin(false);
			return;
		}
		if (!orderCheckout.addressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      setSpin(false);
			return;
		}
		try {
			if (orderCheckout.paymentMethod === 1) {
				const { data } = await createOrderPayUponReceipt(orderCheckout);
				toast.success("Thanh toán thành công");
				navigate("/order/success");
				return data;
			}

			if (orderCheckout.paymentMethod === 2) {
				const { data } = await createOrderVNPayPayment({
					...orderCheckout,
					returnUrl: `${window.location.origin}/orderprocessing`,
				});
				window.location.href = data.paymentUrl;
				return data;
			}
			if (orderCheckout.paymentMethod === 3) {
				const { data } = await createOrderVNPayPayment({
					...orderCheckout,
					returnUrl: `${window.location.origin}/orderprocessingv2`,
				});
				window.location.href = data.paymentUrl;
				return data;
			}
		} catch (error: any) {
			toast.error(error?.response?.data?.message);
		} finally {
			setSpin(false);
		}
	};
  useEffect(() => {
		if (order?.data?.length === 0) {
			toast.error("Vui lòng mua thêm hàng");
			const timeout = setTimeout(() => {
				navigate("/");
			}, 3000);
			return () => clearTimeout(timeout);
		}
	}, [order, navigate]);
	return (
		<>
			<div className="grid grid-cols-12 gap-5 lg:px-[100px] md:px-[65px] px-0 py-8">
				<div className="col-span-12 lg:col-span-8">
					<ProductOrderV2
						data={order}
						handleChangeAddress={handleChangeAddress}
						isLoading={isLoading}
						setOrder={setOrder}
					/>
				</div>
				<div className="col-span-12 lg:col-span-4">
					<div className="w-full">
						<h4 className="hidden pb-5 text-xl font-bold text-center lg:pb-7 lg:block lg:text-left ">
							Thông tin liên quan
						</h4>
						{/* <div className="hidden md:hidden lg:block">
							<AddressOrder
								data={order}
								handleChangeAddress={handleChangeAddress}
							/>
						</div> */}
						<MoneyOrder
							data={order}
							handleCheckout={handleCheckout}
							setOrderCheckout={setOrderCheckout}
							orderCheckout={orderCheckout}
							moneyVoucher={moneyVoucher}
						/>
						<Vorcher
							data={order}
							setOrderCheckout={setOrderCheckout}
							setMoneyVoucher={setMoneyVoucher}
							stateOrder={stateOrder}
						/>
						<NoteOrder setOrderCheckout={setOrderCheckout} />
						<PaymentMethod
							data={order}
							handleCheckout={handleCheckout}
							setOrderCheckout={setOrderCheckout}
							orderCheckout={orderCheckout}
							moneyVoucher={moneyVoucher}
							spin={spin}
							setSpin={setSpin}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default OrderPage;
