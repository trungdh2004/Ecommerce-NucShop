import React, { useEffect, useState } from "react";
import AddressOrder from "./AddressOrder";
import ProductOrder from "./ProductOrder";
import Vorcher from "./Vorcher";
import Footer from "@/components/client/Footer";
import PaymentMethod from "./PaymentMethod";
import NoteOrder from "./NoteOrder";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createOrderPayUponReceipt,
	createOrderVNPayPayment,
	pagingOrder,
} from "@/service/order";
import { ObjectCheckoutOrder, ResponseData } from "@/types/ObjectCheckoutOrder";
import { toast } from "sonner";
import { IOrderMoneyValue } from "@/types/order";

const OrderPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const paramsObject = Object.fromEntries(searchParams.entries());
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
		onSuccess: (data) => {
			setOrder(data);
		},
		onError: (error) => {
			console.error("Error in creating order:", error);
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
	const handleCheckout = () => {
		if (order.data.length === 0) {
			toast.error("Vui lòng mua thêm hàng");
			return;
		}
		if (!orderCheckout.addressId) {
			toast.error("Vui lòng chọn địa chỉ giao hàng");
			return;
		}
		if (orderCheckout.paymentMethod === 1) {
			try {
				(async () => {
					const { data } = await createOrderPayUponReceipt(orderCheckout);
					toast.success("Thanh toán thành công");
					navigate("/order/success");
					return data;
				})();
			} catch (error) {
				console.log("Error:", error);
				toast.error("Thanh toán thất bại");
			}
		}

		if (orderCheckout.paymentMethod === 2) {
			try {
				(async () => {
					const { data } = await createOrderVNPayPayment({
						...orderCheckout,
						returnUrl: `${window.location.origin}/orderprocessing`,
					});
					window.location.href = data.paymentUrl;
					return data;
				})();
			} catch (error) {
				console.log("Error:", error);
			}
		}
	};

	return (
		<>
			<div className=" w-full min-h-screen">
				<div className=""></div>
				<div className="lg:px-[130px] md:px-[65px] px-0">
					<AddressOrder
						data={order}
						handleChangeAddress={handleChangeAddress}
					/>
					<ProductOrder data={order} />
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
					/>
				</div>
			</div>
		</>
	);
};

export default OrderPage;
