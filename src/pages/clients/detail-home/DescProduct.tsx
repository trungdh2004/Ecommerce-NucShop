import { Remarkable } from 'remarkable';
type Props = {
	description?: string
	isLoading?: boolean
}
const DescProduct = ({description,isLoading}:Props) => {
	const md = new Remarkable({
        html: true,        // Cho phép HTML bên trong Markdown
        xhtmlOut: false,    // Xuất ra HTML với các tag tự đóng
        breaks: false,      // Tự động ngắt dòng thành <br>
        langPrefix: 'language-',  // Tiền tố cho class của các khối code
        linkify: true,      // Tự động chuyển đổi URL thành liên kết
        typographer: true,  // Thay thế các ký tự đặc biệt như quotes, dashes thành kiểu typographic
    });
    const markdownContent = description;
    const htmlContent = md.render(markdownContent as any);
	
	return (
		<div className="break-all bg-white p-4 rounded-md">
			<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
			
		</div>
	);
};

export default DescProduct;
