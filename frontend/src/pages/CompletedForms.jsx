import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompletedForms, generateFilledPdf } from "../api/pdfApi";

function CompletedForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getCompletedForms();
        setForms(data);
      } catch (e) {
        alert("Failed to load completed forms");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function withBusy(key, fn) {
    setBusy((p) => ({ ...p, [key]: true }));
    try {
      await fn();
    } catch (e) {
      alert("Failed to generate filled PDF");
      console.error(e);
    } finally {
      setBusy((p) => ({ ...p, [key]: false }));
    }
  }

  async function handleView(form) {
    await withBusy(`view_${form.id}`, async () => {
      const result = await generateFilledPdf(form.id);
      window.open(result.download_url, "_blank");
    });
  }

  async function handleDownload(form) {
    await withBusy(`dl_${form.id}`, async () => {
      const result = await generateFilledPdf(form.id);
      const a = document.createElement("a");
      a.href = result.download_url;
      a.download = `filled-${form.file_name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  if (loading) return <main className="page">Loading...</main>;

  return (
    <main className="page">
      <div className="top-line">
        <div>
          <h3>Completed Forms</h3>
          <p>PDFs that have been filled in</p>
        </div>
        <Link to="/" style={{ fontSize: 14 }}>← Back to Dashboard</Link>
      </div>

      {forms.length === 0 ? (
        <div className="card">
          <p style={{ color: "#6b7280" }}>
            No forms have been filled yet. Go to{" "}
            <Link to="/">Dashboard</Link> and click <strong>Fill Form</strong> on a PDF.
          </p>
        </div>
      ) : (
        <div className="document-list">
          {forms.map((form) => (
            <div className="document-row" key={form.id}>
              <div>
                <strong>{form.template_name || form.file_name}</strong>
                {form.template_name && (
                  <p style={{ fontSize: 12, color: "#6b7280" }}>{form.file_name}</p>
                )}
                <p>
                  Last filled:{" "}
                  {new Date(form.last_filled_at).toLocaleString()} &nbsp;·&nbsp;
                  {form.response_count} field
                  {form.response_count !== 1 ? "s" : ""} filled
                </p>
              </div>

              <div className="actions">
                <Link to={`/fill/${form.id}`}>Edit Responses</Link>

                <button
                  onClick={() => handleView(form)}
                  disabled={busy[`view_${form.id}`]}
                  style={{ background: "#059669" }}
                >
                  {busy[`view_${form.id}`] ? "Generating…" : "View Filled PDF"}
                </button>

                <button
                  onClick={() => handleDownload(form)}
                  disabled={busy[`dl_${form.id}`]}
                  style={{ background: "#2563eb" }}
                >
                  {busy[`dl_${form.id}`] ? "Generating…" : "Download"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default CompletedForms;
