import { UiContext } from "@/context/UiProvider";
import { 
  ChevronsLeft, 
  Clock, 
  History, 
  Settings, 
  Share2, 
  HelpCircle, 
  MessageSquare,
  Trash2,
  Plus
} from "lucide-react";
import { useContext, useState, useEffect } from "react";

// Group chats by date
const groupChatsByDate = (messages: ChatMessage[]) => {
  const groupedChats: { [key: string]: ChatMessage[] } = {};

  messages.forEach(msg => {
    const date = new Date(msg.timestamp).toLocaleDateString();
    if (!groupedChats[date]) {
      groupedChats[date] = [];
    }
    groupedChats[date].push(msg);
  });

  return groupedChats;
};

export default function Aside() {
  const { 
    isSidebarOpen, 
    setIsSidebarOpen, 
    messages, 
    clearMessages,
    savedChats,
    startNewChat  
  } = useContext(UiContext);
  
  const [groupedChats, setGroupedChats] = useState<{ [key: string]: ChatMessage[] }>({});

  useEffect(() => {
    setGroupedChats(groupChatsByDate(messages));
  }, [messages]);

  const menuItems = [
    {
      icon: <Plus className="w-5 h-5" />,
      label: "New Chat",
      onClick: () => startNewChat()
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      onClick: () => {}
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      label: "Share AI Bot",
      onClick: () => {}
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: "Support",
      onClick: () => {}
    }
  ];

  return (
    <aside className="h-full p-4 flex flex-col">
      <div className="flex justify-between items-center gap-2 mb-6">
        <h2 className="text-xl font-bold">AI Chat</h2>
        <ChevronsLeft 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="block sm:hidden cursor-pointer" 
        />
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li 
              key={index} 
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={item.onClick}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </li>
          ))}
        </ul>

        {/* Chat History Section */}
        <div className="mt-6">
         <h3>History</h3>
          <div className="flex-grow overflow-y-auto">
        {savedChats.length === 0 ? (
          <p className="text-center text-gray-500">No chat history</p>
        ) : (
          savedChats.map((chat) => (
            <div 
              key={chat.id}
              className="
                flex items-center justify-between
                p-2 rounded-md 
                hover:bg-gray-100 
                transition-colors
                border
                mb-2
              "
            >
              <div 
                className="flex items-center gap-3 flex-grow cursor-pointer"
                onClick={}
              >
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm truncate max-w-[200px]">
                    {chat.messages[0]?.text.slice(0, 50)}
                    {chat.messages[0]?.text.length > 50 ? '...' : ''}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(chat.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => clearMessages(chat.id)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

          
        </div>
      </nav>

      <div className="mt-4 border-t pt-4 text-sm text-gray-500">
        <p>© 2024 AI Chat</p>
      </div>
    </aside>
  );
}
