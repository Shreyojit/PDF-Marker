const express = require("express");
const cors = require("cors");
const path = require("path");

const pdfRoutes = require("./routes/pdfRoutes");
const fieldRoutes = require("./routes/fieldRoutes");
const responseRoutes = require("./routes/responseRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/generated", express.static(path.join(__dirname, "../generated")));

app.use("/api/pdf", pdfRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/responses", responseRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "PDF Marker Backend API is running",
  });
});

app.use(errorMiddleware);

module.exports = app;