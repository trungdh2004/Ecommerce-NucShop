import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ChatContent from "./components/ChatContent";
import Conversation from "./components/Conversation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

const ChatIndex = () => {
	const matches = useMediaQuery("(max-width: 768px)"); 
	const [selectedChat, setSelectedChat] = useState<string>('');
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); 
	useEffect(() => {
		handleDialogOpenChange(Boolean(selectedChat))
	}, [ selectedChat]);

	const handleDialogOpenChange = (open: boolean) => {
		setIsDialogOpen(open);
		if (!open) {
			setSelectedChat(''); 
		}
	};
	return (
		<>
			<div className="grid grid-cols-3 gap-4 h-[calc(100vh-120px)]">
				<div className="h-full col-span-3 bg-white border rounded-md md:col-span-1 box-shadow">
					<Conversation setSelectedChat={setSelectedChat} />
				</div>
				{!matches && ( 
					<div className="hidden h-full col-span-2 bg-white border rounded-md box-shadow md:block">
						<div className="h-full ">
							<ChatContent />
						</div>
					</div>
				)}
			</div>
			{matches && ( 
				<Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
					<DialogTitle/>
					<DialogContent  className="w-screen h-screen max-w-full p-0 md:hidden">
					<div className="w-screen h-screen max-w-full p-0 ">
						<ChatContent />
					</div>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
};

export default ChatIndex;
