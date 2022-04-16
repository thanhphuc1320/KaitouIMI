import React, { useState } from 'react';

// Components
import DialogPdfPreview from '../../../components/dialog/dialogPdfPreview';

// Constant
import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE } from '../../../constant';

// API Call
import { getPublicUrlApiCall } from '../../../apiCalls/file.api';

// Helper functions
import { isURL } from '../../../utils';
import { Button } from '@material-ui/core';

const styles = {
  textField: {
    width: '100px',
  },
  previewButton: {
    marginLeft: '10px',
    fontSize: '10px',
  },
};

export default function FileAnnotationView({
  fileList,
  status,
  title,
  fileType,
  requestId,
  openAnnotationTool,
}) {
  const [linkFileToOpen, setLinkFileToOpen] = useState(null);
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);

  // Setup File Mode To Open
  let fileModeToOpen;
  if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;

  const isOpenFile =
    isURL(linkFileToOpen) &&
    fileModeToOpen &&
    [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);

  const openPdfPreview = (link, type) => {
    if (isURL(link) && type) {
      setLinkFileToOpen(link);
      setFileTypeToOpen(type);
    }
  };

  const closeFilePreview = (e) => {
    setLinkFileToOpen(null);
    setFileTypeToOpen(null);
  };

  const openCloudPublicUrl = (itemUrl, redirect) => {
    const data = {
      itemUrl,
      redirect: redirect,
      requestId: requestId,
    };

    getPublicUrlApiCall(data)
      .then((res) => {
        if (!res.data.code) {
          const { signedUrl, fileType } = res.data;
          openPdfPreview(signedUrl, fileType);
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      {fileList && fileList.length > 0 && (
        <li style={{alignItems: "unset"}}>
          <span>{title}:</span>
          <div style={{display:'flex', gridGap:'10px', flexDirection:"column", alignItems:"flex-end"}}>
            {fileList.map((item, idx) => (
              <div key={idx}>
                {status === 0 && (
                  <Button
                    style={styles.cancelButton}
                    variant="outlined"
                    component="span"
                    onClick={() => openCloudPublicUrl(item.fileUrl, false)}
                  >
                    {item.fileName}
                  </Button>
                )}
                {status === 1 && item.ocrJson[0] && (
                  <div>
                    <Button
                      style={styles.anchor}
                      variant="outlined"
                      onClick={() => openAnnotationTool(item, fileType, idx)}
                    >
                      Annotate {item.fileName}
                    </Button>
                    {item.ocrJson[0].imageUrl && <p>Reviewed</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </li>
      )}
      <DialogPdfPreview
        fileModeToOpen={fileModeToOpen}
        isOpenFile={isOpenFile}
        file={linkFileToOpen}
        handleCloseFilePreview={(e) => closeFilePreview(e)}
      />
    </div>
  );
}
