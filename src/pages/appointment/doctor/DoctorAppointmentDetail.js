import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';


import ico_play from '../../../img/imi/ico-play-circle.png';
import ico_link from '../../../img/imi/ico-link.png';
import ico_image from '../../../img/imi/icon-image.png';
import {
  getRobot
} from '../../../store/actions/robot.action';

import { formatAMPM, isURL } from '../../../utils';
import { getAppointment } from '../../../apiCalls/appointment.api';
import { Redirect } from 'react-router';
import { useCalling } from './../../../containers/calling/use-calling';
import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE } from '../../../constant';
// Components
import DialogPdfPreview from '../../../components/dialog/dialogPdfPreview';
import { getPublicUrlApiCall } from '../../../apiCalls/file.api';
import ico_attach from '../../../img/imi/ico-attach.png';
import ico_record from '../../../img/imi/record-icon-2.png';

export default function DoctorAppointmentDetail(props) {
  const history = useHistory();
  const calling = useCalling();
  const { appointmentId } = props.match.params;
  const robot = useSelector((state) => state.robot.robots);
  const appointment = useSelector((state) => state.appointment);
  const [page, setPage] = useState('DETAIL');
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function subscribe() {
      let response = await getAppointment({ _id: appointmentId })
      setCurrentAppointment(response.data[0])
      if (appointment.hasRecord && response.data[0].audios.length <= currentAppointment?.audios.length || 0) {
        await subscribe(); 
      }
    }
    subscribe();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId, appointment.hasRecord]);

  useEffect(() => {
    dispatch(
      getRobot()
    );
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const {
    dateAndTime = '',
    patient = {},
    image = [],
    video = [],
    patientNote = ''
  } = currentAppointment || {};

  const displayDate =
    new Date(dateAndTime).toLocaleString('default', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }) || '';
  const [displayTime, displayTimeExtra] = formatAMPM(dateAndTime);
  const {
    firstName = '',
    lastName = ''
  } = patient || {};

  const [linkFileToOpen, setLinkFileToOpen] = useState(null);
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);
  const [flag, setFlag] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  // Setup File Mode To Open
  let fileModeToOpen;
  if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;

  const isOpenFile =
    isURL(linkFileToOpen) &&
    fileModeToOpen &&
    [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);

  const handleOpenPdfPreview = (link, type) => {
    if (link && type) {
      setLinkFileToOpen(link);
      setFileTypeToOpen(type);
    }
  };
  const handleCloseFilePreview = (e) => {
    setLinkFileToOpen(null);
    setFileTypeToOpen(null);
  };
  const openCloudPublicUrl = (itemUrl, redirect) => {
    const data = { itemUrl, redirect: redirect };

    getPublicUrlApiCall(data)
      .then((res) => {
        if (!res.data.code) {
          const { signedUrl, fileType } = res.data;
          handleOpenPdfPreview(signedUrl, fileType);
        }
      })
      .catch((e) => console.log(e));
  };

  const callNavigation = async(item) => {
    history.push(`/appointment/robot/${appointmentId}?botId=${item._id}`)
  }

  const transcriptAudioRecording = () => {
    history.push(`/transcript-audio-recording/${appointmentId}`)
  }

  if (page === 'CALL') return <Redirect to={`/appointment/doctor/call?_id=${appointmentId}`} />;

  return (
    currentAppointment && (
      <div className="content-summary">
        <div className="left-summary">
          <h2>Your Appointment</h2>
          <div className="content-summary-info">
            <div className="top-summary-info">
              <div className="left-summary-info">
                <img className="avatar" src={currentAppointment.patient?.avatarUrl} alt='' />
                <div className="info">
                  <p>
                    {firstName} {lastName}
                  </p>
                  <span>California Amergency Center</span>
                  <p className="status">
                    <span></span>Online
                  </p>
                </div>
              </div>
            </div>
            <div className="bottom-summary-info">
              <div className="apointment-open">
                Your appointment will be open on
              </div>
              <div className="apointment-hour">
                <p>{displayDate}</p>
                <p className="hour">
                  {displayTime} {displayTimeExtra}
                </p>
                <span>GMT+0900</span>
              </div>
              <button
                onClick={() => setPage('CALL')}
                className="btn btn-gradient"
              >
                Join Call
              </button>
            </div>
          </div>
        </div>
        <div className="right-summary">
          <div className="d-flex cursor-pointer">
            <h2 className={flag ? "color-text pr-2" : "pr-2"} onClick={() => setFlag(true)}>Detail </h2>
            <h2 className={!flag ? "color-text pl-2" : "pl-2"} onClick={() => setFlag(false)}>Your Robot</h2>
          </div>
            {!flag ? (
            <div>
              <div onClick={()=> setShowDetail(!showDetail)}
                className="right-summary-block cursor-pointer">
                  {
                  robot.map((item) => (
                      <div className="block-flex">
                        <div className="left">
                          <div className="d-flex">
                          <span>{item.name}</span>
                            <span>( {item.robot.name} )</span>
                          </div>
                          </div>
                          <div className="right">
                          {item.robot.status === 'offline' ? (<p className="status-offline"><span></span>{item.robot.status}</p>) : (<p className="status"><span></span>{item.robot.status}</p>)}
                        </div>
                      </div>
                  ))}
              </div>
            {showDetail ? (
                robot.map((item) => (
                  <div className="align-items-center d-flex justify-content-between mb-3 mt-2">
                  <div className="d-flex">
                    <img className="robot-img"/>
                    <div className="align-self-center">
                      <span>{item.robot.name}</span>
                      {item.robot.status === 'offline' ? (<p className="status-offline mb-0"><span></span>{item.robot.status}</p>) : (<p className="status mb-0"><span></span>{item.robot.status}</p>)}
                      <p className="status mb-0">Location: {item.locattion}</p>
                    </div>
                  </div>
                  <div className="size-ico-link" onClick={() => callNavigation(item)}>
                    <img src={ico_link} />
                  </div>
                </div>
                ))
              ): null}
              </div>
              ): 
            ( 
            <div>
            <p className="mb-4 mt-2 text-title">Video</p>
            {video.map((item, index) => (
            <div className="right-summary-block block-flex">
              <div className="left">
                <img src={ico_play} />
                <h3>Video {index + 1}</h3>
              </div>
              <div className="right">
                <p>100MB</p>
              </div>
            </div>
          ))}
          <p className="mb-4 mt-2 text-title">Images</p>
          {image.map((item, index) => (
            <div
              className="right-summary-block block-flex"
              onClick={() => openCloudPublicUrl(item.fileUrl, false)}
            >
              <div className="left">
                <div className="d-flex">
                <img src={ico_image} className="mr-2" width="30"  height="30"/>
                <h3>Images {index + 1}</h3>
                </div>
              </div>
              <div className="right">
               <p>5MB</p>
              </div>
            </div>
          ))}
          <p className="mb-4 mt-2 text-title">Question</p>
          {patientNote !== "" ? <div className="right-summary-block">
            <h3>{patientNote}</h3>
          </div> : null}
          { currentAppointment.audios.length > 0 ? (
            <div className="record-data">
              <div className="d-flex mt-2 mb-2">
                <div className="title">Audio Recording</div>
                <div className="content">
                  {
                    currentAppointment.audios.map((item, index) => {
                      return (<a key={index} href={item[currentAppointment.audios[currentAppointment.audios.length - 1].length - 1].fileURI} className={
                        currentAppointment.audios.length > 0
                          ? ''
                          : 'record-hidden'
                      } target="_blank">
                        <div className="icon__record" style={{backgroundImage: `url(${ico_record})`}}></div>
                        <span className="number-transript">{index + 1}</span>
                      </a>)
                    })
                  }
                  <button
                    onClick={() => transcriptAudioRecording()}
                    className="btn btn-gradient mt-2"
                  >
                    Audio Recording
                  </button>
                </div>
              </div>
              <div className="d-flex">
                <div className="title">Transcripts</div>
                <div className="content">
                  {
                    currentAppointment.audios.map((item, index) => {
                      return (
                        <a key={index} href={item[currentAppointment.audios[currentAppointment.audios.length - 1].length - 1].transcriptURI} className={
                          currentAppointment.audios.length > 0
                            ? ''
                            : 'record-hidden',
                          'mr-2', 'ml-2', 'mt-2', 'mb-2'
                        } target="_blank">
                          <div className="icon__transript" style={{backgroundImage: `url(${ico_attach})`}}></div>
                          <span className="number-transript">{index + 1}</span>
                        </a>
                      )
                    })
                  }
                  <button
                    onClick={() => transcriptAudioRecording()}
                    className="btn btn-gradient mt-2"
                  >
                    Transcript Recording
                  </button>
                </div>
              </div>
            </div>
            ) : null
          }
          </div>
          )
        }
        </div>
        <DialogPdfPreview
          fileModeToOpen={fileModeToOpen}
          isOpenFile={isOpenFile}
          file={linkFileToOpen}
          handleCloseFilePreview={(e) => handleCloseFilePreview(e)}
        />
      </div>
    )
  );
}