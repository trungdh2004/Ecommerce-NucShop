import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounceCallback } from "usehooks-ts";
import { cancelOrder } from "@/service/order";
interface Props {
	open: boolean;
	closeOpen: (isOpen: boolean) => void;
	getOrderById: () => void;
	dataOrderId: any;
}
const OrderCancelConfirm = ({
	open,
	closeOpen,
	getOrderById,
	dataOrderId,
}: Props) => {
	const [textnote, setTextNote] = useState<string>("");
	const debounced = useDebounceCallback((inputValue: string) => {
		setTextNote(inputValue);
	}, 300);
	const handleCancelOrder = async (textnote: string) => {
		try {
			const data = await cancelOrder(dataOrderId._id, textnote,2);
			getOrderById();
			closeOpen(false);
			return data;
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div>
			<Dialog open={open} onOpenChange={closeOpen}>
				<DialogContent className="w-[90%] sm:max-w-[660px] rounded-md max-h-[90vh] p-4 overflow-y-auto">
					<div className="flex justify-between">
						<h3 className="pb-3">Bạn chắc chắn muốn hủy bỏ đơn hàng</h3>
					</div>
					<div className="flex flex-col gap-4">
						<h3>Thông tin xác nhận</h3>
						<Input
							placeholder="Tin nhắn"
							onChange={(event) => debounced(event.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button
							type="submit"
							onClick={() => {
								handleCancelOrder(textnote);
							}}
						>
							Xác nhận
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default OrderCancelConfirm;
