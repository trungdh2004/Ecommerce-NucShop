import React, { useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "user", text: "Hello there!", timestamp: "10:00 AM" },
    { id: 2, sender: "other", text: "Hi! How are you?", timestamp: "10:02 AM" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { id: Date.now(), sender: "user", text: newMessage, timestamp: "Now" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-md h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
            <div className={`flex items-center space-x-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
              <div className="bg-gray-200 p-3 rounded-lg shadow">
                <p className="text-sm">{msg.text}</p>
                <span className="text-gray-400 text-xs">{msg.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-4 mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
