import { useAuth } from "@/hooks/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarListShipper from "./SidebarList";
import useStoreShipper from "@/store/useCurrentShipper";
import { BsCoin } from "react-icons/bs";
import { formatCurrency } from "@/common/func";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { optimizeCloudinaryUrl } from "@/common/localFunction";

const SidebarShipper = () => {
	const { authUser } = useAuth();
	const { current } = useStoreShipper();

	return (
		<ScrollArea className="w-full lg:w-[280px] h-full overflow-y-auto lg:border-r border-blue-400 bg-blue-100/50 border-dashed pb-4">
			{/* user */}
			<div className="p-4 sticky top-[0px]  backdrop-blur-sm z-10">
				<div className="rounded-md bg-gray-current h-[60px] flex items-center px-5 ">
					<div className="w-10 h-10 rounded-full mr-2 border">
					
						<Avatar>
							<AvatarImage src={optimizeCloudinaryUrl(current?.avatar as string,40,40) || "/avatar_25.jpg"} alt="@avatar" className="rounded-full w-full h-full border border-gray-400"/>
							<AvatarFallback>T</AvatarFallback>
						</Avatar>
					</div>
					<div className="text-sm font-semibold flex-1">
						<p>{current?.fullName}</p>
						<div className="flex items-center w-full">
							<div className="size-5 flex items-center justify-center text-yellow-500">
								<BsCoin size={16} />
							</div>
							<p>{formatCurrency(current?.totalIncome as number)}</p>
						</div>
					</div>
				</div>
			</div>
			{/* list */}
			<div className="px-4 w-full">
				{/* dashboard */}

				{/* list con */}
				<SidebarListShipper />
			</div>
		</ScrollArea>
	);
};

export default SidebarShipper;
