import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfCanvas({ fileUrl, onDocumentLoad, renderOverlay }) {
  const [numPages, setNumPages] = useState(null);
  const [pageSizes, setPageSizes] = useState({});

  function handlePageLoadSuccess(page, pageNumber) {
    const viewport = page.getViewport({ scale: 1 });
    setPageSizes((prev) => ({
      ...prev,
      [pageNumber]: { width: viewport.width, height: viewport.height },
    }));
  }

  return (
    <div className="pdf-area">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          if (onDocumentLoad) onDocumentLoad(numPages);
        }}
        onLoadError={(error) => console.error("PDF load error:", error)}
        loading={<p>Loading PDF...</p>}
      >
        {Array.from(new Array(numPages), (_, index) => {
          const pageNumber = index + 1;
          return (
            <div className="pdf-page-wrapper" key={pageNumber}>
              <Page
                pageNumber={pageNumber}
                width={800}
                onLoadSuccess={(page) => handlePageLoadSuccess(page, pageNumber)}
              />
              {renderOverlay && renderOverlay(pageNumber, pageSizes[pageNumber])}
            </div>
          );
        })}
      </Document>
    </div>
  );
}

export default PdfCanvas;
