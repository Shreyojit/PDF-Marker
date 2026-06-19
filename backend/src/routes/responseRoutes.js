const express = require("express");

const {
  saveResponses,
  getResponses,
  clearResponses,
  getCompletedForms,
} = require("../controllers/responseController");

const router = express.Router();

router.get("/completed", getCompletedForms);
router.post("/document/:documentId", saveResponses);
router.get("/document/:documentId", getResponses);
router.delete("/document/:documentId", clearResponses);

module.exports = router;