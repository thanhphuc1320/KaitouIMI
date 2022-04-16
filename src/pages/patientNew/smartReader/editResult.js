import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import DialogResult from 'components/dialog/dialogResult';
import CircularProgress from '@material-ui/core/CircularProgress';
import Slider from 'react-slick';
import { Document, Page } from 'react-pdf';
import { Button } from '@stories/Button/Button';

import { getRequestDetailApiCall } from '../../../apiCalls/request.api';
import { getPublicUrlApiCall } from '../../../apiCalls/file.api';
import { isURL } from '../../../utils';
import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE } from '../../../constant';
import DialogPdfPreview from '../../../components/dialog/dialogPdfPreview';

import { updateRequestFiltered } from '../../../store/actions/request.action';
import ico_alarm_bell from '@img/imi/alarm-bell-blue.png';
import ico_search from '@img/imi/ico-search.png';
import defaultAva from '@img/d_ava.png';
import addIcon from '@img/imi/math-plus.png';

export default function EditResult() {
  const user = useSelector((state) => state.user);
  const [dataUser, setDataUser] = useState(user);
  const [isRun, setIsRun] = useState(true);
  const [isData, setIsData] = useState(false);
  const [, setImagePublic] = useState(false);
  const [indexImg, setIndexImg] = useState(0);
  const [activeEdit, setActiveEdit] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [linkFileToOpen, setLinkFileToOpen] = useState(null);
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);
  const { avatarUrl } = user;
  const [changedArray, setChangedArray] = useState([]);
  const [isOCRResult, setIsOCRResult] = useState(false);
  const [pageNumber] = useState(1);
  const [, setNumPages] = useState(null);
  // const [dataCheckDuplicate, setDataCheckDuplicate] = useState();

  const [focusIndex, setFocusIndex] = React.useState(-1);

  const dispatch = useDispatch();
  const history = useHistory();
  let count = 0;
  const openDialog = () => {
    setIsOpenDialog(true);
  };
  const editResult = () => {
    setActiveEdit(true);
  };
  const saveResult = () => {
    setActiveEdit(false);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots) => (
      <div className="custom-slick-dot">
        <ul className="custom-slick-dot"> {dots} </ul>
      </div>
    ),
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const getId = user.requests.length - 1;
  const getIdRequest = user.requests[getId]._id;

  const getImagePublict = async (data) => {
    if (data) {
      let listImagePublic = [];
      for (let index = 0; index < data.bloodTest.length; index++) {
        const item = data.bloodTest[index];
        let newItem = await getPublicUrlApiCall({
          itemUrl: item.fileUrl,
          redirect: false,
        });
        if (!newItem.data.code) {
          item.signedUrl = newItem.data.signedUrl;
        }
        listImagePublic.push(item);
      }
      let dataTemp = { ...data };
      dataTemp.bloodTest = [...listImagePublic];
      setDataUser(dataTemp);
    }
  };

  useEffect(() => {
    if (isRun) {
      const dataTemp = setInterval(() => {
        getRequestDetailApiCall(user?.requests[getId]._id).then((data) => {
          if (data?.data?.bloodTest[0].ocrDetect !== 'Completed') {
            count = count + 1;
            if (count > 3) {
              clearInterval(dataTemp);
              setIsRun(false);
            }
          } else {
            setDataUser(data.data);
            clearInterval(dataTemp);
            setIsRun(false);
            setImagePublic(true);
            getImagePublict(data.data);
          }
        });
      }, 1000);
    }
  }, [isRun]);

  useEffect(() => {
    if (dataUser.bloodTest) {
      checkOCRResult();
      setIsData(true);
    }
  }, [dataUser]);

  // useEffect(() => {

  // }, [indexImg])

  const beforeChangeImg = (oldIndex, newIndex) => {
    setIndexImg(newIndex);
    setActiveEdit(false);
  };

  // const checkDuplicatePDF = (data) => {
  //   let findDuplicates = (arr) =>
  //     arr.filter((item, index) => arr.indexOf(item) !== index);
  //   let arrOcrPDFTemp = [];
  //   data.map((item) => arrOcrPDFTemp.push(item.key));
  //   setDataCheckDuplicate(findDuplicates(arrOcrPDFTemp));
  // };

  const handleEditReader = (indexImg) => {
    let ocrCorrection = dataUser.bloodTest[indexImg].ocrCorrection;
    let arrTemp = ocrCorrection.concat();
    const newItem = {
      indicator: '',
      key: '',
      value: 0,
    };
    arrTemp = [...arrTemp, newItem];
    ocrCorrection = arrTemp;
    const addFieldEdit = { ...dataUser };
    addFieldEdit.bloodTest[indexImg].ocrCorrection = arrTemp;
    setDataUser(addFieldEdit);
  };

  const handleChangeData = (e, field, index, value) => {
    let ocrCorrection = dataUser.bloodTest[indexImg].ocrCorrection;
    const newArrChange = [...ocrCorrection];
    if (field === 'key') {
      const checkValid = newArrChange.map((item) => {
        if (e?.target.value === item.indicator) {
          return false;
        }
        return true;
      });
      if (checkValid.includes(false)) {
        window.alert('Indicator is exist');
      } else {
        newArrChange[index][field] = e?.target?.value || value;
        newArrChange[index]['indicator'] = e?.target?.value || value;
      }
    } else {
      newArrChange[index][field] = e?.target?.value;
    }
    const editDataChange = { ...dataUser };
    editDataChange.bloodTest[indexImg].ocrCorrection = newArrChange;
    setDataUser(editDataChange);
    setChangedArray(editDataChange);
  };

  const onsubmit = () => {
    if (changedArray.length === 0) {
      onBack();
    }
    const datasubmit = {
      id: dataUser._id,
      bloodTest: dataUser.bloodTest,
    };

    dispatch(updateRequestFiltered(datasubmit));
    openDialog();
    let setInter = setInterval(() => {
      if (count < 10) {
        count = count + 1;
      } else {
        clearInterval(setInter);
        count = 0;
        onBack();
      }
    }, 1000);
  };

  const onBack = () => {
    if (user.role === 'patient') {
      history.push(`/iReader-result/${getIdRequest}`);
    }
  };

  const handleClose = () => {
    setIsOpenDialog(false);
  };

  let fileModeToOpen;
  if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;

  const isOpenFile =
    isURL(linkFileToOpen) &&
    fileModeToOpen &&
    [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);

  const checkOCRResult = () => {
    if (dataUser) {
      let data = dataUser.bloodTest;
      data.forEach((element) => {
        if (element.ocrCorrection.length > 0) {
          setIsOCRResult(true);
        }
      });
    }
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

  return isOpenDialog ? (
    <DialogResult
      isOpenFile={isOpenDialog}
      handleClose={(e) => handleClose(e)}
    />
  ) : (
    <div className="appointment-new">
      <div className="topAppointment">
        <div className="leftTop">
          <h2 className="color-appoiment-h2">
            <NavLink to="/">
              <span>Home</span>
            </NavLink>
            iReader
          </h2>
        </div>
        <div className="rightTop">
          <a href="#!">
            <img src={ico_search} alt="" />
          </a>
          <a href="#!" className="mr-2 ml-2">
            <img src={ico_alarm_bell} alt="" />
            <span className="count">3</span>
          </a>
          <NavLink to="/update-profile" className="avatar">
            <img src={avatarUrl ? avatarUrl : defaultAva} alt="" />
          </NavLink>
        </div>
      </div>
      <>
        {isData ? (
          !isOCRResult ? (
            <div className="d-flex justify-content-center">
              <div className="center mt-5 patient-rest-result-new">
                <p className="note">
                  We can’t analyze your blood test at the moment. Our staff will
                  reach out to you soon.
                </p>
              </div>
            </div>
          ) : (
            <div className="edit-smart-reader">
              {
                <>
                  <div className="left">
                    <p className="title-upload title-edit-upload">
                      Here are your blood test results that our system detects.
                      Please help check!
                    </p>
                    <div
                      style={{ height: '58vh', overflow: 'auto' }}
                      className="left-content-edit"
                    >
                      <div
                        className="detail-smart-reader mt-5"
                        style={{ marginRight: '2rem' }}
                      >
                        {dataUser?.bloodTest[indexImg]?.ocrCorrection.length ===
                        0 ? (
                          <div className="d-flex justify-content-center">
                            <div className="center patient-rest-result-new">
                              <p className="note">
                                We can’t analyze your blood test at the moment.
                                Our staff will reach out to you soon.
                              </p>
                            </div>
                          </div>
                        ) : null}
                        <h2>Blood test</h2>
                        {dataUser?.bloodTest[indexImg]?.ocrCorrection.map(
                          (item, index) => {
                            return (
                              <div className="item-reader mt-2">
                                <span
                                  style={
                                    activeEdit
                                      ? {
                                          marginTop: '3px',
                                          paddingRight: '6px',
                                        }
                                      : item?.key ===
                                          dataUser?.bloodTest[indexImg]
                                            ?.ocrCorrection[index + 1]?.key ||
                                        (index > 0 &&
                                          item?.key ===
                                            dataUser?.bloodTest[indexImg]
                                              ?.ocrCorrection[index - 1]?.key)
                                      ? {
                                          color: 'red',
                                          backgroundColor: '#FFC7CE',
                                          paddingTop: '3px',
                                        }
                                      : {
                                          color: 'rgba(0, 0, 0, 0.38)',
                                          marginTop: '3px',
                                          paddingRight: '6px',
                                        }
                                  }
                                  className={
                                    item?.key ===
                                      dataUser?.bloodTest[indexImg]
                                        ?.ocrCorrection[index + 1]?.key ||
                                    (index > 0 &&
                                      item?.key ===
                                        dataUser?.bloodTest[indexImg]
                                          ?.ocrCorrection[index - 1]?.key)
                                      ? 'colorDuplicate'
                                      : null
                                  }
                                >
                                  {index + 1}.
                                </span>
                                <TextField
                                  name="key"
                                  value={
                                    item?.original_name
                                      ? item?.original_name
                                      : item?.key
                                  }
                                  disabled={activeEdit ? false : true}
                                  onChange={(event) =>
                                    handleChangeData(event, 'key', index)
                                  }
                                  className={
                                    item?.key ===
                                      dataUser?.bloodTest[indexImg]
                                        ?.ocrCorrection[index + 1]?.key ||
                                    (index > 0 &&
                                      item?.key ===
                                        dataUser?.bloodTest[indexImg]
                                          ?.ocrCorrection[index - 1]?.key)
                                      ? 'colorDuplicate'
                                      : null
                                  }
                                />
                                <TextField
                                  className={
                                    item?.key ===
                                      dataUser?.bloodTest[indexImg]
                                        ?.ocrCorrection[index + 1]?.key ||
                                    (index > 0 &&
                                      item?.key ===
                                        dataUser?.bloodTest[indexImg]
                                          ?.ocrCorrection[index - 1]?.key)
                                      ? 'colorDuplicate-value'
                                      : 'item-reader-value'
                                  }
                                  name="value"
                                  value={item.value}
                                  disabled={activeEdit ? false : true}
                                  onChange={(event) =>
                                    handleChangeData(event, 'value', index)
                                  }
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                      {activeEdit && (
                        <div
                          className="d-flex"
                          style={{ marginTop: '20px', cursor: 'pointer' }}
                          onClick={() => handleEditReader(indexImg)}
                        >
                          <img
                            style={{ width: '20px', height: '20px' }}
                            src={addIcon}
                          />
                          <p style={{ color: '#2F80ED', marginLeft: '10px' }}>
                            Add more index
                          </p>
                        </div>
                      )}

                      {/* <div className="detail-smart-reader mt-5">
                              <h2>Blood test</h2>
                              <div className="item-reader mt-2">
                                <p>Glucose</p>
                                <p>5.6</p>
                              </div>
                          </div> */}
                    </div>
                    <div className="form-group d-flex justify-content-center mt-4 btn-group-ireader-edit">
                      {!activeEdit ? (
                        <>
                          <Button
                            className="btn btn-yellow"
                            onClick={() => editResult()}
                            label="Edit Results"
                          />
                          <Button
                            className="btn btn-yellow"
                            style={{
                              background: '#2F80ED',
                            }}
                            onClick={() => onsubmit()}
                            label="Looks good!"
                          />
                        </>
                      ) : (
                        <>
                          <Button
                            className="btn btn-yellow"
                            style={{ background: '#2F80ED' }}
                            onClick={() => saveResult()}
                            label="Save"
                          />
                          <Button
                            disabled
                            className="btn btn-yellow"
                            style={{ backgroundColor: '#C4C4C4' }}
                            label="Looks good!"
                          />
                        </>
                      )}
                    </div>
                  </div>
                  {
                    <div
                      className={
                        dataUser?.bloodTest[indexImg].fileType !==
                        'application/pdf'
                          ? 'd-flex justify-content-center edit-ireader-right'
                          : 'd-flex justify-content-center edit-ireader-right edit-ireader-pdf'
                      }
                    >
                      <div className="ml-3 mr-3 edit-ireader-content">
                        <Slider {...settings} beforeChange={beforeChangeImg}>
                          {dataUser?.bloodTest.map((item) => {
                            return (
                              <div>
                                {item.fileType !== 'application/pdf' ? (
                                  <img
                                    style={{
                                      borderRadius: '24px',
                                      border: '3px solid #828282',
                                      marginRight: '5px',
                                      cursor: 'pointer',
                                    }}
                                    src={item.signedUrl}
                                    onClick={() => {
                                      handleOpenDialogPDF(item);
                                    }}
                                  />
                                ) : (
                                  <div className="upload-success upload-success-pdfpreview cursor-pointer">
                                    <Document
                                      file={item.signedUrl}
                                      onLoadSuccess={onDocumentLoadSuccess}
                                      onClick={() => {
                                        handleOpenDialogPDF(item);
                                      }}
                                    >
                                      <Page pageNumber={pageNumber} />
                                    </Document>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </Slider>
                      </div>
                    </div>
                  }
                </>
              }
            </div>
          )
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
        <DialogPdfPreview
          fileModeToOpen={fileModeToOpen}
          isOpenFile={isOpenFile}
          file={linkFileToOpen}
          handleCloseFilePreview={(e) => handleCloseFilePreview(e)}
        />
      </>
    </div>
  );
}
