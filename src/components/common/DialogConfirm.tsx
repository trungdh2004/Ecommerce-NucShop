import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface IDialogConfirm {
	open: boolean;
	title?: string;
	handleClose: () => void;
	content: string;
	handleSubmit: () => void;
	status?: "success" | "danger";
	labelConfirm?: string;
}

const DialogConfirm = ({
	open,
	handleClose,
	title,
	content,
	handleSubmit,
	status = "danger",
	labelConfirm,
}: IDialogConfirm) => {
	const [check, setCheck] = useState(false);
	return (
		<>
			<Dialog open={open} onOpenChange={handleClose}>
				<DialogContent className="w-[80%] rounded-md max-w-[400px] p-0 gap-0">
					<DialogHeader className="border-b pb-2 font-bold px-4 py-2">
						{title ? title : "Xác nhận"}
					</DialogHeader>

					<div className="py-2 px-4">
						<span className="text-sm sm:text-base">{content}</span>
					</div>

					<div className="px-4 py-2 flex justify-end">
						<Button
							size={"xs"}
							variant={"ghost"}
							className="px-4 ml-4 border-none outline-none"
							onClick={handleClose}
						>
							Hủy
						</Button>
						<Button
							size={"xs"}
							className="px-4 ml-4"
							variant={status === "danger" ? "danger" : "success"}
							onClick={handleSubmit}
						>
							{labelConfirm
								? labelConfirm
								: status === "danger"
									? "Xoá"
									: "Lưu"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DialogConfirm;
