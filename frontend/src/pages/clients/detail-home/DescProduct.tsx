import { Remarkable } from "remarkable";
type Props = {
	description?: string;
	isLoading?: boolean;
};
const DescProduct = ({ description }: Props) => {
	const md = new Remarkable({
		html: true, // Cho phép HTML bên trong Markdown
		xhtmlOut: false, // Xuất ra HTML với các tag tự đóng
		breaks: false, // Tự động ngắt dòng thành <br>
		langPrefix: "language-", // Tiền tố cho class của các khối code
		linkify: true, // Tự động chuyển đổi URL thành liên kết
		typographer: true, // Thay thế các ký tự đặc biệt như quotes, dashes thành kiểu typographic
	});
	const markdownContent = description;
	const htmlContent = md.render(markdownContent as any);

	return (
		<div className="p-4 break-all bg-white rounded-md box-shadow">
			<h3 className="py-4 text-base font-medium border-b md:text-xl">
				Chi tiết sản phẩm :
			</h3>
			<div dangerouslySetInnerHTML={{ __html: htmlContent }} className="p-2" />
		</div>
	);
};

export default DescProduct;
