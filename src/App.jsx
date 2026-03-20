import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const API_BASE =
  "https://ai-assistant-in-node-js-with-gemini-node-5d60.onrender.com/api/ask/AIAssistant";

const suggestedQueries = [
  "What can you help me with?",
  "Tell me about AI technology",
  "How does machine learning work?",
  "Explain artificial intelligence",
  "What is deep learning?",
  "How does natural language processing work?",
];

// Icons
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const CopyIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const BotIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
    <circle cx="20" cy="20" r="20" fill="url(#botGrad)" />
    <defs>
      <linearGradient id="botGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10a37f" />
        <stop offset="1" stopColor="#0d8a6a" />
      </linearGradient>
    </defs>
    <path d="M13 20c0-3.866 3.134-7 7-7s7 3.134 7 7-3.134 7-7 7-7-3.134-7-7z" fill="white" fillOpacity="0.2" />
    <circle cx="20" cy="20" r="4" fill="white" />
    <circle cx="15" cy="17" r="1.5" fill="white" fillOpacity="0.8" />
    <circle cx="25" cy="17" r="1.5" fill="white" fillOpacity="0.8" />
  </svg>
);

const PlusIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const MenuIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const TrashIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy"}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all duration-200 cursor-pointer
        ${copied
          ? "text-green-400 bg-green-400/10"
          : "text-gray-400 hover:text-gray-200 hover:bg-white/10"
        }`}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

function MessageBubble({ role, content, isNew }) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-4 px-4 py-6 group ${isUser ? "bg-transparent" : "bg-white/[0.02]"}`}>
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg">
            U
          </div>
        ) : (
          <div className="w-8 h-8">
            <BotIcon />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-semibold mb-2 ${isUser ? "text-violet-400" : "text-emerald-400"}`}>
          {isUser ? "You" : "Naveen AI"}
        </div>
        <div className={`text-sm leading-7 whitespace-pre-wrap break-words ${isUser ? "text-gray-100" : "text-gray-200"}`}>
          {content}
        </div>

        {/* Action bar for AI messages */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <CopyButton text={content} />
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex gap-4 px-4 py-6 bg-white/[0.02]">
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-8 h-8">
          <BotIcon />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold mb-3 text-emerald-400">Naveen AI</div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ onSuggestion }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 pb-32">
      {/* Logo */}
      <div className="w-16 h-16 mb-6">
        <BotIcon />
      </div>

      <h1 className="text-3xl font-bold text-white mb-2 text-center">
        How can I help you today?
      </h1>
      <p className="text-gray-400 text-sm mb-10 text-center">
        Powered by Gemini AI — ask me anything
      </p>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestedQueries.map((q, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(q)}
            className="group text-left px-4 py-3.5 rounded-xl border border-white/10 bg-white/5
              hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
          >
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              {q}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([]);   // { role, content }
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [historyChats, setHistoryChats] = useState([]); // from API /history
  const [currentSessionId, setCurrentSessionId] = useState(Date.now());

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  /* ---------- fetch history on mount ---------- */
  useEffect(() => {
    axios
      .post(`${API_BASE}/history`)
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : [];
        setHistoryChats(raw);
      })
      .catch((err) => console.error("History fetch error:", err));
  }, []);

  /* ---------- auto scroll ---------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ---------- auto resize textarea ---------- */
  const resizeTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  };

  useEffect(resizeTextarea, [question]);

  /* ---------- submit ---------- */
  const handleSubmit = (e) => {
    e?.preventDefault();
    setError("");
    const q = question.trim();
    if (!q) return;

    // Add user message
    const userMsg = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    axios
      .post(`${API_BASE}/ask`, { question: q })
      .then((result) => {
        setLoading(false);
        if (result.data?.chat) {
          const aiMsg = { role: "ai", content: result.data.chat.answer };
          setMessages((prev) => [...prev, aiMsg]);
          // prepend to history sidebar
          setHistoryChats((prev) => [result.data.chat, ...prev]);
        } else {
          setError(result.data?.message || "No response from AI.");
        }
      })
      .catch(() => {
        setLoading(false);
        setError("Something went wrong. Please try again.");
      });
  };

  /* ---------- new chat ---------- */
  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(Date.now());
    setError("");
    setQuestion("");
  };

  /* ---------- load history chat ---------- */
  const loadHistoryChat = (chat) => {
    setMessages([
      { role: "user", content: chat.question },
      { role: "ai", content: chat.answer },
    ]);
    setError("");
  };

  /* ---------- delete history chat ---------- */
  const deleteChat = async (e, chatId) => {
    e.stopPropagation(); // sidebar button click se prevent karo
    try {
      await axios.delete(`${API_BASE}/delete/${chatId}`);
      setHistoryChats((prev) => prev.filter((c) => c._id !== chatId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Chat delete karne mein problem aayi. Dobara try karo.");
    }
  };

  /* ---------- keyboard ---------- */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasMessages = messages.length > 0;
  const recentHistory = historyChats.slice(0, 20);

  return (
    <div className="flex h-screen bg-[#212121] text-white overflow-hidden font-sans">

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`flex flex-col bg-[#171717] transition-all duration-300 ease-in-out flex-shrink-0
          ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/5">
          <button
            onClick={startNewChat}
            className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg hover:bg-white/10
              text-sm text-gray-300 hover:text-white transition-all duration-150 cursor-pointer"
          >
            <PlusIcon />
            <span className="font-medium">New chat</span>
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 scrollbar-thin">
          {recentHistory.length === 0 ? (
            <p className="text-xs text-gray-600 text-center mt-8 px-4">
              No previous chats
            </p>
          ) : (
            <>
              <p className="text-xs text-gray-500 uppercase tracking-wider px-2 py-2 font-semibold">
                Recent
              </p>
              {recentHistory.map((chat, i) => (
                <div
                  key={chat._id || i}
                  className="flex items-center gap-1 group rounded-lg hover:bg-white/10 transition-all duration-150"
                >
                  <button
                    onClick={() => loadHistoryChat(chat)}
                    className="flex-1 text-left px-3 py-2 cursor-pointer min-w-0"
                  >
                    <p className="text-sm text-gray-300 group-hover:text-white truncate leading-5">
                      {chat.question}
                    </p>
                  </button>
                  {/* Delete button — hover par dikhega */}
                  <button
                    onClick={(e) => deleteChat(e, chat._id)}
                    title="Delete chat"
                    className="flex-shrink-0 p-1.5 mr-1 rounded-md opacity-0 group-hover:opacity-100
                      text-gray-500 hover:text-red-400 hover:bg-red-400/10
                      transition-all duration-150 cursor-pointer"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-semibold">
              N
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">Naveen</p>
              <p className="text-xs text-gray-500 truncate">AI Assistant</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <main className="flex flex-col flex-1 min-w-0">

        {/* Top Bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-white/5 flex-shrink-0 bg-[#212121]">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white
              transition-all duration-150 cursor-pointer"
            title="Toggle sidebar"
          >
            <MenuIcon />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-200">Naveen AI</span>
            <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
              Gemini
            </span>
          </div>
          {hasMessages && (
            <button
              onClick={startNewChat}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <PlusIcon />
              New chat
            </button>
          )}
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {!hasMessages ? (
            <WelcomeScreen onSuggestion={(q) => setQuestion(q)} />
          ) : (
            <div className="max-w-3xl mx-auto w-full pb-36">
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  isNew={i === messages.length - 1}
                />
              ))}
              {loading && <LoadingDots />}
              {error && (
                <div className="mx-4 my-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2 bg-[#212121]">
          {/* Error when no messages */}
          {error && !hasMessages && (
            <div className="max-w-3xl mx-auto mb-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 bg-[#2f2f2f] rounded-2xl border border-white/10
              hover:border-white/20 focus-within:border-white/30 transition-all duration-200 px-4 py-3 shadow-xl">

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                name="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Naveen AI…"
                disabled={loading}
                rows={1}
                className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-500
                  resize-none leading-6 text-sm overflow-hidden disabled:opacity-50"
                style={{ minHeight: "24px", maxHeight: "200px" }}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                  transition-all duration-200 cursor-pointer
                  ${question.trim() && !loading
                    ? "bg-white text-black hover:bg-gray-200 shadow-md"
                    : "bg-white/10 text-gray-600 cursor-not-allowed"
                  }`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <SendIcon />
                )}
              </button>
            </div>

            <p className="text-center text-xs text-gray-600 mt-2">
              Naveen AI can make mistakes. Consider checking important information.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
