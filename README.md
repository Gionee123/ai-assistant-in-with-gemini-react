<div align="center">

# 🤖 Naveen AI Flow

**A visual, node-based AI assistant powered by Google Gemini — built with React Flow**

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![React Flow](https://img.shields.io/badge/React_Flow-11.x-FF0072?style=for-the-badge&logo=react&logoColor=white)](https://reactflow.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

> A premium dark-themed AI assistant with a **React Flow canvas** — type your prompt in the Input Node, hit **Run Flow**, and see the Gemini AI response appear in the Result Node. Save conversations to MongoDB and browse/delete history via a beautiful popup modal.

<br/>

---

</div>

## ✨ Features

- 🔵 **React Flow Canvas** — Visual node-based interface instead of a traditional chat UI
- 🟣 **Input Node** — Textarea inside a draggable node to enter your AI prompt
- 🟢 **Result Node** — Displays the AI response with copy-to-clipboard support
- ▶️ **Run Flow Button** — Triggers the AI call; animated loading dots while thinking
- 💾 **Save to MongoDB** — Save any prompt + response to the database with one click
- 🕓 **Conversation History Popup** — Click the History button to browse all past conversations
- 🔍 **Searchable History** — Filter conversations by prompt or response text in real-time
- 🗑️ **Delete History** — Hover over any history item to reveal a red trash button; deletes instantly (optimistic UI)
- 📋 **Copy Response** — Copy AI response to clipboard with one click
- ⚡ **Status Indicator** — Top-bar pill shows Ready / Running… / Flow complete states
- 🗺️ **Minimap** — React Flow minimap for navigation when nodes are moved around
- 🔄 **Animated Edges** — Gradient animated connection line between nodes (purple → green)
- 🎨 **Premium Dark UI** — Glassmorphism nodes, glowing borders, smooth animations
- ⌨️ **Keyboard shortcuts** — `Esc` to close history modal
- 📱 **Responsive** — Canvas scales with viewport; zoom + pan controls built-in

---

## 🏗️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.1 | UI framework |
| React Flow | 11.x | Node-based visual canvas |
| Vite | 7.x | Build tool & dev server |
| Tailwind CSS | 4.x | Utility-first styling |
| Axios | 1.12 | HTTP requests to backend API |
| Inter (Google Fonts) | — | Typography |

### Backend (Deployed on Render)
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Google Gemini SDK | AI response generation |
| MongoDB (via Mongoose) | Storing conversation history |

---

## 🚀 Getting Started

### Prerequisites

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

Output goes to the `dist/` folder, ready to deploy on Vercel / Netlify.

---

## 🖥️ How to Use

```
1. Type your question into the "Prompt Input" node textarea
2. Click the purple "▶ Run Flow" button in the top-right
3. Watch the animated loading dots in the "AI Response" node
4. Read the Gemini AI answer when it appears
5. (Optional) Click "Copy" to copy the response to clipboard
6. (Optional) Click "Save to MongoDB" to persist the conversation
7. Click "History" to browse and search past conversations
8. Hover over any history item → click the 🗑️ trash icon to delete it
9. Click any history item to load that conversation back into the nodes
```

---

## 📁 Project Structure

```
ai/
├── public/
│   └── (static assets)
├── src/
│   ├── components/
│   │   └── HistoryModal.jsx     # History popup modal (search + list + delete)
│   ├── nodes/
│   │   ├── InputNode.jsx        # Custom React Flow node — prompt textarea
│   │   └── ResultNode.jsx       # Custom React Flow node — AI response display
│   ├── App.jsx                  # Main app: React Flow canvas + all state logic
│   ├── flow.css                 # All custom styles (nodes, modal, buttons, animations)
│   ├── index.css                # Global styles + Tailwind + Google Fonts import
│   └── main.jsx                 # React entry point
├── index.html                   # HTML shell
├── vite.config.js               # Vite + Tailwind + React plugin config
├── package.json                 # Dependencies & scripts
└── README.md                    # You're reading it!
```

---

## 🗂️ Component Architecture

```
App (App.jsx)
├── Top Bar
│   ├── Brand logo + name ("Naveen AI Flow")
│   ├── Status pill (Ready / Running… / Flow complete)
│   ├── 🕓 History Button → opens HistoryModal
│   └── ▶ Run Flow Button
│
├── React Flow Canvas
│   ├── InputNode (src/nodes/InputNode.jsx)
│   │   ├── Purple header ("Prompt Input" + INPUT badge)
│   │   ├── Textarea (controlled, sends value to App state)
│   │   └── Source handle (bottom) → connects to ResultNode
│   │
│   ├── ResultNode (src/nodes/ResultNode.jsx)
│   │   ├── Green header ("AI Response" + OUTPUT badge)
│   │   ├── Target handle (top) ← receives from InputNode
│   │   ├── Body: Loading dots | Error state | Empty state | Response text
│   │   ├── Copy button (in header, appears after response)
│   │   └── "Save to MongoDB" button (in footer, appears after response)
│   │
│   ├── Animated gradient edge (InputNode → ResultNode)
│   ├── Background (dot grid)
│   ├── Controls (zoom +/−, fit)
│   └── MiniMap
│
└── HistoryModal (src/components/HistoryModal.jsx)
    ├── Backdrop (click to close) + Esc key to close
    ├── Header (icon + title + conversation count + ✕ close)
    ├── Search bar (live filter by question or answer)
    ├── Scrollable conversation list
    │   └── Each row:
    │       ├── [Chat icon] [Question title] [Answer preview] [Timestamp]
    │       └── [🗑️ Delete button — appears on hover, red on hover]
    └── Footer hint ("Click to load · Hover to delete")
```

---

## 📡 API Reference

**Base URL:**
```
https://ai-assistant-in-node-js-with-gemini-node-5d60.onrender.com/api/ask/AIAssistant
```

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ask` | Send a question, receive an AI answer + save to DB |
| `POST` | `/history` | Fetch all past conversations |
| `DELETE` | `/delete/:id` | Delete a specific conversation by MongoDB `_id` |

### `POST /ask` — Request
```json
{
  "question": "What is machine learning?"
}
```

### `POST /ask` — Response
```json
{
  "chat": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "question": "What is machine learning?",
    "answer": "Machine learning is a subset of AI that enables systems to learn from data...",
    "createdAt": "2026-03-21T09:45:00.000Z"
  }
}
```

### `POST /history` — Response
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "question": "What is machine learning?",
    "answer": "Machine learning is a subset of AI...",
    "createdAt": "2026-03-21T09:45:00.000Z"
  }
]
```

