// Import necessary dependencies from React and other libraries
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useAuth0 } from "@auth0/auth0-react";
// Main chat component that handles the AI health assistant interface
function App() {
  // State management for chat functionality
  const [chatHistory, setChatHistory] = useState([]); // Stores all chat messages
  const [question, setQuestion] = useState(""); // Current user input
  const [generatingAnswer, setGeneratingAnswer] = useState(false); // Loading state
  const chatContainerRef = useRef(null); // Reference to chat container for auto-scrolling
  const { user, isAuthenticated } = useAuth0(); // Auth0 authentication state
  // Auto-scroll chat container when new messages are added or AI is generating response
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  // Handle user question submission and get AI response
  async function generateAnswer(e) {
    e.preventDefault();
    // Don't process empty questions
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");
    // Add user question to chat
    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

    try {
      // Call Flask backend using environment variable
      const response = await axios.post(import.meta.env.VITE_API_URL, {
        message: currentQuestion,
      });

      // Your Flask backend returns { "reply": "..." }
      const aiResponse = response.data.reply || "No response received.";
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: aiResponse },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setAnswer("Sorry - Something went wrong. Please try again!");
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: "⚠️ Server not reachable." },
      ]);
    }

    setGeneratingAnswer(false);
  }

  return (
    <div className="inset-0 bg-white">
      <div className="h-full max-w-4xl mx-auto flex flex-col p-1 pb-4">
        {/* Header */}
        <header className="text-center py-1 ">
          <h1 className="text-2xl font-bold text-customPurple hover:text-blue-600 transition-colors">
            AI Health Assistant Aira
          </h1>
        </header>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="h-[450px] overflow-y-auto mb-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg p-4 hide-scrollbar"
        >
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="bg-white rounded-xl p-6 max-w-2xl">
                {isAuthenticated && (
                  <h2 className="text-xl font-bold text-customPurple mb-2">
                    💬 Hello {user.name} I’m Aira your Health Assistant
                  </h2>
                )}
                {!isAuthenticated && (
                  <h2 className="text-xl font-bold text-customPurple mb-2">
                    Welcome to Health Assistant 👋
                  </h2>
                )}
                <p className="text-gray-600 mb-2">
                  I’m always here to help — whether you need advice, reminders,
                  medical help, or just someone to chat with. Ask me anything!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-left">
                  <div className="bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-lg shadow-sm ">
                    <span className="text-blue-500">💡</span> Everyday Questions
                  </div>
                  <div className="bg-gradient-to-r from-violet-50 to-violet-100  p-4 rounded-lg shadow-sm ">
                    <span className="text-blue-500">❤️</span> Body & Mind Health
                  </div>
                  <div className="bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-lg shadow-sm ">
                    <span className="text-blue-500">🌸</span> Timely Tips &
                    Gentle Care
                  </div>
                  <div className="bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-lg shadow-sm ">
                    <span className="text-blue-500">😊</span> Emotional Support
                    & Tips
                  </div>
                </div>
                <p className="text-gray-500 mt-4 text-sm">
                  Just type in your question below and press Send. I’ll do my
                  best to help you right away!
                </p>
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    chat.type === "question" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-lg overflow-auto hide-scrollbar ${
                      chat.type === "question"
                        ? "bg-customPurple text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <ReactMarkdown>{chat.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </>
          )}
          {generatingAnswer && (
            <div className="text-left">
              <div className="inline-block bg-gray-100 p-3 rounded-lg animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={generateAnswer}
          className="rounded-lg shadow-lg p-2 bg-gradient-to-r from-blue-50 to-blue-100"
        >
          <div className="flex gap-2">
            <textarea
              required
              className="flex-1 border border-gray-300 rounded p-2 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              className={`px-4 py-1 bg-customPurple text-white rounded-md hover:bg-blue-600 transition-colors ${
                generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={generatingAnswer}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
