import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import { IoFilter } from "react-icons/io5";
import { SearchObjectOrder } from "@/types/searchObjectOrder";
import { vi } from "date-fns/locale";
interface Props {
	searchObjectOrder: SearchObjectOrder;
	setSearchObjectOrder: any;
}
const SearchOrder = ({ searchObjectOrder, setSearchObjectOrder }: Props) => {
	const [dateStart, setDateStart] = React.useState<Date | undefined>();
	const [dateEnd, setDateEnd] = React.useState<Date | undefined>();
	return (
		<div className="flex justify-between">
			<div className="flex gap-3 items-center">
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
						setSearchObjectOrder((prev: any) => ({
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
			<div className="pr-5">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div className="cursor-pointer">
							<IoFilter size={20} />
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[150px]" align="end">
						<DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup
							value={`${searchObjectOrder.method}`}
							onValueChange={(e) => {
								const method = parseInt(e);
								setSearchObjectOrder((prev: any) => ({
									...prev,
									pageIndex: 1,
									method: method,
								}));
							}}
						>
							<DropdownMenuRadioItem value="1" className="cursor-pointer">
								Thanh toán khi nhận hàng
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="2" className="cursor-pointer">
								Thanh toán Internet banking
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
						<DropdownMenuSeparator />
						<DropdownMenuLabel>Sắp xếp theo chiều</DropdownMenuLabel>
						<DropdownMenuRadioGroup
							value={`${searchObjectOrder.sort}`}
							onValueChange={(e) => {
								const sortNumber = parseInt(e) as 1 | -1;
								setSearchObjectOrder((prev: any) => ({
									...prev,
									pageIndex: 1,
									sort: sortNumber,
								}));
							}}
						>
							<DropdownMenuRadioItem value="1" className="cursor-pointer">
								Tăng dần
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="-1" className="cursor-pointer">
								Giảm dần
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
						<DropdownMenuSeparator />
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								setSearchObjectOrder((prev: any) => ({
									...prev,
									pageIndex: 1,
									pageSize: 5,
									sort: 1,
									method: null,
									startDate: null,
									endDate: null,
									paymentStatus: null,
								}));
								setDateEnd(undefined);
								setDateStart(undefined);
							}}
							className="cursor-pointer bg-[#f0f0f0] text-red-500 pl-8"
						>
							Mặc định
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};

export default SearchOrder;
