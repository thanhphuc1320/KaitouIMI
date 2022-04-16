import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAppointment } from '../../apiCalls/appointment.api';
import styled from 'styled-components';

import qs from 'query-string';

// import MaterialTable from 'material-table';
import Panel from '../../components/panel';
import GridItem from '../../components/grid/GridItem';
import GridContainer from '../../components/grid/GridContainer';

import Xray from './subcomponents/Xray';
import CallFrame from './CallFrame';

// Canvas
import Canvas from '../../components/canvas';
import DicomViewer from '../../components/canvas/dcmView';
import { TYPES } from '../../components/canvas/variables';

import ico_phone from '../../img/imi/icon-phone.png';
import ico_fullscreen from '../../img/imi/ico-fullscreen.png';

import { getPublicUrlApiCall } from '../../apiCalls/file.api';

const PatientCallPage = (props) => {
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [testWithPublicLink, setTestWithPublicLink] = useState([]);
  const [ setFull] = useState(false);

  const canvasRef = React.createRef();
  const dcmLoaderRef = React.createRef();

  const query = qs.parse(props.location.search);
  const appointmentId = query['_id'];

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

  const { patient = {}, doctor = {}, image = [] } =
    currentAppointment || {};

  const currentImgPreview =
    (testWithPublicLink.length &&
      testWithPublicLink[currentOcrIndex].signedUrl) ||
    '';

  /**
   * =============================
   * BEGIN ANNOTATION FUNCTIONS
   * =============================
   */
  const isDicom = (url = '') => {
    const imageFormat = ['.jpg', '.png', '.gif', '.pdf'];
    return imageFormat.indexOf(url.substring(url.length - 4)) === -1;
  };

  const openAnnotationTool = async (currentOcr, currentOcrIndex) => {
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

  return !appointmentId ? (
    <div>No call available....</div>
  ) : (
    currentAppointment && (
      <div className="call-page">
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
            />
          </div>
        )}

        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <div className="videocall">
              <Panel height="45rem">
                <div className="header">
                  <div className="header-left">
                    <img src={ico_phone} />
                    <h5 className="text">
                      Dr. {doctor.firstName || 'IMI'}{' '}
                      {doctor.lastName || 'Health'}
                    </h5>
                  </div>
                  <div className="header-right">
                    <a onClick={() => setFull(true)}>
                      <img src={ico_fullscreen} />
                    </a>
                  </div>
                </div>
                <CallFrame
                  id={appointmentId}
                  patient={patient}
                  image={testWithPublicLink}
                  openAnnotationTool={openAnnotationTool}
                  role={'patient'}
                />
              </Panel>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <div className="image-review">
              <Panel height="45rem">
                <Xray
                  onClick={() =>
                    openAnnotationTool(image[currentOcrIndex].ocrJson[0], 0)
                  }
                  isImage={
                    currentImgPreview &&
                    testWithPublicLink[currentOcrIndex].fileType !==
                      'application/pdf'
                  }
                  img={currentImgPreview}
                />
              </Panel>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  );
};

export default PatientCallPage;
