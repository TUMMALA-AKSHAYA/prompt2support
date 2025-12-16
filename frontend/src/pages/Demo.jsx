import "../styles/demo.css";
import DocumentUpload from "../components/DocumentUpload";
import { useState } from "react";

export default function Demo() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Upload documents and ask me anything about them." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", text: input }]);
    setInput("");

    // fake AI reply (replace with real API later)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "I'm analyzing your documents using multiple AI agents." }
      ]);
    }, 800);
  };

  return (
    <div className="demo-container">

      {/* Header */}
      <div className="demo-header">
        <h1>Prompt2Support</h1>
        <span className="demo-badge">Demo Mode</span>
      </div>

      {/* Grid */}
      <div className="demo-grid">

        {/* LEFT: Controls */}
        <div className="demo-card">
          <h3>Knowledge Base</h3>
          <DocumentUpload />

          <div style={{ marginTop: "24px", color: "#9CA3AF", fontSize: "13px" }}>
            Supported: PDF, DOCX, TXT
          </div>
        </div>

        {/* RIGHT: Chat */}
        <div className="demo-card chat-panel">
          <h3>AI Agent</h3>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className="chat-bubble"
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background:
                    m.role === "user"
                      ? "rgba(255,138,31,0.15)"
                      : "rgba(255,255,255,0.03)"
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              placeholder="Ask the AI agent…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>

      </div>
    </div>
  );
}
