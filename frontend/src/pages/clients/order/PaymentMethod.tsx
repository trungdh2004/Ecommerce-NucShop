import { formatCurrency } from "@/common/func";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ObjectCheckoutOrder } from "@/types/ObjectCheckoutOrder";
import { IOrderMoneyValue } from "@/types/order";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdOutlineEventNote } from "react-icons/md";
interface Props {
	data: any;
	handleCheckout: () => void;
	setOrderCheckout: (order: any) => void;
	orderCheckout: ObjectCheckoutOrder;
	moneyVoucher: IOrderMoneyValue | null;
	spin: boolean;
	setSpin: (spin: boolean) => void;
}
const PaymentMethod = ({
	data,
	handleCheckout,
	setOrderCheckout,
	orderCheckout,
	moneyVoucher,
	spin,
	setSpin,
}: Props) => {
	console.log(spin);

	const [paymentMethod, setPaymentMethod] = useState<string>("1");
	const arrayTotal = data?.data?.map((product: any) => {
		return product.totalAmount;
	});
	const totalCost = arrayTotal?.reduce(
		(acc: number, value: number) => acc + value,
		0,
	);

	return (
		<div className="py-2 pb-6">
			<div className="flex-col gap-3 bg-white border border-gray-200 rounded-none lg:flex lg:rounded-md md:rounded-md box-shadow">
				<div className="p-4">
					<h3 className="text-lg text-[#595959] font-semibold pb-6">
						Phương thức thanh toán
					</h3>
					<div className="flex flex-col gap-2">
						<Label
							htmlFor={"paymentMethod1"}
							className={cn(
								`relative max-w-full max-h-[50px] overflow-hidden flex justify-between items-center border border-solid border-line border-[#e9e9e9] cursor-pointer py-2 px-4 gap-2 rounded  bg-white hover:text-[#ee4d2d]   hover:border-[#ee4d2d]  has-[:checked]:text-[#ee4d2d]   has-[:checked]:border-[#ee4d2d]`,
								spin ? "cursor-not-allowed opacity-75" : "",
							)}
						>
							<input
								className={cn(
									"peer",
									spin ? "cursor-not-allowed opacity-75" : "",
								)}
								onChange={(e) => {
									setPaymentMethod(e.target.value);
									setOrderCheckout((prev: any) => {
										return { ...prev, paymentMethod: parseInt(e.target.value) };
									});
								}}
								type="radio"
								hidden
								name="choose-size"
								id="paymentMethod1"
								value="1"
								checked={paymentMethod === "1"}
							/>
							<span className="text-sm capitalize lg:text-base md:text-base">
								Thanh toán khi nhận hàng
							</span>
							<span>
								<img src="/COD.png" alt="" className="size-7" />
							</span>
						</Label>
						<Label
							htmlFor={"paymentMethod2"}
							className={cn(
								`relative max-w-full max-h-[50px] overflow-hidden flex justify-between items-center border border-solid border-line border-[#e9e9e9] cursor-pointer py-2 px-4 gap-2 rounded  bg-white hover:text-[#ee4d2d]   hover:border-[#ee4d2d]  has-[:checked]:text-[#ee4d2d]   has-[:checked]:border-[#ee4d2d]`,
								spin ? "cursor-not-allowed opacity-75" : "",
							)}
						>
							<input
								className={cn(
									"peer",
									spin ? "cursor-not-allowed opacity-75" : "",
								)}
								hidden
								type="radio"
								name="paymentMethod"
								id="paymentMethod2"
								value="2"
								checked={paymentMethod === "2"}
								onChange={(e) => {
									setPaymentMethod(e.target.value);
									setOrderCheckout((prev: any) => {
										return { ...prev, paymentMethod: parseInt(e.target.value) };
									});
								}}
							/>
							<span className="text-sm capitalize lg:text-base md:text-base">
								Thanh toán VNPAY
							</span>
							<span>
								<img src="/vnpay.png" alt="" className="size-7" />
							</span>
						</Label>
						<Label
							htmlFor={"paymentMethod3"}
							className={cn(
								`relative max-w-full max-h-[50px] overflow-hidden flex justify-between items-center border border-solid border-line border-[#e9e9e9] cursor-pointer py-2 px-4 gap-2 rounded  bg-white hover:text-[#ee4d2d]   hover:border-[#ee4d2d]  has-[:checked]:text-[#ee4d2d]   has-[:checked]:border-[#ee4d2d]`,
								spin ? "cursor-not-allowed opacity-75" : "",
							)}
						>
							<input
								className={cn(
									"peer",
									spin ? "cursor-not-allowed opacity-75" : "",
								)}
								hidden
								type="radio"
								name="paymentMethod"
								id="paymentMethod3"
								value="3"
								checked={paymentMethod === "3"}
								onChange={(e) => {
									setPaymentMethod(e.target.value);
									setOrderCheckout((prev: any) => {
										return { ...prev, paymentMethod: parseInt(e.target.value) };
									});
								}}
							/>
							<span className="text-sm capitalize lg:text-base md:text-base">
								Thanh toán MoMo
							</span>
							<span>
								<img src="/momo.png" alt="" className="size-7" />
							</span>
						</Label>
					</div>
				</div>
				{/* <hr /> */}
				<div className="block px-4 py-4 lg:hidden lg:pr-4 md:pr-4">
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-2">
							<MdOutlineEventNote size={20} />
							<h3 className="text-base font-medium lg:text-lg">
								Chi tiết thanh toán
							</h3>
						</div>
						<div className="flex justify-between">
							<p className="text-sm lg:text-base md:text-base">
								Tổng tiền hàng
							</p>
							<span className="">{formatCurrency(totalCost)}</span>
						</div>
						{orderCheckout.addressId !== undefined && (
							<div className="flex justify-between">
								<p className="text-sm lg:text-base md:text-base">
									Phí vận chuyển
								</p>
								<span className="">
									{totalCost != 0
										? formatCurrency(orderCheckout?.shippingCost as number)
										: formatCurrency(0)}
								</span>
							</div>
						)}

						{moneyVoucher !== null && (
							<div className="flex justify-between gap-3">
								<p className="text-sm lg:text-base md:text-base">Giảm giá</p>
								<span className="">
									- {formatCurrency(moneyVoucher?.amount as number)}
								</span>
							</div>
						)}

						<div className="flex items-center justify-between gap-2">
							<p className="text-sm lg:text-base md:text-base">
								Tổng thanh toán :
							</p>
							<span className="lg:text-2xl md:text-xl text-xl text-[#f78138]">
								{totalCost === 0
									? formatCurrency(0)
									: orderCheckout.addressId === undefined
										? formatCurrency(0)
										: moneyVoucher !== null
											? formatCurrency(
													totalCost +
														(orderCheckout?.shippingCost as number) -
														(moneyVoucher?.amount as number),
												)
											: formatCurrency(
													totalCost + (orderCheckout?.shippingCost as number),
												)}
							</span>
						</div>
					</div>
				</div>
				<hr />
				<div className="justify-between hidden py-2 mx-4 lg:block md:block ">
					<p className="pb-4">
						Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản
						NUCSHOP
					</p>
					<Button
						className={`px-9 w-full py-1 bg-custom-400 hover:bg-custom-500 flex gap-1 items-center justify-center ${
							spin ? "cursor-not-allowed opacity-75" : ""
						}`}
						onClick={() => {
							setSpin(true);
							handleCheckout();
						}}
						disabled={spin}
					>
						{spin && <FaSpinner className="mr-2 animate-spin" />}
						Đặt hàng
					</Button>
				</div>
				<div className="lg:hidden md:hidden fixed flex bottom-0 z-[10] h-[50px] w-full bg-white items-center justify-end gap-3 border border-gray-200 ">
					<div className="flex flex-col items-center pt-1">
						<p className="text-sm">Tổng thanh toán</p>

						<span className="text-base self-end text-[#f78138]">
							{totalCost === 0
								? formatCurrency(0)
								: orderCheckout.addressId === undefined
									? formatCurrency(0)
									: moneyVoucher !== null
										? formatCurrency(
												totalCost +
													(orderCheckout?.shippingCost as number) -
													(moneyVoucher?.amount as number),
											)
										: formatCurrency(
												totalCost + (orderCheckout?.shippingCost as number),
											)}
						</span>
					</div>
					<Button
						className={cn(
							"px-9 h-full rounded-none bg-custom-400 hover:bg-custom-500 flex gap-1 items-center",
							spin ? "cursor-not-allowed opacity-75" : "",
						)}
						onClick={() => {
							setSpin(true);
							handleCheckout();
						}}
					>
						{spin && <FaSpinner className="mr-2 animate-spin" />}
						Đặt hàng
					</Button>
				</div>
			</div>
			<div className="block px-4 py-2 mt-4 mb-2 bg-white border border-gray-200 lg:hidden md:hidden">
				<p className="text-sm">
					Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản
					NUCSHOP
				</p>
			</div>
		</div>
	);
};

export default PaymentMethod;
