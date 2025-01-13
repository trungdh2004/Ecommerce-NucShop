import { cn } from "@/lib/utils";
import { IVoucher } from "@/types/voucher";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiCheck } from "react-icons/fi"; // Icon check thành công
import { ModalCodition } from "./ModalCodition";
import styles from "./style.module.css";

type Props = {
	voucher: IVoucher;
	className?: string;
};

const Coupon = ({ voucher, className }: Props) => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(voucher.code).then(() => {
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		});
	};

	return (
		<div className={cn("w-full h-full rounded-md self-auto", className)}>
			<div className={cn(styles.voucherItemInfo, "h-full")}>
				<div className={styles.voucherItemDetail}>
					<div className={styles.voucherItemTitle}>{voucher?.name} </div>
					<div
						className={cn(
							styles.voucherItemDes,
							"md:line-clamp-2 line-clamp-1",
						)}
					>
						{voucher?.description}
					</div>
					<div className={cn("flex items-center justify-between")}>
						<div
							className={
								"text-xs flex flex-col md:flex-row items-start md:items-center gap-0.5"
							}
						>
							<span className="hidden md:inline-block">HSD:</span>{" "}
							<span>{new Date(voucher?.endDate)?.toLocaleDateString()}</span>
						</div>
						<div className={styles.voucherItemCondition}>
							<ModalCodition {...voucher} />
						</div>
					</div>
				</div>
				<div
					className={cn(
						styles.voucherItemAction,
						"md:w-28 md:min-w-28 w-20 min-w-20 pr-4 pl-0.5",
					)}
				>
					<motion.div
						className="flex items-center cursor-pointer action"
						onClick={handleCopy}
						whileTap={{ scale: 0.9 }}
					>
						{isCopied ? (
							<motion.div
								initial={{ opacity: 0, scale: 0.5 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3 }}
								className="flex items-center text-green-500"
							>
								<FiCheck size={24} />
								<span className="ml-1 text-xs">Đã Lưu</span>
							</motion.div>
						) : (
							<button className="px-3 py-2 text-xs text-white rounded-md bg-custom-400 md:text-sm">
								Lưu Mã
							</button>
						)}
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default Coupon;
