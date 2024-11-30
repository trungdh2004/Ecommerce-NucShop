import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import {
	createMessage,
	findOrUpdateConversation,
	pagingMessage,
} from "@/service/chat";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiMessageSquare } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { TooltipComponent } from "../common/TooltipComponent";
import { formatDateMessage } from "@/common/func";
import { Send } from "lucide-react";

const formSchema = z.object({
	content: z.string().min(1),
});

export interface IMessage {
	_id: string;
	conversation: string;
	user: User;
	content: string;
	sender: string;
	read: string[];
	createdAt: Date;
	updatedAt: Date;
	__v: number;
}

export interface User {
	_id: string;
	full_name: string;
	email: string;
	avatarUrl: string;
}

type PropState = {
	content: IMessage[];
	pageIndex: number;
	totalPage: number;
	totalAllOptions: number;
};

const ChatAction = () => {
	const [openChat, setOpenChat] = useState(false);
	const [conversation, setConversation] = useState<null | string>(null);
	const { isLoggedIn, socket } = useAuth();
	const [scroll, setScroll] = useState(false);

	const [data, setData] = useState<PropState>({
		content: [],
		pageIndex: 1,
		totalAllOptions: 0,
		totalPage: 0,
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: "",
		},
	});

	const refBox = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		(async () => {
			try {
				if (isLoggedIn) {
					const { data: dataChat } = await findOrUpdateConversation();
					setConversation(dataChat?._id);
					console.log("call r nè:", dataChat);

					socket?.emit("joinChat", dataChat?._id);
				}
			} catch (error) {}
		})();
	}, [isLoggedIn]);

	useEffect(() => {
		socket?.on("messageSender", (newMessage) => {
			console.log("newMessage", newMessage);
			setData((prev) => ({
				...prev,
				content: [...prev.content, newMessage],
			}));
			setScroll(true);
		});
	}, []);

	useEffect(() => {
		if (scroll) {
			if (refBox.current) {
				refBox.current.scrollTop = refBox.current.scrollHeight;
			}
			setScroll(false);
		}
	}, [scroll]);

	const boolenRef = useRef<boolean>(false);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const { data } = await createMessage(
				values?.content,
				"USER",
				conversation as string,
			);
			setData((prev) => ({
				...prev,
				content: [...prev.content, data?.data],
			}));
			setScroll(true);
			form.reset();
			socket?.emit("newMessage", data?.data, data?.conversation);
		} catch (error) {}
	}

	const handlePagingMessage = async () => {
		try {
			const { data } = await pagingMessage(conversation as string, 1);
			console.log({ data });
			setData(data);
			setScroll(true);
		} catch (error) {}
	};

	return (
		<div>
			<div className="fixed bottom-4 right-4 size-12 rounded-full bg-blue-500 z-[100] cursor-pointer">
				<div
					className={cn(
						"absolute w-80 h-[400px] border rounded-md bg-blue-500 box-shadow bottom-14 right-0 z-10 border-blue-500 p-2 hidden",
						openChat && "block",
					)}
				>
					<div className="w-full h-full bg-white flex flex-col">
						<div
							className="flex-1 overflow-y-auto p-2 scroll-custom"
							ref={refBox}
						>
							{data?.content?.map((item: any) => (
								<div
									className={`flex ${item.sender === "USER" ? "justify-end" : "justify-start"} mb-1`}
								>
									{item?.sender === "ADMIN" && (
										<Avatar className="w-8 h-8 mr-2">
											<AvatarImage src={"/NUC.svg"} />
											<AvatarFallback>{"N"}</AvatarFallback>
										</Avatar>
									)}
									<div
										className={`max-w-[70%] ${item.sender === "USER" ? "bg-purple-500 text-white" : "bg-gray-100"} cursor-pointer rounded-2xl px-4 py-2 text-sm`}
									>
										<TooltipComponent
											label={formatDateMessage(item?.createdAt)}
											side="left"
										>
											<p>{item?.content}</p>
										</TooltipComponent>
									</div>
								</div>
							))}
						</div>
						<div className="bg-white p-1 flex w-full ">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="flex items-center w-full"
								>
									<div className="flex-1">
										<FormField
											control={form.control}
											name="content"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															placeholder="shadcn"
															{...field}
															className="w-full bg-white"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
									<Button variant={"ghost"} type="submit">
										<Send className="w-6 h-6 text-purple-500" />
									</Button>
								</form>
							</Form>
						</div>
					</div>
				</div>
				{openChat && (
					<div className=" size-4 bg-blue-500 absolute bottom-[52px] right-4 rotate-45 "></div>
				)}

				<div
					className="w-full h-full flex items-center justify-center "
					onClick={() => {
						setOpenChat(!openChat);
						if (!boolenRef.current) {
							handlePagingMessage();
							boolenRef.current = true;
						}
					}}
				>
					<FiMessageSquare size={20} className="text-white" />
				</div>
			</div>
		</div>
	);
};

export default ChatAction;
