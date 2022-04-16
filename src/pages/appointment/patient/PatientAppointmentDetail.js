import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { NavLink, useHistory } from 'react-router-dom';

import ico_play from '../../../img/imi/ico-play-circle.png';
import ico_fullscreen from '../../../img/imi/ico-fullscreen-screen.png';
import ico_image from '../../../img/imi/icon-image.png';
import ReactPlayer from 'react-player';

import { cancelAppointment } from '../../../store/actions/appointment.action';
import {
  formatAMPM,
  isURL
} from '../../../utils';
import { getAppointment } from '../../../apiCalls/appointment.api';
import { IMAGE_MODE, IMAGE_TYPES, PDF_MODE, PDF_TYPE } from '../../../constant';
// Components
import DialogPdfPreview from '../../../components/dialog/dialogPdfPreview';
import { getPublicUrlApiCall } from '../../../apiCalls/file.api';
import { FlatButton } from 'material-ui';
import ico_attach from '../../../img/imi/ico-attach.png';
import ico_record from '../../../img/imi/record-icon-2.png';

export default function PatientAppointmentDetail(props) {
  const { appointmentId } = props.match.params || '';

  const { canceledAppointmentId } = useSelector((state) => state.appointment);
  const appointment = useSelector((state) => state.appointment);
  const today = new Date();
  const [page, setPage] = useState('DETAIL');
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // Video
  const [linkVideoToOpen, setLinkVideoToOpen] = useState(null);

  // Image
  const [linkFileToOpen, setLinkFileToOpen] = useState(null);
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    async function getListAppoinment() {
      const list = await getAppointment({ _id: appointmentId })
      if (list.data.code) { 
        console.log('Data Null');
      } else setCurrentAppointment(list.data[0])
      if (appointment.hasRecord && list.data[0].audios.length <= currentAppointment?.audios.length || 0) {
        await getListAppoinment(); 
      }
    }

    getListAppoinment()
  }, [appointmentId]);

  const {
    dateAndTime = '',
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
  const [displayTime, displayTimeExtra] = formatAMPM(dateAndTime) || '';

  const {
    firstName = '',
    lastName = '',
    bio = ''
  } = doctor || {};

  const lengthAudio = currentAppointment?.audios.length

  const handleCancelAppointment = () =>
    dispatch(cancelAppointment({ appointmentId }));
  // Setup File Mode To Open
  let fileModeToOpen;
  if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;
  else fileModeToOpen = 'video';

  const isOpenFile =
    isURL(linkFileToOpen) &&
    fileModeToOpen &&
    [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);

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

  const handleCloseVideoPreview = (e) => {
    setLinkVideoToOpen(null);
  };
  const transcriptAudioRecording = () => {
    history.push(`/transcript-audio-recording/${appointmentId}`)
  }
  const handleOpenVideoPreview = (link, type) => {
    if (link && type) setLinkVideoToOpen(link);
  };
  const openCloudPublicUrl = (itemUrl, redirect, type = 'image') => {
    const data = { itemUrl, redirect: redirect };

    getPublicUrlApiCall(data)
      .then((res) => {
        if (!res.data.code) {
          const { signedUrl, fileType } = res.data;
          if (type === 'video') handleOpenVideoPreview(signedUrl, fileType);
          else handleOpenFilePreview(signedUrl, fileType);
        }
      })
      .catch((e) => console.log(e));
  };

  if (page === 'CALL')
    return <Redirect to={`/appointment/patient/call?_id=${appointmentId}`} />;
  else if (page === 'MODIFY')
    return <Redirect to={`/appointment/${appointmentId}/modify`} />;

  return canceledAppointmentId ? (
    <Redirect to="/appointment" />
  ) : (
    currentAppointment && (
      <div>
        <div className="content-summary">
          <div className="left-summary">
            <h2>Your Appointment</h2>
            <div className="content-summary-info">
              <div className="top-summary-info">
                <div className="left-summary-info">
                  <img className="avatar" src={currentAppointment.doctor.avatarUrl} alt='' />
                  <div className="info">
                    <p>
                      {firstName} {lastName}
                    </p>
                    <span>{bio}</span>
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
                {today <= new Date(dateAndTime) && (
                  <div>
                    <button
                      onClick={() => setPage('CALL')}
                      className="btn btn-gradient"
                    >
                      Join Call
                    </button>
                    <div className="block-btn">
                      <button
                        onClick={() => setPage('MODIFY')}
                        className="btn btn-gradient"
                      >
                        Modify
                      </button>
                    </div>
                    <div className="block-btn">
                      <button
                        onClick={() => handleCancelAppointment()}
                        className="btn btn-gradient"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="right-summary">
            <div>
              {linkVideoToOpen && (
                <div>
                  <FlatButton
                    label="Close"
                    primary={true}
                    onClick={handleCloseVideoPreview}
                  />
                  <ReactPlayer
                    url={linkVideoToOpen}
                    width="100%"
                    height="100%"
                    playing="true"
                    controls="true"
                  />
                </div>
              )}
              <p className="mb-4 mt-2 text-title">Video</p>
              {video.map((item, index) => (
                <div
                  key={index}
                  className="right-summary-block block-flex"
                  onClick={() =>
                    openCloudPublicUrl(item.fileUrl, false, 'video')
                  }
                >
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
                  key={index}
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
                {patientNote !== "" ? <div className="content-summary-block">
                  <p>{patientNote}</p>
                </div> : null
                }
              {
                currentAppointment.audios.length > 0 ? (
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
          </div>
          <DialogPdfPreview
            fileModeToOpen={fileModeToOpen}
            isOpenFile={isOpenFile}
            file={linkFileToOpen}
            handleCloseFilePreview={(e) => handleCloseFilePreview(e)}
          />
        </div>
      </div>
    )
  );
}
