import { formatDateMessage } from "@/common/func";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import {
	createMessage,
	findOrUpdateConversation,
	pagingMessage,
	updateReadMany,
	updateReadOne,
} from "@/service/chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowDown } from "react-icons/fa6";
import { FiMessageSquare } from "react-icons/fi";
import InfiniteScroll from "react-infinite-scroll-component";
import { z } from "zod";
import { TooltipComponent } from "../common/TooltipComponent";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IoCloseSharp } from "react-icons/io5";

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
	const [countNotRead, setCountNotRead] = useState(0);
	const [before, setBefore] = useState(null);
	const [data, setData] = useState<PropState>({
		content: [],
		pageIndex: 1,
		totalAllOptions: 0,
		totalPage: 0,
	});
	const [checkNewMessage, setCheckNewMessage] = useState<null | string>(null);
	const [openScroll, setOpenScroll] = useState(false);

	const refBottom = useRef<HTMLDivElement>(null);
	const refBoxChat = useRef<HTMLDivElement>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: "",
		},
	});

	useEffect(() => {
		(async () => {
			try {
				if (isLoggedIn) {
					const { data: dataChat } = await findOrUpdateConversation();
					setConversation(dataChat?._id);
					socket?.emit("joinChat", dataChat?._id);
					const { data } = await pagingMessage(dataChat?._id, 1, null, "USER");
					setData(data);
					setCountNotRead(data?.countNotRead);
					setBefore(data?.before);
				}
			} catch (error) {}
		})();
	}, [isLoggedIn]);

	useEffect(() => {
		socket?.on("messageSender", async (newMessage) => {
			setData((prev) => ({
				...prev,
				content: [newMessage, ...prev.content],
			}));
			setCheckNewMessage(newMessage?._id);
		});
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			if (refBoxChat.current && refBoxChat.current.scrollTop < -100) {
				setOpenScroll(true);
			} else {
				setOpenScroll(false);
			}
		};

		refBoxChat.current?.addEventListener("scroll", handleScroll);

		return () => {
			refBoxChat.current?.removeEventListener("scroll", handleScroll);
		};
	}, [refBoxChat]);

	useEffect(() => {
		if (checkNewMessage) {
			if (openChat) {
				updateReadOne("USER", checkNewMessage);
			} else {
				setCountNotRead((prev) => ++prev);
			}
		}
	}, [checkNewMessage]);

	const boolenRef = useRef<boolean>(false);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const { data: dataMes } = await createMessage(
				values?.content,
				"USER",
				conversation as string,
			);
			setData((prev) => ({
				...prev,
				content: [dataMes?.data, ...prev.content],
			}));
			form.reset();
			socket?.emit("newMessage", dataMes?.data, dataMes?.conversation);
		} catch (error) {}
	}

	const handlePagingMessage = async () => {
		try {
			const page = data?.pageIndex + 1;
			const { data: dataMes } = await pagingMessage(
				conversation as string,
				page,
				before,
				"USER",
			);
			setData((prev) => {
				return {
					...dataMes,
					content: [...prev.content, ...dataMes?.content],
				};
			});
		} catch (error) {}
	};

	const scrollBottom = async () => {
		refBottom.current?.scrollIntoView({ behavior: "smooth", block: "center" });
	};

	return (
		<div className={cn("hidden", isLoggedIn && "block")}>
			<div className="fixed z-10 bg-white rounded-full shadow-[rgba(0,0,0,0.35)_0px_5px_15px] cursor-pointer bottom-4 right-4 size-12">
				<div
					className={cn(
						"absolute w-80 h-[400px] rounded-md shadow-lg bottom-14 right-0 z-10 hidden ",
						openChat && "block",
					)}
				>
					<div className="flex flex-col w-full h-full bg-white rounded-md">
						<div className="bg-custom-300 rounded-t-md flex justify-between items-center">
							<div className="flex items-center p-2 gap-1">
								<img src="/NUC.svg" alt="" className="size-8" />
								<h3 className="font-semibold text-white">NUCSHOP</h3>
							</div>
							<IoCloseSharp
								size={25}
								className="pr-2 text-white"
								onClick={() => setOpenChat(false)}
							/>
						</div>
						<hr />
						<div
							id="scrollableChatDiv"
							style={{
								// height: 320,
								flex: "1 1 0%",
								overflow: "auto",
								display: "flex",
								flexDirection: "column-reverse",
							}}
							ref={refBoxChat}
							className="relative p-1 scroll-custom"
							// className="flex-1 overflow-y-auto p-2 scroll-custom h-[350px]"
						>
							<InfiniteScroll
								dataLength={data?.content.length}
								next={handlePagingMessage}
								style={{
									display: "flex",
									flexDirection: "column-reverse",
									position: "relative",
								}} //To put endMessage and loader to the top.
								inverse={true} //
								hasMore={data?.pageIndex !== data?.totalPage}
								loader={
									<p className="text-sm text-center text-gray-400">
										Loading...
									</p>
								}
								scrollableTarget="scrollableChatDiv"
								// below props only if you need pull down functionality
								refreshFunction={handlePagingMessage}
								pullDownToRefresh
								pullDownToRefreshThreshold={50}
								pullDownToRefreshContent={
									<h3 style={{ textAlign: "center" }}>&#8595;</h3>
								}
								releaseToRefreshContent={
									<h3 style={{ textAlign: "center" }}>&#8593;</h3>
								}
							>
								<div className="" ref={refBottom}></div>
								{data?.content?.map((item: any) => (
									<div
										className={`flex ${item.sender === "USER" ? "justify-end" : "justify-start"} mb-1`}
										key={item?._id}
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
												<p className="w-full break-words">{item?.content}</p>
											</TooltipComponent>
										</div>
									</div>
								))}
							</InfiniteScroll>
						</div>
						{/* </div> */}
						<div
							className={cn(
								"absolute z-10  size-7 bg-gray-50 rounded-full bottom-16 left-1/2 -translate-x-1/2 flex items-center justify-center hover:bg-gray-100 cursor-pointer",
								!openScroll && "hidden",
							)}
							onClick={scrollBottom}
						>
							<FaArrowDown />
						</div>
						<div className="flex items-center w-full p-1 border-t">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="flex items-center w-full border"
								>
									<div className="flex-1">
										<FormField
											control={form.control}
											name="content"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															placeholder="Nhập..."
															{...field}
															className="w-full bg-white border-none outline-none"
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
					<div className=" size-4 bg-custom-500 absolute bottom-[52px] right-4 rotate-45 "></div>
				)}

				<div
					className="flex items-center justify-center w-full h-full "
					onClick={async () => {
						setOpenChat(!openChat);
						if (!boolenRef.current) {
							boolenRef.current = true;
						}

						if (countNotRead > 0 && !openChat) {
							await updateReadMany("USER", conversation as string);
							setCountNotRead(0);
						}
					}}
				>
					<FiMessageSquare size={20} className="text-custom" />
				</div>

				<div className="absolute left-0 flex items-center justify-center text-white rounded-full bg-custom size-5 -top-1 box-shadow ">
					{countNotRead}
				</div>
			</div>
		</div>
	);
};

export default ChatAction;
