import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { pdfjs } from 'react-pdf';
import { HOST, REQUESTS_URI } from '../constant';
import Swal from 'sweetalert2'

import 'react-toastify/dist/ReactToastify.css';
import '../static/css/flash-record.css';
import '../static/css/user-profile.css';
import ico_bell from '../img/imi/alarm-bell-black.png';
import defaultAva from '../img/d_ava.png';
import { Button, Tooltip } from '@material-ui/core';
import FileUpload from '../components/upload/FileUpload2';
import { NavLink } from 'react-router-dom';
import {
  oldUploadFileApiCall,
  getPublicUrlApiCall,
} from '../apiCalls/file.api';
import {
  getRequestDetailApiCall
} from '../apiCalls/request.api';
import { updateRequestFiltered } from '../store/actions/request.action'
import { notify, toastId, notifyOcrStarting, isURL } from '../utils';
import { FIREBASE_REGISTRATION_TOKEN } from '../constant';
import { createRequest } from '../store/actions/request.action';
import DialogPdfPreview from '../components/dialog/dialogPdfPreview';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogOcrFilteredRaw from './../components/dialog/dialogOcrFilteredRaw';
import DialogOcrRawResult from './../components/dialog/dialogOcrRawResult';
import FlashRecord from './../pages/patientNew/flashRecord';

import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE, DOCTOR_ROLE } from '../constant';

