const pool = require("../config/db");

async function createFields(documentId, fields) {
  const savedFields = [];

  for (const field of fields) {
    const result = await pool.query(
      `INSERT INTO pdf_fields
      (
        document_id,
        field_name,
        field_type,
        page_number,
        x_percent,
        y_percent,
        width_percent,
        height_percent,
        required
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        documentId,
        field.field_name,
        field.field_type,
        field.page_number,
        field.x_percent,
        field.y_percent,
        field.width_percent,
        field.height_percent,
        field.required || false,
      ]
    );

    savedFields.push(result.rows[0]);
  }

  return savedFields;
}

async function getFieldsByDocumentId(documentId) {
  const result = await pool.query(
    `SELECT * FROM pdf_fields 
     WHERE document_id = $1 
     ORDER BY page_number ASC, id ASC`,
    [documentId]
  );

  return result.rows;
}

async function updateField(fieldId, data) {
  const result = await pool.query(
    `UPDATE pdf_fields
     SET 
      field_name = COALESCE($1, field_name),
      field_type = COALESCE($2, field_type),
      page_number = COALESCE($3, page_number),
      x_percent = COALESCE($4, x_percent),
      y_percent = COALESCE($5, y_percent),
      width_percent = COALESCE($6, width_percent),
      height_percent = COALESCE($7, height_percent),
      required = COALESCE($8, required)
     WHERE id = $9
     RETURNING *`,
    [
      data.field_name,
      data.field_type,
      data.page_number,
      data.x_percent,
      data.y_percent,
      data.width_percent,
      data.height_percent,
      data.required,
      fieldId,
    ]
  );

  return result.rows[0];
}

async function deleteField(fieldId) {
  await pool.query(`DELETE FROM pdf_fields WHERE id = $1`, [fieldId]);

  return true;
}

module.exports = {
  createFields,
  getFieldsByDocumentId,
  updateField,
  deleteField,
};