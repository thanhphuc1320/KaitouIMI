import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

/*********************** import api *********************************************/
import { getRequestDetailApiCall } from '../../../apiCalls/request.api';
import { getPublicUrlApiCall } from '../../../apiCalls/file.api';

/*********************** import api *********************************************/

import { Button } from '@stories/Button/Button';
import '../../../static/css/result-patient.css';

/*********************** import image *********************************************/

import logo from '@img/logo_result.png';
import doctor3 from '@img/imi/result_patient/ireader_doctor.png';

/*********************** import image *********************************************/

/*********************** import other *********************************************/
import DialogPdfPreview from '../../../components/dialog/dialogPdfPreview';
import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE } from '../../../constant';
import { isURL } from '../../../utils';
import moment from 'moment';
/*********************** import other *********************************************/

const IReaderResult = () => {
  const params = useParams();
  const history = useHistory();

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

  return (
    <div
      className="new-test-result-container"
      style={{ backgroundColor: '#C8E4FF' }}
    >
      <div
        className="header-iReader-result"
        style={{ position: 'fixed', zIndex: '10' }}
      >
        <Button color="primary1" size="back" onClick={isBack} />
      </div>
      <div className="body-iReader-result" style={{ paddingTop: '3rem' }}>
        <div
          className="title-body-iReader-result"
          style={{ borderBottom: '1px solid' }}
        >
          <img src={logo} />
          <div className="name-patient-iReader-result">
            <div>
              <span className="custom-text-title" style={{ fontSize: '40px' }}>
                Good Morning,{' '}
              </span>
              <span className="custom-text-title" style={{ fontSize: '40px' }}>
                {dataResult?.user?.lastName}!
              </span>
            </div>

            <p className="date-title-bottom">
              Test Result on {moment(dataResult?.createdAt).format('DD.MM.YY')}
            </p>
          </div>
          <div
            className="context-title-body-iReader-result"
            style={{ display: 'flex' }}
          >
            <span className="text-title-bottom text-title-iReader-result">
              Here is the scoop. We’ll walk you through your blood test
              analysis, then guide you through your personalized reports.
            </span>
            <img src={doctor3} />
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
        <div className="bottom-test-result-iReader">
          <div className="btn-uploaded-test-result">
            <Button
              size="primary"
              color="primary1"
              label="Your Uploaded Blood Test Result"
              disabled={isLoading}
              loading={isLoading}
              onClick={() =>
                openCloudPublicUrl(dataResult.bloodTest[0].fileUrl, false)
              }
            />
          </div>

          <div className="bottom-test-result-summary-iReader">
            <p
              className="custom-text-title text-title-iReader-result-body-blue"
              style={{ fontSize: '46px' }}
            >
              Your Blood Test Result Summary
            </p>
            <p
              className="text-title-bottom text-title-iReader-result-body "
              style={{ fontWeight: '400', padding: '20px' }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing.{' '}
            </p>
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
  );
};
export default IReaderResult;
