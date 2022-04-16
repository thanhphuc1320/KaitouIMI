import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import {
  uploadMultiple,
  convertToDiseaseName,
  convertToTitle,
} from '../../../utils';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import img_default from '@img/imi/ico-img-default.png';
// import img_default from '@img/imi/ico-img-default.png';
import ico_remove from '@img/imi/ico-remove.png';
import ico_check from '@img/imi/ico-check-green.png';
import ico_video from '@img/imi/ico-video-record.png';
import ico_record from '@img/imi/record-icon-idoctor.png';
import ico_stopRecord from '@img/imi/icon-stop.png';
import ico_fullScreen from '@img/imi/full-screen-review.png';
import ico_playVideo from '@img/imi/play-video.png';
import video_loading from '@img/Countdown.mp4';
import ico_patient from '@img/imi/ico-patient.png';
import { Button } from '@stories/Button/Button';
import { useHistory } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';
import { Document, Page } from 'react-pdf';
import {
  oldUploadFileApiCall,
  getPublicUrlApiCall,
} from '../../../apiCalls/file.api';

import { uploadAudioFile } from '@apis/file';
import { getRequestDetailApiCall } from '../../../apiCalls/request.api';
import { getTextRecordApi } from '../../../apiCalls/textRecord.api';
import { isURL } from '../../../utils';
import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE } from '../../../constant';
import DialogSkip from 'components/dialog/dialogSkip';
import DialogPdfPreview from 'components/dialog/dialogPdfPreview';
import {
  createRequest,
  updateRequestFiltered,
} from '../../../store/actions/request.action';
import ico_next from '../../../img/imi/icon-next.png';

let mediaLocalRecorder;
let audioRecorder;
let local_stream = null;
let mediaLocalRecordedBlobs = [];
let audioRecorderBlob = [];
let screen = window.screen;

/****************    Name Step    ********************/
// 1: 'Record Video',
// 2: 'Submit Other Documents',
// 3: 'Ask Question',
// 4: 'Review Request'
/*****************************************************/

