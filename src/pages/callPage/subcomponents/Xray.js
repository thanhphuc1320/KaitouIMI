import React from 'react';

import PdfPreview from '../../../components/dialog/pdfPreview';

export default function Xray({ onClick, isImage, img }) {
  return (
    <div>
      <div className="header">
        <div className="header-left">
          <h5> Image preview </h5>
        </div>
      </div>

      <div className="x-ray">
        <div onClick={onClick}>
          {isImage ? (
            <img src={img} />
          ) : (
            <PdfPreview pageNumber={1} file={img} />
          )}
        </div>
      </div>

      <div className="xray-icons">
        <div className="xray-icon-list-col" />
      </div>
    </div>
  );
}
