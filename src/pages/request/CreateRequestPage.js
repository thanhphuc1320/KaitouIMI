import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { pdfjs } from 'react-pdf';

import _ from 'lodash';
import ReactPlayer from 'react-player';

import 'react-toastify/dist/ReactToastify.css';
import '../../static/css/create-request.css';

// Other Component
import DialogPdfPreview from '../../components/dialog/dialogPdfPreview';

// Material UI
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/styles';

import FileUpload from '../../components/upload/FileUpload2';
import createRequestState from './createRequestState';
import ico_delete from '../../img/imi/ico-delete.png';
// import messaging from './firebase';

import {
  uploadFileApiCall,
  getPublicUrlApiCall,
  oldUploadFileApiCall,
} from '../../apiCalls/file.api';
import { isURL } from '../../utils';
import {
  IMAGE_TYPES,
  PDF_TYPE,
  IMAGE_MODE,
  PDF_MODE,
  FIREBASE_REGISTRATION_TOKEN,
  ENV,
} from '../../constant';
import { createRequest } from '../../store/actions/request.action';

import {
  styles,
  submitButtonStyle,
} from '../../layouts/styles/createRequestStyle';
import messaging from '../../firebase';
import { FlatButton } from 'material-ui';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const SubmitButton = styled(Button)(submitButtonStyle);

