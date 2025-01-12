import { cn } from "@/lib/utils";
import { useProcessBarLoading } from "@/store/useSidebarAdmin";

const ProgessBarLoading = () => {
	const { isOpen } = useProcessBarLoading();
	return (
		<div
			className={cn(
				"w-full hidden fixed bottom-0 inset-x-0 z-[99999999]",
				isOpen && "block",
			)}
		>
			<div className="h-1.5 w-full bg-blue-100 overflow-hidden">
				<div className="progress w-full h-full bg-blue-500 left-right"></div>
			</div>
		</div>
	);
};

export default ProgessBarLoading;
