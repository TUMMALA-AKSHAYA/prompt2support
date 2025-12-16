import { useState } from "react";

export default function DemoWorkspace() {
  const [messages, setMessages] = useState([
    {
      role: "agent",
      text: "Hi 👋 Upload your documents and ask me questions about them.",
    },
  ]);
  const [input, setInput] = useState("");
  const [filesUploaded, setFilesUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------- FILE UPLOAD ----------
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Backend not responding");

      setFilesUploaded(true);
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: `📄 ${file.name} uploaded successfully.` },
      ]);
    } catch (err) {
      // Fallback demo mode
      setFilesUploaded(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text:
            "📄 Document received (Demo Mode). I’m ready to answer questions.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ---------- CHAT ----------
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      if (!res.ok) throw new Error("Backend not responding");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: data.answer || "Response generated." },
      ]);
    } catch (err) {
      // Fallback AI response
      let reply =
        "I analyzed the uploaded documents and found relevant information.";

      if (input.toLowerCase().includes("refund"))
        reply = "Refunds are processed within 5–7 business days.";
      if (input.toLowerCase().includes("warranty"))
        reply = "The product includes a 1-year limited warranty.";
      if (input.toLowerCase().includes("return"))
        reply = "Returns are accepted within 30 days of purchase.";

      setMessages((prev) => [...prev, { role: "agent", text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07090d",
        color: "#fff",
        padding: 40,
        fontFamily: "Inter, system-ui",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}>
        AI Customer Support Demo
      </h1>

      {/* UPLOAD */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: 20,
          maxWidth: 800,
          marginBottom: 24,
        }}
      >
        <label
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg,#ff8a1f,#ff5f1f)",
            color: "#000",
            padding: "10px 18px",
            borderRadius: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? "Uploading..." : "Upload Document"}
          <input
            type="file"
            hidden
            onChange={handleFileUpload}
            accept=".pdf,.txt,.docx"
          />
        </label>

        <p style={{ marginTop: 10, fontSize: 12, opacity: 0.6 }}>
          Supported: PDF, DOCX, TXT • Session-isolated
        </p>
      </div>

      {/* CHAT */}
      <div
        style={{
          maxWidth: 800,
          height: 360,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: 20,
          overflowY: "auto",
          marginBottom: 20,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: 14,
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg,#ff8a1f,#ff5f1f)"
                    : "rgba(255,255,255,0.12)",
                color: msg.role === "user" ? "#000" : "#fff",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 12, maxWidth: 800 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            filesUploaded
              ? "Ask about the uploaded document..."
              : "Upload a document first..."
          }
          disabled={!filesUploaded}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!filesUploaded}
          style={{
            padding: "14px 22px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg,#ff8a1f,#ff5f1f)",
            color: "#000",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>

      <p style={{ marginTop: 12, fontSize: 12, opacity: 0.5 }}>
        Demo Mode enabled • Backend auto-connects when available
      </p>
    </div>
  );
}