export default function SecondOpinion({
  uploadFiles,
  setUploadFiles,
  handleStep,
  step,
  onPrevSteep,
  requestHasData,
}) {
  const user = useSelector((state) => state.user) || {};

  const dataCreateRequest =
    useSelector((state) => state.request.createRequest) || null;
  const dataRequest = useSelector((state) => state.request) || null;
  const dispatch = useDispatch();
  const history = useHistory();
  const selectItemStyle = { whiteSpace: 'preWrap' };
  const [isSubmit, setIsSubmit] = useState(false);
  const [uploadImages] = useState(uploadFiles);
  const [fileTestType] = useState('bloodTest');
  const [listFile, setListFile] = useState([]);
  const [selectType, setSelectType] = useState(1);
  const [questions, setQuestions] = useState('');
  // const [, setSubmitDone] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [, setNumPages] = useState(null);
  const [pageNumber] = useState(1);
  /**********************Video*************************************/

  const [open, setOpen] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTitleRecord, setIsTitleRecord] = useState(convertToTitle(5));
  const [timeRecord, setTimeRecord] = useState(30);
  const [checkTimeBar, setCheckTimeBar] = useState(30);
  const [dataRecordSubmit, setDataRecordSubmit] = useState();
  const [stopClick, setStopClick] = useState(false);
  const [isEndRecording, setIsEndRecording] = useState(false);
  const [isIntervelTime, setIsIntervelTime] = useState(false);
  const [timeOut2, setTimeOut2] = useState();
  const [timeOut3, setTimeOut3] = useState();
  const [timeTracks, setTimeTracks] = useState();
  const [timeBarVideo, setTimeBarVideo] = useState(0);
  const [thumbnail, setThumbnail] = useState();
  const [widthBar, setWidthBar] = useState(20);
  const [reviewVideo, setReViewVideo] = useState();
  const [nextStep3, setNextStep3] = useState(false);
  const [isReviewVideo, setIsReviewVideo] = useState(false);
  const [fileLanguage, setFileLanguage] = useState('English');
  const [isSubmitRecord, setIsSubmitRecord] = useState(false);
  const [optionVideo, setOptionVideo] = useState(false);
  const [dataTranscriptText, setDataTranscriptText] = useState();
  const [checkAnalyzeTranscript, setCheckAnalyzeTranscript] = useState(false);
  const [skipStep2HasRequest, setSkipStep2HasRequest] = useState(false);
  const [catchErrorVideo, setCatchErrorVideo] = useState(false);

  /*******************************************************************/
  const [typeReview, setTypeReview] = useState(convertToDiseaseName(1));
  const [linkFileToOpen, setLinkFileToOpen] = useState(null);
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);
  const [requestHasId, setRequestHasId] = useState();

  // const [isOpenVideo, setIsOpenVideo] = useState(false);

  let checkStop = false;
  let count = 30;
  let intervelTime;
  let time2;
  let time3;
  let timeTrack;
  let intervelCheckDetail;
  let countCheck = 0;
  let nameTranscript = '';

  const videoTagRef = useRef(null);
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  let toastId = null;
  // const notify = () =>
  //   (toastId = toast('Uploading File..', {
  //     className: 'toast-container',
  //     autoClose: 3000,
  //   }));

  // const notifyOcrStarting = () =>
  //   (toastId = toast(`Processing OCR, we'll notify you when it's ready`, {
  //     className: 'toast-container',
  //     autoClose: 2500,
  //   }));
  const validateDataToSubmit = () => {
    if (!questions.length) {
      toast.error('Please write a question', {
        className: 'error-toast-container',
        autoClose: 2000,
      });
      return null;
    }
    // if (uploadImages.length === 0) {
    //   toast.error('Please Upload your supporting Scanned documents', {
    //     className: 'error-toast-container',
    //     autoClose: 1500,
    //   });
    //   return null;
    // }
    const dataCreateRequest = {
      id: requestHasData ? requestHasData._id : requestHasId,
      type: selectType,
      questions: [{ content: questions || ' ' }],
      isAutomatic: false,
      bloodTest: uploadImages,
      video: [dataRecordSubmit],
      anotherDocuments: [],
      status: 0,
    };
    listFile.forEach((e) => {
      if (e.statusUpload) {
        delete e.statusUpload;
      }
    });
    dataCreateRequest.anotherDocuments = listFile;
    return dataCreateRequest;
  };

  const handleInputChange = (e) => {
    const { files } = e.target || [];
    const listPromise = [];
    if (files.length >= 1) {
      let countFile = listFile.length + files.length;
      if (countFile > 5) {
        toast.error('You can not upload more than 5 pictures file', {
          className: 'error-toast-container',
          autoClose: 2000,
        });
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
            setListFile([...listFile, ...dataUpload]);
            Promise.all(listPromise)
              .then((resDataPublic) => {
                resDataPublic.map((item, index) => {
                  let dataTemp = [...dataUpload];
                  if (!dataTemp[index].statusUpload) {
                    dataTemp[index].publicFileUrl = item.publicFileUrl;
                    dataTemp[index].statusUpload = true;
                    dataTemp[index].fileType = item.fileType;
                    dataTemp[index].fileUrl = item.fileUrl;
                    setListFile([...listFile, ...dataTemp]);
                  }
                });
              })
              .catch((e) => console.log(e));
          }
        }
      }
    }
  };
  const onSubmit = () => {
    const dataToSubmit = validateDataToSubmit();
    if (dataToSubmit) {
      dispatch(updateRequestFiltered(dataToSubmit));
      // notifyOcrStarting();
      setActiveTab(3);
      setIsSubmit(true);
      handleStep(100);
    }
    onPrevSteep('submit');
  };
  const onBack = () => {
    history.push('/');
  };
  const onRemoveFile = (index) => {
    setListFile([...listFile.slice(0, index), ...listFile.slice(index + 1)]);
  };
  const handleSelectionChange = (event, index, value) => {
    setSelectType(value);
    handleReviewType(value);
  };

  const handleReviewType = (value) => {
    setTypeReview(convertToDiseaseName(value));
  };

  useEffect(() => {
    if (isRecording) {
      processBarRecord(3.33 * (30 - checkTimeBar), 100);
      setTimeBarVideo(3.33 * (30 - checkTimeBar));
    } else {
      setCheckTimeBar(30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkTimeBar, isRecording]);

  // useEffect(() => {
  //   setSubmitDone(true);
  //   if (selectType) {
  //     handleReviewType();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectType, isSubmit]);

  useEffect(() => {
    if (step === 'step2' || step === 'step1') {
      setActiveTab(1);
      if (open && (!requestHasData || requestHasData.video.length === 0)) {
        setUpLocalVideo();
      }
    }
    if (step === 'step3') {
      setActiveTab(2);
    }
  }, [step]);

  useEffect(() => {
    if (localStream) {
      return function cleanup() {
        const tracks = localStream.getTracks();
        tracks.forEach((ele) => {
          ele.stop();
        });
      };
    }
  }, [localStream]);

  useEffect(() => {
    (async () => {
      if (requestHasData) {
        if (requestHasData.video[0]?.fileUrl) {
          const { fileUrl } = requestHasData.video[0];
          await getPublicUrlApiCall({
            itemUrl: fileUrl,
            redirect: false,
          }).then((res) => {
            setReViewVideo(res.data.signedUrl);
            setDataRecordSubmit({ ...res.data, fileUrl });
          });
          takePhoto();
          setOptionVideo(true);
          setOpen(false);
          clearTimeout(timeTracks);
          setIsRecording(false);
          setTimeout(() => {
            setNextStep3(true);
          }, 2000);
          setTimeRecord(30);
          checkStop = true;
          clearInterval(isIntervelTime);
          setIsEndRecording(true);
          handleChangeTitle(false);
          setCheckAnalyzeTranscript(true);

          setIsTitleRecord(convertToTitle(1));
        } else {
          setSkipStep2HasRequest(true);
          setOptionVideo(true);
          setUpLocalVideo();
        }

        if (requestHasData.video[1]?.transcriptURI) {
          let data = requestHasData.video[1]?.transcriptURI;
          handleGetDataTranscript(data);
        }

        if (requestHasData.anotherDocuments.length > 0) {
          let arrAnotherTemp = [];
          for (let i = 0; i < requestHasData.anotherDocuments.length; i++) {
            const item = requestHasData.anotherDocuments[i];
            let newItem = await getPublicUrlApiCall({
              itemUrl: item.fileUrl,
              redirect: false,
            });
            if (!newItem.data.code) {
              item.publicFileUrl = newItem.data.signedUrl;
              item.fileType = newItem.data.fileType;
              item.statusUpload = true;
            }
            arrAnotherTemp.push(item);
          }
          let dataListFileTemp = { ...listFile };
          dataListFileTemp = [...arrAnotherTemp];
          setListFile(dataListFileTemp);
        }

        if (requestHasData.questions[0]?.content) {
          setQuestions(requestHasData.questions[0]?.content);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (dataRequest) {
      let catchIdRequest = dataRequest.patientRequests.length - 1;
      let choseData = dataRequest.patientRequests[catchIdRequest]._id;
      setRequestHasId(choseData);
    }
  }, [dataRequest]);

  useEffect(() => {
    if (dataRecordSubmit && isSubmitRecord) {
      const updateRequestInStep2 = {
        id: requestHasData ? requestHasData._id : requestHasId,
        bloodTest: uploadImages,
        video: [dataRecordSubmit],
        anotherDocuments: listFile,
      };
      dispatch(updateRequestFiltered(updateRequestInStep2));
      handleCheckDetailRequest();
      setIsSubmitRecord(false);
    }
  }, [dataRecordSubmit, isSubmitRecord]);

  const handleCheckDetailRequest = () => {
    let id = requestHasData ? requestHasData._id : requestHasId;
    intervelCheckDetail = setInterval(() => {
      countCheck = countCheck + 1;
      if (countCheck > 5) {
        countCheck = 0;
        nameTranscript = '';
        setCheckAnalyzeTranscript(true);
        clearInterval(intervelCheckDetail);
      } else {
        getRequestDetailApiCall(id).then((res) => {
          if (
            res.data.video[1]?.transcriptURI &&
            res.data.video[1]?.transcriptURI !== nameTranscript
          ) {
            let data = res.data.video[1]?.transcriptURI;
            handleGetDataTranscript(data);
            countCheck = 0;
            clearInterval(intervelCheckDetail);
          }
        });
      }
    }, 5000);
  };

  const handleGetDataTranscript = (data) => {
    nameTranscript = data;
    getTextRecordApi(data).then((res) => {
      setDataTranscriptText(res.data);
      setCheckAnalyzeTranscript(true);
    });
  };

  const handleTranscript = async (dataTranscript) => {
    await uploadAudioFile(dataTranscript);
  };

  const onNextStep3 = (check) => {
    if (check === 'skip2') {
      onPrevSteep('skip2');
      if (!nextStep3) {
        const tracks = localStream.getTracks();
        tracks.forEach((ele) => {
          ele.stop();
        });
      }
    } else if (check === 3) {
      setOpen(false);
      onPrevSteep(3);
    } else if (
      check === 'skip2HasRequest' &&
      (stopClick || skipStep2HasRequest)
    ) {
      onPrevSteep('skip2');
      const tracks = localStream.getTracks();
      tracks.forEach((ele) => {
        ele.stop();
      });
    }
    setActiveTab(2);
    handleStep(65);
  };
  const onNextStep4 = (check) => {
    if (check === 'skip3') {
      onPrevSteep('skip3');
    }
    const updateRequestInStep3 = {
      id: requestHasData ? requestHasData._id : requestHasId,
      bloodTest: uploadImages,
      video: [dataRecordSubmit],
      anotherDocuments: listFile,
    };
    dispatch(updateRequestFiltered(updateRequestInStep3));
    setActiveTab(3);
    handleStep(68);
  };

  const setUpLocalVideo = async () => {
    try {
      if (videoTagRef.current) {
        const opts = { audio: true, video: { width: 1280, height: 720 } };
        local_stream = await navigator.mediaDevices.getUserMedia(opts);
        videoTagRef.current.srcObject = local_stream;
        videoTagRef.current.onloadedmetadata = function (e) {
          videoTagRef.current.play();
        };
        setLocalStream(local_stream);
      } else {
        setNextStep3(true);
        setCatchErrorVideo(true);
        alert('Please enable your media devices!as');
      }
    } catch (error) {
      setNextStep3(true);
      setCatchErrorVideo(true);
      alert('Please enable your media devices!as');
      throw error;
    }
  };

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const openDialog = () => {
    setIsOpenDialog(true);
  };

  const handleClose = () => {
    setIsOpenDialog(false);
  };

  const onShowPopUp = () => {
    openDialog();
  };

  const onBackStep = () => {
    onPrevSteep(1);
    handleClose();
  };

  const handleReview = () => {
    if (!questions.length) {
      toast.error('Please write a question', {
        className: 'error-toast-container',
        autoClose: 2000,
      });
    } else {
      const updateRequestInStep3 = {
        id: requestHasData ? requestHasData._id : requestHasId,
        bloodTest: uploadImages,
        video: [dataRecordSubmit],
        anotherDocuments: listFile,
        questions: [{ content: questions || ' ' }],
      };
      dispatch(updateRequestFiltered(updateRequestInStep3));
      setActiveTab(4);
      handleStep(68);
    }
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const convertAudioForTranscript = (localStreams) => {
    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();
    let stream = localStreams;
    ctx.createMediaStreamSource(stream).connect(dest);
    return dest.stream;
  };

  const setupLocalStream = async () => {
    try {
      setOpen(true);
      const getTracks = localStream.getTracks();
      timeTrack = setTimeout(() => {
        takePhoto();
        setStopClick(true);
        getTracks.forEach((ele) => {
          ele.stop();
        });
        setOpen(false);
        setIsRecording(false);
        setIsEndRecording(true);
        setOptionVideo(false);
        setTimeout(() => {
          setNextStep3(true);
        }, 2000);
        audioRecorder.stop();
        handleChangeTitle(false);
        mediaLocalRecorder.onstop = () => {
          const record = new Blob(mediaLocalRecordedBlobs, {
            type: 'video/webm',
          });
          const recordAudio = new Blob(audioRecorderBlob, {
            type: 'audio/mp3',
          });
          let file = [],
            files = [];
          file = new File([record], 'record.webm', { type: 'video/webm' });
          files[0] = new File([recordAudio], 'record.mp3', {
            type: 'audio/mp3',
          });
          const data = {
            file,
            patientId: user._id,
            fileName: file.name,
            fileTestType: 'video/webm',
          };
          const dataTranscript = {
            requestId: requestHasData ? requestHasData._id : requestHasId,
            files,
            text_language_code: fileLanguage,
          };
          handleTranscript(dataTranscript);
          sendDataRecord(data);
          setCheckAnalyzeTranscript(false);
          mediaLocalRecordedBlobs = [];
          audioRecorderBlob = [];
        };
      }, 30000);
      setTimeTracks(timeTrack);
    } catch (error) {
      alert('Please enable your media devices!qqq');
      throw error;
    }
  };

  const handleOnOpenRecord = async (value) => {
    handleChangeTitle(true);
    setIsRecording(true);
    setNextStep3(false);
    setDataTranscriptText('');
    setupLocalStream();
    handleChangeTimeRecord();

    let options = { mimeType: 'video/webm' };
    mediaLocalRecorder = new MediaRecorder(localStream, options);
    mediaLocalRecorder.ondataavailable = (e) =>
      mediaLocalRecordedBlobs.push(e.data);
    mediaLocalRecorder.start();

    audioRecorder = new MediaRecorder(convertAudioForTranscript(localStream), {
      mimeType: 'audio/webm',
    });
    audioRecorder.ondataavailable = (evt) => audioRecorderBlob.push(evt.data);
    audioRecorder.start();
  };

  const handleOnStopRecord = (value) => {
    setStopClick(true);
    takePhoto();
    setOpen(false);
    clearTimeout(timeTracks);
    setIsRecording(false);
    setOptionVideo(false);
    setTimeout(() => {
      setNextStep3(true);
    }, 2000);
    setTimeRecord(30);
    checkStop = true;
    clearInterval(isIntervelTime);
    setIsEndRecording(true);
    handleChangeTitle(false);
    setIsTitleRecord(convertToTitle(1));
    audioRecorder.stop();
    mediaLocalRecorder.stop();
    const tracks = localStream.getTracks();
    tracks.forEach((ele) => {
      ele.stop();
    });
    mediaLocalRecorder.onstop = async () => {
      const record = new Blob(mediaLocalRecordedBlobs, { type: 'video/webm' });
      const recordAudio = new Blob(audioRecorderBlob, { type: 'audio/mp3' });
      let file = [],
        files = [];
      file = new File([record], 'record.webm', { type: 'video/webm' });
      files[0] = new File([recordAudio], 'record.mp3', { type: 'audio/mp3' });
      const data = {
        file,
        patientId: user._id,
        fileName: file.name,
        fileTestType: 'video/webm',
      };
      const dataTranscript = {
        requestId: requestHasData ? requestHasData._id : requestHasId,
        files,
        text_language_code: fileLanguage,
      };
      handleTranscript(dataTranscript);
      sendDataRecord(data);
      setCheckAnalyzeTranscript(false);
      mediaLocalRecordedBlobs = [];
      audioRecorderBlob = [];
    };
    processBarRecord(100, 10);
  };
  const handleChangeTitle = (check) => {
    if (check) {
      setIsTitleRecord(convertToTitle(2));
      time2 = setTimeout(() => {
        setIsTitleRecord(convertToTitle(3));
      }, 10000);
      setTimeOut2(time2);
      time3 = setTimeout(() => {
        setIsTitleRecord(convertToTitle(4));
      }, 15000);
      setTimeOut3(time3);
    } else {
      clearTimeout(timeOut2);
      clearTimeout(timeOut3);
      setIsTitleRecord(convertToTitle(1));
    }
  };
  const handleChangeTimeRecord = () => {
    intervelTime = setInterval(() => {
      if (count > 0 && !checkStop) {
        count = count - 1;
        setTimeRecord(count);
        setCheckTimeBar(count);
      } else {
        count = 30;
        setTimeRecord(30);
        setIsTitleRecord(convertToTitle(1));
        clearInterval(intervelTime);
      }
      setIsIntervelTime(intervelTime);
    }, 1000);
  };

  const handleReplay = () => {
    setUpLocalVideo();
    setIsReviewVideo(false);
    setOpen(true);
    setTimeBarVideo(0);
    mediaLocalRecordedBlobs = [];
    setIsEndRecording(false);
    setIsRecording(false);
    count = 30;
    setIsTitleRecord(convertToTitle(5));
  };

  const sendDataRecord = (data) => {
    if (data) {
      oldUploadFileApiCall(data).then((res) => {
        const { fileUrl } = res.data;
        getPublicUrlApiCall({ itemUrl: fileUrl, redirect: false }).then(
          (resDataPublic) => {
            setReViewVideo(resDataPublic.data.signedUrl);
            setDataRecordSubmit({ ...resDataPublic.data, fileUrl });
            setIsSubmitRecord(true);
          }
        );
      });
    }
  };
  const processBarRecord = (value, count) => {
    const elem = document.getElementById('videoBar');
    var width = timeBarVideo;
    var id = setInterval(frame, count);
    function frame() {
      if (width >= value) {
        clearInterval(id);
      } else {
        width++;
        elem.style.width = width + '%';
      }
    }
    setTimeBarVideo(value);
  };

  const takePhoto = () => {
    const video = videoTagRef?.current;
    let canvas = document.createElement('canvas');
    canvas.width = video?.videoWidth;
    canvas.height = video?.videoHeight;
    let context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setThumbnail(canvas.toDataURL());
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
    if (listFile.length > 0 && activeTab === 2) {
      let elem = document.getElementsByClassName('uploadBar');
      const elemImg = document.getElementsByClassName('default-img');
      listFile.forEach((e, index) => {
        if (!e.statusUpload && elem) {
          handleLoadFile(95, index, elem, 1);
        } else if (e.statusUpload && elem) {
          elemImg[index].style.display = 'none';
          handleLoadFile(100, index, elem, 1);
        }
      });
    }
  }, [listFile, activeTab]);

  let fileModeToOpen;
  if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;

  const isOpenFile =
    isURL(linkFileToOpen) &&
    fileModeToOpen &&
    [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);

  const handleOnReview = () => {
    setOpen(true);
    setIsReviewVideo(true);
  };

  const handleFileLanguageChange = (event, index, value) => {
    setFileLanguage(value);
  };

  const handleFullScreen = (item) => {
    handleOpenFilePreview(item.publicFileUrl, item.fileType);
  };

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

  return (
    <div className="appointment-new appointment-new-height">
      {activeTab !== 1 && activeTab !== 2 && activeTab !== 4 ? (
        <div>
          {!isSubmit ? (
            <div className="content-opinion" style={{ textAlign: 'unset' }}>
              <div>
                <div className="second-opinion">
                  <div className="left-opinion">
                    <p>Please tell us what concerns you?</p>
                    <div className="form-group mt-4">
                      <SelectField
                        defaultValue={1}
                        menuItemStyle={selectItemStyle}
                        className="form-control"
                        value={selectType}
                        onChange={handleSelectionChange}
                      >
                        <MenuItem value={1} primaryText="Cancer" />
                        <MenuItem value={2} primaryText="General" />
                        <MenuItem value={3} primaryText="Liver" />
                        <MenuItem value={4} primaryText="Diabetes" />
                      </SelectField>
                    </div>
                    <p>
                      Please be as detailed as possible so our doctors have the
                      best understanding of your conditions.
                    </p>
                    <div className="question-opinion">
                      <textarea
                        value={questions}
                        placeholder="You can type your question"
                        onChange={(e) => setQuestions(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group mb-3 mt-5 d-flex justify-content-center">
                  <Button
                    style={{
                      margin: '0px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    className="btn btn-blue-submit font-weight-bold"
                    onClick={() => handleReview()}
                    label="Review"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="submit-opinion-succsess">
              <div>
                <p>Your iDoctor request has been accepted</p>
                <div className="form-group text-center">
                  <div className="btn-backToHome-iDoctor">
                    <Button
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      className="btn btn-blue-submit"
                      onClick={() => onBack()}
                      label="Back to Home"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ height: '100%' }}>
          {activeTab === 1 && (
            <div className="start-idoctor" style={{ height: '100%' }}>
              <div
                className="content-opinion"
                style={{
                  marginTop: '1.3rem',
                  marginLeft: '-4px',
                  height: '100%',
                  flexDirection: 'column',
                }}
              >
                <div style={{ marginTop: '5.6rem' }}>
                  <div className="group-title-iRecoder">
                    <p
                      className="title-upload"
                      style={{ marginBottom: '24px' }}
                    >
                      iRecorder
                    </p>
                  </div>
                  <p className="title-sup">{isTitleRecord}</p>
                  <div
                    className={
                      screen.width === 425
                        ? isRecording || isEndRecording
                          ? 'video-record-mobile'
                          : 'before-record'
                        : 'video-record'
                    }
                  >
                    <div style={{ width: '100%' }}>
                      {open ? (
                        isReviewVideo ? (
                          <video
                            style={{ borderRadius: '32px 32px 0px 0px' }}
                            width="100%"
                            height="100%"
                            autoPlay={true}
                            src={reviewVideo}
                            controls
                          ></video>
                        ) : (
                          <video
                            style={{ borderRadius: '32px 32px 0px 0px' }}
                            width="100%"
                            height="100%"
                            autoPlay={true}
                            ref={videoTagRef}
                            muted
                          ></video>
                        )
                      ) : requestHasData && !stopClick ? (
                        <video
                          style={{ borderRadius: '32px 32px 0px 0px' }}
                          width="100%"
                          height="100%"
                          autoPlay={true}
                          src={reviewVideo}
                          ref={videoTagRef}
                          controls
                        ></video>
                      ) : (
                        <div
                          style={{
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <img
                            src={isEndRecording ? ico_playVideo : null}
                            style={{ position: 'absolute', cursor: 'pointer' }}
                            onClick={handleOnReview}
                          ></img>
                          <img
                            style={{ borderRadius: '32px 32px 0px 0px' }}
                            src={
                              thumbnail && isEndRecording
                                ? thumbnail
                                : ico_video
                            }
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="progressVideo"
                    style={{ marginBottom: '2.25rem' }}
                  >
                    {isRecording || !isEndRecording ? (
                      <div id="videoBar" style={{ width: '0%' }}></div>
                    ) : (
                      <div id="videoBar" style={{ width: '100%' }}></div>
                    )}
                  </div>
                  {
                    <>
                      <div
                        style={
                          screen.width < 426
                            ? { marginBottom: '25px', flexDirection: 'column' }
                            : { marginBottom: '25px' }
                        }
                        className="d-flex justify-content-center container-action-record-iDoctor"
                      >
                        <div className="d-flex justify-content-center">
                          {isEndRecording ? (
                            <div
                              className="record-again-css"
                              onClick={handleReplay}
                            >
                              {' '}
                              Record video again?{' '}
                            </div>
                          ) : !isRecording ? (
                            <button
                              style={{ border: 'none' }}
                              onClick={(value) => handleOnOpenRecord(value)}
                              disabled={catchErrorVideo}
                            >
                              <img src={ico_record} />
                            </button>
                          ) : (
                            <button
                              style={{ border: 'none' }}
                              onClick={(value) => handleOnStopRecord(value)}
                            >
                              <img src={ico_stopRecord} />
                            </button>
                          )}
                          {!isEndRecording ? (
                            <div
                              className="d-flex custom-time-record"
                              style={{ marginTop: '10px' }}
                            >
                              {timeRecord}:00
                            </div>
                          ) : null}
                        </div>
                        <SelectField
                          value={fileLanguage}
                          onChange={handleFileLanguageChange}
                          className="select-field"
                          style={{ marginLeft: '2rem' }}
                        >
                          <MenuItem value="English" primaryText="English" />
                          <MenuItem
                            value="Vietnamese"
                            primaryText="Vietnamese"
                          />
                        </SelectField>
                      </div>
                      <div className="form-group text-center group-button-iRecoder">
                        <button
                          disabled={!nextStep3 ? true : false}
                          className={
                            nextStep3
                              ? 'btn btn-blue-submit'
                              : 'btn btn-gray-next'
                          }
                          onClick={() => onNextStep3(3)}
                        >
                          Next{' '}
                          <img
                            style={{ position: 'unset' }}
                            src={ico_next}
                            alt=""
                          />
                        </button>
                        {requestHasData && optionVideo && !isRecording ? (
                          <p
                            className="note-skip"
                            onClick={() => onNextStep3('skip2HasRequest')}
                          >
                            Skip This Step
                          </p>
                        ) : !isRecording && !stopClick && !requestHasData ? (
                          <p
                            className="note-skip"
                            onClick={() => onNextStep3('skip2')}
                          >
                            Skip This Step
                          </p>
                        ) : null}
                      </div>
                    </>
                  }
                </div>
                {!checkAnalyzeTranscript && isEndRecording ? (
                  // <div style={{ width: '10rem', height: '10rem' }}>
                  //   <video
                  //     width="100%"
                  //     height="100%"
                  //     autoPlay={true}
                  //     src={video_loading}
                  //   />
                  // </div>
                  <div>Processing your speech recognition</div>
                ) : (!dataTranscriptText && isEndRecording) ||
                  (!dataTranscriptText && requestHasData) ? (
                  <div>
                    We can’t analyze your recorder at the moment. Our staff will
                    reach out to you soon.
                  </div>
                ) : (
                  <div className="text-patient">
                    <p className="name-right">
                      <span className="pr-2">
                        <img src={ico_patient} alt="" />
                      </span>
                      Patient
                    </p>
                    <div className="description">
                      <p>{dataTranscriptText && dataTranscriptText}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 2 && (
            <div className={listFile.length === 0 ? 'start-idoctor' : ''}>
              <div className="record-opinion">
                <div
                  className="step3 "
                  style={
                    listFile.length > 0
                      ? { margin: '0px', justifyContent: 'unset' }
                      : { margin: '0px' }
                  }
                >
                  <div
                    className={listFile?.length !== 0 ? 'left' : ''}
                    style={listFile.length > 0 ? { marginTop: '2.1rem' } : {}}
                  >
                    <div
                      className={`${
                        listFile?.length !== 0 ? 'f-left' : 'margin-Top'
                      }`}
                    >
                      <p
                        className={`${
                          listFile.length === 0
                            ? 'position-text step3-mobile'
                            : 'position-no-file'
                        } title-upload`}
                      >
                        Do you want to upload other documents?
                      </p>
                      <div className="step2">
                        <div
                          className={
                            listFile.length > 0
                              ? 'form-group'
                              : 'form-group text-center'
                          }
                          style={{ height: '64px', marginBottom: '1.25rem' }}
                        >
                          <input
                            accept={
                              'file_extension,image/*,application/pdf' ||
                              'file_extension|audio/*|image/*|media_type' ||
                              'video/mp4'
                            }
                            id={`outlined-button-file-image`}
                            type="file"
                            multiple
                            onChange={(e) => handleInputChange(e)}
                            style={{ display: 'none' }}
                            onClick={(e) => (e.target.value = null)}
                            disabled={false}
                          />
                          <label
                            htmlFor={`outlined-button-file-image`}
                            className="upload-mobile"
                          >
                            <Button
                              style={
                                listFile.length > 0
                                  ? {
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }
                                  : {
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      margin: 'auto',
                                    }
                              }
                              className="btn btn-upload"
                              label="Upload"
                            />
                          </label>
                        </div>
                        <div
                          className={`${
                            listFile.length > 0
                              ? 'title-upload-left'
                              : 'title-upload-center'
                          } title-upload-other`}
                        >
                          <p
                            className={`${
                              listFile.length > 0 ? 'text-upload-note' : ''
                            } note-upload `}
                          >
                            Other documents like xray, doctor note, other
                            medical record
                          </p>
                        </div>
                      </div>
                      <div
                        className={`${
                          listFile.length > 0 ? 'mt-37vh web' : 'mt-27vh web'
                        }`}
                      >
                        <div
                          className={
                            listFile.length > 0
                              ? ''
                              : 'form-group d-flex justify-content-center'
                          }
                        >
                          <button
                            style={{ bottom: '2rem', paddingTop: '5px' }}
                            disabled={listFile.length > 0 ? false : true}
                            className={
                              listFile.length > 0
                                ? 'btn btn-blue-submit'
                                : 'btn btn-gray-next'
                            }
                            onClick={() => onNextStep4()}
                          >
                            Next
                            <img
                              style={{ position: 'unset' }}
                              src={ico_next}
                              alt=""
                            />
                          </button>
                        </div>
                        {listFile.length === 0 &&
                          uploadImages.length === 0 &&
                          !dataRecordSubmit?.fileUrl && (
                            <p
                              style={{ marginLeft: '5px', marginTop: '33px' }}
                              className="note-skip"
                              onClick={() => onShowPopUp()}
                            >
                              Skip This Step
                            </p>
                          )}
                        {listFile.length === 0 &&
                          (uploadImages.length > 0 ||
                            dataRecordSubmit?.fileUrl) && (
                            <p
                              style={{ marginLeft: '5px', marginTop: '33px' }}
                              className="note-skip"
                              onClick={() => onNextStep4('skip3')}
                            >
                              Skip This Step
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                  {listFile.length > 0 && (
                    <div className="right">
                      <div className="list-pic-upload scroll-pic d-block-list">
                        {listFile?.length > 0 &&
                          listFile.map((item, idx) => (
                            <div className="mr-3" key={idx}>
                              <div style={{ float: 'right' }}>
                                <div className="item-pic-upload mt-3">
                                  <div className="img-upload">
                                    {item &&
                                      item.publicFileUrl &&
                                      (item.fileType !== 'application/pdf' ? (
                                        <img
                                          className="upload-success"
                                          src={item.publicFileUrl}
                                          alt=""
                                        />
                                      ) : (
                                        <div className="upload-success upload-success-pdfpreview">
                                          <Document
                                            file={item.publicFileUrl}
                                            onLoadSuccess={
                                              onDocumentLoadSuccess
                                            }
                                          >
                                            <Page pageNumber={pageNumber} />
                                          </Document>
                                        </div>
                                      ))}
                                    <div className="default-img">
                                      <img
                                        className=""
                                        src={img_default}
                                        alt=""
                                      />
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
                          ))}
                      </div>
                    </div>
                  )}
                  <div className="mobile mt-5">
                    <div className="form-group d-flex justify-content-center">
                      <button
                        style={{ bottom: '2rem', paddingTop: '5px' }}
                        disabled={listFile.length > 0 ? false : true}
                        className={
                          listFile.length > 0
                            ? 'btn btn-blue-submit'
                            : 'btn btn-gray-next'
                        }
                        onClick={() => onNextStep4()}
                      >
                        Next
                        <img
                          style={{ position: 'unset' }}
                          src={ico_next}
                          alt=""
                        />
                      </button>
                    </div>
                    {listFile.length === 0 &&
                      uploadImages.length === 0 &&
                      !dataRecordSubmit?.fileUrl && (
                        <p
                          style={{ marginLeft: '5px', marginTop: '1.65rem' }}
                          className="note-skip"
                          onClick={() => onShowPopUp()}
                        >
                          Skip This Step
                        </p>
                      )}
                    {listFile.length === 0 &&
                      (uploadImages.length > 0 ||
                        dataRecordSubmit?.fileUrl) && (
                        <p
                          style={{ marginLeft: '5px', marginTop: '1.65rem' }}
                          className="note-skip"
                          onClick={() => onNextStep4('skip3')}
                        >
                          Skip This Step
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <div className="record-opinion">
                <div
                  className="step3"
                  style={
                    listFile.length > 0
                      ? { margin: '0px', justifyContent: 'unset' }
                      : { margin: '0px' }
                  }
                >
                  <div className="detail-left-iDoctor">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '1.4rem',
                      }}
                    >
                      <p
                        style={{
                          fontWeight: '700',
                          fontSize: '1.2rem',
                          color: '#4F4F4F',
                        }}
                      >
                        Summary
                      </p>
                      <div className="d-flex">
                        <p
                          style={{
                            fontWeight: '700',
                            fontSize: '1.2rem',
                            color: '#979797',
                          }}
                        >
                          Status:{' '}
                        </p>
                        <p
                          style={{
                            fontWeight: '700',
                            fontSize: '1.2rem',
                            color: '#F7931E',
                          }}
                        >
                          Pending
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="left-header-review-iDoctor">
                        Type of your concern:
                        <p style={{ color: '#4F4F4F', marginBottom: 'unset' }}>
                          {typeReview}
                        </p>
                      </div>
                      <p
                        className="title-upload-review"
                        style={
                          listFile.length === 0
                            ? { marginLeft: '6px' }
                            : { marginLeft: '0px' }
                        }
                      >
                        Detailed of your conditions.
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          flexDirection: 'column',
                        }}
                      >
                        <div className="question-opinion">
                          <textarea value={questions} />
                        </div>
                        <div
                          style={{
                            justifyContent: 'center',
                            marginTop: '2.5rem',
                          }}
                          className="web"
                        >
                          <div className="form-group d-flex justify-content-center">
                            <Button
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              className="btn btn-blue-submit"
                              onClick={() => onSubmit()}
                              label="Submit"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(listFile.length > 0 ||
                    uploadImages.length > 0 ||
                    dataRecordSubmit?.fileUrl) && (
                    <div className="result-iDoctor-right">
                      <div>
                        {uploadImages.length > 0 && (
                          <div>
                            <p className="title-list-review-iDoctor">
                              Your Blood test
                            </p>
                            <div className="list-item-review">
                              {uploadImages?.length > 0 &&
                                uploadImages.map((item, idx) => (
                                  <div className="mr-3" key={idx}>
                                    <div>
                                      <div className="item-pic-upload-review mt-3">
                                        <div className="img-upload">
                                          {item ? (
                                            item.fileType !==
                                            'application/pdf' ? (
                                              <img
                                                className="upload-success"
                                                src={item.publicFileUrl}
                                                alt=""
                                              />
                                            ) : (
                                              <div className="upload-success upload-success-pdfpreview">
                                                <Document
                                                  file={item.publicFileUrl}
                                                  onLoadSuccess={
                                                    onDocumentLoadSuccess
                                                  }
                                                >
                                                  <Page
                                                    pageNumber={pageNumber}
                                                  />
                                                </Document>
                                              </div>
                                            )
                                          ) : (
                                            <div>
                                              <img
                                                className=""
                                                src={img_default}
                                                alt=""
                                              />
                                            </div>
                                          )}
                                        </div>
                                        <div className="detail-img-upload">
                                          <Tooltip title={item.fileName} arrow>
                                            <p className="name-file cursor-pointer">
                                              {item.fileName}
                                            </p>
                                          </Tooltip>
                                          <div
                                            className="cursor-pointer"
                                            onClick={() =>
                                              handleFullScreen(item)
                                            }
                                          >
                                            <div>
                                              <img
                                                className="cursor-pointer icon-remove"
                                                src={ico_fullScreen}
                                                alt=""
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                        {dataRecordSubmit?.fileUrl && (
                          <div>
                            <p className="title-list-review-iDoctor">
                              Your iRecord video
                            </p>
                            <div className="list-item-review">
                              {dataRecordSubmit?.fileUrl && (
                                <div className="mr-3">
                                  <div className="item-pic-upload-review mt-3">
                                    <div className="video-upload">
                                      <video
                                        width="100%"
                                        height="100%"
                                        className="video-upload"
                                        autoPlay={false}
                                        controls
                                        src={reviewVideo}
                                      ></video>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {listFile.length > 0 && (
                          <div>
                            <p className="title-list-review-iDoctor">
                              Your other documents
                            </p>
                            <div className="list-item-review">
                              {listFile?.length > 0 &&
                                listFile.map((item, idx) => (
                                  <div className="mr-3" key={idx}>
                                    <div>
                                      <div className="item-pic-upload-review mt-3">
                                        <div className="img-upload">
                                          {item ? (
                                            item.fileType !==
                                            'application/pdf' ? (
                                              <img
                                                className="upload-success"
                                                src={item.publicFileUrl}
                                                alt=""
                                              />
                                            ) : (
                                              <div className="upload-success upload-success-pdfpreview">
                                                <Document
                                                  file={item.publicFileUrl}
                                                  onLoadSuccess={
                                                    onDocumentLoadSuccess
                                                  }
                                                >
                                                  <Page
                                                    pageNumber={pageNumber}
                                                  />
                                                </Document>
                                              </div>
                                            )
                                          ) : (
                                            <div>
                                              <img
                                                className=""
                                                src={img_default}
                                                alt=""
                                              />
                                            </div>
                                          )}
                                        </div>
                                        <div className="detail-img-upload">
                                          <Tooltip title={item.fileName} arrow>
                                            <p className="name-file cursor-pointer">
                                              {item.fileName}{' '}
                                            </p>
                                          </Tooltip>
                                          <div
                                            className="d-flex justify-content-center align-items-center cursor-pointer"
                                            onClick={() =>
                                              handleFullScreen(item)
                                            }
                                          >
                                            <div>
                                              <img
                                                className="cursor-pointer icon-remove"
                                                src={ico_fullScreen}
                                                alt=""
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div
                    style={{ justifyContent: 'center', marginTop: '2.5rem' }}
                    className="mobile"
                  >
                    <div className="form-group d-flex justify-content-center">
                      <Button
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        className="btn btn-blue-submit"
                        onClick={() => onSubmit()}
                        label="Submit"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <DialogSkip
        isOpenFile={isOpenDialog}
        handleClose={(e) => handleClose(e)}
        onBackStep={(e) => onBackStep(e)}
      />
      <DialogPdfPreview
        fileModeToOpen={fileModeToOpen}
        isOpenFile={isOpenFile}
        file={linkFileToOpen}
        handleCloseFilePreview={(e) => handleCloseFilePreview(e)}
      />
    </div>
  );
}
