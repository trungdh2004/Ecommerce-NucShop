import React from "react";

const ContactPage: React.FC = () => {
	return (
		<div className="bg-white">
			{/* Header Section */}
			<div className="bg-pink-100 py-12">
				<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
					<div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
						<img
							src="/image.jpg"
							alt="Profile"
							className="rounded-full object-cover w-64 h-64 lg:w-80 lg:h-80"
						/>
						<div className="w-full">
							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								Bạn cần hỗ trợ?
							</h2>
							<p className="text-gray-600 mb-6">
								Celah rất hân hạnh được hỗ trợ bạn, hãy để lại thông tin cho
								chúng tôi nhé. Yêu cầu của bạn sẽ được xử lý và phản hồi trong
								thời gian sớm nhất.
							</p>
							<form className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Họ tên*
									</label>
									<input
										type="text"
										className="w-full p-2 border border-gray-300 rounded"
										placeholder="Tên đầy đủ"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Email*
									</label>
									<input
										type="email"
										className="w-full p-2 border border-gray-300 rounded"
										placeholder="Địa chỉ email"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Tin nhắn
									</label>
									<textarea
										className="w-full p-2 border border-gray-300 rounded"
										rows={4}
										placeholder="Đừng ngại hỏi về đơn hàng của bạn"
									></textarea>
								</div>
								<button
									type="submit"
									className="bg-black text-white px-4 py-2 rounded"
								>
									Gửi
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* Company Information Section */}
			<div className="bg-white py-8">
				<div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div>
						<h3 className="text-lg font-bold text-gray-800">
							CÔNG TY TNHH SOCIAL BELLA VIỆT NAM
						</h3>
						<p className="text-gray-600 mt-2">
							Celah beauty là kênh ưa mua sắm mỹ phẩm, làm đẹp hàng đầu Việt Nam
						</p>
						<p className="text-gray-600 mt-4">
							Hồ Chí Minh: Lầu 10, Tòa nhà HD Bank, 25Bis Nguyễn Thị Minh Khai,
							P. Bến Nghé, Q.1, TP.HCM
						</p>
						<p className="text-gray-600">
							Hà Nội: Tầng 12, Tòa nhà Ladeco, 266 Đội Cấn, Phường Liễu Giai,
							Quận Ba Đình, TP. Hà Nội
						</p>
						<p className="text-gray-600 mt-4">
							Giấy chứng nhận đăng ký doanh nghiệp số: 0316375266
						</p>
					</div>
					<div>
						<h3 className="text-lg font-bold text-gray-800">
							LIÊN HỆ VỚI CHÚNG TÔI
						</h3>
						<p className="text-gray-600 mt-2">Email: support@sapovn</p>
						<p className="text-gray-600">CSKH: 19006750</p>
						<p className="text-gray-600">
							Thời gian làm việc: 8h - 21h (Thứ 2 - Thứ 7)
						</p>
						<p className="text-gray-600">
							Fanpage:{" "}
							<a
								href="https://www.facebook.com/sapo.vn"
								className="text-custom"
							>
								https://www.facebook.com/sapo.vn
							</a>
						</p>
					</div>
				</div>
			</div>

			{/* Subscription Section */}
			<div className="bg-orange-200 py-6">
				<div className="max-w-4xl mx-auto flex items-center justify-between">
					<p className="text-gray-800">
						NHẬN THÔNG TIN KHUYẾN MÃI TỪ CHÚNG TÔI
					</p>
					<form className="flex gap-2">
						<input
							type="email"
							placeholder="Nhập địa chỉ email"
							className="p-2 border border-gray-300 rounded w-full lg:w-64"
						/>
						<button
							type="submit"
							className="bg-black text-white px-4 py-2 rounded"
						>
							Gửi
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;
