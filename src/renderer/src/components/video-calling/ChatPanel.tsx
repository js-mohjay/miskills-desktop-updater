"use client";

import React, { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";

interface ChatPanelProps {
  socket: Socket | null;
  scheduleId: string;
  occurrenceId: string;
}

interface Message {
  senderName: string;
  text: string;
  timeStamp: number;
  meta: {
    userRole: string;
  };
}

const ChatPanel: React.FC<ChatPanelProps> = ({ socket, scheduleId, occurrenceId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("chatHistory", (payload) => {
      setMessages(payload.messages);
    });

    socket.on("newChat", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("newChat");
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    socket.emit("chatMessage", { scheduleId, occurrenceId, text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col bg-gray-700 rounded p-2 h-96">
      <div className="flex-1 overflow-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="py-1">
            <span className="font-semibold text-white">{msg.senderName}:</span>{" "}
            <span className="text-gray-200">{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          className="flex-1 rounded-l p-2 text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 rounded-r px-4 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
