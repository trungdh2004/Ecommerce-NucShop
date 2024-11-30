import React from "react";
import { useParams } from "react-router-dom";
import ChatContent from "./components/ChatContent";

const ChatBox = () => {
	const { id } = useParams();
	return <ChatContent />;
};

export default ChatBox;
