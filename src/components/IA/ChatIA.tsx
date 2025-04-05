"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchAuthenticatedUser, sendMessageToAI } from "@/server/service/chatService";

const ChatIA = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const authenticatedUser = await fetchAuthenticatedUser();
      if (authenticatedUser) {
        setUser(authenticatedUser);
        const userChatKey = `chatConversation_${authenticatedUser.user_id}`;
        const savedMessages = localStorage.getItem(userChatKey);
        setMessages(savedMessages ? JSON.parse(savedMessages) : []);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`chatConversation_${user.user_id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const data = await sendMessageToAI(input);
    setMessages((prev) => [...prev, { sender: "ia", text: data.reply }]);

    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return user ? (
    <div className="p-4 rounded bg-gray-200 dark:bg-gray-800 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Chat con IA</h2>
      <div className="flex-grow mb-4 overflow-y-auto text-gray-600 dark:text-gray-400">
        {messages.length === 0 ? (
          <p>No hay mensajes en la conversación.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === "ia" ? "text-blue-600" : "text-green-600"}`}>
              <strong>{msg.sender === "ia" ? "IA:" : "Tú:"}</strong> {msg.text}
            </div>
          ))
        )}
        {isLoading && <div className="text-gray-500">La IA está respondiendo...</div>}
      </div>
      <div className="flex rounded px-2 text-gray-800">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-grow mr-2 border-gray-500 dark:border-white bg-white"
          onKeyDown={handleKeyDown}
        />
        <Button className="mt-1 bg-blue-500 hover:bg-blue-600" onClick={sendMessage} disabled={isLoading}>
          Enviar
        </Button>
      </div>
    </div>
  ) : (
    <p>Cargando...</p>
  );
};

export default ChatIA;