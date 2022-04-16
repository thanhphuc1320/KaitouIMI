import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import { Button } from '@stories/Button/Button';
import '../../../static/css/result-patient.css';

/*********************** import api *********************************************/
import { getRequestDetailApiCall } from '../../../apiCalls/request.api';
import { getPublicUrlApiCall } from '../../../apiCalls/file.api';

/*********************** import api *********************************************/

/*********************** import image *********************************************/
import logo from '@img/logo_result.png';
import doctor_title from '@img/imi/result_patient/doctor-report.png';
import doctor_bg from '@img/imi/result_patient/bg-doctor-report.png';
import circle from '@img/imi/result_patient/Ellipse.png';
import dot from '@img/imi/result_patient/Dot.png';
import rectangle from '@img/imi/result_patient/Rectangle.png';
import line from '@img/imi/result_patient/line.png';
import defaultAva from '@img/d_ava.png';
import doctor1 from '@img/imi/result_patient/doctor_1.png';
import doctor2 from '@img/imi/result_patient/doctor_2.png';
import doctor3 from '@img/imi/result_patient/doctor_3.png';
/*********************** import image *********************************************/

/*********************** import other *********************************************/
import DialogPdfPreview from '../../../components/dialog/dialogPdfPreview';
import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE } from '../../../constant';
import { isURL } from '../../../utils';
import moment from 'moment';
/*********************** import other *********************************************/

