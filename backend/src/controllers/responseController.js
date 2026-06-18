const responseService = require("../services/responseService");

async function saveResponses(req, res, next) {
  try {
    const documentId = req.params.documentId;
    const { responses } = req.body;

    if (!Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        message: "responses must be an array",
      });
    }

    await responseService.saveResponses(documentId, responses);

    res.json({
      success: true,
      message: "Responses saved successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function getResponses(req, res, next) {
  try {
    const documentId = req.params.documentId;

    const responses = await responseService.getResponsesByDocumentId(documentId);

    res.json({
      success: true,
      data: responses,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  saveResponses,
  getResponses,
};