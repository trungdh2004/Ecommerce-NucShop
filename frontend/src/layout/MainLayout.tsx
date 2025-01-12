import ChatAction from "@/components/chat/ChatAction";
import FooterV2 from "@/components/client/FooterV2";
import Header from "@/components/client/Header";
import { cn } from "@/lib/utils";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";

const MainLayout = () => {
	const location = useLocation();
	return (
		<div className="bg-[#fafafa]">
			{/* <div className="bg-magic"></div> */}
			{/* <OverlayVioletV2 /> */}
			{/* {location.pathname == "/" ? <HeaderAndSlider /> : <Header />} */}
			<Header />
			<main className={cn(" ", location.pathname == "/" && "mt-0")}>
				<Outlet />
			</main>
			{/* <Footer /> */}
			<FooterV2 />

			<ChatAction />
			<ScrollRestoration />
		</div>
	);
};

export default MainLayout;
