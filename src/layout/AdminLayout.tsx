import HeaderAdmin from "@/components/admin/header/HeaderAdmin";
import Sidebar from "@/components/admin/sidebar/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useOpenSidebar } from "@/store/useSidebarAdmin";
import { useMediaQuery } from "usehooks-ts";

const AdminLayout = () => {
	const matches = useMediaQuery("(min-width: 1024px)");
	const { isOpen, setClose } = useOpenSidebar();

	useEffect(() => {
		if (matches) {
			setClose();
		}
	}, [matches]);
	return (
		<div className="scroll-custom flex bg-main min-h-[100vh] overflow-y-auto">
			<Sheet open={isOpen} onOpenChange={setClose}>
				<SheetContent className="p-0 !max-w-[300px] z-[101]" side={"left"}>
					<Sidebar />
				</SheetContent>
			</Sheet>
			<div className="fixed top-0 left-0 bottom-0 hidden lg:block">
				<Sidebar />
			</div>
			<div className="lg:pl-[280px] w-full">
				{/* header */}
				<HeaderAdmin />
				<div className="pb-4 pt-[80px] md:pb-10 px-4 md:px-8">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default AdminLayout;
