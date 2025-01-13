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
	return (
		<>
			<Dialog open={open} onOpenChange={handleClose}>
				<DialogContent className="w-[80%] rounded-md max-w-[400px] p-0 gap-0">
					<DialogHeader className="px-4 py-2 pb-2 font-bold border-b">
						{title ? title : "Xác nhận"}
					</DialogHeader>

					<div className="px-4 py-2">
						<span className="text-sm sm:text-base">{content}</span>
					</div>

					<div className="flex justify-end px-4 py-2">
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
