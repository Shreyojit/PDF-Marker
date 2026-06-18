const express = require("express");

const {
  saveResponses,
  getResponses,
} = require("../controllers/responseController");

const router = express.Router();

router.post("/document/:documentId", saveResponses);

router.get("/document/:documentId", getResponses);

module.exports = router;