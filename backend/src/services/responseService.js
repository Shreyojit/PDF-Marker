const pool = require("../config/db");

async function saveResponses(documentId, responses) {
  for (const response of responses) {
    await pool.query(
      `INSERT INTO pdf_responses
      (document_id, field_id, value)
      VALUES ($1,$2,$3)
      ON CONFLICT (document_id, field_id)
      DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [documentId, response.field_id, response.value]
    );
  }

  return true;
}

async function getResponsesByDocumentId(documentId) {
  const result = await pool.query(
    `SELECT 
      r.*,
      f.field_name,
      f.field_type,
      f.page_number
     FROM pdf_responses r
     JOIN pdf_fields f ON r.field_id = f.id
     WHERE r.document_id = $1
     ORDER BY f.page_number ASC, f.id ASC`,
    [documentId]
  );

  return result.rows;
}

async function clearResponsesByDocumentId(documentId) {
  await pool.query(
    `DELETE FROM pdf_responses WHERE document_id = $1`,
    [documentId]
  );
}

async function getCompletedDocuments() {
  const result = await pool.query(
    `SELECT
       d.id, d.file_name, d.template_name, d.stored_file_name, d.created_at,
       COUNT(r.id)::int AS response_count,
       MAX(r.updated_at) AS last_filled_at
     FROM pdf_documents d
     INNER JOIN pdf_responses r ON d.id = r.document_id
     GROUP BY d.id, d.file_name, d.template_name, d.stored_file_name, d.created_at
     HAVING COUNT(r.id) > 0
     ORDER BY MAX(r.updated_at) DESC`
  );
  return result.rows;
}

module.exports = {
  saveResponses,
  getResponsesByDocumentId,
  clearResponsesByDocumentId,
  getCompletedDocuments,
};