import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import InputNode from "./nodes/InputNode";
import ResultNode from "./nodes/ResultNode";
import HistoryModal from "./components/HistoryModal";
import "./flow.css";

/* ─────────────────────────── constants ─────────────────────────── */
const API_BASE =
  "https://ai-assistant-in-node-js-with-gemini-node-5d60.onrender.com/api/ask/AIAssistant";

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

/* ─────────────────────── initial nodes ─────────────────────────── */
const initialEdges = [
  {
    id: "e-input-result",
    source: "input-1",
    sourceHandle: "out",
    target: "result-1",
    targetHandle: "in",
    animated: true,
    style: { stroke: "url(#edgeGradient)", strokeWidth: 2.5 },
    type: "smoothstep",
  },
];

const INIT_NODES = [
  {
    id: "input-1",
    type: "inputNode",
    position: { x: 200, y: 60 },
    data: { prompt: "", onPromptChange: () => {} },
    draggable: true,
  },
  {
    id: "result-1",
    type: "resultNode",
    position: { x: 200, y: 380 },
    data: { response: "", loading: false, error: "", saving: false, saved: false, onSave: () => {} },
    draggable: true,
  },
];

/* ──────────────────────────── App ──────────────────────────────── */
export default function App() {
  /* ── flow state ── */
  const [prompt,   setPrompt]   = useState("");
  const [response, setResponse] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  /* ── history state ── */
  const [historyOpen,    setHistoryOpen]    = useState(false);
  const [historyList,    setHistoryList]    = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyFetched, setHistoryFetched] = useState(false);

  /* ── nodes / edges ── */
  const [nodes, setNodes, onNodesChange] = useNodesState(INIT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  /* ─────────── sync helper ─────────── */
  const syncNodes = useCallback(
    (p, r, l, e, sv, sd, onSaveFn) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === "input-1")
            return { ...node, data: { ...node.data, prompt: p, onPromptChange: (v) => handlePromptChangeRef.current(v) } };
          if (node.id === "result-1")
            return { ...node, data: { ...node.data, response: r, loading: l, error: e, saving: sv, saved: sd, onSave: onSaveFn || handleSaveSyncRef.current } };
          return node;
        })
      );
    },
    [setNodes]
  );

  /* ── refs so callbacks don't go stale ── */
  const handlePromptChangeRef = React.useRef(null);
  const handleSaveSyncRef     = React.useRef(null);

  /* ─────────── prompt change ─────────── */
  const handlePromptChange = useCallback(
    (val) => {
      setPrompt(val);
      setSaved(false);
      setNodes((nds) =>
        nds.map((n) =>
          n.id === "input-1" ? { ...n, data: { ...n.data, prompt: val } } : n
        )
      );
    },
    [setNodes]
  );
  handlePromptChangeRef.current = handlePromptChange;

  /* ─────────── save to MongoDB ─────────── */
  const handleSaveSync = useCallback(async () => {
    if (!prompt.trim() || !response) return;
    setSaving(true);
    syncNodes(prompt, response, false, "", true, false);
    try {
      await axios.post(`${API_BASE}/ask`, { question: prompt });
      setSaving(false);
      setSaved(true);
      syncNodes(prompt, response, false, "", false, true);
      // refresh history list silently
      axios.post(`${API_BASE}/history`).then((res) => {
        if (Array.isArray(res.data)) setHistoryList(res.data);
      }).catch(() => {});
      setTimeout(() => {
        setSaved(false);
        syncNodes(prompt, response, false, "", false, false);
      }, 3000);
    } catch {
      setSaving(false);
      syncNodes(prompt, response, false, "", false, false);
      alert("Save failed. Please try again.");
    }
  }, [prompt, response, syncNodes]);
  handleSaveSyncRef.current = handleSaveSync;

  /* ─────────── Run Flow ─────────── */
  const handleRunFlow = useCallback(async () => {
    const q = prompt.trim();
    if (!q) return;

    setError("");
    setResponse("");
    setSaved(false);
    setLoading(true);
    syncNodes(q, "", true, "", false, false, handleSaveSyncRef.current);

    try {
      const result = await axios.post(`${API_BASE}/ask`, { question: q });
      const answer = result.data?.chat?.answer || result.data?.answer || "";
      setLoading(false);
      if (answer) {
        setResponse(answer);
        syncNodes(q, answer, false, "", false, false, handleSaveSyncRef.current);
        // silently refresh history
        axios.post(`${API_BASE}/history`).then((res) => {
          if (Array.isArray(res.data)) { setHistoryList(res.data); setHistoryFetched(true); }
        }).catch(() => {});
      } else {
        const msg = result.data?.message || "No response from AI.";
        setError(msg);
        syncNodes(q, "", false, msg, false, false, handleSaveSyncRef.current);
      }
    } catch {
      const msg = "Something went wrong. Please try again.";
      setError(msg);
      setLoading(false);
      syncNodes(q, "", false, msg, false, false, handleSaveSyncRef.current);
    }
  }, [prompt, syncNodes]);

  /* ─────────── open history popup ─────────── */
  const openHistory = useCallback(() => {
    setHistoryOpen(true);
    if (!historyFetched) {
      setHistoryLoading(true);
      axios
        .post(`${API_BASE}/history`)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : [];
          setHistoryList(data);
          setHistoryFetched(true);
        })
        .catch(() => setHistoryList([]))
        .finally(() => setHistoryLoading(false));
    }
  }, [historyFetched]);

  /* ─────────── delete one history item ─────────── */
  const handleDeleteHistory = useCallback(async (id) => {
    // Optimistic remove from UI immediately
    setHistoryList((prev) => prev.filter((c) => c._id !== id));
    try {
      await axios.delete(`${API_BASE}/delete/${id}`);
    } catch {
      // If API fails, re-fetch to restore correct state
      axios.post(`${API_BASE}/history`)
        .then((res) => { if (Array.isArray(res.data)) setHistoryList(res.data); })
        .catch(() => {});
      alert("Delete failed. Please try again.");
    }
  }, []);

  /* ─────────── select a history item ─────────── */
  const handleSelectHistory = useCallback(
    (chat) => {
      const p = chat.question || "";
      const r = chat.answer   || "";
      setPrompt(p);
      setResponse(r);
      setError("");
      setSaved(false);
      setSaving(false);
      setLoading(false);
      syncNodes(p, r, false, "", false, false, handleSaveSyncRef.current);
    },
    [syncNodes]
  );

  /* ─────────── connect ─────────── */
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, type: "smoothstep" }, eds)),
    [setEdges]
  );

  /* ─────────── live node data (always fresh) ─────────── */
  const liveNodes = nodes.map((n) => {
    if (n.id === "input-1")
      return { ...n, data: { ...n.data, prompt, onPromptChange: handlePromptChange } };
    if (n.id === "result-1")
      return { ...n, data: { ...n.data, response, loading, error, saving, saved, onSave: handleSaveSync } };
    return n;
  });

  return (
    <div className="flow-root">

      {/* ══════════ Top Bar ══════════ */}
      <header className="flow-topbar">

        {/* Left: brand */}
        <div className="topbar-left">
          <div className="brand-logo">
            <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
              <circle cx="16" cy="16" r="16" fill="url(#logoGrad)" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7c3aed" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="5" fill="white" fillOpacity="0.9" />
              <circle cx="10" cy="12" r="2" fill="white" fillOpacity="0.6" />
              <circle cx="22" cy="12" r="2" fill="white" fillOpacity="0.6" />
            </svg>
          </div>
          <div>
            <h1 className="brand-name">Naveen AI Flow</h1>
            <p className="brand-sub">Powered by Gemini · React Flow</p>
          </div>
        </div>

        {/* Center: status */}
        <div className="topbar-center">
          <div className="flow-status">
            <span className={`status-dot ${loading ? "pulsing" : response ? "active" : ""}`} />
            <span className="status-label">
              {loading ? "Running…" : response ? "Flow complete" : "Ready"}
            </span>
          </div>
        </div>

        {/* Right: History + Run */}
        <div className="topbar-right">

          {/* ── History Button ── */}
          <button className="history-btn" onClick={openHistory} title="View conversation history">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
            History
            {historyList.length > 0 && (
              <span className="history-count">{historyList.length > 99 ? "99+" : historyList.length}</span>
            )}
          </button>

          {/* ── Run Flow Button ── */}
          <button
            onClick={handleRunFlow}
            disabled={loading || !prompt.trim()}
            className={`run-btn ${loading ? "running" : ""}`}
          >
            {loading ? (
              <>
                <div className="btn-spinner" />
                Running Flow…
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Run Flow
              </>
            )}
          </button>
        </div>
      </header>

      {/* ══════════ React Flow Canvas ══════════ */}
      <div className="flow-canvas">
        {/* edge gradient */}
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#a855f7" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        <ReactFlow
          nodes={liveNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.4}
          maxZoom={1.8}
          proOptions={{ hideAttribution: true }}
          style={{ background: "transparent" }}
        >
          <Background color="#334155" gap={28} size={1} variant="dots" />
          <Controls
            style={{
              background: "#1e293b",
              border: "1px solid rgba(148,163,184,0.1)",
              borderRadius: 10,
            }}
          />
          <MiniMap
            nodeColor={(n) => (n.type === "inputNode" ? "#7c3aed" : "#059669")}
            maskColor="rgba(0,0,0,0.4)"
            style={{
              background: "#0f172a",
              border: "1px solid rgba(148,163,184,0.1)",
              borderRadius: 10,
            }}
          />
        </ReactFlow>
      </div>

      {/* ══════════ History Modal ══════════ */}
      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={historyList}
        loading={historyLoading}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
      />
    </div>
  );
}
