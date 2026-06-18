function convertPercentToPdfCoordinates(field, page) {
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  const x = (Number(field.x_percent) / 100) * pageWidth;
  const yFromTop = (Number(field.y_percent) / 100) * pageHeight;

  const width = (Number(field.width_percent) / 100) * pageWidth;
  const height = (Number(field.height_percent) / 100) * pageHeight;

  const pdfY = pageHeight - yFromTop - height;

  return {
    x,
    y: pdfY,
    width,
    height,
  };
}

module.exports = {
  convertPercentToPdfCoordinates,
};