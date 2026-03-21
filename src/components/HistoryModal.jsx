import React, { useEffect, useRef, useState } from "react";

/* ── tiny helpers ─────────────────────────────────── */
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function truncate(str, n = 72) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n) + "…" : str;
}

/* ═══════════════════════════════════════════════════
   HistoryModal
   Props:
     isOpen    — boolean
     onClose   — () => void
     history   — [{ _id, question, answer, createdAt }]
     loading   — boolean (fetching history)
     onSelect  — (chat) => void
     onDelete  — (id) => Promise<void>
   ═══════════════════════════════════════════════════ */
export default function HistoryModal({ isOpen, onClose, history, loading, onSelect, onDelete }) {
  const [search,     setSearch]     = useState("");
  const [deletingId, setDeletingId] = useState(null); // which item is being deleted
  const overlayRef = useRef(null);
  const inputRef   = useRef(null);

  /* focus search on open */
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  /* close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  /* close on backdrop click */
  const handleBackdrop = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  /* delete a single item */
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // don't trigger the row click (load conversation)
    if (!id || deletingId) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  /* filtered list */
  const filtered = (history || []).filter((c) =>
    (c.question || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.answer   || "").toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleBackdrop}>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-label="Conversation History">

        {/* ── Header ── */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-header-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
              </svg>
            </div>
            <div>
              <h2 className="modal-title">Conversation History</h2>
              <p className="modal-sub">{(history || []).length} saved conversation{(history || []).length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close (Esc)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Search ── */}
        <div className="modal-search-wrap">
          <svg className="modal-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="modal-search-input"
          />
          {search && (
            <button className="modal-search-clear" onClick={() => setSearch("")} title="Clear">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── List ── */}
        <div className="modal-list">
          {loading ? (
            <div className="modal-state-center">
              <div className="modal-spinner" />
              <p>Loading history…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="modal-state-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40" style={{ color: "#334155" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>
                {search ? "No results found" : "No conversations yet"}
              </p>
            </div>
          ) : (
            filtered.map((chat, i) => {
              const isDeleting = deletingId === chat._id;
              return (
                <div
                  key={chat._id || i}
                  className={`modal-item-row ${isDeleting ? "modal-item-deleting" : ""}`}
                >
                  {/* ── Clickable conversation area ── */}
                  <button
                    className="modal-item"
                    onClick={() => { onSelect(chat); onClose(); }}
                    disabled={isDeleting}
                  >
                    {/* Icon */}
                    <div className="modal-item-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                      </svg>
                    </div>

                    {/* Text */}
                    <div className="modal-item-body">
                      <p className="modal-item-question">
                        {truncate(chat.question, 80)}
                      </p>
                      <p className="modal-item-answer">
                        {truncate(chat.answer, 100)}
                      </p>
                    </div>

                    {/* Meta: time + arrow */}
                    <div className="modal-item-meta">
                      <span className="modal-item-time">{timeAgo(chat.createdAt)}</span>
                      <svg className="modal-item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* ── Delete button (shows on hover) ── */}
                  <button
                    className="modal-item-delete-btn"
                    onClick={(e) => handleDelete(e, chat._id)}
                    disabled={isDeleting}
                    title="Delete conversation"
                  >
                    {isDeleting ? (
                      <div className="modal-delete-spinner" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer ── */}
        {filtered.length > 0 && (
          <div className="modal-footer">
            <span className="modal-footer-hint">
              Click a conversation to load · Hover to delete
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
