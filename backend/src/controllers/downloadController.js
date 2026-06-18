const { generateFilledPdf } = require("../services/pdfGenerationService");
const { getPublicFileUrl } = require("../utils/fileUtils");

async function downloadFilledPdf(req, res, next) {
  try {
    const documentId = req.params.documentId;

    const result = await generateFilledPdf(documentId);

    res.json({
      success: true,
      file_name: result.outputFileName,
      download_url: getPublicFileUrl(req, "generated", result.outputFileName),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  downloadFilledPdf,
};