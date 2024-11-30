import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import Conversation from "./components/Conversation";


const LayoutChat = () => {

	const checkNavigate = window.location.pathname === "/admin/chat";

	return (
		<>
			<div className="grid grid-cols-3 gap-4 h-[calc(100vh-120px)]">
				<div
					className={cn(
						"h-full flex flex-col col-span-3 md:col-span-1 border box-shadow bg-white rounded-md overflow-hidden ",
						checkNavigate ? "max-md:block" : "max-md:hidden",
					)}
				>
					<Conversation />
				</div>
				<div
					className={cn(
						"h-full col-span-2 max-md:col-span-3 bg-white border rounded-md box-shadow  overflow-hidden ",
						checkNavigate ? "max-md:hidden" : "max-md:block",
					)}
				>
					<Outlet />
				</div>
			</div>
		</>
	);
};

export default LayoutChat;