### `DELETE /delete/:id` — Response
```json
{
  "message": "Chat deleted successfully"
}
```

> **Error Responses:**
> - `404 Not Found` — Chat with the given ID does not exist
> - `500 Internal Server Error` — Unexpected server error

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
npm run build
# Deploy the dist/ folder
```

Or via Vercel CLI:
```bash
npx vercel --prod
```

### Backend
Already live on **Render**:
```
https://ai-assistant-in-node-js-with-gemini-node-5d60.onrender.com
```

> ⚠️ **Note:** Render free tier spins down after inactivity. The first request after idle may take a few seconds.

---

## 🐛 Troubleshooting

| Issue | Solution |
|---|---|
| Backend slow on first request | Render free tier cold-start — just wait a moment and retry |
| `npm run dev` fails | Make sure Node.js ≥ 18 is installed |
| Tailwind classes not applying | Ensure `@import "tailwindcss"` is at the top of `index.css` |
| React Flow nodes not visible | Check that `reactflow/dist/style.css` is imported in `App.jsx` |
| Blank page on build | Open browser console — check for import path errors |
| History modal shows empty | Backend may be cold-starting; wait a second and re-open |

---

## 🔮 Roadmap

- [x] 🔵 React Flow node-based canvas UI
- [x] 🟣 Custom Input Node with textarea
- [x] 🟢 Custom Result Node with copy button
- [x] 💾 Save conversations to MongoDB
- [x] 🕓 History popup modal
- [x] 🔍 Searchable history
- [x] 🗑️ Delete individual history entries
- [ ] 🔐 User Authentication (login / signup)
- [ ] 📁 Multiple named flow sessions
- [ ] 🌐 Multi-language support
- [ ] 🖼️ Image input support (Gemini Vision)
- [ ] 🔊 Text-to-speech responses
- [ ] 📤 Export flow as PDF / Markdown
- [ ] 🌙 Light mode toggle
- [ ] 🔗 Add more custom nodes (e.g., Summarize Node, Translate Node)

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

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Naveen**

*Full-Stack Developer | AI Enthusiast*

[![GitHub](https://img.shields.io/badge/GitHub-Gionee123-181717?style=flat-square&logo=github)](https://github.com/Gionee123)

---

*Made with ❤️ and powered by Google Gemini AI · React Flow*

</div>
