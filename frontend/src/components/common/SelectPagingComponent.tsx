import instance from "@/config/instance";
import React, { ReactNode } from "react";
import Select, { ActionMeta, GetOptionValue } from "react-select";
import { Label } from "../ui/label";

type ActionTypes =
	| "clear"
	| "create-option"
	| "deselect-option"
	| "pop-value"
	| "remove-value"
	| "select-option"
	| "set-value";
export const customStyles = {
	control: (provided: any, state: any) => ({
		...provided,
		width: "100%", // Làm cho control phủ toàn bộ chiều rộng
		border: "1px solid #e2e8f0",
		boxShadow: state.isFocused ? "0px 0px 0px 1.2px #101010" : "none",
		"&:hover": {
			borderColor: "#e2e8f0", // Border color on hover
		},
		cursor: "pointer",
	}),
	dropdownIndicator: () => ({
		display: "none", // Ẩn con trỏ xuống
	}),
	indicatorSeparator: () => ({
		display: "none", // Ẩn đường ngăn cách
	}),
	multiValue: () => ({
		backgroundColor: "#1877f214",
		display: "flex",
		margin: "2px",
		borderRadius: "5px",
	}),
	multiValueRemove: () => ({
		borderRadius: "2px",
		padding: "0 4px",
		display: "flex",
		"&:hover": {
			backgroundColor: "transparent",
		},
		justifyContent: "center",
		alignItems: "center",
	}),
	option: () => ({
		backgroundColor: "transparent",
		padding: "8px 12px",
		fontSize: "inherit",
		cursor: "pointer",
		width: "100%",
		display: "block",
		"&:hover": {
			backgroundColor: "#1877f214",
		},
	}),
};

type GetOptionLabel<Option> = (option: Option) => ReactNode | string;

type CommonProps<T> = {
	value: T | T[] | undefined | null;
	isMulti?: boolean;
	options?: T[];
	selectOption?: (option: T) => void;
	selectProps?: any;
	setValue?: (value: T, action: ActionTypes) => void;
	emotion?: any;
	onChange: (newValue: any | null, actionMeta: ActionMeta<T>) => void;
	getOptionLabel?: GetOptionLabel<T> | undefined;
	getOptionValue?: GetOptionValue<T> | undefined;
	label?: string;
	placeholder?: string;
	isClearable?: boolean;
	url: string;
	searchObject?: any;
};

const SelectPagingComponent = <T,>({
	value,
	onChange,
	isMulti = false,
	label,
	getOptionLabel,
	getOptionValue,
	placeholder,
	isClearable = false,
	url,
	searchObject,
}: CommonProps<T>) => {
	const [open, setOpen] = React.useState<boolean>(false);
	const [options, setOption] = React.useState<any[]>([]);
	const [obj, setObj] = React.useState<any>({
		pageIndex: 1,
		totalOptionPage: 0,
		totalAllOptions: 0,
		totalPage: 0,
	});
	const [t, setT] = React.useState<any>(null);
	const [keyword, setKeyword] = React.useState("");

	const fetchData = async (page: number) => {
		try {
			const { data } = await instance.post(url, {
				pageIndex: page,
				...searchObject,
				keyword: keyword,
			});

			if (data?.content?.length > 0) {
				const newOptions = [...options, ...data?.content];
				setOption(newOptions);
				setObj(data);
			} else {
				setOption([]);
			}
		} catch (error) {}
	};

	React.useEffect(() => {
		if (open) {
			getData();
		}
	}, [open]);

	const getData = async () => {
		const newPage = 1;
		fetchData(newPage);
	};

	const loadPagingData = () => {
		const page = obj.pageIndex;
		fetchData(page + 1);
	};

	const handleChangeText = (value: string) => {
		if (t) {
			clearTimeout(t);
		}
		setT(
			setTimeout(() => {
				setKeyword(value);
			}, 500),
		);
	};

	const handleOpen = () => {
		setOpen(true);
		setKeyword("");
	};

	return (
		<div className="w-full">
			{label && <Label>{label}</Label>}
			<Select
				isClearable={isClearable}
				value={value}
				onChange={onChange}
				menuIsOpen={open}
				onMenuOpen={handleOpen}
				onMenuClose={() => {
					setOpen(false);
					setOption([]);
					setObj({
						pageIndex: 1,
						totalOptionPage: 0,
						totalAllOptions: 0,
						totalPage: 0,
					});
				}}
				isMulti={isMulti}
				options={options}
				formatOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				classNamePrefix="react-select"
				styles={customStyles}
				onMenuScrollToBottom={() => {
					if (obj.pageIndex < obj.totalPage) {
						loadPagingData();
					}
				}}
				onInputChange={handleChangeText}
				placeholder={placeholder}
			/>
		</div>
	);
};

export default SelectPagingComponent;
