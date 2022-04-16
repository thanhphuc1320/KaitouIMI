import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// Components
import ReactPlayer from 'react-player';
import { Button } from '@material-ui/core';
import { FlatButton } from 'material-ui';
import DialogPdfPreview from '../../../components/dialog/dialogPdfPreview';

// Constant
import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE } from '../../../constant';

// API Call
import {
  oldUploadFileApiCall,
  getPublicUrlApiCall,
} from '../../../apiCalls/file.api';

// Helper functions
import { isURL } from '../../../utils';

const styles = {
  textField: {
    width: '100px',
  },
  previewButton: {
    marginLeft: '10px',
    fontSize: '10px',
  },
};

export default function FileUploadView({
  fileUploadType,
  uploadImages,
  setUploadImages,
}) {
  const user = useSelector((state) => state.user) || {};
  const [linkFileToOpen, setLinkFileToOpen] = useState(null);
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);

  // Setup File Mode To Open
  let fileModeToOpen;
  if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;

  let toastId = null;
  const notify = () =>
    (toastId = toast('Uploading File..', {
      className: 'toast-container',
      autoClose: 3000,
    }));

  const isOpenFile =
    isURL(linkFileToOpen) &&
    fileModeToOpen &&
    [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);

  const handleOpenFilePreview = (link, type) => {
    if (link && type) {
      setLinkFileToOpen(link);
      setFileTypeToOpen(type);
    }
  };

  const handleCloseFilePreview = (e) => {
    setLinkFileToOpen(null);
    setFileTypeToOpen(null);
  };

  const openCloudPublicUrl = (itemUrl, redirect, type) => {
    const data = { itemUrl, redirect: redirect };

    getPublicUrlApiCall(data)
      .then((res) => {
        if (!res.data.code) {
          const { signedUrl, fileType } = res.data;
          handleOpenFilePreview(signedUrl, fileType);
        }
      })
      .catch((e) => console.log(e));
  };

  const handleUploadFile = (e, type) => {
    const { files } = e.target || [];
    if (files.length > 0) {
      const file = files[0];
      const uploadingData = {
        file,
        patientId: user._id,
        fileName: file.name,
      };

      notify();

      oldUploadFileApiCall(uploadingData)
        .then((res) => {
          const { fileName, fileType, fileUrl } = res.data;

          const uploadedFile = {
            fileName,
            fileType,
            fileUrl,
          };
          setUploadImages(uploadImages.concat([uploadedFile]));
        })
        .then(() =>
          toast.update(toastId, {
            render: 'Uploaded',
            type: toast.TYPE.INFO,
            className: 'update-toast-container',
            progressClassName: 'update-progress-bar',
            autoClose: 1500,
          })
        )
        .catch((e) => console.log(e));
    }
  };

  const onRemoveFile = (e, index, type) => {
    setUploadImages([
      ...uploadImages.slice(0, index),
      ...uploadImages.slice(index + 1),
    ]);
  };
  return (
    <div>
      <div className="item-upload">
        <h4>Upload your {fileUploadType}</h4>
        <a>
          <input
            type="file"
            value=""
            onChange={(e) => handleUploadFile(e, fileUploadType)}
            onClick={(e) => {
              e.target.value = null;
            }}
          />
          <ul>
            {uploadImages &&
              uploadImages.length > 0 &&
              uploadImages.map((item, idx) => (
                <li>
                  <Button
                    variant="outlined"
                    component="span"
                    style={styles.previewButton}
                    onClick={() =>
                      openCloudPublicUrl(item.fileUrl, false, fileUploadType)
                    }
                  >
                    {fileUploadType} {idx + 1}
                  </Button>
                  <Button
                    variant="outlined"
                    component="span"
                    style={styles.previewButton}
                    onClick={(e) => onRemoveFile(e, idx, fileUploadType)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
          </ul>
        </a>
      </div>
      <DialogPdfPreview
        fileModeToOpen={fileModeToOpen}
        isOpenFile={isOpenFile}
        file={linkFileToOpen}
        handleCloseFilePreview={(e) => handleCloseFilePreview(e)}
      />
      {fileUploadType === 'video' && linkFileToOpen && (
        <div>
          <div className="player-wrapper">
            <FlatButton
              label="Close"
              primary={true}
              onClick={(e) => handleCloseFilePreview(e)}
            />
            <ReactPlayer
              url={linkFileToOpen}
              width="100%"
              height="100%"
              playing="true"
              controls="true"
            />
          </div>
        </div>
      )}
    </div>
  );
}
