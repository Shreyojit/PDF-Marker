import axios from "axios";

const API_BASE_URL = "/api";

export async function uploadPdf(file) {
  const formData = new FormData();
  formData.append("pdf", file);

  const response = await axios.post(`${API_BASE_URL}/pdf/upload`, formData);
  return response.data.data;
}

export async function getAllPdfs() {
  const response = await axios.get(`${API_BASE_URL}/pdf`);
  return response.data.data;
}

export async function getPdfById(documentId) {
  const response = await axios.get(`${API_BASE_URL}/pdf/${documentId}`);
  return response.data.data;
}

export async function saveFields(documentId, fields) {
  const response = await axios.post(
    `${API_BASE_URL}/fields/document/${documentId}`,
    { fields }
  );

  return response.data.data;
}

export async function getFields(documentId) {
  const response = await axios.get(
    `${API_BASE_URL}/fields/document/${documentId}`
  );

  return response.data.data;
}

export async function deleteField(fieldId) {
  const response = await axios.delete(`${API_BASE_URL}/fields/${fieldId}`);
  return response.data;
}

export async function clearResponses(documentId) {
  const response = await axios.delete(
    `${API_BASE_URL}/responses/document/${documentId}`
  );
  return response.data;
}

export async function saveResponses(documentId, responses) {
  const response = await axios.post(
    `${API_BASE_URL}/responses/document/${documentId}`,
    { responses }
  );

  return response.data;
}

export async function getResponses(documentId) {
  const response = await axios.get(
    `${API_BASE_URL}/responses/document/${documentId}`
  );

  return response.data.data;
}

export async function generateFilledPdf(documentId) {
  const response = await axios.post(`${API_BASE_URL}/pdf/${documentId}/generate`);
  return response.data;
}

export async function exportTemplate(documentId) {
  const response = await axios.get(
    `${API_BASE_URL}/pdf/${documentId}/export-template`,
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", `template-${documentId}-fields.json`);

  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function deletePdf(documentId) {
  const response = await axios.delete(`${API_BASE_URL}/pdf/${documentId}`);
  return response.data;
}

export async function importTemplate(pdfFile, fieldsJsonFile) {
  const formData = new FormData();

  formData.append("pdf", pdfFile);
  formData.append("fields_json", fieldsJsonFile);

  const response = await axios.post(
    `${API_BASE_URL}/pdf/import-template`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
}