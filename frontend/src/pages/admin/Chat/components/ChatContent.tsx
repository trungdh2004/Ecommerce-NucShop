import EmojiModal from "@/components/common/EmojiModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth";
import { createMessage, findConversation, pagingMessage } from "@/service/chat";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { Link, useParams } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import { IConversation } from "./Conversation";
import InfiniteScroll from "react-infinite-scroll-component";
import { cn } from "@/lib/utils";
import { FaArrowDown } from "react-icons/fa";

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

const ChatContent = () => {
	const { id } = useParams();
	const [message, setMessage] = useState<PropState>({
		content: [],
		pageIndex: 1,
		totalPage: 0,
		totalAllOptions: 0,
	});
	const [messageNew, setMessageNew] = useState("");
	const [conversation, setConversation] = useState<IConversation>();
	const [_, setLoading] = useState(false);
	const [, setScroll] = useState(false);
	const { socket } = useAuth();

	const [, setHasRequest] = useState(true);
	const [openScroll, setOpenScroll] = useState(false);
	const [before, setBefore] = useState(null);

	const refBottom = useRef<HTMLDivElement>(null);
	const refBoxChat = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (socket) {
			socket?.emit("joinChat", id as string);
			socket.on("messageSender", (message) => {
				setMessage((prev) => ({
					...prev,
					content: [
						{
							...message,
							user: conversation?.user,
						},
						...prev.content,
					],
				}));
				setScroll(true);
			});
		}
		(async () => {
			try {
				setLoading(true);
				const { data: conversation } = await findConversation(id as string);
				setConversation(conversation);
				const { data } = await pagingMessage(id as string, 1, null, "ADMIN");
				setBefore(data?.before);
				setMessage(data);
			} catch (error) {
			} finally {
				setLoading(false);
				setScroll(true);
			}
		})();

		return () => {
			if (socket) {
				socket?.emit("leaveRoom", id as string);
			}
			setHasRequest(true);
		};
	}, [id]);

	const handleNewMessage = async () => {
		try {
			const { data } = await createMessage(messageNew, "ADMIN", id as string);
			setMessage((prev) => ({
				...prev,
				content: [data.data, ...prev.content],
			}));
			if (socket) {
				socket?.emit("newMessage", data?.data, data?.conversation);
			}
			setMessageNew("");
		} catch (error) {}
	};

	const handlePagingMessage = async () => {
		try {
			const page = message?.pageIndex + 1;
			const { data: dataMes } = await pagingMessage(
				conversation?._id as string,
				page,
				before,
				"USER",
			);
			setMessage((prev) => {
				return {
					...dataMes,
					content: [...prev.content, ...dataMes?.content],
				};
			});
		} catch (error) {}
	};

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

	const scrollBottom = async () => {
		refBottom.current?.scrollIntoView({ behavior: "smooth", block: "center" });
	};

	return (
		<div className="relative flex flex-col h-full">
			<header className="flex items-center justify-between w-full px-3 border-b h-[60px]">
				<div className="flex items-center gap-3">
					<div className="overflow-hidden border rounded-full size-10">
						<img
							src={conversation?.user?.avatarUrl || "/avatar_25.jpg"}
							alt=""
						/>
					</div>
					<div>
						<h2 className="font-semibold">{conversation?.user?.full_name}</h2>
						{/* <span className="text-sm text-green-500">online</span> */}
					</div>
				</div>

				<Link to={"/admin/chat"}>
					<Button variant={"outline"} className="block md:hidden">
						<CiLogout size={20} />
					</Button>
				</Link>
			</header>

			{/* {message.content?.length > 0 &&
					message.content?.map((item) => (
						<div key={item._id}>
							<ChatMessage
								{...item}
								avatar={conversation?.user?.avatarUrl || ""}
							/>
						</div>
					))} */}

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
					dataLength={message?.content.length}
					next={handlePagingMessage}
					style={{
						display: "flex",
						flexDirection: "column-reverse",
						position: "relative",
					}} //To put endMessage and loader to the top.
					inverse={true} //
					hasMore={message?.pageIndex !== message?.totalPage}
					loader={
						<p className="text-sm text-center text-gray-400">Loading...</p>
					}
					scrollableTarget="scrollableChatDiv"
					// below props only if you need pull down functionality
					refreshFunction={handlePagingMessage}
					pullDownToRefresh
					pullDownToRefreshThreshold={50}
					pullDownToRefreshContent={
						false
						// <h3 style={{ textAlign: "center" }}>&#8595;</h3>
					}
					releaseToRefreshContent={false}
				>
					<div className="" ref={refBottom}></div>
					{message.content?.length > 0 &&
						message.content?.map((item) => (
							<div key={item._id}>
								<ChatMessage
									{...item}
									avatar={conversation?.user?.avatarUrl || ""}
								/>
							</div>
						))}
				</InfiniteScroll>
			</div>
			{/* </div> */}
			<div
				className={cn(
					"absolute z-10  size-7 bg-gray-50 rounded-full bottom-20 left-1/2 -translate-x-1/2 flex items-center justify-center hover:bg-gray-100 cursor-pointer",
					!openScroll && "hidden",
				)}
				onClick={scrollBottom}
			>
				<FaArrowDown />
			</div>

			<div className="p-4 border-t">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleNewMessage();
					}}
					className="flex items-center gap-2"
				>
					<EmojiModal
						getEmoji={(e) => {
							setMessageNew((prev) => `${prev}${e.native}`);
						}}
					/>
					<Input
						placeholder="Type your message here..."
						className="flex-1"
						value={messageNew}
						onChange={(e) => setMessageNew(e.target.value)}
					/>
					<Button variant={"ghost"} disabled={!messageNew} type="submit">
						<Send className="w-6 h-6 text-purple-500" />
					</Button>
				</form>
			</div>
		</div>
	);
};
export default ChatContent;
