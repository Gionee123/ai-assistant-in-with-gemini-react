import React from "react";
import { Handle, Position } from "reactflow";

const InputNode = ({ data }) => {
  return (
    <div className="input-node">
      {/* Node Header */}
      <div className="node-header input-header">
        <div className="node-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
        <span className="node-title">Prompt Input</span>
        <span className="node-badge">Input</span>
      </div>

      {/* Textarea */}
      <div className="node-body">
        <label className="node-label">Enter your prompt</label>
        <textarea
          value={data.prompt}
          onChange={(e) => data.onPromptChange(e.target.value)}
          placeholder="Ask Naveen AI anything…"
          rows={5}
          className="node-textarea"
          spellCheck={false}
        />
        <p className="node-hint">Shift+Enter for new line</p>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          border: "2px solid #c4b5fd",
          width: 12,
          height: 12,
          bottom: -6,
        }}
      />
    </div>
  );
};

export default InputNode;
