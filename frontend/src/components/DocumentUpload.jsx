import { useState } from "react";

export default function DocumentUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first");
      return;
    }

    const formData = new FormData();

    // ⚠️ THIS KEY MUST BE "file"
    formData.append("file", file);

    try {
      await onUpload(formData);
      setStatus("Document uploaded successfully");
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus("Upload failed");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileChange}
      />

      <button
        onClick={handleUpload}
        style={{
          marginTop: "10px",
          padding: "8px 14px",
          background: "#ff8a1f",
          border: "none",
          borderRadius: "8px",
          color: "#111",
          cursor: "pointer",
          fontWeight: "600"
        }}
      >
        Upload
      </button>

      {status && (
        <div style={{ marginTop: "8px", fontSize: "13px" }}>
          {status}
        </div>
      )}
    </div>
  );
}
