import EmojiModal from "@/components/common/EmojiModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth";
import { createMessage, findConversation, pagingMessage } from "@/service/chat";
import { Send } from "lucide-react";
import { ElementRef, useEffect, useRef, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { Link, useParams } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import { IConversation } from "./Conversation";

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
	const [loading, setLoading] = useState(false);
	const [scroll, setScroll] = useState(false);
	const { socket } = useAuth();
	const [hidden, setHidden] = useState(false);
	const [hasRequest, setHasRequest] = useState(true);
	const [page, setPage] = useState(1);

	const refBox = useRef<ElementRef<"div">>(null);
	const bottomRef = useRef<ElementRef<"div">>(null);

	useEffect(() => {
		if (socket) {
			socket?.emit("joinChat", id as string);
			socket.on("messageSender", (message) => {
				console.log("message", {
					...message,
					user: conversation?.user,
				});
				setMessage((prev) => ({
					...prev,
					content: [
						...prev.content,
						{
							...message,
							user: conversation?.user,
						},
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

				const { data } = await pagingMessage(id as string, 1);
				if (data?.pageIndex >= data?.totalPage) {
					setHasRequest(false);
				}
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
				content: [...prev.content, data.data],
			}));
			if (socket) {
				socket?.emit("newMessage", data?.data, data?.conversation);
			}
			setScroll(true);
			setMessageNew("");
		} catch (error) {}
	};

	useEffect(() => {
		const topDiv = refBox?.current;

		const handlerScroll = () => {
			const scrollTop = topDiv?.scrollTop;

			if (scrollTop === 0) {
				handleNextPage();
			}
		};

		topDiv?.addEventListener("scroll", handlerScroll);

		return () => {
			topDiv?.removeEventListener("scroll", handlerScroll);
		};
	}, [refBox, hasRequest, page]);

	const handleNextPage = async () => {
		try {
			const page = message?.pageIndex + 1;
			if (!hasRequest) return;

			const { data } = await pagingMessage(id as string, page);

			console.log("data", data);
			setMessage((prev) => {
				return {
					...prev,
					pageIndex: page,
					content: [...data?.content, ...prev.content],
				};
			});
			setPage(page);
			if (data?.totalPage === page) setHasRequest(false);
		} catch (error) {}
	};

	useEffect(() => {
		const bottomDiv = bottomRef?.current;
		const topDiv = refBox.current;
		const shouldAutoScroll = () => {
			// if (!hasInitialized && bottomDiv) {
			// 	setHasInitialized(true);
			// 	return true;
			// }

			if (!topDiv) {
				return false;
			}

			const distanceFromBottom =
				topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

			return distanceFromBottom <= 100;
		};

		if (shouldAutoScroll()) {
			setTimeout(() => {
				bottomRef.current?.scrollIntoView({
					behavior: "smooth",
				});
			}, 100);
		}
	}, [bottomRef, refBox, scroll]);

	return (
		<div className="h-full flex flex-col">
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

				<Link to={"/admin/chat"}><Button variant={"outline"} className="block md:hidden">
					<CiLogout size={20} />
				</Button></Link>
			</header>
			<div
				className="flex-1 block scroll-custom overflow-y-auto space-y-2 p-2"
				id="messageBox"
				ref={refBox}
			>
				{message.content?.length > 0 &&
					message.content?.map((item) => (
						<div key={item._id}>
							<ChatMessage
								{...item}
								avatar={conversation?.user?.avatarUrl || ""}
							/>
						</div>
					))}

				<div ref={bottomRef}></div>
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
