import { LogoNucSVG } from "@/assets/svg";
import { Link } from "react-router-dom";

const HeaderOrder = () => {
	return (
		<div className="bg-white w-full lg:h-[100px] h-[70px] flex items-center border border-gray-200 box-shadow">
			<div className="flex items-center gap-4 lg:px-[130px] md:px-[65px] px-0">
				<Link to={"/"}>
					<LogoNucSVG width={70} />
				</Link>
				<span className="text-sm lg:text-xl">|</span>
				<span className="text-sm lg:text-2xl">Thanh toán</span>
			</div>
		</div>
	);
};

export default HeaderOrder;
