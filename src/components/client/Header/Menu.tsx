import { NavLink } from "react-router-dom";

const Menu = () => {
	return (
		<div className="hidden md:block">
			<ul className="text-black font-medium flex items-center justify-center gap-x-5 *:py-0.5 *:border-b-[3px] *:border-transparent transition-all ">
				<li className=" hover:border-blue-500 hover:text-blue-500 has-[.active]:border-blue-500 has-[.active]:text-blue-500 cursor-pointer">
					<NavLink to={"/"}>Trang chủ</NavLink>
				</li>
				<li className="hover:border-blue-500 hover:text-blue-500 has-[.active]:border-blue-500 has-[.active]:text-blue-500 cursor-pointer">
					<NavLink to={"/shop"}>Sản phẩm </NavLink>
				</li>
				<li className="hover:border-blue-500 hover:text-blue-500 has-[.active]:border-blue-500 has-[.active]:text-blue-500 cursor-pointer">
					<NavLink to={"/blogs"}>Bài viết</NavLink>
				</li>
				<li className="hover:border-blue-500 hover:text-blue-500 has-[.active]:border-blue-500 has-[.active]:text-blue-500 cursor-pointer">
					<NavLink to={"/contacts"}>Liên hệ </NavLink>
				</li>
				<li className="hover:border-blue-500 hover:text-blue-500 has-[.active]:border-blue-500 has-[.active]:text-blue-500 cursor-pointer">
					<NavLink to={"/introduce"}>Giới thiệu</NavLink>
				</li>
			</ul>
		</div>
	);
};

export default Menu;
