import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPdfById,
  getFields,
  getResponses,
  saveResponses,
} from "../api/pdfApi";
import PdfCanvas from "../components/PdfCanvas";
import FillOverlay from "../components/FillOverlay";
import DownloadButton from "../components/DownloadButton";

function FormFillPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [pdf, setPdf] = useState(null);
  const [fields, setFields] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      setLoading(true);

      const pdfData = await getPdfById(documentId);
      const fieldData = await getFields(documentId);
      const responseData = await getResponses(documentId);

      const responseMap = {};

      responseData.forEach((item) => {
        responseMap[item.field_id] = item.value;
      });

      setPdf(pdfData);
      setFields(fieldData);
      setResponses(responseMap);
    } catch (error) {
      alert("Failed to load form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [documentId]);

  function handleChange(fieldId, value) {
    setResponses((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  }

  async function handleSaveResponses() {
    try {
      const payload = Object.keys(responses).map((fieldId) => ({
        field_id: Number(fieldId),
        value: responses[fieldId],
      }));

      await saveResponses(documentId, payload);
      alert("Responses saved successfully");
    } catch (error) {
      alert("Failed to save responses");
      console.error(error);
    }
  }

  if (loading) {
    return <main className="page">Loading...</main>;
  }

  if (!pdf) {
    return <main className="page">PDF not found</main>;
  }

  return (
    <main className="page">
      <div className="top-line">
        <div>
          <h3>Fill PDF Form</h3>
          <p>{pdf.file_name}</p>
        </div>

        <div className="actions">
          <button onClick={() => navigate("/")}>Back</button>
          <button onClick={handleSaveResponses}>Save Responses</button>
          <DownloadButton
            documentId={documentId}
            beforeDownload={handleSaveResponses}
          />
        </div>
      </div>

      <PdfCanvas
        fileUrl={pdf.file_url}
        mode="fill"
        renderOverlay={(pageNumber, pageSize) => (
          <FillOverlay
            fields={fields.filter((field) => field.page_number === pageNumber)}
            responses={responses}
            pageSize={pageSize}
            onChange={handleChange}
          />
        )}
      />
    </main>
  );
}

export default FormFillPage;