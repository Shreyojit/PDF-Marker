const fieldService = require("../services/fieldService");

async function createFields(req, res, next) {
  try {
    const documentId = req.params.documentId;
    const { fields } = req.body;

    if (!Array.isArray(fields)) {
      return res.status(400).json({
        success: false,
        message: "fields must be an array",
      });
    }

    const savedFields = await fieldService.createFields(documentId, fields);

    res.status(201).json({
      success: true,
      data: savedFields,
    });
  } catch (error) {
    next(error);
  }
}

async function getFields(req, res, next) {
  try {
    const documentId = req.params.documentId;

    const fields = await fieldService.getFieldsByDocumentId(documentId);

    res.json({
      success: true,
      data: fields,
    });
  } catch (error) {
    next(error);
  }
}

async function updateField(req, res, next) {
  try {
    const field = await fieldService.updateField(req.params.fieldId, req.body);

    res.json({
      success: true,
      data: field,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteField(req, res, next) {
  try {
    await fieldService.deleteField(req.params.fieldId);

    res.json({
      success: true,
      message: "Field deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createFields,
  getFields,
  updateField,
  deleteField,
};