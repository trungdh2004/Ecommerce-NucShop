import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
const Slider = () => {
	return (
		<div className="overflow-hidden h-auto md:h-screen flex items-start justify-between gap-5 pl-4 lg:pl-10 mb-10">
			<div className="space-y-5 mt-10 md:mt-28">
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1.5 }}
				>
					<h2 className="text-3xl md:text-6xl font-bold max-w-[280px] md:max-w-[650px] text-blue-800">
						Chúng tôi đang thay đổi cách mọi người kết nối
					</h2>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1.5 }}
				>
					<p className="text-sm md:text-2xl text-black/50 max-w-[280px] md:max-w-3xl">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
						saepe perspiciatis esse ipsum nostrum minus ratione corrupti
						doloribus assumenda vitae mollitia earum vero magni maiores
						voluptatum fugiat error aliquid quos.
					</p>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1.5 }}
				>
					<Button className="px-5 py-3 md:px-14 md:py-7 capitalize text-base md:text-xl bg-custom-500 hover:bg-custom-400">
						Mua ngay
					</Button>
				</motion.div>
			</div>
			<div className=" flex items-center gap-9 -mr-10">
				<div className=" flex-col hidden lg:flex">
					<motion.div
						initial={{ x: -100 }}
						animate={{ x: 0, transition: { duration: 1.5 } }}
						whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}
					>
						<div className="w-[185px] h-[250px]">
							<img
								className="w-full h-full object-cover rounded-2xl"
								src="slider-1.png"
								alt=""
							/>
						</div>
					</motion.div>
				</div>
				{/*  */}
				<div className="flex flex-col gap-6">
					<motion.div
						initial={{ y: -100 }}
						animate={{ y: 0, transition: { duration: 1.5 } }}
						whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}
					>
						<div className="relative sm:static -right-5 sm:right-0 sm:ml-0 w-[100px] h-[150px]  sm:w-[185px] sm:h-[250px] ">
							<img
								className="w-full h-full object-cover rounded-2xl"
								src="slider-2.png"
								alt=""
							/>
						</div>
					</motion.div>
					<motion.div
						initial={{ y: 100 }}
						animate={{ y: 0, transition: { duration: 1.5 } }}
						whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}
					>
						<div className="w-[100px] h-[150px]  sm:w-[185px] sm:h-[250px]">
							<img
								className="w-full h-full object-cover rounded-2xl"
								src="slider-2.png"
								alt=""
							/>
						</div>
					</motion.div>
				</div>
				{/*  */}
				<div className="hidden sm:flex flex-col gap-6 mb-12  ">
					<motion.div
						initial={{ y: -100 }}
						animate={{ y: 0, transition: { duration: 1.5 } }}
						whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}
					>
						<div className="w-[180px] h-[254px]">
							<img
								className="w-full h-full object-cover rounded-2xl"
								src="slider-3.png"
								alt=""
							/>
						</div>
					</motion.div>
					<motion.div
						initial={{ y: 100 }}
						animate={{ y: 0, transition: { duration: 1.5 } }}
						whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}
					>
						<div className="w-[180px] h-[254px]">
							<img
								className="w-full h-full object-cover rounded-2xl"
								src="slider-3.png"
								alt=""
							/>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default Slider;
