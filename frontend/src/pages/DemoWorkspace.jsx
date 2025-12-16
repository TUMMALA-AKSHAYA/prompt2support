export default function DemoWorkspace() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #07090d 0%, #050608 100%)",
        color: "#fff",
        fontFamily: "Inter, system-ui, -apple-system",
        display: "grid",
        gridTemplateColumns: "280px 1fr",
      }}
    >
      {/* LEFT SIDEBAR */}
      <aside
        style={{
          borderRight: "1px solid rgba(255,255,255,0.08)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>
          My Agents
        </h2>

        <button
          style={{
            background:
              "linear-gradient(135deg, #ff8a1f, #ff5f1f)",
            color: "#000",
            border: "none",
            padding: "12px",
            borderRadius: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + New Agent
        </button>

        <div>
          <p style={{ opacity: 0.6, fontSize: 13, marginBottom: 8 }}>
            Projects
          </p>

          {[
            "Customer Support AI",
            "Sales Follow-ups",
            "HR Assistant",
          ].map((item) => (
            <div
              key={item}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                cursor: "pointer",
                marginBottom: 6,
                background:
                  "rgba(255,255,255,0.04)",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>
            Follow-up Agent
          </h1>

          <button
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "10px 16px",
              borderRadius: 12,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Configuration
          </button>
        </div>

        {/* AGENT DESCRIPTION */}
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: 24,
            maxWidth: 720,
          }}
        >
          <p style={{ opacity: 0.8 }}>
            This agent answers customer questions using uploaded
            documents, policies, and manuals with verified reasoning.
          </p>
        </div>

        {/* SUGGESTED ACTIONS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {[
            "Summarize customer tickets",
            "Answer refund policy questions",
            "Draft response emails",
          ].map((action) => (
            <div
              key={action}
              style={{
                padding: 18,
                borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
              }}
            >
              {action}
            </div>
          ))}
        </div>

        {/* CHAT INPUT */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: 12,
          }}
        >
          <input
            placeholder="What should the agent help with today?"
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              padding: "14px 16px",
              color: "#fff",
              outline: "none",
            }}
          />
          <button
            style={{
              background:
                "linear-gradient(135deg, #ff8a1f, #ff5f1f)",
              color: "#000",
              border: "none",
              padding: "14px 22px",
              borderRadius: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
