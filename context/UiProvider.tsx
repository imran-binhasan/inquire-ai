'use client'
import { createContext, useContext, useState, useEffect } from "react";
import OpenAI from "openai";

// Define message type
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

// Interface for saved chat history
interface SavedChat {
  id: string;
  messages: ChatMessage[];
  timestamp: number;
}

// Extend the existing context interface
interface UiContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  startNewChat: () => void;
  savedChats: SavedChat[];
  loadSavedChat: (chatId: string) => void;
  openai: OpenAI;
}

export const UiContext = createContext<UiContextType>({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  messages: [],
  addMessage: () => {},
  clearMessages: () => {},
  startNewChat: () => {},
  savedChats: [],
  loadSavedChat: () => {},
  openai: new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true
  })
});

const UiProvider = ({ children }: { children: React.ReactNode }) => {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true
  });

  // Messages state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Saved chats state
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);

  // Effect to load saved chats from localStorage on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedSavedChats = localStorage.getItem('savedChats');
      if (loadedSavedChats) {
        setSavedChats(JSON.parse(loadedSavedChats));
      }
    }
  }, []);

  // Effect to save chats history to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedChats', JSON.stringify(savedChats));
    }
  }, [savedChats]);

  // Add message method
  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  // Clear messages method
  const clearMessages = (chatId: string) => {
    setSavedChats(prevChats => {
      // Filter out the chat based on its ID (not the message ID)
      const updatedChats = prevChats.filter(chat => chat.id !== chatId);
      
      // Now update localStorage with the new list of chats
      localStorage.setItem('savedChats', JSON.stringify(updatedChats));
      
      // Return the updated chats to update the state
      return updatedChats;
    });
  };
  
  
  
  
  

  // Load a saved chat
  const loadSavedChat = (chatId: string) => {
    const savedChat = savedChats.find(chat => chat.id === chatId);
    if (savedChat) {
      // Clear current messages and load saved chat messages
      setMessages(savedChat.messages);
    }
  };

  // New method to start a new chat
  const startNewChat = () => {
    // Only save the chat if there are messages
    if (messages.length > 0) {
      // Check if any message's id already exists in savedChats
      const existingMessageIds = savedChats.flatMap(chat => chat.messages.map(msg => msg.id));
      const hasDuplicate = messages.some(msg => existingMessageIds.includes(msg.id));
  
      // If no duplicate message ID exists, save the chat
      if (!hasDuplicate) {
        const newSavedChat: SavedChat = {
          id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          messages: [...messages],
          timestamp: Date.now()
        };
  
        // Add the new chat to saved chats and limit it to the last 10 chats
        setSavedChats(prevChats => {
          const updatedChats = [newSavedChat, ...prevChats].slice(0, 10);
          return updatedChats;
        });
      }
    }
  
    // Explicitly clear messages after saving
    setMessages([]);
  };
  

  // Combine all states and methods
  const uiStates = { 
    isSidebarOpen, 
    setIsSidebarOpen, 
    messages, 
    addMessage, 
    clearMessages,
    startNewChat,
    savedChats,
    loadSavedChat,
    openai
  };

  return (
    <UiContext.Provider value={uiStates}>
      {children}
    </UiContext.Provider>
  );
};

export default UiProvider;