import instance from "@/config/instance";

const url = "system";
export const searchPopupService = ({ keyword }: { keyword: string }) => {
	const uri = `${url}/searchClient?keyword=${keyword}`;
	return instance.get(uri);
};
export const searchDetailPageService = ({
	keyword,
	type,
	pageIndex = 1,
}: {
	keyword: string;
	type: string;
	pageIndex?: number;
}) => {
	const uri = `${url}/searchClientDetail?keyword=${keyword}&type=${type}&pageIndex=${pageIndex}`;
	return instance.get(uri);
};

export const contactFormService = (
	name: string,
	email: string,
	content: string,
) => {
	const uri = `${url}/contactForm`;
	return instance.post(uri, {
		name,
		email,
		content,
	});
};
