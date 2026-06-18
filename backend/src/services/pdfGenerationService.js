const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const pool = require("../config/db");
const { convertPercentToPdfCoordinates } = require("../utils/coordinateMapper");
const { ensureFolder } = require("../utils/fileUtils");

async function generateFilledPdf(documentId) {
  const docResult = await pool.query(
    `SELECT * FROM pdf_documents WHERE id = $1`,
    [documentId]
  );

  const document = docResult.rows[0];

  if (!document) {
    throw new Error("PDF document not found");
  }

  const fieldResult = await pool.query(
    `SELECT 
      f.*,
      r.value
     FROM pdf_fields f
     LEFT JOIN pdf_responses r 
     ON f.id = r.field_id AND f.document_id = r.document_id
     WHERE f.document_id = $1
     ORDER BY f.page_number ASC, f.id ASC`,
    [documentId]
  );

  const fields = fieldResult.rows;

  const existingPdfBytes = fs.readFileSync(document.file_path);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  for (const field of fields) {
    if (!field.value) continue;

    const pageIndex = Number(field.page_number) - 1;
    const page = pages[pageIndex];

    if (!page) continue;

    const coords = convertPercentToPdfCoordinates(field, page);

    if (field.field_type === "text") {
      page.drawText(String(field.value), {
        x: coords.x,
        y: coords.y + 4,
        size: 10,
        font,
        color: rgb(0, 0, 0),
        maxWidth: coords.width,
      });
    }

    if (field.field_type === "checkbox") {
      const checked =
        field.value === true ||
        field.value === "true" ||
        field.value === "yes" ||
        field.value === "1";

      if (checked) {
        page.drawText("X", {
          x: coords.x + 2,
          y: coords.y,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
      }
    }

    if (field.field_type === "signature") {
      page.drawText(String(field.value), {
        x: coords.x,
        y: coords.y + 4,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
    }
  }

  const generatedDir = path.join(__dirname, "../../generated");
  ensureFolder(generatedDir);

  const outputFileName = `filled-${Date.now()}-${document.stored_file_name}`;
  const outputPath = path.join(generatedDir, outputFileName);

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  return {
    outputFileName,
    outputPath,
  };
}

module.exports = {
  generateFilledPdf,
};