export default function DocumentUpload({ onUploaded }) {
  const upload = async (file) => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("http://localhost:8000/api/documents/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (data.success && typeof onUploaded === "function") {
      onUploaded(data.filename);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".txt,.docx,.pdf"
        onChange={(e) => upload(e.target.files[0])}
      />
    </div>
  );
}
