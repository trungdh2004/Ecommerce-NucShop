import { calculateTimeDistance } from "@/common/func";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { pagingConversation } from "@/service/chat";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface IConversation {
	user: {
		avatarUrl: string;
		email: string;
		full_name: string;
		_id: string;
	};
	createdAt: string;
	lastContent: string;
	lastMessage: string;
	lastRead: "USER" | "ADMIN"[];
	lastSender: "USER" | "ADMIN";
	status: boolean;
	updatedAt: string;
	_id: string;
}

type PropState = {
	content: IConversation[];
	pageIndex: number;
	totalPage: number;
	totalAllOptions: number;
};
const Conversation = () => {
	const [conversation, setConversation] = useState<PropState>({
		content: [],
		pageIndex: 1,
		totalPage: 0,
		totalAllOptions: 0,
	});
	const [isLoad,setIsLoad] = useState(false)
	const { socket } = useAuth();

	useEffect(() => {
		(async () => {
			try {
				const { data } = await pagingConversation(1);
				setConversation(data);
			} catch (error) {} finally {
				setIsLoad(true)
			}
		})();
	}, []);

	useEffect(() => {
		if (socket) {
			socket.on("updateConversation", (dataConver: any) => {
				setConversation((prev) => {
					const dataFilter = prev?.content?.filter(
						(item) => item?._id !== dataConver?._id,
					);
					return {
						...prev,
						content: [dataConver, ...dataFilter],
					};
				});
			});
		}
	}, [isLoad]);
	return (
		<div className="flex flex-col h-full">
			<div className="p-4 border-b">
				<h1 className=" text-xl font-semibold">Messages</h1>
			</div>
			<div className="flex-1 overflow-y-auto scroll-custom">
				<div className="p-2">
					<h3 className="px-2 py-1 text-sm text-gray-500">ACTIVE CHATS</h3>
					{conversation?.content.map((chat) => (
						<Link to={"/admin/chat/" + chat?._id} key={chat._id}>
							<div
								className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
								onClick={() => {}}
							>
								<div className="relative">
									<Avatar>
										<AvatarImage src={chat?.user?.avatarUrl} />
										<AvatarFallback>{chat.user.full_name[0]}</AvatarFallback>
									</Avatar>
								</div>
								<div className="flex-1">
									<div className="flex justify-between">
										<span className="font-medium">{chat.user.full_name}</span>
										<span className="text-xs text-gray-500">
											{calculateTimeDistance(chat?.lastMessage, true)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className={cn("text-sm text-gray-500 line-clamp-1")}>
											{chat.lastSender === "ADMIN" && "Bạn: "}
											{chat.lastContent}
										</span>
										{/* {chat.unread && (
											<Badge variant="secondary" className="bg-green-100">
												{chat.unread}
											</Badge>
										)} */}
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
			<div className="w-full h-6 bg-white"></div>
		</div>
	);
};

export default Conversation;
