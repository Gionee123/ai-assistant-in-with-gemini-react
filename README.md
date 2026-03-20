<div align="center">

# 🤖 Naveen AI Assistant

**A modern, ChatGPT-style AI chat application powered by Google Gemini**

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

> Ask anything, get intelligent answers — a sleek full-stack AI assistant with conversation history, dark UI, and real-time responses.

<br/>

---

</div>

## 📸 Preview

| Welcome Screen | Chat Interface |
|---|---|
| Centered welcome with suggested prompts | Real-time Q&A with copy & history |

> Dark-themed UI inspired by ChatGPT — sidebar with conversation history, animated typing indicators, and a sticky chat input bar.

---

## ✨ Features

- 🧠 **Google Gemini AI** — Powered by Gemini via a Node.js backend API
- 💬 **ChatGPT-style UI** — Dark theme, sidebar, message bubbles, and avatars
- 📜 **Conversation History** — Past questions loaded automatically from the server
- 🗑️ **Delete Chat History** — Remove any past conversation with one click (hover to reveal trash icon)
- 📋 **Copy to Clipboard** — Copy any AI response with one click
- ⌨️ **Smart Input** — Auto-resizing textarea; press `Enter` to send, `Shift+Enter` for new line
- ⏳ **Loading Animation** — Animated bouncing dots while AI is thinking
- 🆕 **New Chat** — Start a fresh conversation at any time
- 📱 **Responsive** — Works seamlessly on desktop and mobile screens
- ⚡ **Vite + React 19** — Blazing-fast development and hot module replacement
- 🎨 **Tailwind CSS v4** — Utility-first styling with custom dark theme

---

## 🏗️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.1 | UI framework |
| Vite | 7.x | Build tool & dev server |
| Tailwind CSS | 4.x | Styling & dark theme |
| Axios | 1.12 | HTTP requests to backend API |
| Inter (Google Fonts) | — | Typography |

### Backend (Deployed)
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Google Gemini SDK | AI response generation |
| MongoDB (via Mongoose) | Storing conversation history |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) `>= 18.x`
- [npm](https://www.npmjs.com/) `>= 9.x`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Gionee123/ai-assistant-in-with-gemini-react.git

# 2. Navigate to the frontend directory
cd ai-assistant-in-with-gemini-react/ai

# 3. Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open your browser at **http://localhost:5173** 🎉

### Production Build

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy.

---

## 📡 API Reference

The frontend connects to a deployed Node.js backend hosted on **Render**.

**Base URL:**
```
https://ai-assistant-in-node-js-with-gemini-node-5d60.onrender.com/api/ask/AIAssistant
```

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ask` | Send a question, receive an AI answer |
| `POST` | `/history` | Fetch all past conversations |
| `DELETE` | `/delete/:id` | Delete a specific chat by its MongoDB `_id` |

### Request — `POST /ask`

```json
{
  "question": "What is machine learning?"
}
```

### Response — `POST /ask`

```json
{
  "chat": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "question": "What is machine learning?",
    "answer": "Machine learning is a subset of AI that enables systems to learn from data..."
  }
}
```

### Request — `DELETE /delete/:id`

```
DELETE /api/ask/AIAssistant/delete/64f1a2b3c4d5e6f7a8b9c0d1
```

### Response — `DELETE /delete/:id`

```json
{
  "message": "Chat deleted successfully"
}
```

> **Error Responses:**
> - `404 Not Found` — Chat with the given ID does not exist
> - `500 Internal Server Error` — Unexpected server error

---

## 📁 Project Structure

```
ai/
├── public/
│   ├── naveen1.png          # App favicon / logo
│   └── naveen2.png          # Additional asset
├── src/
│   ├── App.jsx              # Main application component (entire UI)
│   ├── index.css            # Global styles + Tailwind + Google Fonts
│   └── main.jsx             # React entry point
├── index.html               # HTML shell
├── vite.config.js           # Vite + Tailwind + React plugin config
├── package.json             # Dependencies & scripts
└── README.md                # You're reading it!
```

---

## 🖥️ UI Components Overview

```
App
├── Sidebar
│   ├── "+ New Chat" button
│   ├── Recent conversations list (from API)
│   │   └── Each item: [Chat title] + [🗑️ Delete button on hover]
│   └── User profile footer
├── Main Area
│   ├── Header (toggle sidebar, model badge, new chat)
│   ├── Welcome Screen (when no messages)
│   │   ├── Bot Avatar
│   │   ├── Greeting heading
│   │   └── Suggested prompt cards (6 cards, 2 columns)
│   ├── Chat Messages
│   │   ├── User bubble (purple avatar)
│   │   ├── AI bubble (green avatar + copy button on hover)
│   │   └── Loading dots animation
│   └── Input Bar
│       ├── Auto-resize textarea
│       ├── Send button (active/disabled states)
│       └── Disclaimer text
```

---

## ⚙️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

---

## 🌐 Deployment

### Frontend (Vercel / Netlify)

```bash
# Build the project
npm run build

# Deploy the dist/ folder to Vercel or Netlify
```

Or use Vercel CLI:
```bash
npx vercel --prod
```

### Backend
The backend is already live and deployed on **Render** at:
```
https://ai-assistant-in-node-js-with-gemini-node-5d60.onrender.com
```

---

## 🔮 Roadmap

- [x] 🗑️ Delete individual chat history entries
- [ ] 🔐 User Authentication (login/signup)
- [ ] 📁 Multiple chat sessions with named conversations
- [ ] 🌐 Multi-language support
- [ ] 🖼️ Image input support (Gemini Vision)
- [ ] 🔊 Text-to-speech responses
- [ ] 📤 Export conversations as PDF / Markdown
- [ ] 🌙 Light mode toggle

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a new branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 🐛 Known Issues & Troubleshooting

| Issue | Solution |
|---|---|
| Backend takes a few seconds on first request | Render free tier spins down after inactivity — just wait a moment |
| `npm run dev` fails | Make sure Node.js ≥ 18 is installed |
| Tailwind classes not applying | Ensure `@import "tailwindcss"` is in `index.css` |
| Blank page on build | Check browser console for import errors |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Naveen**

*Full-Stack Developer | AI Enthusiast*

[![GitHub](https://img.shields.io/badge/GitHub-Gionee123-181717?style=flat-square&logo=github)](https://github.com/Gionee123)

---

*Made with ❤️ and powered by Google Gemini AI*

</div>
