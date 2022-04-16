import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { pdfjs } from 'react-pdf';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../../static/css/flash-record.css';
import DialogResult from 'components/dialog/dialogResult';
import FileUpload from '../../components/upload/uploadFilePatient';
import { getRequestDetailApiCall } from '../../apiCalls/request.api';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getPublicUrlApiCall } from '../../apiCalls/file.api';
import { Button } from '@stories/Button/Button';

// import { notify, toastId, notifyOcrStarting } from "../../utils";
import { FIREBASE_REGISTRATION_TOKEN } from '../../constant';
import { createRequest } from '../../store/actions/request.action';
import { useHistory } from 'react-router-dom';

import ico_next from '../../img/imi/icon-next.png';

import SecondOpinion from './secondOpinion/secondOpinion';
import { uploadMultiple } from '../../utils';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function FlashRecord({ handleStep, type, step, onPrevSteep }) {
  const params = useParams();
  const testResultId = params.id;
  const history = useHistory();
  const user = useSelector((state) => state.user) || {};
  const dispatch = useDispatch();
  const [uploadImages, setUploadImages] = useState([]);
  const [isRequestUploaded, setIsRequestUploaded] = useState(false);
  const [fileTestType, setFileTestType] = useState('bloodTest');
  const [activeTab, setActiveTab] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [requestHasData, setRequestHasData] = useState();
  const [loadingShowFile, setLoadingShowFile] = useState(false);
  let count = 0;

  /**
   * Handle File upload
   */
  const handleInputChange = (e) => {
    const { files } = e.target || [];
    const listPromise = [];
    if (files.length >= 1) {
      let countFile = uploadImages.length + files.length;
      let countImg = 0,
        countPdf = 0,
        isImg = false,
        isPDF = false;
      uploadImages.forEach((element) => {
        if (element.fileType !== 'application/pdf') {
          countImg += 1;
          isImg = true;
        } else {
          countPdf += 1;
          isPDF = true;
        }
      });
      for (let i = 0; i < files.length; i++) {
        if (files[i].type !== 'application/pdf') {
          countImg += 1;
          isImg = true;
        } else {
          countPdf += 1;
          isPDF = true;
        }
      }
      if (
        (type === 'Opinion' && (countFile > 5 || countImg > 5)) ||
        (type === 'iReader' && countFile > 5)
      ) {
        toast.error('You can not upload more than 5 pictures file', {
          className: 'error-toast-container',
          autoClose: 4000,
        });
      } else if (type === 'Opinion' && countPdf > 1) {
        toast.error('You can not upload more than 1 PDF file', {
          className: 'error-toast-container',
          autoClose: 4000,
        });
      } else if (type === 'Opinion' && isImg && isPDF) {
        toast.error(
          'You can not upload picture file and PDF file at the same time',
          {
            className: 'error-toast-container',
            autoClose: 4000,
          }
        );
      } else {
        let dataUpload = [];
        for (let index = 0; index < files.length; index++) {
          const file = files[index];
          const fileType = file['type'];
          const uploadingData = {
            file,
            fileTestType,
            patientId: user._id,
            fileName: file.name,
          };
          const handleDataUpload = {
            fileName: file.name,
            publicFileUrl: '',
            fileType: '',
            fileUrl: '',
            statusUpload: '',
          };
          dataUpload = [...dataUpload, handleDataUpload];
          listPromise.push(uploadMultiple(uploadingData, index));
          if (listPromise.length === files.length) {
            setUploadImages([...uploadImages, ...dataUpload]);
            Promise.all(listPromise)
              .then((resDataPublic) => {
                resDataPublic.map((item, index) => {
                  let dataTemp = [...dataUpload];
                  if (!dataTemp[index].statusUpload) {
                    dataTemp[index].publicFileUrl = item.publicFileUrl;
                    dataTemp[index].statusUpload = true;
                    dataTemp[index].fileType = item.fileType;
                    dataTemp[index].fileUrl = item.fileUrl;
                    setUploadImages([...uploadImages, ...dataTemp]);
                  }
                });
              })
              .catch((e) => console.log(e));
          }
        }
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (testResultId) {
        let arrTemp = [];
        await getRequestDetailApiCall(testResultId).then((res) => {
          setRequestHasData(res.data);
          res.data.bloodTest.forEach((item) => {
            arrTemp.push(item);
            return arrTemp;
          });
        });
        handlePublicUrl(arrTemp);
      } else {
        setLoadingShowFile(true);
      }
    })();
  }, []);

  const handlePublicUrl = async (arr) => {
    let arrTemp = [];
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      let newItem = await getPublicUrlApiCall({
        itemUrl: item.fileUrl,
        redirect: false,
      });
      if (!newItem.data.code) {
        item.publicFileUrl = newItem.data.signedUrl;
        item.statusUpload = true;
        item.fileType = newItem.data.fileType;
      }
      arrTemp.push(item);
    }
    let dataTemp = { ...uploadImages };
    dataTemp = [...arrTemp];
    setLoadingShowFile(true);
    setUploadImages(dataTemp);
  };

  /**
   * Main Function
   * 1. Validate Data
   * 2. Create a new Request
   */

  const onSubmit = async () => {
    setIsSubmit(true);

    if (uploadImages.length) {
      let isAutomatic = false;
      if (user.role === 'patient') {
        isAutomatic = true;
      } else {
        isAutomatic = false;
      }
      const dataToSubmit = {
        biopsy: [],
        radiology: [],
        type:
          type === 'Smart' || user?.role === 'doctor'
            ? 5
            : type === 'iReader'
            ? 6
            : 7,
        isAutomatic: isAutomatic,
        registrationToken: localStorage.getItem(FIREBASE_REGISTRATION_TOKEN),
        questions: [{ content: 'N/A' }],
      };
      uploadImages.forEach((e) => {
        if (e.statusUpload) {
          delete e.statusUpload;
        }
      });
      dataToSubmit[fileTestType] = uploadImages;
      await dispatch(createRequest(dataToSubmit));
      if (user.role === 'patient') {
        setIsRequestUploaded(true);
        openDialog();
      } else {
        setTimeout(() => {
          onBack();
        }, 1000);
      }
    } else
      toast.error('You need to upload at least 1 document', {
        className: 'error-toast-container',
        autoClose: 4000,
      });
  };

  function nextStep(getId) {
    const dataTemp = setInterval(() => {
      getRequestDetailApiCall(getId).then((data) => {
        if (data?.data?.bloodTest[0].ocrDetect !== 'Completed') {
          count = count + 1;
          if (count > 10) {
            setSubmitError(true);
            clearInterval(dataTemp);
          }
        } else {
          clearInterval(dataTemp);
          onBack();
          // notifyOcrStarting();
        }
      });
    }, 3000);
  }
  useEffect(() => {
    if (user.createRequest && isSubmit) {
      const getId = user.createRequest?._id;
      nextStep(getId);
    }
  }, [user.createRequest]);

  const onBack = () => {
    if (user.role === 'patient') {
      history.push('/smart-reader/edit');
    } else {
      history.push('/my-requests');
    }
  };
  const handleDataSubmit = () => {
    const dataSubmit = {
      type: 1,
      status: 5,
      questions: [{ content: ' ' }],
      isAutomatic: false,
      bloodTest: uploadImages ? uploadImages : [],
      video: [],
      biopsy: [],
      radiology: [],
      anotherDocuments: [],
    };
    return dataSubmit;
  };
  const onNext = (check) => {
    if (!testResultId) {
      const dataSubmit = handleDataSubmit();
      dispatch(createRequest(dataSubmit));
    }
    if (check === 'skip1') {
      onPrevSteep('skip1');
    }
    setActiveTab(true);
    handleStep(35);
  };

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const openDialog = () => {
    setIsOpenDialog(true);
  };

  const handleClose = () => {
    setIsOpenDialog(false);
  };
  return isRequestUploaded ? (
    <div className="appointment-new">
      {submitError ? (
        <div className="center mt-5 patient-rest-result-new">
          <p className="note">
            We can’t analyze your blood test at the moment. Our staff will reach
            out to you soon.
          </p>
        </div>
      ) : (
        <DialogResult
          isOpenFile={isOpenDialog}
          handleClose={(e) => handleClose(e)}
        />
      )}
    </div>
  ) : (
    <div style={{ height: '100%' }}>
      {activeTab === false ? (
        <div className={type === 'Opinion' ? 'start-idoctor' : ''}>
          <div className="content-opinion">
            <div
              className={`${
                type !== 'Opinion'
                  ? 'flash-record-content ml-82'
                  : 'flash-record-content-idoctor mt-77'
              } ${uploadImages.length > 0 ? 'mt-list-file' : ''}`}
            >
              {loadingShowFile ? (
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
                    titleUpload={type}
                  />
                </div>
              ) : null}
              <div
                className={
                  uploadImages && uploadImages.length > 0
                    ? 'form-group-1 text-center btn-submit-image has-file'
                    : 'form-group text-center btn-submit-image'
                }
              >
                {type !== 'Opinion' ? (
                  <div className="gr-btn-submit-flash">
                    <Button
                      className={
                        uploadImages.length > 0
                          ? 'btn btn-blue-submit'
                          : 'btn btn-gray-next'
                      }
                      onClick={() => onSubmit()}
                      label="Submit"
                    />
                  </div>
                ) : !testResultId ? (
                  <div>
                    <button
                      disabled={uploadImages.length > 0 ? false : true}
                      className={
                        uploadImages.length > 0
                          ? 'btn btn-blue-submit'
                          : 'btn btn-gray-next'
                      }
                      onClick={() => onNext()}
                    >
                      Next <img src={ico_next} alt="" />
                    </button>
                    {uploadImages.length === 0 && (
                      <p
                        className="note-skip note-skip-reponse"
                        onClick={() => onNext('skip1')}
                      >
                        Skip This Step
                      </p>
                    )}
                  </div>
                ) : loadingShowFile ? (
                  <div>
                    <button
                      disabled={uploadImages.length > 0 ? false : true}
                      className={
                        uploadImages.length > 0
                          ? 'btn btn-blue-submit'
                          : 'btn btn-gray-next'
                      }
                      onClick={() => onNext()}
                    >
                      Next <img src={ico_next} alt="" />
                    </button>
                    {uploadImages.length === 0 && (
                      <p
                        className="note-skip note-skip-reponse"
                        onClick={() => onNext('skip1')}
                      >
                        Skip This Step
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    className="d-flex justify-content-center"
                    style={{ height: '10rem' }}
                  >
                    <div className="d-flex justify-content-center mt-5">
                      <CircularProgress className="loading-edit-iReader" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SecondOpinion
          handleStep={(e) => handleStep(e)}
          uploadFiles={uploadImages}
          setUploadFiles={setUploadImages}
          step={step}
          onPrevSteep={(value) => onPrevSteep(value)}
          requestHasData={requestHasData}
        />
      )}
    </div>
  );
}
