import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { findEmail, verifyOTP } from "@/service/account";
import { toast } from "sonner";
import OverlayViolet from "@/components/OverlayViolet";
interface PropsVerifyOtp {
	setStep: (val: number) => void;
	email: string;
}
const VerifyOtp = ({ setStep, email }: PropsVerifyOtp) => {
	const [time, setTime] = useState(5 * 60 - 1);
	useEffect(() => {
		const idInterval = setInterval(timeRemaining, 1000);
		return () => {
			clearInterval(idInterval);
		};
	}, [time]);
	const timeRemaining = () => {
		const elementTime = document.querySelector("span.time") as HTMLSpanElement;
		const minute = Math.floor(time / 60);
		const seconds = time % 60;
		if (time > 0) {
			elementTime.innerHTML = `${minute}:${seconds}s`;
			setTime((prev) => prev - 1);
		} else {
			elementTime.innerHTML = "Hết hạn OTP";
		}
	};
	const resendOTP = async () => {
		try {
			setTime(5 * 60 - 1);
			const { data } = await findEmail({ email });
			toast.success(data.message);
		} catch (error: any) {
			toast.error(error.response!.data?.message);
		}
	};
	const FormSchema = z.object({
		otp: z.string({ message: "Bạn chưa nhập mã OTP" }).min(6, {
			message: "Mã OTP phải 6 ký tự",
		}),
	});
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			otp: "",
		},
	});
	const onSubmit = async (payload: z.infer<typeof FormSchema>) => {
		try {
			const { data } = await verifyOTP({ email, otp: payload.otp });
			setStep(3);
			toast.success(data.message);
		} catch (error: any) {
			form.setError("otp", { message: error.response!.data?.message });
		}
	};
	return (
		<div className="">
			<OverlayViolet />
			<div className="absolute left-3 top-3 flex justify-between items-center pr-5">
				<Link
					to={"/"}
					className="dark:bg-slate-600 relative flex items-center justify-center max-w-36 mt-10 ml-12 p-3 bg-white rounded-lg shadow-lg"
				>
					<IoIosArrowRoundBack size={20} className="mr-4" /> Trang chủ
				</Link>
			</div>
			<div className="dark:bg-slate-800 w-full max-w-[355px] md:max-w-sm mx-auto mt-12  px-8 py-9 bg-white shadow-md border border-gray-200 rounded-2xl">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
						<div className=" space-y-5 ">
							<h2 className="text-left text-xl font-bold mb-4">Nhập mail</h2>
							<div className="space-y-1">
								<FormField
									control={form.control}
									name="otp"
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center justify-between">
												<FormLabel>Nhập mã OTP</FormLabel>
												<p className="text-xs">
													Thời gian còn lại:{" "}
													<span className="time text-blue-600 font-semibold">
														5:00s
													</span>
												</p>
											</div>
											<FormControl>
												<InputOTP maxLength={6} {...field}>
													<InputOTPGroup className="flex items-center justify-between gap-[10px] md:gap-4 *:border *:border-gray-200 *:rounded-md">
														<InputOTPSlot index={0} />
														<InputOTPSlot index={1} />
														<InputOTPSlot index={2} />
														<InputOTPSlot index={3} />
														<InputOTPSlot index={4} />
														<InputOTPSlot index={5} />
													</InputOTPGroup>
												</InputOTP>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<Button
							type="submit"
							className="w-full mt-3 mb-6 text-white text-base font-bold bg-blue-500 hover:bg-blue-400"
						>
							Xác thực
						</Button>
					</form>
				</Form>
				<p className="text-xs text-right mt-4">
					Bạn chưa nhận được mail?{" "}
					<span className="text-blue-600 cursor-pointer" onClick={resendOTP}>
						Gửi lại
					</span>
				</p>
			</div>
		</div>
	);
};

export default VerifyOtp;
