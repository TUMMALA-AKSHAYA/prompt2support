import "../styles/demo.css";
import DocumentUpload from "../components/DocumentUpload";
import { useState } from "react";

export default function Demo() {
  /* =========================
     STATE
     ========================= */
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "I’m here to help you understand your documents and resolve customer queries clearly and quickly."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ REAL uploaded files (no dummy data)
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // ✅ Upload status
  const [uploadStatus, setUploadStatus] = useState(null); // success | error | null

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
      setUploadStatus(null);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      const file = formData.get("file");
      if (file) {
        setUploadedFiles(prev => [...prev, file.name]);
      }

      setUploadStatus("success");

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "Document uploaded successfully. I will now use it to answer your questions."
        }
      ]);
    } catch (err) {
      console.error(err);
      setUploadStatus("error");

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "Document upload failed. Please upload a TXT or DOCX file."
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
              Supported formats: TXT, DOCX (PDF preprocessing supported)
            </div>

            {/* Upload Status */}
            {uploadStatus === "success" && (
              <div style={{ color: "#22c55e", fontSize: "13px", marginTop: "8px" }}>
                Document uploaded successfully
              </div>
            )}

            {uploadStatus === "error" && (
              <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px" }}>
                Upload failed
              </div>
            )}
          </div>

          {/* Uploaded Files */}
          <div className="uploaded-files">
            <div className="files-title">Uploaded files</div>
            {uploadedFiles.length === 0 ? (
              <div className="supported-text">No documents uploaded yet</div>
            ) : (
              <ul>
                {uploadedFiles.map((file, idx) => (
                  <li key={idx}>{file}</li>
                ))}
              </ul>
            )}
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
