import React, { useEffect, useState } from 'react';

import PdfPreview from '@components/dialog/pdfPreview';
import { useCalling } from '../../use-calling';

import DialogPdfPreview from '@components/dialog/dialogPdfPreview';
import {
  oldUploadFileApiCall,
  getPublicUrlApiCall,
} from '../../../../apiCalls/file.api';

import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE, DOCTOR_ROLE } from '../../../../constant';
import { notify, toastId, notifyOcrStarting, isURL } from '../../../../utils';
import ico_fullscreen from '@assets/icons/ico-fullscreen.png';

import {
  ContainerImagePreview,
  ImagePreview,
  HeaderPreview
} from './styled';

const Xray = () => {
  const calling = useCalling();
  const getType = calling.currentImage?.fileType;
  const [file] = React.useState('https://pdfkit.org/demo/out.pdf')
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);
  const [linkFileToOpen, setLinkFileToOpen] = useState(null);

  let fileModeToOpen;
  if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;

  const isOpenFile =
    isURL(linkFileToOpen) &&
    fileModeToOpen &&
    [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);
    
  const handleCloseFilePreview = (e) => {
    setLinkFileToOpen(null);
    setFileTypeToOpen(null);
  };

  const openCloudPublicUrl = (itemUrl, fileType,) => {
    handleOpenFilePreview(itemUrl, fileType);
  };

  const handleOpenFilePreview = (link, type) => {
    if (link && type) {
      setLinkFileToOpen(link);
      setFileTypeToOpen(type);
    }
  };
  return (
    <ContainerImagePreview>
      <HeaderPreview>
        <h2 className="img-review">Image Review</h2>
        <div className="header-right">
          <img src={ico_fullscreen} className="iconFullScreenImage" onClick={calling.controller.toggleFullScreenImage} alt='' />
        </div>
      </HeaderPreview>

      <ImagePreview onClick={() => openCloudPublicUrl(calling.currentImage.signedUrl, calling.currentImage.fileType, false)}>
        <div>
          {
            (getType === 'video/mp4' || getType === 'video/webm') ? (
              <video src={calling.currentImage?.signedUrl} autoPlay controls/>
            ) : ( getType === 'application/pdf' ? (
              <PdfPreview pageNumber={1} file={file}/>
            ) : (
              <img src={calling.currentImage?.signedUrl} alt='' />
            ))
          }  
        </div>
      </ImagePreview>
      <DialogPdfPreview
        fileModeToOpen={fileModeToOpen}
        isOpenFile={isOpenFile}
        file={linkFileToOpen}
        handleCloseFilePreview={(e) => handleCloseFilePreview(e)}
      />
    </ContainerImagePreview>
  );
};
export default Xray;
