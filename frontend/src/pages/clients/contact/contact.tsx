
const contact = () => {
	return (
		<div className="bg-white">
			<div className="py-12 bg-pink-100">
				<div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-lg">
					<div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
						<img
							src="https://th.bing.com/th/id/R.38fa125e216cf97d18e2ab141d7c2836?rik=6bOYUiLqRNdUBg&riu=http%3a%2f%2fwww.elle.vn%2fwp-content%2fuploads%2f2017%2f07%2f20%2fBo-anh-thoi-trang-Anh-sang-phuc-hung-3.jpg&ehk=7HcQJYJXZYtviIJTPGKlk4%2fkQ2%2f3IZQEisBMCSlJOeg%3d&risl=&pid=ImgRaw&r=0"
							alt="Profile"
							className="object-cover w-64 h-64 rounded-full lg:w-80 lg:h-80"
						/>
						<div className="w-full">
							<h2 className="mb-4 text-2xl font-bold text-gray-800">
								Bạn cần hỗ trợ?
							</h2>
							<p className="mb-6 text-gray-600">
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
									className="px-4 py-2 text-white bg-black rounded"
								>
									Gửi
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default contact;
