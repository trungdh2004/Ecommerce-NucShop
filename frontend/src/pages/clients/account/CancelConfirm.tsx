import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cancelOrder } from "@/service/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiFillExclamationCircle } from "react-icons/ai";
import { toast } from "sonner";

const FormSchema = z.object({
	type: z.string().min(1, { message: "Vui lòng chọn lý do hủy đơn hàng" }),
});

type Props = {
	open: string | boolean;
	handleClose: () => void;
	handleFetchOrder: () => void;
};
interface IRes {
	note: string;
	cancelBy: number;
	open: string;
}
const CancelConfirm = ({ open, handleClose }: Props) => {
	const queryClient = useQueryClient();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});
	const ListContent = [
		"Muốn nhập/thay dổi mã Voucher",
		"Muốn thay đổi sản phẩm trong đơn hàng",
		"Thủ tục thanh toán quá rắc rối",
		"Tìm giá rẻ hơn chỗ khác",
		"Đổi ý không muốn mua nữa",
	];
	console.log("id", open);
	// const handleCancelOrder = async (open: string | boolean, noteCancel: string, cancelBy = 2) => {
	//   try {
	//     const data = await cancelOrder(open, noteCancel, cancelBy);
	//     handleClose();
	//     handleFetchOrder();
	//     console.log("huy hang ", data)
	//   } catch (error) {
	//     console.log(error)
	//   }
	// }
	const { mutate } = useMutation({
		mutationFn: async ({ open, note, cancelBy = 1 }: IRes) => {
			await cancelOrder(open, note, cancelBy);
		},
		onSuccess: () => {
			handleClose();
			queryClient.invalidateQueries({
				queryKey: ["purchase"],
			});
			toast.success("Bạn đã hủy đơn hàng thành công!");
		},
		onError: () => {
			toast.error("Bạn đã hủy đơn hàng thất bại!");
		},
	});
	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		// console.log("data", data.type)
		mutate({ open: open as string, note: data.type as string, cancelBy: 1 });
	};
	return (
		<>
			<Dialog open={!!open} onOpenChange={handleClose}>
				<DialogContent className=" sm:w-[500px] ">
					<DialogHeader>
						<DialogTitle>Chọn Lý Do Hủy</DialogTitle>
						<div className="my-2">
							<DialogDescription className="text-[#FFB22C] my-3">
								<p className="flex ">
									<AiFillExclamationCircle className="mr-2" size={24} /> Vui
									lòng chọn lý do hủy đơn hàng. Lưu ý: Thao tác này sẽ hủy tất
									cả sản phẩm có trong đơn hàng và không thể hoàn tác.
								</p>
							</DialogDescription>
						</div>
					</DialogHeader>
					<div className="">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<FormField
									control={form.control}
									name="type"
									render={({ field }) => (
										<FormItem className="space-y-3">
											<FormControl>
												<RadioGroup
													onValueChange={field.onChange}
													value={field.value}
													className="flex flex-col space-y-1"
												>
													{ListContent.map((item: any, index: number) => {
														return (
															<FormItem
																key={index}
																className="flex items-center space-x-3 space-y-0"
															>
																<FormControl>
																	<RadioGroupItem value={item} />
																</FormControl>
																<FormLabel className="text-sm font-normal md:text-base">
																	{item}
																</FormLabel>
															</FormItem>
														);
													})}
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<button
									className="w-full py-3 text-sm text-white uppercase rounded-sm bg-custom-500 md:text-base"
									type="submit"
								>
									Đồng ý
								</button>
							</form>
						</Form>
					</div>
					<DialogFooter></DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default CancelConfirm;
