import voucher1 from "@/assets/voucher.png";
import Coupon from "@/components/common/Coupon/Coupon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { takeApplyDiscountCode } from "@/service/voucher";
import { IOrderMoneyValue } from "@/types/order";
import { IVoucher } from "@/types/voucher";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";

interface Props {
	data: any;
	setOrderCheckout: (order: any) => void;
	setMoneyVoucher: Dispatch<SetStateAction<IOrderMoneyValue | null>>;
	stateOrder: any;
}
const Vorcher = ({
	data,
	setOrderCheckout,
	setMoneyVoucher,
	stateOrder,
}: Props) => {
	const [voucher, setVoucher] = useState<IVoucher | null>(data?.voucher);
	const [show, setShow] = useState(false);
	const { register, handleSubmit, reset } = useForm();
	const onSubmit = async (data: any) => {
		try {
			const check = await takeApplyDiscountCode({
				code: data.voucherCode,
				listId: stateOrder.listId,
			});
			setVoucher(check.data.voucher);
			setShow(true);
			if (check.data !== null) {
				setOrderCheckout((prev: any) => {
					return { ...prev, voucher: check.data.voucher._id };
				});
				setMoneyVoucher(check.data.valueCheck);
			} else {
				alert("Mã voucher không đúng hoặc đã hết hạn sử dụng!");
			}
		} catch (error: any) {
			setVoucher(null);
			setShow(true);
			setOrderCheckout((prev: any) => {
				return { ...prev, voucher: null };
			});
			setMoneyVoucher(null);
			toast.error(error?.response?.data?.message);
		}
	};

	useEffect(() => {
		if (data?.voucherMain) {
			setOrderCheckout((prev: any) => {
				return { ...prev, voucher: data?.voucherMain?.voucher?._id };
			});
			setVoucher(data?.voucherMain?.voucher);
			setMoneyVoucher({ amount: data?.voucherMain?.amountVoucher });
			setShow(true);
		}
	}, [data]);
	return (
		<div className="py-2">
			<div className="flex flex-col bg-white border border-gray-200 rounded-none lg:rounded-md md:rounded-md">
				<div className="flex items-center justify-between gap-6 py-2 lg:flex-row">
					<div className="col-span-3">
						<div className="flex items-center gap-3 pl-4">
							<img src={voucher1} alt="" className="w-8 h-8" />
						</div>
					</div>
					<form
						action=""
						onSubmit={handleSubmit(onSubmit)}
						className="flex lg:flex-wrap md:flex-nowrap flex-nowrap  items-center w-full gap-2 px-3"
					>
						<div className="relative flex-1 min-w-[180px] sm:w-3/4 md:w-52">
							<input
								placeholder="Nhập mã giảm giá"
								type="text"
								className="w-full outline-none border border-gray-200 bg-gray-100 h-8 md:h-10 p-1.5"
								{...register("voucherCode")}
							/>
							<div
								className="absolute top-1/2 -translate-y-1/2 right-1.5 size-5 bg-black/30 rounded-full flex items-center justify-center cursor-pointer"
								onClick={() => {
									setVoucher(null);
									setShow(true);
									setOrderCheckout((prev: any) => {
										return { ...prev, voucher: null };
									});
									setMoneyVoucher(null);
									reset();
								}}
							>
								<IoClose className="text-white" />
							</div>
						</div>
						<Button
							className={cn(
								"h-8 md:h-10 w-full sm:w-auto bg-custom-500 hover:bg-custom-600 text-white px-5",
							)}
						>
							Áp dụng
						</Button>
					</form>
				</div>

				{show &&
					(voucher === null ? (
						<div className="flex justify-center py-3">
							<h3 className="text-red-400">Bạn chưa có voucher nào</h3>
						</div>
					) : (
						<Coupon
							voucher={voucher}
							className="w-full px-6 lg:w-full lg:max-w-full h-1/3 lg:h-2/3 py-3 "
						/>
					))}
			</div>
		</div>
	);
};

export default Vorcher;
