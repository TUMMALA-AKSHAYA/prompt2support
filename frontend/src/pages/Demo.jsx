import "../styles/demo.css";
import DocumentUpload from "../components/DocumentUpload";
import { useState } from "react";

const BACKEND_URL = "https://prompt2support-q4sh.onrender.com";

export default function Demo() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "I'm here to help you understand your documents and resolve customer queries clearly and quickly."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // 🔹 SEND QUERY
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setLoading(true);

    setMessages(prev => [...prev, { role: "user", text: userText }]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/queries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text:
            typeof data.answer === "string"
              ? data.answer
              : "I couldn't find relevant information in the uploaded documents."
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "There was an issue processing your request."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 FILE UPLOAD CALLBACK
  const handleUploaded = filename => {
    if (filename) {
      setUploadedFiles(prev => [...prev, filename]);
    }

    setMessages(prev => [
      ...prev,
      {
        role: "assistant",
        text:
          "Document uploaded successfully! You can now ask questions based on its content."
      }
    ]);
  };

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h1>Prompt2Support</h1>
        <span className="demo-badge">Demo</span>
      </div>

      <div className="demo-grid">
        {/* LEFT */}
        <div className="demo-card">
          <h3>Knowledge Base</h3>

          <DocumentUpload
            onUploaded={handleUploaded}
            uploadUrl={`${BACKEND_URL}/api/documents/upload`}
          />

          <p className="supported-text">Supported formats: TXT, DOCX, PDF</p>

          {uploadedFiles.map((f, i) => (
            <div key={i}>📄 {f}</div>
          ))}

          <ul className="sample-queries">
            <li onClick={() => setInput("What is the return policy?")}>
              What is the return policy?
            </li>
            <li onClick={() => setInput("How can I track my order?")}>
              How can I track my order?
            </li>
            <li onClick={() => setInput("What warranty does this product have?")}>
              What warranty does this product have?
            </li>
            <li onClick={() => setInput("Is EMI available for this purchase?")}>
              Is EMI available for this purchase?
            </li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className="demo-card chat-panel">
          <h3>AI Assistant</h3>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble assistant">Thinking…</div>
            )}
          </div>

          <div className="chat-input">
            <input
              value={input}
              placeholder="Ask a question about your documents"
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