const IDoctorResult = () => {
  const history = useHistory();
  const params = useParams();
  const videoRef = useRef(null);

  const screen = window.screen.width;
  const testResultId = params.testResultId;

  const [dataResult, setDataResult] = useState();

  const [dataTestResultConvert, setDataTestResultConvert] = useState();
  const [dataDetail, setDataDetail] = useState();
  const [duplicateArt, setDuplicateArt] = useState();
  const [duplicateNor, setDuplicateNor] = useState();
  const [, setIsLoadingDetected] = useState(false);
  const [linkFileToOpen, setLinkFileToOpen] = useState(null);
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultVideo, setResultVideo] = useState();

  useEffect(() => {
    async function getAPI() {
      await getRequestDetailApiCall(testResultId)
        .then((result) => {
          setDataResult(result.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getAPI();
  }, []);

  useEffect(() => {
    if (dataResult) {
      const lengthBloodTest = dataResult.bloodTest
        ? dataResult.bloodTest?.length
        : 0;
      if (
        lengthBloodTest > 0 &&
        dataResult.bloodTest[0].ocrDetect === 'Completed'
      ) {
        const dataBloodTest = dataResult.bloodTest[0].ocrCorrection;
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
        hasDuplicatesArt(dataTemp);
        handleShowVideo(dataResult);
      }
    }
  }, [dataResult]);

  useEffect(() => {
    if (dataTestResultConvert) {
      const lengthBloodTest = dataResult?.bloodTest
        ? dataResult.bloodTest?.length
        : 0;
      if (lengthBloodTest > 0) {
        let dataTemp = dataResult.bloodTest[0].ocrCorrection[0];
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
    }
  }, [dataTestResultConvert]);

  const hasDuplicatesArt = (arr) => {
    let arrNameArt = [],
      arrNameNor = [];
    if (arr['art']) {
      arr['art'].map((item) => arrNameArt.push(item.key));
    }
    if (arr['normal']) {
      arr['normal'].map((item) => arrNameNor.push(item.key));
    }
    let findDuplicates = (arr) =>
      arr.filter((item, index) => arr.indexOf(item) !== index);
    setDuplicateArt(findDuplicates(arrNameArt));
    setDuplicateNor(findDuplicates(arrNameNor));
  };

  const handleShowVideo = (data) => {
    let dataTemp = [];
    if (data.video[0] !== null) {
      getPublicUrlApiCall({
        itemUrl: data.video[0]?.fileUrl,
        redirect: false,
      }).then((res) => {
        dataTemp.push(res.data);
        setResultVideo([...dataTemp]);
      });
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

  let fileModeToOpen;
  if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;

  const isOpenFile =
    isURL(linkFileToOpen) &&
    fileModeToOpen &&
    [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);

  const isNumber = (n) => {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  };

  const isBack = () => {
    history.push('/all-file-test-result');
  };

  const handlePlayVideo = () => {
    videoRef.current.play();
  };

  return (
    <div className="new-test-result-container">
      <div className="header-iDoctor-result">
        <div className="btn-back-result-page">
          <Button color="primary1" size="back" onClick={isBack} />
        </div>
        <div className="contain-logo-result">
          <img src={logo} />
        </div>
      </div>
      <div className="body-iDoctor-result">
        <div className="contain-title-body-iDoctor-result">
          <div className="body-title-result">
            <div className="title-circle-iDoctor-result">
              <img src={circle} />
            </div>
            <div className="body-title-iDoctor-result">
              <div className="doctor_title">
                <img src={doctor_bg} />
                <img style={{ left: '13%' }} src={doctor_title} />
              </div>
            </div>
          </div>

          <div className="contain-title-iDoctor-result">
            <div className="title-recommendation-top">
              <div className="recommendation-title-line">
                <img src={dot} />
                <img
                  src={line}
                  style={screen < 425 ? { width: '50%' } : null}
                />
                <img src={dot} />
              </div>
              <div className="custom-text-title text-title-iDoctor-result-body-blue">
                iDoctor Recommendation
              </div>
              <div className="recommendation-title-line">
                <img src={dot} />
                <img style={{ width: '70%' }} src={line} />
                <img src={dot} />
              </div>
            </div>
            <div className="title-recommendation-bottom">
              <div className="date-title-bottom">
                Test Result on{' '}
                {moment(dataResult?.createdAt).format('DD.MM.YY')}
              </div>
              <div className="text-title-bottom text-title-iReader-result-body">
                Issued by : Dr.{dataResult?.reviewers[0]?.lastName}
              </div>
            </div>
            <img
              style={{ position: 'absolute', bottom: '1%', right: '20%' }}
              src={rectangle}
            />
          </div>
        </div>

        <div className="contain-profile-doctor-iDoctor-result">
          <div className="profile-doctor-iDoctor">
            <div className="title-profile-doctor">
              <img src={circle} />
              <div
                className="custom-text-title title-profile-text"
                style={{ fontSize: '36px' }}
              >
                Doctor
              </div>
            </div>
            <div className="profile-avatar-iDoctor">
              <div className="text-profile-avatar">Pr</div>
              <div className="profile-avatar-image">
                <img
                  src={
                    dataResult?.reviewers[0]?.avatarUrl
                      ? dataResult?.reviewers[0]?.avatarUrl
                      : defaultAva
                  }
                />
              </div>
              <div className="text-profile-avatar">file</div>
            </div>
            <div className="custom-text-title profile-avatar-doctor-name">
              Dr.{dataResult?.reviewers[0]?.lastName}
              <img src={rectangle} />
            </div>
          </div>
          <div className="context-doctor-iDoctor">
            <div className="bg-contain-text">
              <div style={{ overflowY: 'scroll', height: '100%' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
            </div>
          </div>
        </div>

        <div className="test-result-analysis">
          <div className="test-result-good-news">
            <div className="title-result-analysis">
              <p
                className="custom-text-title text-title-iReader-result-body-blue"
                style={{ fontSize: '40px' }}
              >
                Your Blood Test Analysis
              </p>
              <div>
                <span className="text-title-bottom text-title-iReader-result-body">
                  Good news
                </span>
                <span
                  className="custom-text-title text-title-iReader-result-body"
                  style={{
                    fontSize: '24px',
                    lineHeight: '33px',
                    color: '#000000',
                    fontWeight: 'normal',
                  }}
                >
                  , your results have some amazing numbers.
                </span>
              </div>
            </div>
            {dataTestResultConvert && dataTestResultConvert['normal'] && (
              <div className="contain-item-result-test-analysis">
                {dataTestResultConvert['normal'].map((item, index) => {
                  return (
                    isNumber(item.value) && (
                      <div
                        className="item-result-test-analysis"
                        key={index}
                        style={
                          duplicateNor && duplicateNor.includes(item.key)
                            ? {
                                backgroundColor: '#FFC7CE',
                              }
                            : null
                        }
                      >
                        <div className="name-test-result">
                          <span
                            style={
                              duplicateNor && duplicateNor.includes(item.key)
                                ? { color: 'red' }
                                : { color: '#E5E5E5' }
                            }
                          >
                            {item.key}
                          </span>
                        </div>
                        <div className="detail-item-result-tets-analysis">
                          <p
                            style={
                              duplicateNor && duplicateNor.includes(item.key)
                                ? {
                                    color: 'red',
                                  }
                                : null
                            }
                          >
                            Normal
                          </p>
                          <div
                            style={
                              duplicateNor && duplicateNor.includes(item.key)
                                ? {
                                    color: 'red',
                                  }
                                : null
                            }
                          >
                            {item.value.toFixed(1)} mIU/ML
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            )}
          </div>
          <div className="test-result-out-range">
            <div className="title-test-result-out-range">
              <div>
                <span
                  className="text-title-bottom text-title-iReader-result-body"
                  style={{ fontWeight: 'normal' }}
                >
                  We see some
                </span>
                <span
                  className="text-title-bottom text-title-iReader-result-body"
                  style={{ paddingLeft: '5px', paddingRight: '5px' }}
                >
                  out of range
                </span>
                <span
                  className="text-title-bottom text-title-iReader-result-body"
                  style={{ fontWeight: 'normal' }}
                >
                  here,
                </span>
              </div>

              <p
                className="text-title-bottom text-title-iReader-result-body"
                style={{
                  fontWeight: 'normal',
                }}
              >
                but don’t worry we will assist you on how you can improve your
                health.
              </p>
            </div>
            {dataTestResultConvert && dataTestResultConvert['art'] && (
              <div className="contain-item-result-test-result-out-range">
                {dataTestResultConvert['art'].map((item, index) => {
                  return (
                    isNumber(item.value) && (
                      <div
                        className="item-result-test-result-out-range"
                        key={index}
                        style={
                          duplicateArt && duplicateArt.includes(item.key)
                            ? {
                                backgroundColor: '#FFC7CE',
                              }
                            : null
                        }
                      >
                        <div className="name-test-result-out-range">
                          <span
                            style={
                              duplicateArt && duplicateArt.includes(item.key)
                                ? { color: 'red' }
                                : { color: '#4F4F4F' }
                            }
                          >
                            {item.key}
                          </span>
                        </div>
                        <div className="detail-item-result-tets-result-out-range">
                          <p
                            style={
                              duplicateArt && duplicateArt.includes(item.key)
                                ? {
                                    color: 'red',
                                  }
                                : null
                            }
                          >
                            {item.level}
                          </p>
                          <div
                            style={
                              duplicateArt && duplicateArt.includes(item.key)
                                ? {
                                    color: 'red',
                                  }
                                : null
                            }
                          >
                            {item.value.toFixed(1)} mIU/ML
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="test-result-record-video-iDoctor">
          <div className="contain-record-video-iDoctor-result">
            <img src={circle} />

            <div className="video-record-iDoctor-result">
              <div className="btn-play-video-result">
                <Button
                  colorIMI="primary1"
                  size="play"
                  onClick={handlePlayVideo}
                />
              </div>
              {resultVideo && (
                <video
                  ref={videoRef}
                  controls
                  width="100%"
                  height="100%"
                  src={resultVideo[0].signedUrl}
                />
              )}
            </div>
            <div className="circle-video-result" />
          </div>
          <div className="transcript-video-record-result">
            <div className="context-transcript">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>
        </div>

        <div className="test-result-over-all" style={{ marginTop: '15%' }}>
          <div className="contain-over-all-left">
            <p
              className="date-title-bottom"
              style={{ fontSize: '24px', color: '#000000' }}
            >
              Overall
            </p>
            <div className="context-over-all">{dataResult?.impression}</div>
          </div>
          <img src={doctor1} />
        </div>

        <div className="test-result-question-and-answer">
          <img src={doctor2} />
          <div className="contain-question-right">
            <p
              className="date-title-bottom"
              style={{ fontSize: '24px', color: '#000000' }}
            >
              Question and Answers
            </p>
            <div className="context-question-result">
              <p> Questions: {dataResult?.questions[0].content} </p>
              <p> Answers: {dataResult?.questions[0]?.answers[0].content} </p>
            </div>
          </div>
        </div>

        <div className="test-result-over-all">
          <div className="contain-over-all-left">
            <p
              className="date-title-bottom"
              style={{ fontSize: '24px', color: '#000000' }}
            >
              Doctor Suggestions
            </p>
            <div className="context-over-all">
              {dataResult?.comments[0].title} :{' '}
              {dataResult?.comments[0].description}
            </div>
          </div>
          <img src={doctor3} />
        </div>

        <p className="title-end-result bottom-text-iDoctor-result">
          Thank You for Trusting IMI AI. INC
        </p>
      </div>
      <DialogPdfPreview
        fileModeToOpen={fileModeToOpen}
        isOpenFile={isOpenFile}
        file={linkFileToOpen}
        handleCloseFilePreview={(e) => handleCloseFilePreview(e)}
      />
    </div>
  );
};
export default IDoctorResult;
