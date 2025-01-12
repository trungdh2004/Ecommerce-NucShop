import { LogoNucSVG } from "@/assets/svg";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineMail, MdOutlinePhoneInTalk } from "react-icons/md";
import { Link } from "react-router-dom";

const FooterV2 = () => {
	return (
		<div
			className="padding mx-auto bg-black *:text-white relative"
			style={{ boxShadow: "0 15px 30px 5px rgba(0, 0, 0, 0.3)" }}
		>
			<div className="pt-10 grid md:grid-cols-2 lg:grid-cols-4 *:border-b-[1px] *:border-b-white *:mb-5 *:md:border-none">
				<div className="*:flex *:items-center *:gap-x-3 *:pb-6">
					<Link to="/" className="text-4xl font-bold ">
						<LogoNucSVG width={50} color="#fff" />
					</Link>
					<Link to={`/`} className="">
						<MdOutlinePhoneInTalk className="text-2xl" />
						1900 1188
					</Link>
					<Link to={`/`} className="">
						<MdOutlineMail className="text-2xl" />
						duantn@gmail.com
					</Link>
					<Link to={`/`} className="">
						<IoLocationOutline className="text-2xl" />
						Dị nậu , Thạch Thất , Hà Nội
					</Link>
				</div>
				<div className="*:flex *:items-center *:gap-x-3 *:pb-6 ">
					<Link to={`/introduce`} className="text-xl font-semibold uppercase ">
						Giới thiệu
					</Link>
					<Link to={`/introduce`} className="">
						Giới thiệu
					</Link>
					<Link to={`/blogs`} className="">
						Tin tức
					</Link>
					<Link to={`/`} className="">
						Hệ thống của hàng
					</Link>
					<Link to={`/contacts`} className="">
						Liên hệ
					</Link>
					<Link to={`/`} className="">
						Chính sách bảo mật
					</Link>
				</div>
				<div className="*:flex *:items-center *:gap-x-3 *:pb-6 ">
					<Link to={`/`} className="text-xl font-semibold uppercase ">
						Hỗ trợ khách hàng
					</Link>
					<Link to={`/`} className="">
						Hỏi đáp
					</Link>
					<Link to={`/`} className="">
						Chính sách phát triển
					</Link>
					<Link to={`/`} className="">
						Hướng dẫn chọn kích cỡ
					</Link>
					<Link to={`/`} className="">
						Hướng dẫn thanh toán
					</Link>
					<Link to={`/`} className="">
						Quy định đổi hàng
					</Link>
					<Link to={`/`} className="">
						Hướng dẫn mua hàng
					</Link>
				</div>
				<div className="*:flex *:items-center *:gap-x-5 *:pb-6 ">
					<Link to={`/`} className="text-xl font-semibold uppercase ">
						Kết nối
					</Link>
					<div className="">
						<Link to={`/`} className="">
							<img src="/facebook.png" alt="" className="w-10 h-10" />
						</Link>
						<Link to={`/`} className="">
							<img src="/youtube.png" alt="" className="w-10 h-10" />
						</Link>
						<Link to={`/`} className="">
							<img src="/instagram.png" alt="" className="w-10 h-10" />
						</Link>
						<Link to={`/`} className="">
							<img src="/tik-tok.png" alt="" className="w-10 h-10" />
						</Link>
					</div>
					<Link to={`/`} className="text-xl font-semibold uppercase ">
						Phương thức thanh toán
					</Link>
					<img src="https://canifa.com/assets/images/pay.svg" alt="" />
				</div>
			</div>

			<hr className="hidden md:block" />
			<div className="flex items-center justify-between">
				<p className="font-semibold text-center text-white md:py-5">
					© 2024 NUCSHOP
				</p>
				<div className="flex flex-col items-center gap-4 lg:flex-row md:flex-row">
					<img src="/dmca.png" alt="" />
					<img src="/bocongthuong.png" alt="" />
				</div>
			</div>
		</div>
	);
};

export default FooterV2;
