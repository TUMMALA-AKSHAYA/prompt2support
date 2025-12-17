import "../styles/demo.css";
import DocumentUpload from "../components/DocumentUpload";
import { useState } from "react";

export default function Demo() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Upload documents and ask me anything about them." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");

    // show user message immediately
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/queries/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: userMessage })
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: data.answer || "No response received from AI."
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ AI backend error. Please check server or API key."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  const handleUpload = async (formData) => {
  try {
    const res = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();

    setMessages(prev => [
      ...prev,
      {
        role: "assistant",
        text: "📄 Document uploaded successfully. You can now ask questions about it."
      }
    ]);
  } catch (err) {
    console.error(err);
    setMessages(prev => [
      ...prev,
      {
        role: "assistant",
        text: "⚠️ Failed to upload document. Please try again."
      }
    ]);
  }
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

        {/* LEFT: Upload */}
        <div className="demo-card">
          <h3>Knowledge Base</h3>
          
          <DocumentUpload onUpload={handleUpload} />


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
            {loading && (
              <div className="chat-bubble" style={{ opacity: 0.6 }}>
                AI is thinking…
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              placeholder="Ask the AI agent…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading}>
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
