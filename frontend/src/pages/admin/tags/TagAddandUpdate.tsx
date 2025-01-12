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
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { addTag, getTag, updateTag } from "@/service/tags-admin";
import { useProcessBarLoadingEventNone } from "@/store/useSidebarAdmin";
import { toast } from "sonner";

interface FormDialog {
	open: boolean | string;
	title?: "Thêm sản phẩm" | "Cập nhật";
	labelConfirm?: string;
	handleClose: () => void;
	handlePaging: () => void;
}
const formSchema = z.object({
	name: z
		.string({
			required_error: "Tên tag là bắt buộc",
			invalid_type_error: "Tên là một chuỗi",
		})
		.min(1, {
			message: "Tên bắt buộc phải nhập",
		}),

	description: z
		.string({
			required_error: "Description là bắt buộc",
			invalid_type_error: "Description là một chuỗi",
		})
		.min(1, {
			message: "Mô tả bắt buộc phải nhập",
		}),
});
const TagAdd = ({ title, open, handleClose, handlePaging }: FormDialog) => {
	const { setOpenProcessLoadingEventNone, setCloseProcessLoadingEventNone } =
		useProcessBarLoadingEventNone();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});
	const onHandleUpdate = async (dataForm: any) => {
		try {
			setOpenProcessLoadingEventNone();
			await updateTag(open, dataForm);
			handleClose();
			handlePaging();
			toast.success("Bạn cập nhật tags thành công");
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setCloseProcessLoadingEventNone();
		}
	};
	const onHandleAdd = async (dataForm: any) => {
		try {
			setOpenProcessLoadingEventNone();
			await addTag(dataForm);
			form.reset();
			handleClose();
			handlePaging();
			toast.success("Bạn thêm tag thành công");
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
					const { data } = await getTag(open);
					form.reset(data.data);
				} catch (error) {
					console.error("Error:", error);
				}
			})();
		}
	}, [open]);

	const onSubmit = (data: { name: string; description: string }) => {
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
				<DialogContent className="w-[90%] sm:max-w-[425px] rounded-md max-h-[90vh] p-2 sm:p-4 overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{typeof open === "string" ? "Cập nhật" : "Thêm thẻ tag"}
						</DialogTitle>
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Input placeholder="Description" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">
								{typeof open === "string" ? "Cập nhật" : "Thêm thẻ tag"}
							</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default TagAdd;
