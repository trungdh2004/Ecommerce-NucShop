import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addSize, getSizeId, updateSize } from "@/service/size-admin";
import { useProcessBarLoadingEventNone } from "@/store/useSidebarAdmin";
import { SizeTypes } from "@/types/typeSize";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface FormDialog {
	open: boolean | string;
	title?: "Thêm size" | "Cập nhật";
	labelConfirm?: string;
	handleClose: () => void;
	handlePaging: () => void;
}
const formSchema = z.object({
	name: z
		.string({
			message: "Tên kích thước không được để trống",
		})
		.nonempty({
			message: "Tên kích thước không được để trống",
		}),
	toWeight: z.number().min(1, "Phải lớn hơn 0"),
	fromWeight: z.number().min(1, "Phải lớn hơn 0"),
	toHeight: z.number().min(1, "Phải lớn hơn 0"),
	fromHeight: z.number().min(1, "Phải lớn hơn 0"),
});
const SizeAddandUpdate = ({
	title,
	open,
	handleClose,
	handlePaging,
}: FormDialog) => {
	const { setOpenProcessLoadingEventNone, setCloseProcessLoadingEventNone } =
		useProcessBarLoadingEventNone();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			toHeight: 0,
			fromHeight: 0,
			toWeight: 0,
			fromWeight: 0,
		},
	});
	const onHandleUpdate = async (dataForm: SizeTypes) => {
		try {
			setOpenProcessLoadingEventNone();
			const { data } = await updateSize(open, dataForm);
			handleClose();
			handlePaging();
			toast.success("Bạn cập nhật size thành công");
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setCloseProcessLoadingEventNone();
		}
	};
	const onHandleAdd = async (dataForm: SizeTypes) => {
		try {
			setOpenProcessLoadingEventNone();
			const { data } = await addSize(dataForm);
			form.reset();
			handleClose();
			handlePaging();
			toast.success("Bạn thêm size thành công");
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setCloseProcessLoadingEventNone();
		}
	};

	useEffect(() => {
		if (typeof open === "string") {
			(async () => {
				try {
					const { data } = await getSizeId(open);
					console.log(data);
					form.reset(data.data);
				} catch (error) {
					console.error("Error:", error);
				}
			})();
		}
	}, [open]);

	const onSubmit = (data: {
		name: string;
		toWeight: number;
		fromHeight: number;
		toHeight: number;
		fromWeight: number;
	}) => {
		if (typeof open === "string") {
			onHandleUpdate(data);
		} else {
			onHandleAdd(data);
		}
	};

	return (
		<div>
			<Dialog open={!!open} onOpenChange={handleClose}>
				<DialogTrigger asChild>
					<Button variant="outline">{title}</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>
							{typeof open === "string" ? "Cập nhật" : "Thêm size"}
						</DialogTitle>
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tên kích thước</FormLabel>
										<FormControl>
											<Input placeholder="Name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-2 gap-3">
								<FormField
									control={form.control}
									name="fromHeight"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Chiều cao nhỏ</FormLabel>
											<FormControl>
												<Input
													placeholder="Chiều cao nhỏ"
													{...field}
													onChange={(event) =>
														field.onChange(+event.target.value)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="toHeight"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Chiều cao lớn</FormLabel>
											<FormControl>
												<Input
													placeholder="Chiều cao lớn"
													{...field}
													type="number"
													onChange={(event) =>
														field.onChange(+event.target.value)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<FormField
									control={form.control}
									name="fromWeight"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cân nặng thấp</FormLabel>
											<FormControl>
												<Input
													placeholder="Cân nặng thấp"
													{...field}
													type="number"
													onChange={(event) =>
														field.onChange(+event.target.value)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="toWeight"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cân nặng cao</FormLabel>
											<FormControl>
												<Input
													placeholder="Cân nặng cao"
													{...field}
													type="number"
													onChange={(event) =>
														field.onChange(+event.target.value)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<Button type="submit">
								{typeof open === "string" ? "Cập nhật" : "Thêm kích thước"}
							</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default SizeAddandUpdate;
