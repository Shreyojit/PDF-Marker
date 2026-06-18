const pool = require("../config/db");

async function createPdfDocument(file) {
  const result = await pool.query(
    `INSERT INTO pdf_documents 
    (file_name, stored_file_name, file_path)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [file.originalname, file.filename, file.path]
  );

  return result.rows[0];
}

async function getAllPdfDocuments() {
  const result = await pool.query(
    `SELECT * FROM pdf_documents ORDER BY created_at DESC`
  );

  return result.rows;
}

async function getPdfDocumentById(id) {
  const result = await pool.query(
    `SELECT * FROM pdf_documents WHERE id = $1`,
    [id]
  );

  return result.rows[0];
}

async function deletePdfDocument(id) {
  const result = await pool.query(
    `DELETE FROM pdf_documents WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

module.exports = {
  createPdfDocument,
  getAllPdfDocuments,
  getPdfDocumentById,
  deletePdfDocument,
};