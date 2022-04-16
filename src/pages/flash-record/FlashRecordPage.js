import React, { useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { pdfjs } from 'react-pdf';

import 'react-toastify/dist/ReactToastify.css';
import '../../static/css/flash-record.css';

import FileUpload from '../../components/upload/FileUpload2';
import {
  uploadFileApiCall,
  oldUploadFileApiCall,
} from '../../apiCalls/file.api';
import {
  notify,
  toastId,
  notifyOcrStarting,
} from '../../utils';
import {
  FIREBASE_REGISTRATION_TOKEN,
} from '../../constant';
import { createRequest } from '../../store/actions/request.action';
import messaging from '../../firebase';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function FlashRecordPage(props) {
  const user = useSelector((state) => state.user) || {};
  const dispatch = useDispatch();
  const [uploadImages, setUploadImages] = useState([]);
  const [isRequestUploaded, setIsRequestUploaded] = useState(false);
  const [fileTestType, setFileTestType] = useState('bloodTest');

  /**
   * Handle File upload
   */
  const handleInputChange = (e) => {
    const { files } = e.target || [];
    notify();

    if (files.length >= 1) {
      const file = files[0];
      const fileType = file['type'];
      const uploadingData = {
        file,
        fileTestType,
        patientId: user._id,
        fileName: file.name,
      };

      if (localStorage.getItem(FIREBASE_REGISTRATION_TOKEN))
        uploadFileApiCall(uploadingData)
          .then((res) => console.log('Upload Success'))
          .catch((e) => console.log(e));
      else {
        oldUploadFileApiCall(uploadingData)
          .then((res) => {
            if (!res.data.code) {
              let currentFileType = res.data;

              const { fileUrl, fileName } = currentFileType;
              setUploadImages(
                uploadImages.concat([{ fileUrl, fileType, fileName }])
              );

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
      }

      messaging.onMessage((payload) => {
        const { notification } = payload;
        if (notification && notification.title.split(':')[1] === 'FILE') {
          const { body } = notification;
          const uploadedFile = JSON.parse(body);

          const {
            bloodTest,
            urineTest,
            biopsyTest,
            radiologyTest,
            addedInfo: flashRecordTest,
          } = uploadedFile;

          let currentFileType;
          if (bloodTest && bloodTest.length > 0) currentFileType = bloodTest[0];
          else if (urineTest && urineTest.length > 0)
            currentFileType = urineTest[0];
          else if (biopsyTest && biopsyTest.length > 0)
            currentFileType = biopsyTest[0];
          else if (radiologyTest && radiologyTest.length > 0)
            currentFileType = radiologyTest[0];
          else currentFileType = flashRecordTest[0];

          const { fileUrl, fileName } = currentFileType;
          console.log('handleInputChange -> currentFileType', currentFileType);

          setUploadImages(
            uploadImages.concat([{ fileUrl, fileType, fileName }])
          );

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
    if (uploadImages.length) {
      const dataToSubmit = {
        type: 0,
        isAutomatic: true,
        registrationToken: localStorage.getItem(FIREBASE_REGISTRATION_TOKEN),
        questions: [{ content: 'N/A' }],
      };
      dataToSubmit[fileTestType] = uploadImages;

      dispatch(createRequest(dataToSubmit));
      setIsRequestUploaded(true);
      // notifyOcrStarting();
    } else
      toast.error('You need to upload at least 1 document', {
        className: 'error-toast-container',
        autoClose: 4000,
      });
  };

  return isRequestUploaded ? (
    <div className="flash-record-page">
      <div className="flash-record-content">
        <p className="text-center">Your iDoctor request has been accepted</p>
        <div className="form-group text-center">
          <button
            className="btn btn-blue"
            onClick={() => props.onSetActiveTab(-1)}
          >
            Back To home
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flash-record-page">
      <div className="flash-record-content">
        <div className="form-group">
          <FileUpload
            id={`outlined-button-file-image`}
            onChange={(e) => handleInputChange(e)}
            uploadFiles={uploadImages}
            setUploadFiles={setUploadImages}
            fileUploadType="image"
            acceptType={'file_extension,image/*,application/pdf'}
            type="flash-record"
            fileTestType={fileTestType}
            setFileTestType={setFileTestType}
          />
        </div>
        <div className="form-group text-center">
          <button
            className="btn btn-gradient-yellow"
            onClick={() => onSubmit()}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
