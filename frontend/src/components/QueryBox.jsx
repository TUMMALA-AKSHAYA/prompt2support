import { useState } from "react";

export default function QueryBox() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://localhost:8000/api/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ NORMALIZE ANSWER SAFELY
        if (typeof data.answer === "string") {
          setAnswer(data.answer);
        } else if (typeof data.answer === "object") {
          setAnswer(data.answer.answer || "No relevant information found.");
        } else {
          setAnswer("No relevant information found.");
        }
      } else {
        setAnswer("❌ No relevant information found.");
      }
    } catch (err) {
      console.error(err);
      setAnswer("❌ Failed to process query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "16px" }}>
      <input
        type="text"
        value={query}
        placeholder="Ask a question about your documents"
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={ask}
        style={{
          marginTop: "10px",
          background: "#ff8a1f",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "#f7f7f7",
            borderRadius: "8px",
            whiteSpace: "pre-wrap",
          }}
        >
          {answer}
        </div>
      )}
    </div>
  );
}
