import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import FlatButton from 'material-ui/FlatButton';

const PdfPreview = (props) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => setPageNumber(pageNumber <= 1 ? 1 : (pageNumber - 1));
  const goToNextPage = () => setPageNumber(
    pageNumber >= numPages ? numPages : (pageNumber + 1)
  );

  const { file, onLoadError } = props;
  const styles = {
    DocumentWrap: {
      cursor: 'pointer',
      width: '100%',
    },
  };
const screen = window.screen.width;

  return (
    <div className="edit-css-pdf-review-container">
      <div style={styles.DocumentWrap} className="pdf-review-content-css">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onLoadError}
        >
          <Page scale={screen <= 425 ? 5.0 : 1.0} pageNumber={pageNumber} />
          <div>
            {pageNumber > 1 &&
            <FlatButton
              className="preview-prev-nav"
              label="Prev"
              primary={true}
              onClick={goToPrevPage}
            />}
            {pageNumber < numPages &&
            <FlatButton
              className="preview-next-nav"
              label="Next"
              primary={true}
              onClick={goToNextPage}
            />}
          </div>
        </Document>
      </div>

      {numPages && (
        <p className="pdf-preview-numpages">
          Page {pageNumber} of {numPages}
        </p>
      )}
    </div>
  );
}

export default PdfPreview;
