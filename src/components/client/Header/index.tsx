import { cn } from "@/lib/utils";
import Actions from "./Actions";
import Menu from "./Menu";
import MenuMobile from "./MenuMobile";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

const Header = () => {
	const location = useLocation();
	const [isScroll, setIsScroll] = useState(false);

	const handleScroll = useCallback(() => {
		setIsScroll(window.scrollY > 100);
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	return (
		<div
			className={cn(
				" w-full top-0 z-50  padding",
				location.pathname === "/"
					? "bg-transparent fixed"
					: "backdrop-blur-md fixed",
				isScroll && "backdrop-blur-md",
			)}
		>
			<div className="flex items-center justify-between h-16 max-w-full">
				<div className="block md:hidden">
					<MenuMobile />
				</div>
				<div className="absolute max-sm:-translate-x-1/2 top-1/2 left-1/2 max-sm:-translate-y-1/2 sm:static sm:flex sm:items-center">
					<img src="/NUC.svg" alt="" className="size-[50px]"/>
				</div>
				<Menu />
				<Actions />
			</div>
		</div>
	);
};



export default Header;
