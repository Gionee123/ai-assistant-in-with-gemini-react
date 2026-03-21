import React, { useState } from "react";
import { Handle, Position } from "reactflow";

const ResultNode = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!data.response) return;
    try {
      await navigator.clipboard.writeText(data.response);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = data.response;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-node">
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{
          background: "linear-gradient(135deg, #059669, #10b981)",
          border: "2px solid #6ee7b7",
          width: 12,
          height: 12,
          top: -6,
        }}
      />

      {/* Node Header */}
      <div className="node-header result-header">
        <div className="node-icon result-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <span className="node-title">AI Response</span>
        <span className="node-badge result-badge">Output</span>

        {data.response && !data.loading && (
          <button
            onClick={handleCopy}
            className={`copy-btn ${copied ? "copied" : ""}`}
            title={copied ? "Copied!" : "Copy response"}
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="node-body">
        {data.loading ? (
          <div className="result-loading">
            <div className="loading-dots">
              <span style={{ animationDelay: "0ms" }} />
              <span style={{ animationDelay: "150ms" }} />
              <span style={{ animationDelay: "300ms" }} />
            </div>
            <p className="loading-text">Naveen AI is thinking…</p>
          </div>
        ) : data.error ? (
          <div className="result-error">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" className="error-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p>{data.error}</p>
          </div>
        ) : data.response ? (
          <div className="result-content">
            <pre className="result-text">{data.response}</pre>
          </div>
        ) : (
          <div className="result-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" className="empty-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <p>Click <strong>Run Flow</strong> to generate a response</p>
          </div>
        )}
      </div>

      {/* Save button */}
      {data.response && !data.loading && (
        <div className="node-footer">
          <button
            onClick={data.onSave}
            disabled={data.saving || data.saved}
            className={`save-btn ${data.saved ? "saved" : ""} ${data.saving ? "saving" : ""}`}
          >
            {data.saving ? (
              <>
                <div className="btn-spinner" />
                Saving…
              </>
            ) : data.saved ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save to MongoDB
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultNode;