import messaging from '../firebase';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const SmartRecordReaderPage = () => {
  const initialState = {
    request: {},
    comment: {
      commentType: null,
      title: null,
      description: null,
      link: null,
      fileType: null,
    },
    isOpenCommentBox: false,
    linkFileToOpen: null,
    fileTypeToOpen: null,
    questionIndex: -1,
    answerIndex: -1,
    isOpenAnswerBox: false,
    openedQuestions: [],
    isOpenOCR: false,
    currentOcr: null,
    isToolOpen: false,
    currentOcrImageType: 'pdf',
    isRequestDeleted: false,
  };
  const [isSubmit, setIsSubmit] = useState(false);

  const dispatch = useDispatch();
  const [uploadImages, setUploadImages] = useState([]);
  const [isRequestUploaded, setIsRequestUploaded] = useState(false);
  const [fileTestType, setFileTestType] = useState('bloodTest');
  const user = useSelector((state) => state.user);
  const [linkFileToOpen, setLinkFileToOpen] = useState(null);
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);
  const [isOpenModalOcrFilteredRaw, setIsOpenModalOcrFilteredRaw] = useState(null)
  const [isOpenModalOcrRawResult, setIsOpenModalOcrRawResult] = useState(null)
  const [ocrFilteredRaw, setOcrFilteredRaw] = useState([])
  const [dataChoose, setDataChoose] = useState([]);
  const [ocrCorrection, setOcrCorrection] = useState([]);
  const [ocrTextAnnotations, setOcrTextAnnotations] = useState(null)
  const [timeFilteredRaw, setTimeFilteredRaw] = useState(0)
  const { avatarUrl = defaultAva } = user;
  let count = 0

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

  const handleCloseOcrFiltered = () => {
    setIsOpenModalOcrFilteredRaw(false)
  }

  const handleCloseOcrRawResult = () => {
    setIsOpenModalOcrRawResult(false)
  }

  const handleOpenFilePreview = (link, type) => {
    if (link && type) {
      setLinkFileToOpen(link);
      setFileTypeToOpen(type);
    }
  };

  const handleReadFilePreview = (rawData) => { 
    if (rawData && rawData != "") { 
      setOcrTextAnnotations(rawData);
      setIsOpenModalOcrRawResult(true)
    }
  }

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

  const openModalOcrFilteredRaw = () => {
    setIsOpenModalOcrFilteredRaw(true)
  }

  const openModalOcrRawResult = (itemUrl) => {
    const data = {
      itemUrl,
      redirect: false,
    };

    getPublicUrlApiCall(data)
      .then((res) => {
        if (!res.data.code) {
          const { signedUrl, fileType } = res.data;
          fetch(signedUrl)
            .then(r => r.text())
            .then(text => {
              handleReadFilePreview(text)
            });
        }
      })
      .catch((e) => console.log(e)); 
  }
  const handleUpdateFilePreview = async (e) => {
    e.map(item => {
      if (item["isAdd"]){
        delete item.isAdd
      }
      return item
    });

    let bloodTestSend = dataChoose.bloodTest;
    bloodTestSend[0].ocrCorrection = e;
    await dispatch(updateRequestFiltered({
      id: user.requests[0]._id,
      bloodTest: bloodTestSend
    }))
    setLinkFileToOpen(null);
    setFileTypeToOpen(null);
  }

  const handleDownloadFilePreview = (e) => {
    window.open(`${HOST}${REQUESTS_URI}/downloadOcrJson/${dataChoose._id}`);
  }

  const handleAddNewIndicator = (e) => {
    let arrayTemp = ocrCorrection.concat();
    const newItem = {
      indicator: "",
      key: "",
      value: 0,
      isAdd: true
    }
    arrayTemp = [...arrayTemp, newItem]
    setOcrCorrection(arrayTemp);
  }

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

    oldUploadFileApiCall(uploadingData)
      .then((res) => {
        if (!res.data.code) {
          let currentFileType = res.data;
          const { fileUrl, fileName, originalFileName } = currentFileType;
          setUploadImages(
            uploadImages.concat([{ fileUrl, fileType, fileName, originalFileName }])
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

          const { fileUrl, fileName, originalFileName  } = currentFileType;

          setUploadImages(
            uploadImages.concat([{ fileUrl, fileType, fileName, originalFileName }])
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

  const onSubmit = async () => {
    setIsSubmit(true)
    if (uploadImages.length) {
      const dataToSubmit = {
        type: 5,
        isAutomatic: false,
        registrationToken: localStorage.getItem(FIREBASE_REGISTRATION_TOKEN),
        questions: [{ content: 'N/A' }],
        biopsy: [],
        radiology: [],
        bloodTest: []
      };
      dataToSubmit[fileTestType] = uploadImages;
      localStorage.setItem('dataUpload', JSON.stringify(dataToSubmit));
      await dispatch(createRequest(dataToSubmit));
      // notifyOcrStarting();
    } else
      toast.error('You need to upload at least 1 document', {
        className: 'error-toast-container',
        autoClose: 4000,
      });
  };

  const onResetFile = () => {
    setUploadImages([])
    window.location.reload()
  }

  const countTime = () => {
    if (isSubmit) {
      count++
      setTimeFilteredRaw(count)
      if (count === 2) {
        clearInterval(countTime)
        return count
      }
    }
  }

  // const editFilteredRaw = (editFilteredRaw) => { 
  //   console.log(editFilteredRaw);
  // }

  useEffect(() => {
    setOcrCorrection(ocrCorrection);
  }, [ocrCorrection])

  useEffect(() => {
    let isError = true
    if (user.requests && user.requests.length > 0 && isSubmit) {
     const dataTemp = setInterval(() => {
        getRequestDetailApiCall(user?.requests[0]._id).then((data) => {
          if(data?.data?.bloodTest[0].ocrDetect !== "Completed"){
            count = count + 1;
            if (count > 20){
              clearInterval(dataTemp)
              Swal.fire({
                icon: 'error',
                text: 'Can not read the file!',
              }).then((res) => {
                if (res.isConfirmed) {
                  setIsSubmit(false)
                  onResetFile()
                }
              })
            }
          }else {
            clearInterval(dataTemp)
            setIsSubmit(false)
            setDataChoose(data.data);
            setUploadImages(data.data.bloodTest);
            setOcrCorrection(data.data.bloodTest[0].ocrCorrection);
            setOcrFilteredRaw(data.data.bloodTest[0].ocrFilteredRaw)
            if (data.data.bloodTest[0].ocrFileUrl && data.data.bloodTest[0].ocrFilteredRaw.length > 0) { 
              setIsRequestUploaded(true);
              isError = false
              setIsSubmit(false)
            }
          }
        })
      }, 1000)
    }
  }, [user.requests]);

  return (
    <div className="patient-full-page appointment-new">
      <div className="topAppointment">
        <div className="leftTop">
          <h2>
            <span className="customSpan">Smart Record Reader</span>
          </h2>
        </div>
        <div className="rightTop">
          <a href="#!">
            <img src={ico_bell} alt="" />
            <span className="count">3</span>
          </a>
          <NavLink to='/update-profile' className="avatar">
            <img src={avatarUrl} alt="" />
          </NavLink>
        </div>
      </div>
      <FlashRecord/>
    </div>
  );
};
export default SmartRecordReaderPage;
