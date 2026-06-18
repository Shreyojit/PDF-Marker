const fs = require("fs");
const path = require("path");

function ensureFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

function getPublicFileUrl(req, folderName, fileName) {
  return `/${folderName}/${fileName}`;
}

module.exports = {
  ensureFolder,
  getPublicFileUrl,
};