export const customStyles = {
	control: (provided: any,) => ({
		...provided,
		width: "100%", // Làm cho control phủ toàn bộ chiều rộng
		border: "1px solid #e2e8f0",
		borderColor: "",
	}),
	dropdownIndicator: () => ({
		display: "none", // Ẩn con trỏ xuống
	}),
	indicatorSeparator: () => ({
		display: "none", // Ẩn đường ngăn cách
	}),
};
