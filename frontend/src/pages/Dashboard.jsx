import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PdfUploader from "../components/PdfUploader";
import TemplateImporter from "../components/TemplateImporter";
import { getAllPdfs, exportTemplate, deletePdf } from "../api/pdfApi";

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadDocuments() {
    try {
      setLoading(true);
      const data = await getAllPdfs();
      setDocuments(data);
    } catch (error) {
      alert("Failed to load PDFs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function handleExportTemplate(documentId) {
    try {
      await exportTemplate(documentId);
    } catch (error) {
      alert("Failed to export template");
      console.error(error);
    }
  }

  async function handleDelete(doc) {
    const ok = confirm(
      `Delete "${doc.file_name}" and all its marked fields? This cannot be undone.`
    );
    if (!ok) return;
    try {
      await deletePdf(doc.id);
      loadDocuments();
    } catch (error) {
      alert("Failed to delete PDF");
      console.error(error);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h3>Upload New PDF</h3>
        <PdfUploader onUploaded={loadDocuments} />
      </section>

      <section className="card">
        <h3>Import Existing Marked Template</h3>
        <TemplateImporter onImported={loadDocuments} />
      </section>

      <section className="card">
        <h3>Uploaded PDFs</h3>

        {loading && <p>Loading...</p>}

        {!loading && documents.length === 0 && <p>No PDFs uploaded yet.</p>}

        <div className="document-list">
          {documents.map((doc) => (
            <div className="document-row" key={doc.id}>
              <div>
                <strong>{doc.template_name || doc.file_name}</strong>
                <p>{doc.file_name}</p>
                <p>Uploaded: {new Date(doc.created_at).toLocaleString()}</p>
              </div>

              <div className="actions">
                <a href={doc.file_url} target="_blank" rel="noreferrer">
                  View Original
                </a>

                <Link to={`/builder/${doc.id}`}>Mark Fields</Link>

                <Link to={`/fill/${doc.id}`}>Fill Form</Link>

                <button onClick={() => handleExportTemplate(doc.id)}>
                  Export Template
                </button>

                <button
                  onClick={() => handleDelete(doc)}
                  style={{ background: "#dc2626" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;