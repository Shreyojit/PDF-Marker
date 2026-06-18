import { useState } from "react";
import { importTemplate } from "../api/pdfApi";

function TemplateImporter({ onImported }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [fieldsJsonFile, setFieldsJsonFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleImport() {
    if (!pdfFile) {
      alert("Please select PDF file");
      return;
    }

    if (!fieldsJsonFile) {
      alert("Please select fields.json file");
      return;
    }

    try {
      setLoading(true);

      await importTemplate(pdfFile, fieldsJsonFile);

      alert("Template imported successfully");

      setPdfFile(null);
      setFieldsJsonFile(null);

      if (onImported) {
        onImported();
      }
    } catch (error) {
      alert("Template import failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="import-box">
      <div>
        <label>PDF File</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => setPdfFile(event.target.files[0])}
        />
      </div>

      <div>
        <label>Fields JSON</label>
        <input
          type="file"
          accept="application/json"
          onChange={(event) => setFieldsJsonFile(event.target.files[0])}
        />
      </div>

      <button onClick={handleImport} disabled={loading}>
        {loading ? "Importing..." : "Import Template"}
      </button>
    </div>
  );
}

export default TemplateImporter;