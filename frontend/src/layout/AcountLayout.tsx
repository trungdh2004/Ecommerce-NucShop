import { optimizeCloudinaryUrl } from "@/common/localFunction";
import sidebarAccount from "@/config/sidebarAccount";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { Outlet, useNavigate } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";

const itemVariants: Variants = {
	open: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
	closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const AccountLayout = () => {
	const [isOpen, setIsOpen] = useState(true);
	const { authUser } = useAuth();
	const isMobile = useMediaQuery("(max-width: 1024px)");
	const router = useNavigate();

	useEffect(() => {
		if (isMobile) {
			setIsOpen(false);
		} else {
			setIsOpen(true);
		}
	}, [isMobile]);

	const location = window.location.pathname;
	return (
		<>
			<div className="bg-magic"></div>

			<div className="padding max-md:px-0 min-h-[calc(100vh-60px)] ">
				<div className="relative flex flex-col w-full gap-2 px-0 py-2 lg:flex-row lg:gap-8 lg:py-12">
					<div className="block w-full lg:w-[250px]">
						<div>
							<motion.nav
								initial={false}
								animate={isOpen ? "open" : "closed"}
								className="relative"
							>
								<motion.button className="flex items-center w-full px-2 border-b border-blue-400 ">
									<div className="flex items-center flex-1 w-full gap-2 p-2 sm:pb-4">
										<div className="overflow-hidden border rounded-full size-8 sm:size-12">
											<img
												src={
													optimizeCloudinaryUrl(
														authUser?.avatarUrl as string,
														50,
														50,
													) || "/avatar_25.jpg"
												}
												className="w-full h-full "
											/>
										</div>
										<div className="">
											<p className="font-semibold">{authUser?.full_name}</p>
											<p className="items-center hidden text-sm font-medium text-gray-400 cursor-pointer md:flex">
												<MdEdit className="mr-1 " size={16} /> Sửa hồ sơ
											</p>
										</div>
									</div>
									<motion.div
										variants={{
											open: { rotate: 180 },
											closed: { rotate: 0 },
										}}
										onClick={() => setIsOpen(!isOpen)}
										transition={{ duration: 0.2 }}
										style={{ originY: 0.55 }}
										className="p-2 rounded-full text-custom hover:bg-gray-50/50 lg:hidden "
									>
										<svg
											width="15"
											height="15"
											viewBox="0 0 20 20"
											color="#3b82f6"
										>
											<path d="M0 7 L 20 7 L 10 16" />
										</svg>
									</motion.div>
								</motion.button>
								<motion.ul
									variants={{
										open: {
											clipPath: "inset(0% 0% 0% 0% round 10px)",
											transition: {
												type: "spring",
												bounce: 0,
												duration: 0.7,
												delayChildren: 0.3,
												staggerChildren: 0.05,
											},
											height: "auto",
										},
										closed: {
											clipPath: "inset(10% 50% 90% 50% round 10px)",
											transition: {
												type: "spring",
												bounce: 0,
												duration: 0.3,
											},
											height: 0,
										},
									}}
									className={cn(
										"hidden mt-2 absolute z-10 max-lg:backdrop-blur-lg bg-custom-500/10 lg:bg-transparent w-full",
										isOpen && "block",
									)}
								>
									{sidebarAccount?.map((item) => {
										const isCheck = location.includes(item.path);
										return (
											<motion.li
												variants={itemVariants}
												className={cn(
													"w-full px-2 py-1 h-10 hover:bg-slate-50/40 cursor-pointer lg:rounded-md flex items-center hover:text-custom",
													isCheck && "text-custom bg-slate-50/40",
												)}
												onClick={() => {
													if (isMobile) {
														setIsOpen(false);
													}
													router(item.path);
												}}
											>
												{<item.icon size={20} className="mr-4" />}{" "}
												<span>{item.name}</span>
											</motion.li>
										);
									})}
								</motion.ul>
							</motion.nav>
						</div>
					</div>
					<div className="flex-1 w-full ">
						<Outlet />
					</div>
				</div>
			</div>
		</>
	);
};

export default AccountLayout;
