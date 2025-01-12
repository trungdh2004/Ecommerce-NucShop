import { useEffect, useState } from "react";
type Props = {
	date: Date;
};
const Countdown = ({ date }: Props) => {
	const calculateTimeLeft = () => {
		const targetDate = new Date(date).getTime();
		const now = new Date().getTime();
		const difference = targetDate - now;

		let timeLeft = {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
		};

		if (difference > 0) {
			timeLeft = {
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60),
			};
		}

		return timeLeft;
	};
	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);

		return () => clearInterval(timer);
	}, [date]);

	const TimeUnit = ({ value, label }: { value: string; label: string }) => (
		<div className="flex flex-col items-center">
			<span className="flex items-center justify-center text-2xl font-medium text-gray-800 bg-white rounded-full size-12 md:size-20">
				{value}
			</span>
			<span className="text-sm text-gray-500 uppercase">{label}</span>
		</div>
	);

	const TimeSeparator = () => (
		<span className="pb-5 mx-2 text-2xl font-medium text-gray-800">:</span>
	);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center">
				<TimeUnit value={String(timeLeft.days).padStart(2, "0")} label="Ngày" />
				<TimeSeparator />
				<TimeUnit value={String(timeLeft.hours).padStart(2, "0")} label="Giờ" />
				<TimeSeparator />
				<TimeUnit
					value={String(timeLeft.minutes).padStart(2, "0")}
					label="Phút"
				/>
				<TimeSeparator />
				<TimeUnit
					value={String(timeLeft.seconds).padStart(2, "0")}
					label="Giây"
				/>
			</div>
		</div>
	);
};

export default Countdown;
