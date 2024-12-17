"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageSquare, FileText } from "lucide-react";

const styles = {
  container: "w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md",
  tabNav: "flex w-full border-b",
  tabButton: (isActive: boolean) => `
    flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2
    transition-colors duration-200 
    ${isActive 
      ? "border-blue-500 text-blue-600" 
      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }
  `,
  tabIcon: "w-5 h-5",
  contentContainer: "p-6",
  reportSection: "space-y-2",
  reportTitle: "text-lg font-semibold text-gray-800",
  reportContent: "p-4 bg-gray-50 rounded-lg min-h-[16rem] whitespace-pre-wrap",

  chatSection: "space-y-4",
  chatMessages: "max-h-[300px] overflow-y-auto p-4 bg-gray-50 rounded-lg",
  message: (isUser: boolean) => `
    flex ${isUser ? "justify-end" : "justify-start"} mb-2
  `,
  messageBubble: (isUser: boolean) => `
    px-4 py-2 rounded-lg max-w-[70%] 
    ${isUser 
      ? "bg-blue-600 text-white" 
      : "bg-gray-200 text-gray-800"
    }
  `,
  chatInputGroup: "flex gap-2",
  chatInput: "flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  chatButton: `
    px-6 py-3 text-white bg-blue-600 rounded-lg 
    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
  `,
  errorMessage: "p-3 text-red-700 bg-red-50 rounded-lg",
};

interface TabSectionProps {
  reportContent?: string;
}

const TabSection: React.FC<TabSectionProps> = ({ 
  reportContent = "Your report content goes here..." 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Hello! How can I assist you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { name: "Report", icon: FileText },
    { name: "Chatbot", icon: MessageSquare },
  ];

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const newMessage = { role: "user" as const, content: chatInput };
    setMessages((prev) => [...prev, newMessage]);
    setChatInput("");
    setIsLoading(true);
    setError("");

    try {
      // Simulate chat API response
      const response = await axios.post("/api/chat", { message: chatInput });
      setMessages((prev) => [...prev, { role: "ai", content: response.data.reply }]);
    } catch (err) {
      setError("Failed to get a response. Please try again.");
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.container}>
      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(index)}
              className={styles.tabButton(activeTab === index)}
            >
              <Icon className={styles.tabIcon} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className={styles.contentContainer}>
        {activeTab === 0 ? (
          // Report Section
          <div className={styles.reportSection}>
            <h2 className={styles.reportTitle}>Report</h2>
            <div className={styles.reportContent}>{reportContent}</div>
          </div>
        ) : (
          // Chat Section
          <div className={styles.chatSection}>
            <div className={styles.chatMessages}>
              {messages.map((msg, index) => (
                <div key={index} className={styles.message(msg.role === "user")}>
                  <div className={styles.messageBubble(msg.role === "user")}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.chatInputGroup}>
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.chatInput}
              />
              <button
                onClick={handleChatSubmit}
                disabled={isLoading || !chatInput.trim()}
                className={styles.chatButton}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>

            {/* Error Message */}
            {error && <div className={styles.errorMessage}>{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabSection;
