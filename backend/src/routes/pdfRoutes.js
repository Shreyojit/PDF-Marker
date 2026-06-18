const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadPdf,
  getAllPdfs,
  getPdfById,
  deletePdf,
} = require("../controllers/pdfController");

const { downloadFilledPdf } = require("../controllers/downloadController");

const {
  exportTemplate,
  importTemplate,
} = require("../controllers/templateController");

const router = express.Router();

router.post("/upload", upload.single("pdf"), uploadPdf);

router.post(
  "/import-template",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "fields_json", maxCount: 1 },
  ]),
  importTemplate
);

router.get("/", getAllPdfs);

router.get("/:id", getPdfById);
router.delete("/:id", deletePdf);

router.get("/:documentId/export-template", exportTemplate);

router.post("/:documentId/generate", downloadFilledPdf);

module.exports = router;