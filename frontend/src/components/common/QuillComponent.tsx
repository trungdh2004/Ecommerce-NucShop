import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// quill
const QuillComponent = () => {
	const [value, setValue] = useState("");
	return (
		<div>
			<ReactQuill theme="snow" value={value} onChange={setValue} />
			<button
				className="px-4 py-2 bg-blue-300 rounded-md"
				onClick={() => console.log(value)}
			>
				click
			</button>
		</div>
	);
};

export default QuillComponent;
