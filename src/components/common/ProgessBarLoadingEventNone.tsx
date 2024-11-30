import { cn } from "@/lib/utils";
import { useProcessBarLoadingEventNone } from "@/store/useSidebarAdmin";

const ProgessBarLoadingEventNone = () => {
	const { isOpen } = useProcessBarLoadingEventNone();
	return (
		<div
			className={cn(
				"w-full  fixed  inset-0 z-[99999999] bg-black/30 ",
				isOpen ? "block" : "hidden",
			)}
		>
			<div className="absolute flex items-end gap-1 font-semibold text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
				Vui lòng chờ trong giây lát{" "}
				<div className="flex items-center gap-0.5 mb-1">
					<div className="h-1.5 w-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
					<div className="h-1.5 w-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
					<div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
				</div>
			</div>
			<div className="absolute inset-x-0 bottom-0">
				<div className="h-1.5 w-full bg-blue-100 overflow-hidden">
					<div className="w-full h-full bg-blue-500 progress left-right"></div>
				</div>
			</div>
		</div>
	);
};

export default ProgessBarLoadingEventNone;
