// src/App.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * App - Chat UI for ElderWell AI Assistant (Aira)
 * - Primary: POST to backend RAG endpoint (VITE_API_URL)
 * - Silent fallback: If backend fails, call OpenAI directly (VITE_OPENAI_KEY)
 *
 * IMPORTANT: Client-side OpenAI key exposure is insecure for production.
 * Use serverless proxy or secure backend to hold secrets in production.
 */

export default function App() {
  const [chatHistory, setChatHistory] = useState([]); // { type: 'question' | 'answer', content }
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const chatContainerRef = useRef(null);

  const { user, isAuthenticated } = useAuth0?.() || {
    user: null,
    isAuthenticated: false,
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  // System prompt to make OpenAI behave as a cautious elderly health assistant
  const DEFAULT_SYSTEM_PROMPT = `
You are Aira, a compassionate and careful health assistant for elderly users.
- Provide general health information, safety-first advice, and suggestions.
- Keep language simple, clear, and respectful.
- Encourage users to consult a licensed medical professional for diagnosis or urgent issues.
- If user reports severe or emergency symptoms (chest pain, severe bleeding, trouble breathing, unconsciousness), instruct them to seek emergency services immediately.
- Do not provide prescriptions or replace a licensed clinician.
`.trim();

  // Calls OpenAI directly (fallback). Returns string answer.
  async function callOpenAIFallback(userQuestion) {
    const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;
    if (!OPENAI_KEY) {
      // If fallback key isn't configured, return a gentle failure message (no backend/ fallback details)
      return "Sorry — I can't answer that right now. Please try again shortly.";
    }

    try {
      const payload = {
        model: "gpt-4o-mini", // replace with available model (gpt-3.5-turbo / gpt-4 if available)
        messages: [
          { role: "system", content: DEFAULT_SYSTEM_PROMPT },
          { role: "user", content: userQuestion },
        ],
        max_tokens: 700,
        temperature: 0.2,
      };

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Generic failure message (do not expose backend/fallback)
        return "Sorry — I can't answer that right now. Please try again shortly.";
      }

      const data = await res.json();
      const aiText = data?.choices?.[0]?.message?.content?.trim();
      return (
        aiText || "Sorry — I couldn't generate an answer. Please try again."
      );
    } catch (err) {
      console.error("OpenAI fallback error:", err);
      return "Sorry — I can't answer that right now. Please try again shortly.";
    }
  }

  // Full submit flow: primary backend -> silent fallback to OpenAI
  async function generateAnswer(e) {
    e?.preventDefault?.();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question.trim();
    setQuestion("");

    // Add user's question to chat
    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

    // Try backend first
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL,
        { message: currentQuestion },
        { timeout: 25000 } // 25 second timeout (adjust as needed)
      );

      // Expect backend to return { reply: "..." } or similar
      const aiResponse =
        response?.data?.reply?.trim() ||
        response?.data?.answer?.trim() ||
        "Sorry — no response received.";
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: aiResponse },
      ]);
    } catch (backendErr) {
      // Silent fallback: do NOT display any backend/fallback message to user
      console.warn(
        "Backend call failed — using OpenAI fallback (silent).",
        backendErr
      );

      const fallbackAnswer = await callOpenAIFallback(currentQuestion);
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: fallbackAnswer },
      ]);
    } finally {
      setGeneratingAnswer(false);
    }
  }

  return (
    <div className="inset-0 bg-white min-h-screen">
      <div className="h-full max-w-4xl mx-auto flex flex-col p-1 pb-4">
        {/* Header */}
        <header className="text-center py-1">
          <h1 className="text-2xl font-bold text-customPurple hover:text-blue-600 transition-colors">
            AI Health Assistant — Aira
          </h1>
        </header>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="h-[60vh] md:h-[70vh] overflow-y-auto mb-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg p-4 hide-scrollbar"
        >
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="bg-white rounded-xl p-6 max-w-2xl shadow-sm">
                {isAuthenticated ? (
                  <h2 className="text-xl font-bold text-customPurple mb-2">
                    💬 Hello {user?.name || "there"} — I’m Aira, your Health
                    Assistant
                  </h2>
                ) : (
                  <h2 className="text-xl font-bold text-customPurple mb-2">
                    Welcome to Aira — your Health Assistant 👋
                  </h2>
                )}
                <p className="text-gray-600 mb-2">
                  Ask about general health topics, find nearby hospitals, or
                  request tips on self-care.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                  <div className="bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-lg">
                    💡 Everyday Questions
                  </div>
                  <div className="bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-lg">
                    ❤️ Body & Mind Health
                  </div>
                  <div className="bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-lg">
                    🌸 Timely Tips & Care
                  </div>
                  <div className="bg-gradient-to-r from-violet-50 to-violet-100 p-4 rounded-lg">
                    😊 Emotional Support
                  </div>
                </div>

                <p className="text-gray-500 mt-4 text-sm">
                  Type your question below and press Send.
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
            />
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
