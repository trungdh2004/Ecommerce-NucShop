import { cn } from "@/lib/utils";
import { useOpenSidebar } from "@/store/useSidebarAdmin";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";

interface Props {
	Icon: IconType;
	label: string;
	path: string;
	isAction: boolean;
	isParent?:boolean
}

const SidebarItem = ({ Icon, label, path, isAction , isParent }: Props) => {
	const { setClose } = useOpenSidebar();

	return (
		<Link to={path} onClick={setClose}>
			<div
				className={cn(
					"h-10 px-4 group py-3 gap-2 flex items-center hover:bg-[rgba(24,119,242,0.08)] rounded-md cursor-pointer mt-2",
					isAction && "bg-[rgba(24,119,242,0.08)]",
					isParent && "font-semibold"
				)}
			>
				{!!Icon && (
					<Icon
						className={cn(
							"group-hover:text-blue-500 text-[#4b5563]",
							isAction && "text-blue-500",
						)}
						size={18}
					/>
				)}

				<span
					className={cn(
						"group-hover:text-blue-500 text-[#4b5563] text-sm",
						isAction && "text-blue-500",
					)}
				>
					{label}
				</span>
			</div>
		</Link>
	);
};

export default SidebarItem;
