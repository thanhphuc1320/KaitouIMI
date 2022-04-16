import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Document, Page } from 'react-pdf';
import Slider from 'react-slick';
// Components
import DialogPdfPreview from '../dialog/dialogPdfPreview';

// Constant
import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE } from '../../constant';

// API Call

import { isURL } from '../../utils';
import { Button } from '@stories/Button/Button';

import { Tooltip } from '@material-ui/core';
import { FlatButton } from 'material-ui';
import img_default from '../../img/imi/ico-img-default.png';
import ico_remove from '../../img/imi/ico-remove.png';
import ico_check from '../../img/imi/ico-check-green.png';
import ico_next from '../../img/imi/ico-next-file.png';
import ico_back from '../../img/imi/ico-back-file.png';
export default function ({
  fileUploadType,
  uploadFiles,
  setUploadFiles,
  key,
  acceptType,
  id,
  onChange,
  name,
  disabled,
  titleUpload,
}) {
  const [linkFileToOpen, setLinkFileToOpen] = useState(null);
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);
  const [, setNumPages] = useState(null);
  const [pageNumber] = useState(1);
  const sliderFile = useRef(null);
  const [widthBar, setWidthBar] = useState(20);

  //   const [fileLanguage, setFileLanguage] = useState('English');

  // Setup File Mode To Open
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

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const onRemoveFile = (index) => {
    setUploadFiles([
      ...uploadFiles.slice(0, index),
      ...uploadFiles.slice(index + 1),
    ]);
  };

  const settings = {
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1441,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 1,
          centerMode: true,
        },
      },
    ],
  };
  const clickedPrev = () => {
    sliderFile.current.slickPrev();
  };

  const clickedNext = () => {
    sliderFile.current.slickNext();
  };
  const handleLoadFile = (value, index, elem, time) => {
    const elemActive = document.getElementsByClassName('active-check');
    const elemActiveRemove = document.getElementsByClassName('active-remove');
    const elemProcess = document.getElementsByClassName('progressUpload');
    let width = widthBar;
    var id = setInterval(frame, time);
    function frame() {
      if (elem && elemProcess && elemActive && elemActiveRemove) {
        if (width >= value) {
          clearInterval(id);
        } else {
          width++;
          if (elem) {
            elem[index].style.width = width + '%';
          }
          if (width === 100 && elemProcess && elemActive && elemActiveRemove) {
            elemProcess[index].style.display = 'none';
            elemActive[index].style.display = 'block';
            elemActiveRemove[index].style.display = 'block';
            setWidthBar(20);
          }
        }
      }
    }
    setWidthBar(value);
  };
  useEffect(() => {
    if (uploadFiles.length > 0) {
      let elem = document.getElementsByClassName('uploadBar');
      const elemImg = document.getElementsByClassName('default-img');
      uploadFiles.forEach((e, index) => {
        if (!e.statusUpload && elem) {
          handleLoadFile(95, index, elem, 1);
        } else if (e.statusUpload && elem) {
          elemImg[index].style.display = 'none';
          handleLoadFile(100, index, elem, 1);
        }
      });
    }
  }, [uploadFiles]);

  const handleOpenDialogPDF = (item) => {
    handleOpenFilePreview(item.publicFileUrl, item.fileType);
  };

  const handleOpenFilePreview = (link, type) => {
    if (link && type) {
      setLinkFileToOpen(link);
      setFileTypeToOpen(type);
    }
  };

  return (
    <div key={key}>
      <div className="d-flex justify-content-center">
        <div
          className={
            uploadFiles && uploadFiles.length > 0
              ? 'input-upload has-file'
              : 'input-upload'
          }
        >
          {titleUpload === 'Opinion' ? (
            uploadFiles.length === 0 ? (
              <p className="title-upload">
                Let us help you read your blood test!
              </p>
            ) : (
              <p className="title-upload">
                Let us help you read your blood test!
              </p>
            )
          ) : (
            <p className="title-upload">
              Let us help you read your blood test!
            </p>
          )}
          <input
            accept={acceptType || 'file_extension|audio/*|image/*|media_type'}
            id={id}
            multiple={true}
            type="file"
            onChange={(e) => onChange(e)}
            name={name}
            style={{ display: 'none' }}
            onClick={(e) => (e.target.value = null)}
            disabled={disabled || false}
          />
          <label htmlFor={id}>
            <Button
              className="btn-upload"
              variant="outlined"
              label="Upload your blood test"
            ></Button>
          </label>
        </div>
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
      {uploadFiles && uploadFiles.length > 0 && (
        <div
          className={
            uploadFiles && uploadFiles.length > 0
              ? 'slider-list-file has-file'
              : 'slider-list-file'
          }
        >
          <div
            className={
              uploadFiles.length > 2 ? 'content-user' : 'content-user ml-45'
            }
          >
            <div className="silders center slider-dektop">
              <Slider {...settings} ref={sliderFile}>
                {uploadFiles.map((item, idx) => {
                  return (
                    <div key={idx} className="d-flex justify-content-center">
                      <div className="item-pic-upload">
                        <div>
                          <div className="img-upload">
                            {item &&
                              item.publicFileUrl &&
                              (item.fileType != 'application/pdf' ? (
                                <img
                                  className="upload-success"
                                  style={{ cursor: 'pointer' }}
                                  src={item.publicFileUrl}
                                  alt=""
                                  onClick={() => {
                                    handleOpenDialogPDF(item);
                                  }}
                                />
                              ) : (
                                <div className="upload-success upload-success-pdfpreview cursor-pointer">
                                  <Document
                                    file={item.publicFileUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onClick={() => {
                                      handleOpenDialogPDF(item);
                                    }}
                                  >
                                    <Page pageNumber={pageNumber} />
                                  </Document>
                                </div>
                              ))}
                            <div className="default-img">
                              <img className="" src={img_default} alt="" />
                            </div>
                          </div>
                          <div className="detail-img-upload">
                            <Tooltip title={item.fileName} arrow>
                              <p className="name-file cursor-pointer">
                                {item.fileName}
                              </p>
                            </Tooltip>
                            <div className="progressUpload">
                              <div
                                className="uploadBar"
                                style={{ width: '0%' }}
                              ></div>
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                              <div className="active-check">
                                <img
                                  className="mr-3 cursor-pointer"
                                  src={ico_check}
                                  alt=""
                                />
                              </div>
                              <div className="active-remove">
                                <img
                                  className="cursor-pointer icon-remove"
                                  src={ico_remove}
                                  alt=""
                                  onClick={() => onRemoveFile(idx)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
          {uploadFiles && uploadFiles.length > 1 && (
            <div>
              <a className="prev-dektop cursor" href="#!">
                <img
                  className="selected-back"
                  alt=""
                  src={ico_back}
                  onClick={() => clickedPrev()}
                />
              </a>
              <a className="next-dektop cursor" href="#!">
                <img
                  className="selected-next"
                  alt=""
                  src={ico_next}
                  onClick={() => clickedNext()}
                />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
