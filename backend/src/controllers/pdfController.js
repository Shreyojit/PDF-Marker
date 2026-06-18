const fs = require("fs");
const path = require("path");
const pdfService = require("../services/pdfService");
const { getPublicFileUrl } = require("../utils/fileUtils");

async function uploadPdf(req, res, next) {
  try {
    if (!req.file) {
      throw new Error("PDF file is required");
    }

    const document = await pdfService.createPdfDocument(req.file);

    res.status(201).json({
      success: true,
      data: {
        ...document,
        file_url: getPublicFileUrl(req, "uploads", document.stored_file_name),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getAllPdfs(req, res, next) {
  try {
    const documents = await pdfService.getAllPdfDocuments();

    const data = documents.map((doc) => ({
      ...doc,
      file_url: getPublicFileUrl(req, "uploads", doc.stored_file_name),
    }));

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function getPdfById(req, res, next) {
  try {
    const document = await pdfService.getPdfDocumentById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    res.json({
      success: true,
      data: {
        ...document,
        file_url: getPublicFileUrl(req, "uploads", document.stored_file_name),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function deletePdf(req, res, next) {
  try {
    const document = await pdfService.deletePdfDocument(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: "PDF not found" });
    }

    const filePath = path.join(__dirname, "../../uploads", document.stored_file_name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: "PDF deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadPdf,
  getAllPdfs,
  getPdfById,
  deletePdf,
};