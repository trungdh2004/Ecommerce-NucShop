import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const DealOfTheDays = () => {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const updateTime = () => {
		const now = new Date().getTime();
		const distance = new Date(1724402089041).getTime() - now;

		// Tính toán thời gian còn lại
		const days = Math.floor(distance / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
		);
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((distance % (1000 * 60)) / 1000);
		setTimeLeft({
			days,
			hours,
			minutes,
			seconds,
		});
	};

	useEffect(() => {
		const timer = setInterval(updateTime, 1000);
		return () => clearInterval(timer);
	}, []);

	const commits = [
		{
			id: 1,
		},
		{
			id: 2,
		},
		{
			id: 3,
		},
		{
			id: 4,
		},
	];

	return (
		<div className="bg-white relative mt-20 flex items-center justify-center">
			<div className="flex flex-wrap items-center justify-around p-8 flex-1 gap-10 md:mt-24 bg-white">
				<div className="">
					<div
						className="flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 size-[250px] md:size-[400px]"
						style={{ borderRadius: "35% 65% 72% 28% / 39% 47% 53% 61%" }}
					>
						<img
							className="w-full h-full object-cover"
							src="sale.png"
							alt="Túi xách da màu nâu"
						/>
					</div>
				</div>
				<div className="space-y-5 md:space-y-14 padding">
					<h2 className="text-xl md:text-3xl font-semibold">Deal của ngày</h2>
					<ul className="flex items-center gap-5 md:gap-8 font-semibold text-black/65  text-lg">
						{[
							{ en: "days", vi: "Ngày" },
							{ en: "hours", vi: "Giờ" },
							{ en: "minutes", vi: "Phút" },
							{ en: "seconds", vi: "Giây" },
						].map((unit, index) => (
							<li key={index} className="space-x-1">
								<span className=" md:text-5xl">
									{timeLeft[unit.en as keyof typeof timeLeft]}
								</span>
								<span className="uppercase">{unit.vi}</span>
							</li>
						))}
					</ul>
					<Button className="uppercase px-10 rounded-3xl bg-red-500 hover:bg-red-700 text-white">
						Mua ngay
					</Button>
				</div>
			</div>
			<div className="hidden  md:inline-block absolute -translate-x-1/2 left-1/2 -top-16 rounded-2xl bg-white  py-8 px-14 box-shadow">
				<ul className="flex  items-center justify-center gap-14">
					{commits?.map((commit) => (
						<li key={commit.id} className="space-y-3">
							<div className="flex items-center gap-4">
								<span className="inline-block size-7 bg-[#E0F7DA] rounded-lg"></span>
								<p className="font-bold text-base text-nowrap">Fast ship</p>
							</div>
							<span className="text-xs text-[#8E8E8E] line-clamp-2">
								Giao hàng nhanh gọn và đơn đảm bảo
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default DealOfTheDays;
