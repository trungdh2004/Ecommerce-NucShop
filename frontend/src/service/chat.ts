import instance from "@/config/instance";

export const findOrUpdateConversation = async () =>
	instance.get(`/chat/findOrCreateConversation`);

export const pagingMessage = async (
	conversationId: string,
	pageIndex: number,
	before: string | null,
	sender?: string,
) =>
	instance.post(
		`/chat/message/${conversationId}${before ? `?before=${before}` : ""}`,
		{
			pageIndex,
			sender,
		},
	);

export const createMessage = async (
	content: string,
	sender: "USER" | "ADMIN",
	conversationId: string,
) =>
	instance.post(`/chat/createMessage/${conversationId}`, {
		content,
		sender,
	});

export const pagingConversation = (pageIndex: number) =>
	instance.post("/chat/pagingConversation", {
		pageIndex,
	});
export const findConversation = (id: string) =>
	instance.get("/chat/findConversation/" + id);

export const updateReadMany = (sender: string, id: string) =>
	instance.put("/chat/readMessageMany/" + id, {
		sender,
	});

export const updateReadOne = (sender: string, id: string) =>
	instance.put("/chat/readMessageById/" + id, {
		sender,
	});
