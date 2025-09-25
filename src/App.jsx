import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [copied, setCopied] = useState(false);
  const [inputHeight, setInputHeight] = useState("auto");

  const suggestedQueries = [
    "What can you help me with?",
    "Tell me about AI technology",
    "How does machine learning work?",
    "Explain artificial intelligence",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!question.trim()) {
      setError("Please enter a question!");
      return;
    }

    setLoading(true);

    axios
      .post(
        "https://ai-assistant-in-node-js-with-gemini-node-5d60.onrender.com/api/ask/AIAssistant/ask",
        { question }
      )
      .then((result) => {
        setLoading(false);

        if (result.data?.chat) {
          setAnswer(result.data.chat.answer);
          setData((prev) => [result.data.chat, ...prev]);
          setQuestion(""); // clear input after submit
        } else {
          setError(result.data.message || "No response");
        }
      })
      .catch((error) => {
        setLoading(false);
        setError("Something went wrong!");
        console.error(error);
      });
  };

  const handleSuggestedQuery = (query) => {
    setQuestion(query);
    // Trigger auto-resize after setting question
    setTimeout(() => {
      const textarea = document.querySelector('textarea[name="question"]');
      autoResizeTextarea(textarea);
    }, 0);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
    // Auto-resize textarea based on content
    const textarea = e.target;
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 200; // Maximum height limit
    const minHeight = 24; // Minimum height for single line
    const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
    textarea.style.height = newHeight + "px";
  };

  const autoResizeTextarea = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200;
      const minHeight = 24;
      const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
      textarea.style.height = newHeight + "px";
    }
  };

  useEffect(() => {
    axios
      .get(
        "https://ai-assistant-in-node-js-with-gemini-node-5d60.onrender.com/api/ask/AIAssistant/history"
      )
      .then((result) => setData(result.data))
      .catch((error) => console.error(error));
  }, []);

  // Initialize textarea height when component mounts and when question changes
  useEffect(() => {
    const textarea = document.querySelector('textarea[name="question"]');
    if (textarea) {
      // Reset height to auto first
      textarea.style.height = "auto";
      // Then calculate proper height
      autoResizeTextarea(textarea);
    }
  }, [question]);

  // Additional effect to ensure proper initialization
  useEffect(() => {
    const textarea = document.querySelector('textarea[name="question"]');
    if (textarea && !question) {
      // Reset to minimum height when empty
      textarea.style.height = "24px";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Main Chat Interface */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">
                Naveen AI Assist
              </h1>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* AI Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full blur-sm opacity-60"></div>
              <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main Prompt */}
          <div className="text-center mb-8">
            <h2 className="text-xl text-gray-700 mb-6">
              What do you want to know about AI?
            </h2>

            {/* Suggested Queries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {suggestedQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuery(query)}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-left transition-colors duration-200 border border-gray-200 hover:border-gray-300"
                >
                  {query}
                </button>
              ))}
            </div>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              Show more
            </button>
          </div>

          {/* Input Field */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all min-h-[52px] ">
              <textarea
                name="question"
                value={question}
                onChange={handleInputChange}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 resize-none  leading-6 overflow-auto"
                disabled={loading}
                rows={1}
                style={{
                  height: "auto",
                  minHeight: "24px",
                  maxHeight: "200px",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                onInput={(e) => {
                  // Additional input handler for better auto-resize
                  autoResizeTextarea(e.target);
                }}
                onPaste={(e) => {
                  // Handle paste events for auto-resize
                  setTimeout(() => {
                    autoResizeTextarea(e.target);
                  }, 0);
                }}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="ml-2 p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full transition-colors duration-200 flex-shrink-0"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Answer Display */}
          {answer && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-h-[400px] overflow-y-auto">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                    {answer}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(answer)}
                  className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 flex-shrink-0"
                  title="Copy answer"
                >
                  {copied ? (
                    <>
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat History */}
        {data.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Conversations
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {data.slice(0, 5).map((chat, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="mb-3">
                    <span className="text-sm font-medium text-blue-600">
                      Q:
                    </span>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap break-words leading-relaxed mt-1">
                      {chat.question}
                    </p>
                  </div>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-green-600">
                        A:
                      </span>
                      <p className="text-gray-600 text-sm whitespace-pre-wrap break-words leading-relaxed mt-1">
                        {chat.answer}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(chat.answer)}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xs text-gray-600 hover:text-gray-800 transition-colors duration-200 flex-shrink-0"
                      title="Copy answer"
                    >
                      {copied ? (
                        <>
                          <svg
                            className="w-3 h-3 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
