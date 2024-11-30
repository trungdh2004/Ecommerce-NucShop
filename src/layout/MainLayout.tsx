import ChatAction from "@/components/chat/ChatAction";
import Footer from "@/components/client/Footer";
import Header from "@/components/client/Header";
import OverlayVioletV2 from "@/components/OverlayVioletV2";
import { cn } from "@/lib/utils";
import HeaderAndSlider from "@/pages/clients/home/HeaderAndSlider";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";

const MainLayout = () => {
	const location = useLocation();
	return (
		<div>
			{/* <div className="bg-magic"></div> */}
			<OverlayVioletV2 />
			{/* {location.pathname == "/" ? <HeaderAndSlider /> : <Header />} */}
			<Header />
			<main className={cn("mt-[64px]",location.pathname == "/" && "mt-0")}>
				<Outlet />
			</main>
			<Footer />

			<ChatAction />
			<ScrollRestoration />
		</div>
	);
};

export default MainLayout;
