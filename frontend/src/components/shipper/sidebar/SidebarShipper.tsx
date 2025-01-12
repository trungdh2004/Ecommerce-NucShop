import { formatCurrency } from "@/common/func";
import { optimizeCloudinaryUrl } from "@/common/localFunction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import useStoreShipper from "@/store/useCurrentShipper";
import { BsCoin } from "react-icons/bs";
import SidebarListShipper from "./SidebarList";

const SidebarShipper = () => {
	const { current } = useStoreShipper();

	return (
		<ScrollArea className="w-full lg:w-[280px] h-full overflow-y-auto lg:border-r border-blue-400 bg-blue-100/50 border-dashed pb-4">
			{/* user */}
			<div className="p-4 sticky top-[0px]  backdrop-blur-sm z-10">
				<div className="rounded-md bg-gray-current h-[60px] flex items-center px-5 ">
					<div className="w-10 h-10 mr-2 border rounded-full">
						<Avatar>
							<AvatarImage
								src={
									optimizeCloudinaryUrl(current?.avatar as string, 40, 40) ||
									"/avatar_25.jpg"
								}
								alt="@avatar"
								className="w-full h-full border border-gray-400 rounded-full"
							/>
							<AvatarFallback>T</AvatarFallback>
						</Avatar>
					</div>
					<div className="flex-1 text-sm font-semibold">
						<p>{current?.fullName}</p>
					</div>
				</div>
			</div>
			{/* list */}
			<div className="w-full px-4">
				{/* dashboard */}

				{/* list con */}
				<SidebarListShipper />
			</div>
		</ScrollArea>
	);
};

export default SidebarShipper;
