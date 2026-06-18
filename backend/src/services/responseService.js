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

module.exports = {
  saveResponses,
  getResponsesByDocumentId,
};