const express = require("express");

const {
  saveResponses,
  getResponses,
  clearResponses,
} = require("../controllers/responseController");

const router = express.Router();

router.post("/document/:documentId", saveResponses);
router.get("/document/:documentId", getResponses);
router.delete("/document/:documentId", clearResponses);

module.exports = router;