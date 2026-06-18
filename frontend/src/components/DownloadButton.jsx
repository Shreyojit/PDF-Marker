import { useState } from "react";
import { generateFilledPdf } from "../api/pdfApi";

function DownloadButton({ documentId, beforeDownload }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    try {
      setLoading(true);

      if (beforeDownload) {
        await beforeDownload();
      }

      const result = await generateFilledPdf(documentId);

      if (result.download_url) {
        window.open(result.download_url, "_blank");
      }
    } catch (error) {
      alert("Failed to generate PDF");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleDownload} disabled={loading}>
      {loading ? "Generating..." : "Download Filled PDF"}
    </button>
  );
}

export default DownloadButton;