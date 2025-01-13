import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Barcode from "react-barcode";
import { useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/common/func";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IVoucher } from "@/types/voucher";

export function ModalCodition(voucher: IVoucher) {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(voucher?.code).then(() => {
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2500);
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="text-xs border-none md:text-sm hover:bg-none bg-none">
					Điều kiện
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold text-[#333f48]">
						Chi tiết mã ưu đãi
					</DialogTitle>
				</DialogHeader>
				<div className="text-[#333f48]">
					<div className="flex flex-col items-center p-2 border border-gray-200 rounded-md">
						<h3 className="text-base font-bold text-center">
							Voucher {formatCurrency(voucher?.maxAmount)}
						</h3>
						<Barcode value={voucher?.code} format="CODE128" height={30} />
					</div>
					<div className="mt-5 text-sm">
						<p>
							Hạn sử dụng: {new Date(voucher?.endDate)?.toLocaleDateString()}.
						</p>
						<p>Địa điểm áp dụng: Web NucShop</p>
						<p>
							Áp dụng cho{" "}
							{voucher?.listUseProduct?.length > 0 ? "một số" : "toàn bộ"} sản
							phẩm
						</p>
						<p>
							Áp dụng giảm {formatCurrency(voucher?.maxAmount || 0)} cho hóa đơn
							có giá trị thanh toán cuối cùng từ{" "}
							{formatCurrency(voucher?.minimumOrderValue || 0)}.
						</p>
						<p>Áp dụng 01 mã ưu đãi/ 01 hoá đơn thanh toán.</p>
					</div>
				</div>
				<DialogFooter>
					<Button
						onClick={handleCopy}
						type="button"
						className="relative w-full bg-blue-500 hover:bg-blue-600"
					>
						{isCopied ? (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								exit={{ scale: 0 }}
								transition={{ duration: 0.3 }}
								className="absolute inset-0 flex items-center justify-center text-white bg-green-500 rounded-md"
							>
								<div className="flex items-center gap-1">
									<IoIosCheckmarkCircleOutline color="#fff" size={18} />{" "}
									<p>Đã sao chép</p>
								</div>
							</motion.div>
						) : (
							<span>Lưu mã</span>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
