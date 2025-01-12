import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocation } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import { useAuth } from "@/hooks/auth";
import sidebarShipper from "@/config/sidebarShipper";

const SidebarListShipper = () => {
	const location = useLocation();
	const { authUser } = useAuth();

	return (
		<div>
			{sidebarShipper?.map((item, index) => {
				if (item.isAdmin) {
					if (!authUser?.is_admin) {
						return null;
					}
				}

				if (item.children) {
					return (
						<Accordion type="multiple" className="" key={index}>
							<AccordionItem value="item-1" className="border-none pt-2">
								<AccordionTrigger className="pb-2 border-b-none h-10 w-full px-4 group py-3 gap-2 flex items-center hover:bg-[rgba(24,119,242,0.08)] rounded-md cursor-pointer">
									<p className="text-sm font-semibold text-[#4b5563] group-hover:text-blue-500 cursor-pointer">
										{item.label}
									</p>
								</AccordionTrigger>
								<AccordionContent className="pb-0 pl-4" datatype="open">
									<div className="space-y-1  mt-2 ">
										{item.children.map((row: any) => (
											<SidebarItem
												key={item.path + item.label}
												label={row.label}
												Icon={row.icon}
												path={`${item.path}${row.path}`}
												isAction={
													location.pathname === `${item.path}${row.path}`
												}
											/>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					);
				}

				return (
					<SidebarItem
						key={item.path}
						label={item.label}
						Icon={item.icon}
						path={`${item.path}`}
						isAction={location.pathname === `${item.path}`}
						isParent
					/>
				);
			})}
		</div>
	);
};

export default SidebarListShipper;
