import { useEffect, useState } from "react";

const IntroducePage = () => {
	const [showButton, setShowButton] = useState(false);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		const handleScroll = () => {
			if (window.pageYOffset > 300) {
				setShowButton(true);
			} else {
				setShowButton(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return (
		<div className="w-full px-4 sm:px-6 lg:px-8">
			<h1 className="text-center pt-10 text-[16px] sm:text-[18px]">
				VỀ CHÚNG TÔI
			</h1>
			<h2 className="text-center text-[20px] sm:text-[22px] pt-3 pb-8">
				THƯƠNG HIỆU THỜI TRANG NUCSHOP
			</h2>
			<div className="flex flex-col justify-between md:flex-row">
				<p className="w-full md:w-[38%] md:ml-28 text-[14px] sm:text-[16px] text-[#544e46]">
					Tại NUCSHOP, chúng tôi tự hào mang đến cho bạn những thiết kế áo thời
					thượng, trẻ trung và đậm chất cá nhân. Với sứ mệnh giúp bạn thể hiện
					gu thẩm mỹ độc đáo của riêng mình, mỗi sản phẩm của chúng tôi đều được
					chọn lựa và thiết kế tỉ mỉ để mang lại sự thoải mái, tự tin và phong
					cách. Đặc biệt, chúng tôi luôn cập nhật những xu hướng mới nhất để bạn
					có thể tự do khám phá và tỏa sáng.
				</p>
				<p className="w-full md:w-[38%] md:mr-28 text-[14px] sm:text-[16px] text-[#544e46] mt-4 md:mt-0">
					Dù bạn đang tìm kiếm một chiếc áo đơn giản cho ngày thường hay muốn
					nổi bật trong những dịp đặc biệt, NC luôn có những lựa chọn phù hợp.
					Hãy khám phá ngay bộ sưu tập của chúng tôi và tìm cho mình một phong
					cách riêng! Với nhiều mẫu áo đa dạng, từ phong cách đơn giản, tinh tế
					đến năng động, phá cách, NC mang đến cho bạn sự lựa chọn phong phú để
					thể hiện cá tính trong mọi hoàn cảnh.
				</p>
			</div>
			<div className="flex flex-col justify-between md:flex-row pt-14">
				<img
					src="https://theme.hstatic.net/200000690725/1001078549/14/about01_introduce1_img.jpg?v=549"
					alt=""
					className="w-full md:w-[50%] transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-700 hover:text-white hover:rounded-lg cursor-pointer"
				/>
				<div className="mt-8 md:mt-0 md:mr-28">
					<h3 className="text-center pt-16 font-sans text-[16px] sm:text-[18px]">
						NUCSHOP
					</h3>
					<h2 className="text-center text-[20px] sm:text-[22px] pt-1 pb-8">
						CÂU CHUYỆN THƯƠNG HIỆU
					</h2>
					<p className="w-full md:w-[500px] text-[14px] sm:text-[16px] text-[#544e46]">
						NUCSHOP không chỉ là một thương hiệu thời trang, mà là kết quả của
						niềm đam mê và sự cống hiến không ngừng. Được thành lập từ khát khao
						mang đến cho giới trẻ một không gian để thể hiện cá tính thông qua
						thời trang, NUCSHOP đã trải qua một hành trình đầy thử thách và cảm
						hứng. Theo thời gian, NUCSHOP dần mở rộng và phát triển với nhiều bộ
						sưu tập đa dạng, không chỉ mang đến sự thời thượng mà còn khẳng định
						cá tính của từng người mặc.
					</p>
				</div>
			</div>
			<div className="flex flex-col md:flex-row pt-20 justify-between mb-[80px]">
				<div className="pt-10 md:ml-20">
					<h3 className="text-center pt-8 font-light text-[16px] sm:text-[18px]">
						MODE FASHION
					</h3>
					<h2 className="text-center text-[20px] sm:text-[22px] pt-1 pb-8">
						GIÁ TRỊ CỐT LÕI
					</h2>
					<p className="w-full md:w-[500px] text-[14px] sm:text-[16px] text-[#544e46]">
						Chúng tôi cam kết mang đến những sản phẩm có chất lượng tốt nhất, từ
						chất liệu đến kiểu dáng. Mỗi sản phẩm đều được kiểm tra kỹ lưỡng để
						đảm bảo sự thoải mái, bền bỉ và đẹp mắt cho người mặc. NUCSHOP không
						ngừng đổi mới để mang đến cho khách hàng những thiết kế độc đáo và
						thời thượng nhất. Chúng tôi luôn bắt kịp xu hướng thời trang, nhưng
						vẫn giữ được nét riêng biệt, sáng tạo trong từng sản phẩm.
					</p>
				</div>
				<img
					className="w-full md:w-[50%] transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-700 hover:text-white hover:rounded-lg cursor-pointer"
					src="https://theme.hstatic.net/200000690725/1001078549/14/about01_introduce2_img.jpg?v=549"
					alt=""
				/>
			</div>
			{showButton && (
				<button
					onClick={scrollToTop}
					className="fixed px-4 py-2 font-bold text-white transition-opacity duration-300 bg-gray-600 rounded-full bottom-5 right-5 hover:bg-gray-800"
				>
					&#x2191;
				</button>
			)}
		</div>
	);
};

export default IntroducePage;
