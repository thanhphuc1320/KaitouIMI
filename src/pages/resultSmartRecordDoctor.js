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
import { NavLink, useParams, useHistory } from 'react-router-dom';
import {
  oldUploadFileApiCall,
  getPublicUrlApiCall,
} from '../apiCalls/file.api';
import {
  getRequestDetailApiCall
} from '../apiCalls/request.api';
import { updateRequestFiltered } from '../store/actions/request.action'
import { isURL } from '../utils';
import DialogPdfPreview from '../components/dialog/dialogPdfPreview';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogOcrFilteredRaw from './../components/dialog/dialogOcrFilteredRaw';
import DialogOcrRawResult from './../components/dialog/dialogOcrRawResult';
import InsertCommentIcon from '@material-ui/icons/InsertComment';

import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE, DOCTOR_ROLE } from '../constant';
import {
  getTestResult
} from '../store/actions/testResult.action';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ResultSmartRecordDoctor = () => {
  const params = useParams()
  const history = useHistory()
  const dispatch = useDispatch();
  const [dataTestResult, setDataTestResult] = useState([]);
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
  const testResultId = params.id
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
      if (item["isAdd"]) {
        delete item.isAdd
      }
      return item
    });

    let bloodTestSend = dataChoose.bloodTest;
    bloodTestSend[0].ocrCorrection = e;
    await dispatch(updateRequestFiltered({
      id: dataChoose._id,
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

  const goToback = () => {
    history.push('/my-requests')
  }

  useEffect(() => {
    if (testResultId) {
      getRequestDetailApiCall(testResultId)
        .then((result) => {
          setDataChoose(result.data);
          setDataTestResult(result.data.bloodTest);
          setOcrCorrection(result.data.bloodTest[0].ocrCorrection);
          setOcrFilteredRaw(result.data.bloodTest[0].ocrFilteredRaw)
        })
        .catch(() => {
          // FIXME:
        })
    } else {
      dispatch(getTestResult());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOcrCorrection(ocrCorrection);
  }, [ocrCorrection])


  return (
    <div className="patient-full-page">
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
      <div className="m-3">
        <div>
          <DialogPdfPreview
            fileModeToOpen={fileModeToOpen}
            isOpenFile={isOpenFile}
            file={linkFileToOpen}
            handleCloseFilePreview={(e) => handleCloseFilePreview(e)}
          />
          <DialogOcrFilteredRaw
            isOpenFile={isOpenModalOcrFilteredRaw}
            ocrFilteredRaw={ocrFilteredRaw}
            ocrCorrection={ocrCorrection}
            handleCloseFilePreview={(e) => handleCloseOcrFiltered(e)}
            handleUpdateFilePreview={(e) => handleUpdateFilePreview(e)}
            handleDownloadFilePreview={(e) => handleDownloadFilePreview(e)}
            handleAddNewIndicator={(e) => handleAddNewIndicator(e)}
          // editOcrFilteredRaw={(dataChanges) => editFilteredRaw(dataChanges) }
          />
          <DialogOcrRawResult
            isOpenFile={isOpenModalOcrRawResult}
            ocrTextAnnotations={ocrTextAnnotations}
            handleCloseFilePreview={(e) => handleCloseOcrRawResult(e)}
          />
          <div>
            {
              dataTestResult && dataTestResult.length > 0 && dataTestResult[dataTestResult.length - 1].ocrDetect === 'Failed' &&
              (<div className="text-center mt-5">
                <InsertCommentIcon className="icon-file" />
                <span>We can’t analyze your blood test at the moment. Our staff will reach out to you soon.</span>
              </div>)
            }

            {
              dataTestResult && dataTestResult.length > 0  && dataTestResult[dataTestResult.length - 1].ocrDetect === 'Processing' &&
              (<div className="text-center mt-5">
                <InsertCommentIcon className="icon-file" />
                <span>We are processing your data, please check back later.</span>
              </div>)
            }
            {
              dataTestResult &&
              dataTestResult.length > 0  &&
              dataTestResult[dataTestResult.length - 1].ocrDetect === 'Completed' &&
              dataTestResult.map((item, idx) => {
              return (
                <div key={idx} className="d-flex mb-3" style={{ 'justify-content': 'center' }}>
                  <Button
                    className="d-block customButton"
                    variant="outlined"
                    onClick={() => openCloudPublicUrl(item.fileUrl, false)}
                  >
                    Original Document
                      </Button>
                  <Button
                    className="d-block ml-3 customButton"
                    variant="outlined"
                    onClick={() => openModalOcrRawResult(item.ocrFileTextAnnotations)}
                  >
                    Raw Result
                      </Button>
                  <Button
                    className="d-block ml-3 customButton"
                    variant="outlined"
                    onClick={() => openCloudPublicUrl(item.ocrFileUrl, false)}
                  >
                    Current Result
                        </Button>
                  <Button
                    className="d-block ml-3 customButton"
                    variant="outlined"
                    onClick={() => openModalOcrFilteredRaw(item.ocrFileUrl, false)}
                  >
                    Filtered Result
                      </Button>
                </div>
              );
            })}
          </div>
          <div className="form-group text-center">
            <button
              className="btn btn-blue mt-5"
              onClick={goToback}
            >
              Back
                </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResultSmartRecordDoctor;
