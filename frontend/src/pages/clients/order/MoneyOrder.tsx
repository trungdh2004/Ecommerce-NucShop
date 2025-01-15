import { formatCurrency } from "@/common/func";
import { ObjectCheckoutOrder } from "@/types/ObjectCheckoutOrder";
import { IOrderMoneyValue } from "@/types/order";
import { MdOutlineEventNote } from "react-icons/md";

interface Props {
	data: any;
	handleCheckout: () => void;
	setOrderCheckout: (order: any) => void;
	orderCheckout: ObjectCheckoutOrder;
	moneyVoucher: IOrderMoneyValue | null;
}
const MoneyOrder = ({
	data,
	orderCheckout,
	moneyVoucher,
}: Props) => {
	const arrayTotal = data?.data?.map((product: any) => {
		return product.totalAmount;
	});
	const totalCost = arrayTotal?.reduce(
		(acc: number, value: number) => acc + value,
		0,
	);
	return (
		<div className="py-5 mb-3 bg-white border border-gray-200 rounded-none lg:rounded-md md:rounded-md">
			<div className="px-4 py-4 lg:pr-4 md:pr-4">
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<MdOutlineEventNote size={20} />
						<h3 className="text-base font-medium lg:text-lg">
							Chi tiết thanh toán
						</h3>
					</div>
					<div className="flex justify-between">
						<p className="text-sm lg:text-base md:text-base">Tổng tiền hàng</p>
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
		</div>
	);
};

export default MoneyOrder;
