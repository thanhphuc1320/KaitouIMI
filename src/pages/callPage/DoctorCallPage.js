import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  getAppointment,
  createOrUpdateAppointment,
} from '../../apiCalls/appointment.api';
import { formatAMPM, isURL } from '../../utils';

import qs from 'query-string';

import Panel from '../../components/panel';
import GridItem from '../../components/grid/GridItem';
import GridContainer from '../../components/grid/GridContainer';

import ChatBox from '../../components/ChatBox';
import Xray from './subcomponents/Xray';
import CallFrame from './CallFrame';

// Canvas
import Canvas from '../../components/canvas';
import DicomViewer from '../../components/canvas/dcmView';
import { TYPES } from '../../components/canvas/variables';

import ico_phone from '../../img/imi/icon-phone.png';
import ico_fullscreen from '../../img/imi/ico-fullscreen.png';
import ico_send from '../../img/imi/ico-send.png';

//css
import '../../static/css/call-page.css';

import {
  oldUploadFileApiCall,
  getPublicUrlApiCall,
} from '../../apiCalls/file.api';
import { DOCTOR_ROLE } from '../../constant';

export default function DoctorCallPage(props) {
  const [showChat, setShowChat] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [testWithPublicLink, setTestWithPublicLink] = useState([]);

  const query = qs.parse(props.location.search);
  const appointmentId = query['_id'];

  const canvasRef = React.createRef();
  const dcmLoaderRef = React.createRef();

  const [currentState, setCurrentState] = useState({
    currentOcr: null,
    isToolOpen: false,
    currentOcrImageType: 'pdf',
    currentOcrIndex: 0,
  });

  const {
    currentOcrImageType,
    currentOcr,
    isToolOpen,
    currentOcrIndex,
  } = currentState;

  let toastId = null;

  const notifyExportingRequest = () =>
    (toastId = toast('Exporting...', {
      className: 'toast-container',
      autoClose: 1000,
    }));

  const notifyExportedRequest = () => {
    toast.update(toastId, {
      render: 'Exported Request',
      type: toast.TYPE.INFO,
      className: 'update-toast-container',
      progressClassName: 'update-progress-bar',
      autoClose: 1000,
    });
  };

  const notifyUpdatingAnnotation = () =>
    (toastId = toast(
      'Update Annotation, it might take from 5 up to 15 seconds.',
      {
        className: 'toast-container',
        autoClose: 20000,
      }
    ));

  useEffect(() => {
    getAppointment({ _id: appointmentId })
      .then((res) => {
        const getPublicLinkTasks = res.data[0].image.map((item, index) =>
          getPublicUrlApiCall({
            itemUrl: item.fileUrl,
            redirect: false,
          }).then((result) => {
            if (!result.data.code)
              return { ...result.data, ...res.data[0].image[index] };
          })
        );
        Promise.all(getPublicLinkTasks).then((result) => {
          setTestWithPublicLink(result);
          setCurrentAppointment(res.data[0]);
        });
      })
      .catch((e) => console.log('error', e));
  }, [appointmentId]);

  const {
    endDateAndTime = '',
    dateAndTime = '',
    patient = {},
    doctor = {},
    image = [],
    video = [],
    patientNote = '',
  } = currentAppointment || {};

  const displayDate =
    new Date(dateAndTime).toLocaleString('default', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }) || '';
  const [displayTime, displayTimeExtra] = formatAMPM(dateAndTime);
  const { firstName = '', lastName = '' } = patient || {};

  const currentImgPreview =
    (testWithPublicLink.length &&
      testWithPublicLink[currentOcrIndex].signedUrl) ||
    '';

  /**
   * =============================
   * BEGIN ANNOTATION FUNCTIONS
   * =============================
   */
  const updateAnnotation = (data, callback = () => {}) => {
    const { currentOcrIndex } = currentState;
    notifyUpdatingAnnotation();

    const canvas = canvasRef.current;
    canvas.resetLayer(async () => {
      const imageData = canvas.toImageData();
      const imageBlob = await (await fetch(imageData)).blob();
      const dataToUpload = {
        file: imageBlob,
        patientId: patient._id,
        fileName: `image-${currentOcrIndex}-annotation.png`,
        appointmentId,
      };
      oldUploadFileApiCall(dataToUpload)
        .then((res) => {
          if (!res.data.code) {
            let updatedOcr = image;

            updatedOcr[currentOcrIndex].ocrJson[0] = {
              ...data,
              imageUrl: res.data.fileUrl,
            };

            const appointmentToUpdate = {
              mode: 3,
              appointmentId,
              status: 1,
              image: updatedOcr || [],
            };

            createOrUpdateAppointment(appointmentToUpdate)
              .then((result) => {
                if (!result.data.code) {
                  toast.update(toastId, {
                    render: 'Appointment updated',
                    type: toast.TYPE.INFO,
                    className: 'update-toast-container',
                    progressClassName: 'update-progress-bar',
                    autoClose: 1000,
                  });

                  setCurrentState({
                    ...currentState,
                    ...{
                      isToolOpen: false,
                      currentOcr: updatedOcr[currentOcrIndex].ocrJson[0],
                    },
                  });
                }
              })
              .catch((e) => console.log(`fail to update request ocr`, e));
          }
        })
        .catch((e) => console.log(`failed to upload new OCR to cloud`, e));
    });
  };

  const onResetCanvas = () => {
    const { currentOcrIndex } = currentState;
    getAppointment({ _id: appointmentId })
      .then((result) => {
        if (!result.data.code) {
          const { data } = result || {};
          setCurrentState({
            ...currentState,
            ...{ currentOcr: data[0].image[0].ocrJson[0] },
          });
          setCurrentAppointment(data[0]);
        }
      })
      .catch((e) => console.log('error', e));
  };

  const isDicom = (url = '') => {
    const imageFormat = ['.jpg', '.png', '.gif', '.pdf'];
    return imageFormat.indexOf(url.substring(url.length - 4)) === -1;
  };

  const openAnnotationTool = (currentOcr, currentOcrIndex) => {
    let currentOcrImageType;
    if (currentOcr) {
      currentOcrImageType = isDicom(currentOcr.config.url)
        ? TYPES.XRAY
        : TYPES.PDF;

      setCurrentState({
        ...currentState,
        currentOcrImageType,
        currentOcrIndex,
        currentOcr,
        isToolOpen: true,
      });
    }
  };

  const closeAnnotationTool = () => {
    setCurrentState({ ...currentState, isToolOpen: false });
  };

  // console.log({ testWithPublicLink });

  return !appointmentId ? (
    <div>No call available....</div>
  ) : (
    currentAppointment && (
      <div className="call-page">
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <div className="videocall">
              <Panel height="45rem">
                <div className="header">
                  <div className="header-left">
                    <img src={ico_phone} />
                    <h5 className="text">
                      {firstName} {lastName}
                    </h5>
                  </div>
                  <div className="header-right">
                    <a href="#">
                      <img src={ico_fullscreen} />
                    </a>
                  </div>
                </div>
                {image && doctor && appointmentId && (
                  <CallFrame
                    id={appointmentId}
                    doctor={doctor}
                    image={testWithPublicLink}
                    openAnnotationTool={openAnnotationTool}
                    role={'doctor'}
                  />
                )}
              </Panel>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <div className="image-review">
              <Panel height="45rem">
                <a className="xray-send" onClick={() => setShowChat(!showChat)}>
                  <img className="icon" src={ico_send} />
                </a>
                {showChat ? (
                  <ChatBox />
                ) : (
                  <Xray
                    onClick={() =>
                      openAnnotationTool(
                        image[currentOcrIndex].ocrJson[0],
                        currentOcrIndex
                      )
                    }
                    isImage={
                      currentImgPreview &&
                      testWithPublicLink[currentOcrIndex].fileType !==
                        'application/pdf'
                    }
                    img={currentImgPreview}
                  />
                )}
              </Panel>
            </div>
          </GridItem>
        </GridContainer>

        {currentOcrImageType === TYPES.XRAY && (
          <DicomViewer ref={dcmLoaderRef} url={currentOcr?.publicOcrLink} />
        )}

        {isToolOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 1700,
              width: window.innerWidth,
              height: window.innerHeight,
              backgroundColor: '#fff',
              overflow: 'hidden',
            }}
          >
            <Canvas
              ref={canvasRef}
              closeModal={() => closeAnnotationTool()}
              onSave={(data, callback) => updateAnnotation(data, callback)}
              onReset={() => onResetCanvas()}
              data={currentOcr}
              type={currentOcrImageType}
              notifyExportingRequest={notifyExportingRequest}
              notifyExportedRequest={notifyExportedRequest}
              url={
                currentOcrImageType === TYPES.XRAY
                  ? dcmLoaderRef.current?.getImageData()
                  : currentImgPreview
              }
              width={dcmLoaderRef.current?.getSize().width}
              height={dcmLoaderRef.current?.getSize().height}
              role={DOCTOR_ROLE}
            />
          </div>
        )}
      </div>
    )
  );
}
