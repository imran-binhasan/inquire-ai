'use client'
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
  clearMessages: (chatId: string) => void;
  startNewChat: () => void;
  savedChats: SavedChat[];
  loadSavedChat: (chatId: string) => void;
}

export const UiContext = createContext<UiContextType>({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  messages: [],
  addMessage: () => {},
  clearMessages: () => {},
  startNewChat: () => {},
  savedChats: [],
  loadSavedChat: () => {}
});

const UiProvider = ({ children }: { children: React.ReactNode }) => {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Messages state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Saved chats state
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);

  // Load current chat messages on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('currentChatMessages');
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          setMessages(parsedMessages);
        } catch (error) {
          console.error('Error parsing saved messages', error);
        }
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

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

    // Also clear current messages from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentChatMessages');
      setMessages([]);
    }
  };

  // Load a saved chat
  const loadSavedChat = (chatId: string) => {
    const savedChat = savedChats.find(chat => chat.id === chatId);
    if (savedChat) {
      // Clear current messages and load saved chat messages
      setMessages(savedChat.messages);
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
  
    // Explicitly clear messages and localStorage after saving
    setMessages([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentChatMessages');
    }
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
    loadSavedChat
  };

  return (
    <UiContext.Provider value={uiStates}>
      {children}
    </UiContext.Provider>
  );
};

export default UiProvider;