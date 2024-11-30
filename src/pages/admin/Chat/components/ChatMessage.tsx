import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IMessage } from "./ChatContent";
import { TooltipComponent } from "@/components/common/TooltipComponent";
import { formatDateMessage } from "@/common/func";

const ChatMessage = ({
	
	user,
	content,
	sender,
	avatar,
	createdAt,
}: IMessage & {avatar:string}) => (
	<div
		className={`flex ${sender === "ADMIN" ? "justify-end" : "justify-start"} mb-4`}
	>
		{sender === "USER" && (
			<Avatar className="w-8 h-8 mr-2">
				<AvatarImage src={avatar} />
				<AvatarFallback>{user?.full_name?.[0] || "T"}</AvatarFallback>
			</Avatar>
		)}
		<div
			className={`max-w-[70%] ${sender === "ADMIN" ? "bg-purple-500 text-white" : "bg-gray-100"} cursor-pointer rounded-2xl px-4 py-2`}
		>
			<TooltipComponent label={formatDateMessage(createdAt)} side="left">
				<p>{content}</p>
			</TooltipComponent>
		</div>
	</div>
);
export default ChatMessage;
