import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Decentralization } from "@/service/user-admin";
import { useState } from "react";
import { toast } from "sonner";
interface Props {
	open: boolean | string;
	close: () => void;
	isStaff: boolean | null;
	handlePagingUser: () => void;
}
const DiaLogDecentralization = ({
	open,
	close,
	isStaff,
	handlePagingUser,
}: Props) => {
	const checkStaff = isStaff ? "2" : "1";
	const [selectedValue, setSelectedValue] = useState<string | undefined>(
		checkStaff || undefined,
	);
	const handleUpdate = async () => {
		if (selectedValue === undefined) {
			toast.error("Vui lòng chọn người cập nhật");
			return;
		}
		try {
			const { data } = await Decentralization(
				open as string,
				parseInt(selectedValue),
			);
			toast.success("Cập nhật thành công");
			close();
			handlePagingUser();
			return data;
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Dialog open={!!open} onOpenChange={close}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Phân quyền</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<RadioGroup
						className="mt-1"
						value={selectedValue ?? undefined}
						onValueChange={setSelectedValue}
					>
						{[1, 2]?.map((update: any, index: number) => {
							return (
								<>
									<div className="flex justify-between" key={index}>
										<div className="flex gap-3">
											<RadioGroupItem
												value={update.toString()}
												// id={`radio-${address._id}`}
												className="w-3 h-3 lg:w-4 lg:h-4"
											/>

											<div className="flex flex-col gap-2">
												<div className="flex gap-3">
													<h3 className="text-sm font-medium lg:text-base md:text-base">
														{update === 1 ? "Khách" : "Nhân viên"}
													</h3>
												</div>
											</div>
										</div>
									</div>
									<hr />
								</>
							);
						})}
					</RadioGroup>
				</div>
				<DialogFooter>
					<Button type="submit" onClick={handleUpdate}>
						Lưu
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DiaLogDecentralization;
