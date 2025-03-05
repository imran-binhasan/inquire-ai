'use client';

import { useContext, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AudioLines, Paperclip, Send } from "lucide-react";
import Image from "next/image";
import { UiContext } from "@/context/UiProvider";

const Home = () => {
  // Use context to access messages and methods
  const { messages, addMessage } = useContext(UiContext);
  
  // Local state for current message input
  const [message, setMessage] = useState<string>("");
  const [chatStarted, setChatStarted] = useState<boolean>(messages.length > 0);

  // Handle sending message
  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user message using context method
    addMessage({ 
      sender: "user", 
      text: message 
    });

    // Clear input field
    setMessage("");
    setChatStarted(true);

    // Call InquireAI API
    try {
      const response = await axios.post('https://api.echogpt.live/v1/chat/completions', {
        messages: [
          
          { role: "user", content: message }
        ],
        model: "EchoGPT"
      }, {
        headers: { 
          'x-api-key': process.env.NEXT_PUBLIC_ECHO_GPT_API_KEY,
          'Content-Type': 'application/json'
        }
      });

      // Add AI response using context method
      const aiResponse = response.data.choices[0].message.content || "No response";
      addMessage({ 
        sender: "ai", 
        text: aiResponse 
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      addMessage({ 
        sender: "ai", 
        text: "Sorry, there was an error processing your request." 
      });
    }
  };

  // Handle message input with Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="mx-auto w-full md:w-3xl 2xl:w-4xl flex flex-col md:gap-6">
      {/* Chat container */}
      <div className="w-full relative">
        <div className="h-[65vh] md:min-h-96 overflow-y-auto p-3 space-y-2 w-full">
          {/* Conditionally render the greeting */}
          {!chatStarted && (
            <div className="my-5">
              <div className="font-medium text-center flex gap-2 justify-center">
                <Image src={'/star.png'} width={20} height={20} alt="" />
                <h3 className="text-2xl font-medium">Hi! This is InquireAI </h3>
              </div>
              <p className="text-center">How can I help you?</p>
            </div>
          )}

          {/* Display messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}
            >
              <p className="p-2 max-w-xs bg-gray-200 rounded-lg">{msg.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Input field */}
      <div className="border rounded-md p-2">
        <Textarea
          className="w-full resize-none border-none max-h-24 scrollbar-none pb-1"
          placeholder="Ask me anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            fontSize: "16px",
            scrollbarColor: "blue", // Firefox
          }}
        />
        <div className="flex justify-between gap-2 px-2 pt-2 w-full bottom-1">
          <label
            htmlFor="file-upload"
            className="bottom-4 left-4 cursor-pointer text-gray-600"
          >
            <Paperclip size={24} />
          </label>
          <Input type="file" id="file-upload" className="hidden" />

          <div className="flex gap-4 items-center">
            <label
              htmlFor="voice-record"
              className="bottom-4 left-4 cursor-pointer text-gray-600"
            >
              <AudioLines size={24} />
            </label>
            <Input type="file" accept="audio/*" id="voice-record" className="hidden" />
            <Send
              className="cursor-pointer"
              onClick={sendMessage}
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-center text-gray-600">InquireAI can make mistakes. Check important info !.</p>
      </div>
    </div>
  );
};

export default Home;