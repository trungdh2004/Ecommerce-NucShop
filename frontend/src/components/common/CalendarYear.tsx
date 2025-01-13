import React from "react";

import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface Props {
	value?: Date;
	lengthYear?: number;
	minYear?: number;
	onSelect: (value?: Date) => void;
	initialFocus?: boolean;
	disabled?: (date: Date) => boolean;
}

declare function DayPicker(props: Props): JSX.Element;

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const CalendarYear = ({
	value,
	lengthYear,
	minYear,
	onSelect,
	disabled,
}: CalendarProps) => {
	const [currentMonth, setCurrentMonth] = React.useState<Date | undefined>(
		value,
	);
	const months = [
		"Tháng 1",
		"Tháng 2",
		"Tháng 3",
		"Tháng 4",
		"Tháng 5",
		"Tháng 6",
		"Tháng 7",
		"Tháng 8",
		"Tháng 9",
		"Tháng 10",
		"Tháng 11",
		"Tháng 12",
	];
	const newDateYear = new Date().getFullYear();

	const listYear = Array.from({ length: lengthYear ?? 16 }, (_, index) => {
		return newDateYear - index - (minYear ?? 0);
	});

	return (
		<Calendar
			mode="single"
			selected={value}
			onSelect={onSelect}
			className="border rounded-md shadow"
			captionLayout="dropdown"
			locale={vi}
			month={currentMonth}
			onMonthChange={setCurrentMonth}
			classNames={{
				caption_label: "hidden",
				caption: "flex justify-between",
			}}
			components={{
				Caption: (props: any) => {
					const {  displayMonth} = props;
					const dataNow = new Date(displayMonth);
					const month = dataNow.getMonth();
					const year = dataNow.getFullYear();
					return (
						<div className="grid w-full grid-cols-3 gap-2">
							<div className="col-span-2">
								<Select
									value={`${month}`}
									onValueChange={(value) => {
										setCurrentMonth(new Date(year, +value));
									}}
								>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="max-h-56">
										<SelectGroup>
											{months?.map((month, index) => (
												<SelectItem value={index + ""}>{month}</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
							<div className="col-span-1">
								<Select
									value={`${year}`}
									onValueChange={(value) => {
										setCurrentMonth(new Date(+value, month));
									}}
								>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="max-h-56">
										<SelectGroup>
											{listYear?.map((month) => (
												<SelectItem value={month + ""}>{month}</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</div>
					);
				},
			}}
			disabled={disabled}
		/>
	);
};

export default CalendarYear;
