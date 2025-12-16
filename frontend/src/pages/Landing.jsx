export default function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(70% 50% at 50% 100%, rgba(255,140,0,0.45), transparent 70%), linear-gradient(180deg, #050608 0%, #07090d 100%)",
        color: "#ffffff",
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont",
      }}
    >
      {/* NAVBAR */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "32px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Prompt2Support</h1>
        <button
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "white",
            padding: "8px 16px",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>

      {/* HERO */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "120px 24px 160px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 64,
        }}
      >
        {/* LEFT */}
        <div>
          <h2
            style={{
              fontSize: 56,
              lineHeight: 1.05,
              fontWeight: 800,
              marginBottom: 24,
              letterSpacing: "-0.03em",
            }}
          >
            Autonomous AI Agents
            <br />
            for Customer Support
          </h2>

          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.75)",
              maxWidth: 520,
              marginBottom: 40,
            }}
          >
            Enterprise-grade multi-agent reasoning over your documents.
            Deterministic workflows. Privacy-first by design.
          </p>

          <div style={{ display: "flex", gap: 16 }}>
            <button
              style={{
                background:
                  "linear-gradient(135deg, #ff8a1f, #ff5f1f)",
                color: "#000",
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: 14,
                border: "none",
                cursor: "pointer",
                boxShadow:
                  "0 20px 60px rgba(255,138,31,0.35)",
              }}
              onClick={() => (window.location.href = "/demo")}

            >
              Launch Demo
            </button>

            <button
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "white",
                padding: "14px 26px",
                borderRadius: 14,
                cursor: "pointer",
              }}
            >
              View Architecture
            </button>
          </div>
        </div>

        {/* RIGHT — AI AGENT CARD */}
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 24,
            padding: 28,
            boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.6)",
                marginBottom: 12,
              }}
            >
              AI Agent
            </p>

            <div
              style={{
                background: "rgba(0,0,0,0.35)",
                borderRadius: 14,
                padding: 16,
                fontSize: 15,
                lineHeight: 1.5,
              }}
            >
              Hi 👋  
              <br />
              Upload your documents and ask me anything.
              I reason across files and verify answers.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 20,
            }}
          >
            <input
              placeholder="Ask the AI agent…"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "12px 14px",
                color: "white",
                outline: "none",
              }}
            />
            <button
              style={{
                background:
                  "linear-gradient(135deg, #ff8a1f, #ff5f1f)",
                color: "#000",
                fontWeight: 700,
                padding: "12px 18px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
