import { Skeleton } from "@/components/ui/skeleton";

const SkeletonVariant = () => {
	return (
		<div className="flex items-center gap-2">
			<Skeleton className="w-24 h-10" />
			<Skeleton className="w-24 h-10" />
			<Skeleton className="w-24 h-10" />
			<Skeleton className="w-24 h-10" />
			<Skeleton className="w-24 h-10" />
		</div>
	);
};

export default SkeletonVariant;