export default function CreateRequestPage(props) {
  const user = useSelector((state) => state.user) || {};
  const dispatch = useDispatch();
  const { CREATE_APPOINTMENT_FAILED } = useSelector((state) => state.error);
  if (CREATE_APPOINTMENT_FAILED) {
    const errorMessage = CREATE_APPOINTMENT_FAILED.server.readableMsg;
    toast.error(errorMessage, {
      className: 'error-toast-container',
      autoClose: 4000,
    });
  }

  const initialState = _.cloneDeep(createRequestState); // Perform a deep copy of createRequestState

  useEffect(() => {
    setData(initialState.cancerData);
  }, []);

  const {
    generalData,
    liverData,
    cancerData,
    diabetesData,
  } = createRequestState;

  const [linkFileToOpen, setLinkFileToOpen] = useState(null);
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);
  const [data, setData] = useState(cancerData);
  const [isRequestUploaded, setIsRequestUploaded] = useState(false);
  const [questions, setQuestions] = useState('');

  const { uploads, type = 1, video } = data;

  // FIX_ME: Check link works
  const selectItemStyle = { whiteSpace: 'preWrap' };

  // Setup File Mode To Open
  let fileModeToOpen;
  if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;
  else fileModeToOpen = 'video';

  const isOpenFile =
    isURL(linkFileToOpen) &&
    fileModeToOpen &&
    [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);

  let toastId = null;
  const notify = () =>
    (toastId = toast('Uploading File..', {
      className: 'toast-container',
      autoClose: 3000,
    }));

  // const notifyOcrComplete = () =>
  //   (toastId = toast('OCR Complete', {
  //     className: 'toast-container',
  //     autoClose: 2000,
  //   }));

  const notifyOcrStarting = () =>
    (toastId = toast(`Processing OCR, we'll notify you when it's ready`, {
      className: 'toast-container',
      autoClose: 2500,
    }));


  const handleOpenFilePreview = (link, type) => {
    if (isURL(link) && type) {
      setLinkFileToOpen(link);
      setFileTypeToOpen(type);
    }
  };

  const handleCloseFilePreview = (e) => {
    setLinkFileToOpen(null);
    setFileTypeToOpen(null);
  };

  /**
   * Handle Type Change
   */
  const handleSelectionChange = (event, index, value) => {
    let newData;
    switch (value) {
      case 1:
        newData = cancerData;
        break;
      case 2:
        newData = generalData;
        break;
      case 3:
        newData = liverData;
        break;
      case 4:
        newData = diabetesData;
        break;
      default:
        newData = cancerData;
        break;
    }

    const { uploads } = data || {};
    newData['video'] = [];
    uploads.map((uploadField) => {
      newData[uploadField.id] = [];
    });

    setData(newData);
    setQuestions('');
  };

  const validateDataToSubmit = () => {
    const { type, requires, optionals } = data;
    if (!questions.length) {
      toast.error('Please write a question', {
        className: 'error-toast-container',
        autoClose: 2000,
      });
      return null;
    }
    let dataToSubmit = {
      type,
      isAutomatic: false,
      video,
      questions: [{ content: questions || ' ' }],
    };

    const mapIdToName = {
      bloodTest: 'Blood Test',
      urineTest: 'Urine Test',
      radiology: 'Radiology',
      biopsy: 'Biopsy',
    };

    let count = 0;

    for (let i = 0; i < requires.length; i++) {
      const requiredFieldName = requires[i];
      if (!data[requires[i]]) {
        const errorMessage = `Need to upload ${
          mapIdToName[requires[i]]
        } document`;
        toast.error(errorMessage, {
          className: 'error-toast-container',
          autoClose: 10000,
        });
        return null;
      } else {
        dataToSubmit[requiredFieldName] = data[requiredFieldName];
        // Add type of file to Submit
        dataToSubmit[`${requiredFieldName}Type`] =
          data[`${requiredFieldName}Type`];
      }
      count += data[requires[i]].length;
    }

    for (let i = 0; i < optionals.length; i++) {
      const optionalFieldName = optionals[i];
      if (data[optionals[i]]) {
        dataToSubmit[optionalFieldName] = data[optionalFieldName];
        dataToSubmit[`${optionalFieldName}Type`] =
          data[`${optionalFieldName}Type`];
      }
    }

    if (count === 0) {
      toast.error('You need to upload at least 1 document', {
        className: 'error-toast-container',
        autoClose: 4000,
      });
      return null;
    }

    setIsRequestUploaded(true);
    return dataToSubmit;
  };

  /**
   * Handle File upload
   */
  const handleInputChange = (e, documentName, key) => {
    const { uploads} = data || {};
    const { files } = e.target || [];
    notify();

    if (files.length >= 1) {
      const file = files[0];
      const fileType = file['type'];
      const uploadingData = {
        file,
        patientId: user._id,
        fileTestType: uploads[key] ? uploads[key].fileTestType : 'addedInfo',
        fileName: file.name,
      };

      // if (localStorage.getItem(FIREBASE_REGISTRATION_TOKEN))
      //   uploadFileApiCall(uploadingData)
      //     .then((res) => console.log('Upload Success'))
      //     .catch((e) => console.log(e));
      // else {
        oldUploadFileApiCall(uploadingData)
          .then((res) => {
            if (!res.data.code) {
              let currentFileType = res.data;

              const { fileUrl, fileName } = currentFileType;
              if (!data[documentName])
                data[documentName] = [{ fileUrl, fileType, fileName }];
              else data[documentName].push({ fileUrl, fileType, fileName });
              setData({ ...data });

              toast.update(toastId, {
                render: 'Uploaded',
                type: toast.TYPE.INFO,
                className: 'update-toast-container',
                progressClassName: 'update-progress-bar',
                autoClose: 1500,
              });
            }
          })
          .catch((e) => console.log(e));
        return;
      // }

      messaging.onMessage((payload) => {
        const { notification } = payload;
        if (notification && notification.title.split(':')[1] === 'FILE') {
          const { title, body } = notification;
          const uploadedFile = JSON.parse(body);
          const {
            bloodTest,
            urineTest,
            biopsyTest,
            radiologyTest,
            addedInfo: uploadedAddedInfo,
          } = uploadedFile;

          let currentFileType;
          if (bloodTest && bloodTest.length > 0) currentFileType = bloodTest[0];
          else if (urineTest && urineTest.length > 0)
            currentFileType = urineTest[0];
          else if (biopsyTest && biopsyTest.length > 0)
            currentFileType = biopsyTest[0];
          else if (radiologyTest && radiologyTest.length > 0)
            currentFileType = radiologyTest[0];
          else currentFileType = uploadedAddedInfo[0];

          const { fileUrl, fileName } = currentFileType;

          if (title === `${ENV}:FILE:OCR:UPLOAD:SUCCESS`) {
            if (!data[documentName])
              data[documentName] = [{ fileUrl, fileType, fileName }];
            else data[documentName].push({ fileUrl, fileType, fileName });
            setData({ ...data });
          } else if (title === `${ENV}:FILE:ADDED_INFO:UPLOAD:SUCCESS`) {
            if (!data[documentName])
              data[documentName] = [{ fileUrl, fileType, fileName }];
            else data[documentName].push({ fileUrl, fileType, fileName });
            setData({ ...data });
          }

          toast.update(toastId, {
            render: 'Uploaded',
            type: toast.TYPE.INFO,
            className: 'update-toast-container',
            progressClassName: 'update-progress-bar',
            autoClose: 1500,
          });
        }
      });
    }
  };

  /**
   * Main Function
   * 1. Validate Data
   * 2. Create a new Request
   */
  const onSubmit = () => {
    const dataToSubmit = validateDataToSubmit();

    if (dataToSubmit) {
      dataToSubmit.registrationToken = localStorage.getItem(
        FIREBASE_REGISTRATION_TOKEN
      );
      dispatch(createRequest(dataToSubmit));
      // notifyOcrStarting();
    }
  };

  /**
   *
   * @param {} e
   * @param {bloodTest, radiology, urineTest, biopsy} documentName
   * @param {Number} index
   */
  const onPreview = (e, documentName, index) => {
    if (!documentName && documentName == null) return;
    let link = {};

    // Setup Link and fileType
    const uploadType = data[documentName] || [];
    const item = uploadType[index] || {};

    link.fileUrl = item.fileUrl || item.link || null;
    link.fileType = item.fileType;

    if (Array.isArray(link)) {
      if (link.length === 0) return;
      link = link[link.length - 1];
    }

    if (isURL(link.fileUrl) && link.fileType) {
      getPublicUrlApiCall({ itemUrl: link.fileUrl, redirect: false })
        .then((res) => {
          if (!res.data.code)
            handleOpenFilePreview(res.data.signedUrl, link.fileType);
        })
        .catch((e) => console.log('error while getting public url', e));
    }
  };

  /**
   *
   * @param {} e
   * @param {bloodTest, radiology, urineTest, biopsy} documentName
   * @param {*} index
   */
  const onRemoveFile = (e, documentName, index) => {
    const newData = Object.assign({}, data);
    newData[documentName] = [
      ...newData[documentName].slice(0, index),
      ...newData[documentName].slice(index + 1),
    ];
    setData(newData);
  };

  if (isRequestUploaded) {
    props.onUploaded(-1);
  }

  return (
    <div>
      <div className="row">
        <div className="create-request-content">
          <div className="create-request-part create-request-left">
            <div className="form-group">
              <label>Type</label>
              <SelectField
                value={type}
                onChange={handleSelectionChange}
                menuItemStyle={selectItemStyle}
                className="form-control"
              >
                <MenuItem value={1} primaryText="Cancer" />
                <MenuItem value={2} primaryText="General" />
                <MenuItem value={3} primaryText="Liver" />
                <MenuItem value={4} primaryText="Diabetes" />
              </SelectField>
            </div>

            {uploads.map((uploadField, key) => (
              <div className="form-group">
                <FileUpload
                  title={uploadField.title}
                  uploadInfo={uploadField.uploadInfo}
                  acceptType={uploadField.accept}
                  id={`outlined-button-file-${uploadField.id}-${key}`}
                  name={uploadField.id}
                  fileInputStyle={styles.FileInput}
                  buttonLabel={uploadField.buttonLabel}
                  onChange={(e) => handleInputChange(e, uploadField.id, key)}
                  value={uploadField.value}
                />
                {data[uploadField.id] &&
                  data[uploadField.id].length > 0 &&
                  data[uploadField.id].map((item, idx) => (
                    <div className="block_upload">
                      <Button
                        variant="outlined"
                        component="span"
                        onClick={(e) => onPreview(e, uploadField.id, idx)}
                      >
                        <span>{item.fileName}</span>
                        Preview
                      </Button>
                      <a
                        className="ico_delete"
                        variant="outlined"
                        component="span"
                        onClick={(e) => onRemoveFile(e, uploadField.id, idx)}
                      >
                        <img src={ico_delete} alt='' />
                      </a>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <div className="create-request-part create-request-right">
            <div className="form-group">
              <div className="form-group">
                <FileUpload
                  title="Video"
                  uploadInfo=""
                  acceptType="video/*"
                  id={`outlined-button-file-video`}
                  name=""
                  fileInputStyle={styles.FileInput}
                  buttonLabel="Video"
                  onChange={(e) => handleInputChange(e, 'video')}
                  value=""
                />
                {video &&
                  video.length > 0 &&
                  video.map((item, i) => (
                    <div className="block_upload">
                      <Button
                        variant="outlined"
                        component="span"
                        onClick={(e) => onPreview(e, 'video', i)}
                      >
                        <span>{item.fileName}</span>
                        Preview
                      </Button>
                      <a
                        variant="outlined"
                        component="span"
                        onClick={(e) => onRemoveFile(e, 'video', i)}
                      >
                        <img src={ico_delete} alt='' />
                      </a>
                    </div>
                  ))}
                {video.length > 0 &&
                  linkFileToOpen &&
                  fileModeToOpen === 'video' && (
                    <div>
                      <FlatButton
                        label="Close"
                        primary={true}
                        onClick={(e) => handleCloseFilePreview(e)}
                      />
                      <ReactPlayer
                        url={linkFileToOpen}
                        playing="true"
                        controls="true"
                      />
                    </div>
                  )}
              </div>
            </div>
            <div className="create-request-question">
              <div className="question-content">
                <div className="form-group">
                  <label>Question</label>
                  <textarea
                    onChange={(e) => setQuestions(e.target.value)}
                    rows={4}
                    placeholder="You can type your question"
                    className="form-control"
                    value={questions}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div style={styles.SubmitButtonWrap}>
              <SubmitButton
                className="btn btn-gradient-yellow"
                onClick={() => onSubmit()}
              >
                SUBMIT
              </SubmitButton>
            </div>
          </div>
        </div>

        <DialogPdfPreview
          fileModeToOpen={fileModeToOpen}
          isOpenFile={isOpenFile}
          file={linkFileToOpen}
          handleCloseFilePreview={(e) => handleCloseFilePreview(e)}
        />
      </div>
    </div>
  );
}
