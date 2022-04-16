/* eslint-diasble (react/jsx-filename-extension) */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams, useHistory } from 'react-router-dom';

import { getTestResult } from '../../../store/actions/testResult.action';
import { getRequestDetailApiCall } from '../../../apiCalls/request.api';

import defaultAva from '@img/d_ava.png';
import img_answer from '@img/imi/img_answer.png';
import icon_adress from '@img/imi/icon-adress.png';
import ico_alarm_bell from '@img/imi/alarm-bell-blue.png';
import ico_search from '@img/imi/ico-search.png';
import ico_fullScreen from '@img/imi/full-screen-review.png';
import img_default from '@img/imi/ico-img-default.png';
import back from '@img/imi/back-result.png';
import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE } from '../../../constant';
import { isURL, convertToDiseaseName } from '../../../utils';
import { Document, Page } from 'react-pdf';

import InsertCommentIcon from '@material-ui/icons/InsertComment';
import { CircularProgress, Tooltip } from '@material-ui/core';

import '../../../static/css/test-result.css';

import DialogPdfPreview from '../../../components/dialog/dialogPdfPreview';

import { getPublicUrlApiCall } from '../../../apiCalls/file.api';

export default function AppointmentPage() {
  const params = useParams();
  const videoTagRef = React.useRef();
  const history = useHistory();
  const user = useSelector((state) => state.user);
  const testResult = useSelector((state) => state.testResult.data);
  const { avatarUrl = defaultAva, firstName } = user;
  const typeResult = params.type;
  const dispatch = useDispatch();
  const [dataDetail, setDataDetail] = useState(null);
  const [dataTestResultId, setDataTestResultId] = useState({});
  const testResultId = params.testResultId;
  const [dataTestResult, setDataTestResult] = useState();
  const [pageNumber] = useState(1);
  const [linkFileToOpen, setLinkFileToOpen] = useState(null);
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsLoadingDetected] = useState(false);
  const [, setNumPages] = useState(null);
  const [dataTestResultConvert, setDataTestResultConvert] = useState();
  const [showDetaiDoctor, setShowDetailDoctor] = useState(true);
  const [typeReview, setTypeReview] = useState();
  const [resultAnotherDoc, setResultAnotherDoc] = useState();
  const [resultVideo, setResultVideo] = useState();
  const [resultBloodTest, setResultBloodTest] = useState();
  const [statusRequest, setStatusRequest] = useState();
  const [dataShowName, setDataShowName] = useState();
  const [duplicateArt, setDuplicateArt] = useState();
  const [duplicateNor, setDuplicateNor] = useState();
  let dataShowFile = [];
  const level = [
    {
      text: 'Low',
      value: 'Low',
    },
    {
      text: 'Normal',
      value: 'Normal',
    },
    {
      text: 'High',
      value: 'High',
    },
  ];
  useEffect(() => {
    if (testResultId) {
      getRequestDetailApiCall(testResultId)
        .then((result) => {
          setDataTestResultId(result.data);
        })
        .catch(() => {
          // FIXME:
        });
    } else {
      dispatch(getTestResult());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const dataResultTemp = testResultId ? dataTestResultId : testResult;
    setDataTestResult(dataResultTemp);
    const lengthBloodTest = dataResultTemp?.bloodTest
      ? dataResultTemp.bloodTest?.length
      : 0;
    const lengthOcrJson = dataResultTemp?.bloodTest
      ? dataResultTemp.bloodTest[0]?.ocrCorrection?.length
      : 0;
    if (lengthBloodTest > 0 && lengthOcrJson > 0) {
      let dataTemp = dataResultTemp.bloodTest[0].ocrCorrection[0];
      if (dataTestResultConvert && dataTestResultConvert['art']) {
        dataTemp = dataTestResultConvert['art'][0];
      } else if (dataTestResultConvert && dataTestResultConvert['normal']) {
        dataTemp = dataTestResultConvert['normal'][0];
      }
      if (dataTemp) {
        dataTemp.index = 0;
        if (
          (dataTemp.level && dataTemp.level.toLowerCase() === 'normal') ||
          !dataTemp.level
        ) {
          dataTemp.type = 'normal';
        }

        if (
          dataTemp.level &&
          (dataTemp.level.toLowerCase() === 'high' ||
            dataTemp.level.toLowerCase() === 'low')
        ) {
          dataTemp.type = 'art';
        }
        setDataDetail(dataTemp);
      }
    }

    if (dataTestResultId.bloodTest && typeResult !== 5 && typeResult !== 6) {
      handleReviewType(dataTestResultId.type);
      dataShowFile[0] = dataTestResultId.bloodTest;
      dataShowFile[1] = dataTestResultId.video;
      dataShowFile[2] = dataTestResultId.anotherDocuments;
      setDataShowName(dataShowFile);
      handleShowBloodTest(dataShowFile);
      handleShowVideo(dataShowFile);
      handleShowAnotherFile(dataShowFile);
      handleConvertStatus(dataTestResultId.status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testResult, dataTestResultId, dataTestResultConvert]);

  useEffect(() => {
    if (dataTestResult) {
      const lengthBloodTest = dataTestResult.bloodTest
        ? dataTestResult.bloodTest.length
        : 0;
      if (
        lengthBloodTest > 0 &&
        dataTestResult.bloodTest[0].ocrDetect === 'Completed'
      ) {
        const dataBloodTest = dataTestResult.bloodTest[0].ocrCorrection;
        const dataTemp = dataBloodTest.reduce((arr, obj, index) => {
          obj.indexField = index + 1;
          const key = obj?.level || '';
          if (key.toLowerCase() === 'normal' || key.length === 0)
            (arr['normal'] = arr['normal'] || []).push(obj);
          if (key.toLowerCase() === 'low' || key.toLowerCase() === 'high')
            (arr['art'] = arr['art'] || []).push(obj);
          return arr;
        }, {});
        setDataTestResultConvert(dataTemp);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTestResult]);

  useEffect(() => {
    if (dataTestResultConvert && typeResult === 6) {
      hasDuplicatesArt(dataTestResultConvert);
    }
    if (statusRequest) {
      if (statusRequest === 'Draft') {
        history.push(`/opinion/${testResultId}`);
      } else if (statusRequest === 'Completed') {
        history.push(`/iDoctor-result/${testResultId}`);
      }
    }
  }, [dataTestResultConvert, statusRequest]);

  const hasDuplicatesArt = (arr) => {
    let arrNameArt = [],
      arrNameNor = [];
    arr['art'].map((item) => arrNameArt.push(item.key));
    arr['normal'].map((item) => arrNameNor.push(item.key));
    let findDuplicates = (arr) =>
      arr.filter((item, index) => arr.indexOf(item) !== index);
    setDuplicateArt(findDuplicates(arrNameArt));
    setDuplicateNor(findDuplicates(arrNameNor));
  };

  const handleReviewType = (typeRequest) => {
    setTypeReview(convertToDiseaseName(typeRequest));
  };

  let fileModeToOpen;
  if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;

  const isOpenFile =
    isURL(linkFileToOpen) &&
    fileModeToOpen &&
    [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);

  const showDetailRequest = (data, index, type) => {
    data.index = index;
    data.type = type;
    const lengthBloodTest = dataTestResult.bloodTest
      ? dataTestResult.bloodTest.length
      : 0;
    dataTestResult.bloodTest[0].ocrCorrection.forEach((element) => {
      data.isShow = false;
    });
    data.isShow = !data.isShow;
    setDataDetail(data);
  };

  const convertNumber = (dataDetailConvert) => {
    if (!dataDetailConvert.high && dataDetailConvert.value !== 0) {
      return {
        left: '50%',
      };
    } else {
      let rangeValue = dataDetailConvert.high - dataDetailConvert.low;
      let valuetemp = dataDetailConvert.value - dataDetailConvert.low;
      const percentNumber = (valuetemp * 100) / rangeValue;
      let data = Math.ceil(percentNumber);
      if (dataDetailConvert.value === 0) {
        data = -50;
      } else if (data > 100) {
        data = 150;
      } else if (data < -50) {
        data = -40;
      }
      return {
        left: data + '%',
      };
    }
  };

  const openCloudPublicUrl = (itemUrl, redirect, isLoadingDetected) => {
    if (isLoadingDetected) {
      setIsLoadingDetected(true);
    } else {
      setIsLoading(true);
    }
    const data = {
      itemUrl,
      redirect: redirect,
    };

    getPublicUrlApiCall(data)
      .then((res) => {
        if (!res.data.code) {
          const { signedUrl, fileType } = res.data;
          handleOpenFilePreview(signedUrl, fileType);
          setIsLoadingDetected(false);
          setIsLoading(false);
        }
      })
      .catch((e) => console.log(e));
  };

  const handleOpenDialogPDF = (item) => {
    handleOpenFilePreview(item.signedUrl, item.fileType);
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
  const detailRequestIDoctor = () => {
    setShowDetailDoctor(false);
  };
  const onBack = () => {
    if (statusRequest !== 'Completed') {
      history.goBack();
    } else {
      setShowDetailDoctor(true);
    }
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleShowBloodTest = (data) => {
    let dataTemp = [];
    if (data[0].length > 0) {
      data[0].forEach((ele) => {
        getPublicUrlApiCall({ itemUrl: ele.fileUrl, redirect: false }).then(
          (res) => {
            dataTemp.push(res.data);
            setResultBloodTest([...dataTemp]);
          }
        );
      });
    }
  };

  const handleShowVideo = (data) => {
    let dataTemp = [];
    if (data[1][0] !== null) {
      data[1].forEach((ele) => {
        getPublicUrlApiCall({ itemUrl: ele.fileUrl, redirect: false }).then(
          (res) => {
            dataTemp.push(res.data);
            setResultVideo([...dataTemp]);
          }
        );
      });
    }
  };
  const handleShowAnotherFile = (data) => {
    let dataTemp = [];
    if (data[2].length > 0) {
      data[2].forEach((ele) => {
        getPublicUrlApiCall({ itemUrl: ele.fileUrl, redirect: false }).then(
          (res) => {
            dataTemp.push(res.data);
            setResultAnotherDoc([...dataTemp]);
          }
        );
      });
    }
  };
  const handleConvertStatus = (status) => {
    switch (status) {
      case 0:
        setStatusRequest('Pending');
        break;
      case 1:
        setStatusRequest('Approved');
        break;
      case 5:
        setStatusRequest('Draft');
        break;

      default:
        setStatusRequest('Completed');
        break;
    }
  };

  const convertFloat = (data) => {
    return Number.parseFloat(data).toFixed(1);
  };

  const isNumber = (n) => {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  };

  return (
    <div className="appointment-new">
      <div className="topAppointment">
        <div className="leftTop">
          <h2 className="color-appoiment-h2">
            <NavLink to="/">
              <span>Home</span>
            </NavLink>
            <NavLink to="/all-file-test-result">
              <span style={{ color: '#2f80ed' }}>Test results</span>
            </NavLink>
            {typeResult === '5'
              ? 'Smart result'
              : typeResult === '6'
              ? 'iReader result'
              : !statusRequest
              ? null
              : statusRequest === 'Completed'
              ? 'iDoctor result'
              : 'iDoctor Summary'}
          </h2>
        </div>
        <div className="rightTop">
          <div className="icon-search">
            <img src={ico_search} alt="" />
          </div>
          <a href="#!" className="mr-2 ml-2">
            <img src={ico_alarm_bell} alt="" />
            <span className="count">3</span>
          </a>
          <a href="#!" className="avatar">
            <img src={avatarUrl} alt="" />
          </a>
        </div>
      </div>
      {typeResult === '5' || typeResult === '6' ? (
        <div
          className="patient-rest-result"
          style={{ padding: '30px 50px 30px 79px' }}
        >
          <span className="title name" style={{ marginTop: '1.5rem' }}>
            Test results
          </span>
          {dataTestResult &&
            dataTestResult.bloodTest &&
            dataTestResult.bloodTest[0].ocrDetect === 'Completed' &&
            dataTestResult?.bloodTest[0].ocrCorrection.length === 0 && (
              <div className="text-center mt-5 w-100">
                <InsertCommentIcon className="icon-file" />
                <span>
                  We can’t analyze your blood test at the moment. Our staff will
                  reach out to you soon.
                </span>
              </div>
            )}

          {dataTestResult &&
            dataTestResult.bloodTest &&
            dataTestResult.bloodTest[0].ocrDetect === 'Processing' && (
              <div className="text-center mt-5 w-100">
                <InsertCommentIcon className="icon-file" />
                <span>
                  We are processing your data, please check back later.
                </span>
              </div>
            )}
          <div className="left">
            <div className="list-question mt-3">
              <div>
                <div
                  style={{ paddingTop: '1.3rem' }}
                  className="mr-test-result"
                >
                  {((dataTestResultConvert && dataTestResultConvert['art']) ||
                    (dataTestResultConvert &&
                      dataTestResultConvert['normal'])) && (
                    <button
                      className="gradient-blue btn-image p-2 pl-3 m-0 d-flex align-items-center"
                      id="show-image"
                      disabled={isLoading}
                      onClick={() =>
                        openCloudPublicUrl(
                          dataTestResult.bloodTest[0].fileUrl,
                          false
                        )
                      }
                    >
                      {isLoading && (
                        <CircularProgress
                          color="white"
                          className="icon-loadding mr-2"
                        />
                      )}
                      <span>Image Blood Test</span>
                    </button>
                  )}
                  {/* <button className="gradient-blue p-2 m-0 d-flex justify-content-center align-items-center mt-2"
                  id="show-image"
                  disabled={isLoading}
                  onClick={() => openCloudPublicUrl(dataTestResult.bloodTest[0].ocrFileUrl, false, true)}>
                  {
                    isLoadingDetected && <CircularProgress color="primary" className="icon-loadding mr-2"/>
                  }
                  <span>Annotated Results</span>
                </button> */}
                  {dataTestResultConvert && dataTestResultConvert['art'] && (
                    <div className="art-rick mt-2">
                      <div className="title-level">
                        <span className="pl-3">At risk</span>
                      </div>
                      {dataTestResultConvert['art'].map((item, index) => {
                        return (
                          <div key={index}>
                            <div
                              onClick={() =>
                                showDetailRequest(item, index, 'art')
                              }
                              className={
                                dataDetail &&
                                index === dataDetail.index &&
                                dataDetail.type === 'art'
                                  ? 'active-result item-result d-flex'
                                  : 'item-result d-flex'
                              }
                              style={
                                duplicateArt && duplicateArt.includes(item.key)
                                  ? { backgroundColor: '#FFC7CE' }
                                  : null
                              }
                            >
                              <div className="question">
                                <p>{item.indexField}</p>
                              </div>
                              <span className="question-content-result">
                                <p
                                  style={
                                    duplicateArt &&
                                    duplicateArt.includes(item.key)
                                      ? { color: 'red' }
                                      : null
                                  }
                                >
                                  {item.key}:{' '}
                                  {isNumber(item.value) &&
                                    item.value.toFixed(1)}
                                </p>
                                <span>
                                  {item.original_name !== item.indicator && (
                                    <span className="mb-2 d-block">
                                      Original name: {item.original_name}
                                    </span>
                                  )}
                                </span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {dataTestResultConvert && dataTestResultConvert['normal'] && (
                    <div className="normal mt-3">
                      <div className="title-normal">
                        <span className="pl-3">Normal</span>
                      </div>
                      {dataTestResultConvert['normal'].map((item, index) => {
                        return (
                          <div key={index}>
                            <div
                              onClick={() =>
                                showDetailRequest(item, index, 'normal')
                              }
                              className={
                                dataDetail &&
                                index === dataDetail.index &&
                                dataDetail.type === 'normal'
                                  ? 'active-result item-result d-flex'
                                  : 'item-result d-flex'
                              }
                              style={
                                duplicateNor && duplicateNor.includes(item.key)
                                  ? { backgroundColor: '#FFC7CE' }
                                  : null
                              }
                            >
                              <div className="question">
                                <p>{item.indexField}</p>
                              </div>
                              <span className="question-content-result">
                                <p
                                  style={
                                    duplicateNor &&
                                    duplicateNor.includes(item.key)
                                      ? { color: 'red' }
                                      : null
                                  }
                                >
                                  {item.key}:{' '}
                                  {isNumber(item.value) &&
                                    item.value.toFixed(1)}
                                </p>
                                <span>
                                  {item.key !== item.original_name &&
                                    item.original_name && (
                                      <span className="mb-2 d-block">
                                        Original name: {item.original_name}
                                      </span>
                                    )}
                                </span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {dataDetail && (
            <div className="right content-result question-right">
              <div className="d-flex">
                <div
                  className={
                    dataDetail.type === 'normal'
                      ? 'normal show-question mr-4'
                      : 'show-question mr-4'
                  }
                >
                  <p>{dataDetail.index + 1}</p>
                </div>
                <span className="title-question">
                  {dataDetail.key}: {dataDetail.value}
                </span>
              </div>
              <div className="level mb-5">
                <ul
                  className={
                    dataDetail.type === 'art' ? 'art-rick mb-5' : 'normal mb-5'
                  }
                >
                  {level.map((item, index) => {
                    return (
                      <li
                        className={
                          dataDetail.level &&
                          item.value.toLowerCase() ===
                            dataDetail?.level.toLowerCase()
                            ? 'active'
                            : ''
                        }
                        key={index}
                      >
                        <p className="center-text">{item.text}</p>
                      </li>
                    );
                  })}
                </ul>
                <div className="sidebar">
                  <div className="sidebar-content"></div>
                  <div className="sidebar-scroll">
                    <div className="sidebar-scroll-main">
                      <div
                        className="icon-result"
                        style={convertNumber(dataDetail)}
                      >
                        <img src={icon_adress} />
                        <span>
                          {isNumber(dataDetail.value) &&
                            dataDetail.value.toFixed(1)}
                        </span>
                      </div>
                      <span className="sidebar-scroll-min">
                        {convertFloat(dataDetail.low)}
                      </span>
                      <span className="sidebar-scroll-max">
                        {convertFloat(dataDetail.high)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="problem">
                <p>{dataDetail.description}</p>
                {dataDetail.level &&
                  dataDetail.level.toLowerCase() !== 'normal' && (
                    <div style={{ whiteSpace: 'break-spaces' }}>
                      <div style={{ fontSize: '1rem' }}>
                        - Diagnosis: Your {dataDetail.key} level is{' '}
                        {dataDetail.level}
                      </div>
                      {dataDetail.level.toLowerCase() !== 'normal' && (
                        <div style={{ fontSize: '1rem' }}>
                          - What does it mean: {dataDetail.explanation}
                        </div>
                      )}
                    </div>
                  )}
                {/* {
                dataDetail && dataDetail.glossary.level && dataDetail.glossary.level.toLowerCase() !== 'Normal' && (
                  <div>
                    <img src={ico_gan} alt="" />
                    <img src={ico_heart} alt="" /> 
                  </div>  
                )
              }            */}
              </div>
              {/* <div className="form-group-answer">
                <textarea
                  rows="4"
                  placeholder="Hi, I think you need to do..."
                  className="form-control"
                ></textarea>
                <img src={img_answer} alt='' />
              </div> */}
            </div>
          )}
        </div>
      ) : !dataTestResult || !statusRequest ? (
        <div
          className="d-flex justify-content-center"
          style={{ height: '10rem' }}
        >
          <div className="d-flex justify-content-center mt-5">
            <CircularProgress className="loading-edit-iReader" />
          </div>
        </div>
      ) : (
        <div>
          {statusRequest === 'Completed' && showDetaiDoctor ? (
            <div className="iDoctor">
              <h2>Good morning, {firstName}</h2>
              <div className="result-idoctor">
                <div className="review-idoctor">
                  <div className="detail-review">
                    <div className="border-background"></div>
                    <div className="padding-detail">
                      <p> Dear {firstName}! </p>
                      <p>
                        Thank you for seeking health advice from us. Below
                        please find our general impression of your overall
                        health and our answers to your specific questions. We
                        have also made some comments that you can implement to
                        your health.
                      </p>
                      <h4 style={{ marginTop: '1.75rem' }}>
                        Greneral Impression
                      </h4>
                      <span>{dataTestResultId?.impression}</span>
                      <h4 style={{ marginTop: '0.9rem' }}>
                        Answer to Patient’s questions
                      </h4>
                      {dataTestResultId.questions && (
                        <>
                          <span style={{ marginTop: '1.5rem' }}>
                            1. {dataTestResultId?.questions[0]?.content}
                          </span>
                          <span>
                            {
                              dataTestResultId?.questions[0]?.answers[0]
                                ?.content
                            }
                          </span>
                        </>
                      )}
                      <h4>Doctor’s Recommendation</h4>
                      {dataTestResultId.comments &&
                        dataTestResultId.comments.map((item) => {
                          return <span>{item.description}</span>;
                        })}
                    </div>
                  </div>
                  <p style={{ marginTop: '2.05rem' }}>
                    You can review your request
                    <span
                      style={{
                        fontWeight: 'bold',
                        color: '#2F80ED',
                        cursor: 'pointer',
                      }}
                      onClick={detailRequestIDoctor}
                    >
                      {` here `}
                    </span>
                    !
                  </p>
                </div>
                <div className="detail-idoctor">
                  <p>Doctor’s info</p>
                  <span style={{ fontWeight: 'bold', display: 'block' }}>
                    {dataTestResultId?.reviewers &&
                      dataTestResultId?.reviewers[0]?.firstName}
                    {` `}
                    {dataTestResultId?.reviewers &&
                      dataTestResultId?.reviewers[0]?.lastName}
                  </span>
                  <span style={{ display: 'block' }}>
                    Major in gastrointestinal
                  </span>
                  <div className="w-100">
                    <img className="w-100" src={img_answer} alt="" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="show-detail-doctor">
              <div className="record-opinion">
                <div
                  className="step3"
                  style={{ margin: '0px', justifyContent: 'unset' }}
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
                        iDoctor Summary
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
                          className="custom-style-status-iDoctor"
                          style={
                            statusRequest === 'Approved'
                              ? { color: '#F7931E' }
                              : statusRequest === 'Pending'
                              ? { color: 'rgb(40, 194, 165)' }
                              : { color: '#2F80ED' }
                          }
                        >
                          {statusRequest}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="left-header-review-iDoctor">
                        Type of your concern:
                        <p style={{ color: '#4F4F4F', marginBottom: 'unset' }}>
                          {' '}
                          {typeReview}
                        </p>
                      </div>
                      <p
                        className="title-upload-review"
                        style={{ marginTop: '2.3rem' }}
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
                        <div
                          className="question-opinion"
                          style={{ height: '23.75rem' }}
                        >
                          <textarea
                            value={
                              dataTestResultId.questions &&
                              dataTestResultId.questions[0]?.content
                            }
                          />
                        </div>
                        <div
                          style={{
                            justifyContent: 'center',
                            marginTop: '2.5rem',
                          }}
                          className="web"
                        >
                          <div className="form-group d-flex justify-content-center">
                            <button
                              className="btn btn-blue-submit"
                              onClick={onBack}
                            >
                              <img
                                style={{ position: 'unset' }}
                                src={back}
                                alt=""
                              />
                              Back
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="result-iDoctor-right">
                    <div>
                      <div>
                        {resultBloodTest?.length > 0 ? (
                          <>
                            <p className="title-list-review-iDoctor">
                              Your Blood test
                            </p>
                            <div className="list-item-review">
                              {resultBloodTest.map((item, idx) => (
                                <div className="mr-3">
                                  <div>
                                    <div className="item-pic-upload-review mt-3">
                                      <div className="img-upload">
                                        {item ? (
                                          item.fileType !==
                                          'application/pdf' ? (
                                            <img
                                              className="upload-success"
                                              src={item.signedUrl}
                                              alt=""
                                            />
                                          ) : (
                                            <div className="upload-success upload-success-pdfpreview">
                                              <Document
                                                file={item.signedUrl}
                                                onLoadSuccess={
                                                  onDocumentLoadSuccess
                                                }
                                              >
                                                <Page pageNumber={pageNumber} />
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
                                        {dataShowName[0].map((item, index) => {
                                          if (idx === index) {
                                            return (
                                              <Tooltip
                                                title={item.fileName}
                                                arrow
                                              >
                                                <p className="name-file cursor-pointer">
                                                  {item.fileName}
                                                </p>
                                              </Tooltip>
                                            );
                                          } else {
                                            return;
                                          }
                                        })}
                                        <div
                                          className="d-flex justify-content-center align-items-center"
                                          onClick={() =>
                                            handleOpenDialogPDF(item)
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
                          </>
                        ) : null}
                        {resultVideo?.length > 0 ? (
                          <>
                            <p className="title-list-review-iDoctor">
                              Your iRecord video
                            </p>
                            <div className="list-item-review">
                              <div className="mr-3">
                                <div className="item-pic-upload-review mt-3">
                                  <div className="video-upload">
                                    <video
                                      width="100%"
                                      height="100%"
                                      className="video-upload"
                                      autoPlay={false}
                                      controls
                                      src={resultVideo[0].signedUrl}
                                      ref={videoTagRef}
                                    ></video>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                        {resultAnotherDoc?.length > 0 ? (
                          <>
                            <p className="title-list-review-iDoctor">
                              Your other documents
                            </p>
                            <div className="list-item-review">
                              {resultAnotherDoc.map((item, idx) => (
                                <div className="mr-3">
                                  <div>
                                    <div className="item-pic-upload-review mt-3">
                                      <div className="img-upload">
                                        {item ? (
                                          item.fileType !==
                                          'application/pdf' ? (
                                            <img
                                              className="upload-success"
                                              src={item.signedUrl}
                                              alt=""
                                            />
                                          ) : (
                                            <div className="upload-success upload-success-pdfpreview">
                                              <Document
                                                file={item.signedUrl}
                                                onLoadSuccess={
                                                  onDocumentLoadSuccess
                                                }
                                              >
                                                <Page pageNumber={pageNumber} />
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
                                        {dataShowName[2].map((item, index) => {
                                          if (idx === index) {
                                            return (
                                              <Tooltip
                                                title={item.fileName}
                                                arrow
                                              >
                                                <p className="name-file cursor-pointer">
                                                  {item.fileName}
                                                </p>
                                              </Tooltip>
                                            );
                                          } else {
                                            return;
                                          }
                                        })}
                                        <div
                                          className="d-flex justify-content-center align-items-center"
                                          onClick={() =>
                                            handleOpenDialogPDF(item)
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
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{ justifyContent: 'center', marginTop: '2.5rem' }}
                    className="mobile"
                  >
                    <div className="form-group d-flex justify-content-center">
                      <button className="btn btn-blue-submit" onClick={onBack}>
                        <img style={{ position: 'unset' }} src={back} alt="" />
                        Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <DialogPdfPreview
        fileModeToOpen={fileModeToOpen}
        isOpenFile={isOpenFile}
        file={linkFileToOpen}
        handleCloseFilePreview={(e) => handleCloseFilePreview(e)}
      />
    </div>
  );
}
