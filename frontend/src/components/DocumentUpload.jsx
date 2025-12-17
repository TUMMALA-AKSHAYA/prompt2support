import { Upload } from "lucide-react";
import { useState } from "react";

export default function DocumentUpload() {
  const [status, setStatus] = useState("");

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // MUST be "file"

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setStatus("✅ Document uploaded successfully");
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed");
    }
  };

  return (
    <div className="upload-box">
      <Upload size={26} />
      <p>Upload a document</p>

      <input
        type="file"
        hidden
        id="doc-input"
        onChange={(e) => uploadFile(e.target.files[0])}
      />

      <label htmlFor="doc-input" className="select-btn">
        Select File
      </label>

      {status && <p style={{ marginTop: 8 }}>{status}</p>}
    </div>
  );
}
