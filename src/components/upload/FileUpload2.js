import React, { useState } from 'react';
import ReactPlayer from 'react-player';

// Components
import DialogPdfPreview from '../dialog/dialogPdfPreview';

// Material UI
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// Constant
import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE } from '../../constant';

import ico_upload from '../../img/imi/ico-upload.png';

// API Call
import { getPublicUrlApiCall } from '../../apiCalls/file.api';

import { isURL } from '../../utils';

import { Button } from '@material-ui/core';
import { FlatButton } from 'material-ui';
import ico_delete from '../../img/imi/ico-delete.png';

const styles = {
  textField: {
    width: '100px',
  },
  previewButton: {
    marginLeft: '10px',
    fontSize: '10px',
  },
};

export default function FileUpload({
  fileUploadType,
  uploadFiles,
  setUploadFiles,
  key,
  title,
  acceptType,
  id,
  multiple,
  onChange,
  name,
  type,
  fileTestType,
  setFileTestType,
  isLanguage,
  disabled
}) {
  const [linkFileToOpen, setLinkFileToOpen] = useState(null);
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);
  const [fileLanguage, setFileLanguage] = useState('English');

  // Setup File Mode To Open
  let fileModeToOpen;
  if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;

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
    const data = {
      itemUrl,
      redirect: redirect,
    };

    getPublicUrlApiCall(data)
      .then((res) => {
        if (!res.data.code) {
          const { signedUrl, fileType } = res.data;
          handleOpenFilePreview(signedUrl, fileType);
        }
      })
      .catch((e) => console.log(e));
  };

  const onRemoveFile = (e, index, type) => {
    setUploadFiles([
      ...uploadFiles.slice(0, index),
      ...uploadFiles.slice(index + 1),
    ]);
  };

  const handleFileLanguageChange = (event, index, value) => {
    setFileLanguage(value)
  }

  const handleFileTestTypeChange = (event, index, value) =>
    setFileTestType(value);

  return (
    <div key={key}>
      <div className="tit-upload">
        <label>{title || 'Upload File'} </label>
        <div>
          {type === 'flash-record' && (
            <SelectField value={fileTestType} onChange={handleFileTestTypeChange} className="select-field">
              <MenuItem value="bloodTest" primaryText="Blood Test" />
              <MenuItem value="urineTest" primaryText="Urine Test" />
              <MenuItem value="biopsyTest" primaryText="Biopsy Test" />
              <MenuItem value="radiologyTest" primaryText="Radiology Test" />
              <MenuItem value="addedInfo" primaryText="Others" />
            </SelectField>
          )}
          { isLanguage && (
            <SelectField value={fileLanguage} onChange={handleFileLanguageChange} className="select-field">
              <MenuItem value="English" primaryText="English" />
              <MenuItem value="Vietnamese" primaryText="Vietnamese" />
            </SelectField>
          )}
        </div>
      </div>

      <input
        accept={acceptType || 'file_extension|audio/*|image/*|media_type'}
        id={id}
        multiple={multiple || true}
        type="file"
        onChange={(e) => onChange(e)}
        name={name}
        style={{ display: 'none' }}
        onClick={(e) => (e.target.value = null)}
        disabled={disabled || false}
      />
      <label htmlFor={id}>
        <Button variant="outlined" component="span">
          Upload <img src={ico_upload} alt='' />
        </Button>
      </label>

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

      <ul>
        {uploadFiles &&
          uploadFiles.length > 0 &&
          uploadFiles.map((item, idx) => (
            <div className="block_upload" key={idx}>
              <Button
                variant="outlined"
                component="span"
                onClick={() =>
                  openCloudPublicUrl(item.fileUrl, false, fileUploadType)
                }
              >
                {fileUploadType} {idx + 1}
              </Button>
              <a
                className="ico_delete"
                variant="outlined"
                component="span"
                style={styles.previewButton}
                onClick={(e) => onRemoveFile(e, idx, fileUploadType)}
              >
                <img src={ico_delete} alt='' />
              </a>
              <br />
            </div>
          ))}
      </ul>
    </div>
  );
}
