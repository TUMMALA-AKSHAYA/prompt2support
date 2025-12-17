import "../styles/demo.css";
import DocumentUpload from "../components/DocumentUpload";
import { useState } from "react";

export default function Demo() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "I’m here to help you understand your documents and resolve customer queries clearly and quickly."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Uploaded files (dummy + real)
  const [uploadedFiles, setUploadedFiles] = useState([
    "policy.pdf",
    "warranty.docx"
  ]);

  /* =========================
     SEND MESSAGE
     ========================= */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");

    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/queries/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage })
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "assistant", text: data.answer || "No response received from AI." }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "There was an issue processing your request. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     HANDLE FILE UPLOAD
     ========================= */
  const handleUpload = async (formData) => {
    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      // ✅ Extract filenames from uploaded files
      const files = Array.from(formData.getAll("files")).map(
        file => file.name
      );

      setUploadedFiles(prev => [...prev, ...files]);

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "Your document has been uploaded successfully. You can now ask questions related to it."
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "The document upload failed. Please try again."
        }
      ]);
    }
  };

  /* =========================
     UI
     ========================= */
  return (
    <div className="demo-container">
      {/* HEADER */}
      <div className="demo-header">
        <h1>Prompt2Support</h1>
        <span className="demo-badge">Demo</span>
      </div>

      <div className="demo-grid">
        {/* LEFT PANEL */}
        <div className="demo-card">
          <h3 className="section-title">Knowledge Base</h3>

          <div className="upload-box">
            <DocumentUpload onUpload={handleUpload} />
            <div className="supported-text">
              Supported formats: PDF, DOCX, TXT
            </div>
          </div>

          {/* ✅ Uploaded Files */}
          <div className="uploaded-files">
            <div className="files-title">Uploaded files</div>
            <ul>
              {uploadedFiles.map((file, idx) => (
                <li key={idx}>{file}</li>
              ))}
            </ul>
          </div>

          {/* Sample Queries */}
          <div className="sample-queries">
            <div className="sample-title">Try sample questions</div>
            <ul>
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
        </div>

        {/* RIGHT PANEL */}
        <div className="demo-card chat-panel">
          <h3>AI Assistant</h3>
          <p className="ai-subtitle">Customer Support Agent</p>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble assistant">
                <span className="typing">Prompt2Support is typing…</span>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              placeholder="Ask a question about your documents"
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
