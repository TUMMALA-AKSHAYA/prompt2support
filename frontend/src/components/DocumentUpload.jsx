import { useState } from "react";

export default function DocumentUpload({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    onUpload(formData);
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".txt,.docx,.pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        type="submit"
        style={{
          marginTop: "10px",
          background: "#ff8a1f",
          border: "none",
          padding: "6px 14px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600"
        }}
      >
        Upload
      </button>
    </form>
  );
}
