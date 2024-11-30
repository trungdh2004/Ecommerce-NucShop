import { useAuth } from "@/hooks/auth";
import SidebarList from "./SidebarList";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar = () => {
	const { authUser } = useAuth();

	return (
		<ScrollArea className="w-full lg:w-[280px] h-full overflow-y-auto lg:border-r border-dashed pb-4">
			{/* user */}
			<div className="p-4 sticky top-[0px] bg-main backdrop-blur-sm z-10">
				<div className="rounded-md bg-gray-current h-[60px] flex items-center px-5 ">
					<div className="w-10 h-10 rounded-full mr-2 border">
						<img
							src={authUser?.avatarUrl || "/avatar_25.jpg"}
							alt=""
							className="rounded-full w-full h-full"
						/>
					</div>
					<div className="text-sm font-semibold">{authUser?.full_name}</div>
				</div>
			</div>
			{/* list */}
			<div className="px-4 w-full">
				{/* dashboard */}

				{/* list con */}
				<SidebarList />
			</div>
		</ScrollArea>
	);
};

export default Sidebar;
