const express = require("express");

const {
  createFields,
  getFields,
  updateField,
  deleteField,
} = require("../controllers/fieldController");

const router = express.Router();

router.post("/document/:documentId", createFields);

router.get("/document/:documentId", getFields);

router.put("/:fieldId", updateField);

router.delete("/:fieldId", deleteField);

module.exports = router;