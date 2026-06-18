import { useState } from "react";
import { uploadPdf } from "../api/pdfApi";

function PdfUploader({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    try {
      setUploading(true);
      await uploadPdf(file);
      setFile(null);
      alert("PDF uploaded successfully");

      if (onUploaded) {
        onUploaded();
      }
    } catch (error) {
      alert("Upload failed");
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="uploader">
      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => setFile(event.target.files[0])}
      />

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default PdfUploader;