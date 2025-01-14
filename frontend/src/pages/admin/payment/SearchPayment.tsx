import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
interface Props {
	setSearchObject: any;
}
const SearchPayment = ({ setSearchObject }: Props) => {
	const [dateStart, setDateStart] = React.useState<Date | undefined>();
	const [dateEnd, setDateEnd] = React.useState<Date | undefined>();
	return (
		
			<div className="flex lg:flex-row md:flex-row flex-col gap-3 lg:items-center md:items-center items-start ">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-[240px] justify-start text-left font-normal",
								!dateStart && "text-muted-foreground",
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{dateStart ? (
								format(dateStart, "dd/MM/yyyy")
							) : (
								<span>Ngày bắt đầu</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={dateStart}
							onSelect={setDateStart}
							initialFocus
							locale={vi}
							disabled={(date) => {
								const checkStartDate: boolean =
									!!dateEnd && date > new Date(dateEnd);

								return (
									date > new Date() ||
									date < new Date("1900-01-01") ||
									checkStartDate
								);
							}}
						/>
					</PopoverContent>
				</Popover>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-[240px] justify-start text-left font-normal",
								!dateEnd && "text-muted-foreground",
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{dateEnd ? (
								format(dateEnd, "dd/MM/yyyy")
							) : (
								<span>Ngày kết thúc</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={dateEnd}
							onSelect={setDateEnd}
							initialFocus
							locale={vi}
							disabled={(date) => {
								const checkStartDate: boolean =
									!!dateStart && date < new Date(dateStart);

								return (
									date > new Date() ||
									date < new Date("1900-01-01") ||
									checkStartDate
								);
							}}
						/>
					</PopoverContent>
				</Popover>
				<Button
					onClick={() => {
						setSearchObject((prev: any) => ({
							...prev,
							pageIndex: 1,
							startDate: dateStart,
							endDate: dateEnd,
						}));
					}}
					className=""
				>
					Tìm kiếm
				</Button>
			</div>
		
	);
};

export default SearchPayment;
