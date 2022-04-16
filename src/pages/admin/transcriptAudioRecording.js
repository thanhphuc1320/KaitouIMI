import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import AudioPlayer from 'material-ui-audio-player';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink} from 'react-router-dom';

import '../../static/css/admin-dashboard.css';
import img_doctor from '../../img/imi/img-doctor.png';
import ico_doctor from '../../img/imi/ico-doctor.png';
import ico_patient from '../../img/imi/ico-patient.png';
import ico_next from '../../img/imi/ico-next.png';
import ico_pre from '../../img/imi/ico-pre.png';
import next from '../../img/imi/next.png';
import pre from '../../img/imi/pre.png';
import defaultAva from '../../img/d_ava.png';
import ico_bell from '../../img/imi/alarm-bell-black.png';

import FileCopyIcon from '@material-ui/icons/FileCopy';

import { formatAMPM, isURL } from '../../utils';
import { getAppointment } from '../../apiCalls/appointment.api';
import {
  getTextRecord
} from '../../store/actions/textRecord.action';

export default function TranscriptRecording(props) {
  const dispatch = useDispatch();
  const { appointmentId } = props.match.params;
  const appointment = useSelector((state) => state.appointment);
  const transcriptURIData = useSelector((state) => state.textRecord.data);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [fileURI, setFileURI] = useState(null);
  const [transcriptURI, setTranscriptURI] = useState(null);
  const [listTranscript, setListTranscript] = useState([]);
  const user = useSelector((state) => state.user);
  const { avatarUrl = defaultAva } = user;

  useEffect(() => {
    async function subscribe() {
      let response = await getAppointment({_id: appointmentId})
      setCurrentAppointment(response.data[0])
      const data = response.data[0]
      const datalength = data.audios.length
      if (data.audios && datalength > 0 ) {
        const fileURI = data.audios[datalength - 1][0].fileURI
        setFileURI(fileURI)
        const transcriptURI = data.audios[datalength - 1][0].transcriptURI
        setTranscriptURI(transcriptURI)
        dispatch(getTextRecord(transcriptURI));
      }
    }
    subscribe();
  }, [appointmentId])

  useEffect(() => {
    if (transcriptURIData.length) {
      const lineText = transcriptURIData.split('\n')
      const newRray = lineText.map((item, index) => {
        const splitContent = item.split(' - ')
        let data = {
          role: splitContent[0],
          content: splitContent[1]
        }
        return data
      })
      setListTranscript(newRray);
    }
  }, [transcriptURIData])

  const {
    dateAndTime = '',
    endDateAndTime = '',
    doctor = {}
  } = currentAppointment || {};
  const displayDate =
  new Date(dateAndTime).toLocaleString('default', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }) || '';

  const [displayStartTime] = formatAMPM(dateAndTime);
  const [displayEndTime] = formatAMPM(endDateAndTime);
  const {
    firstName = '',
    lastName = ''
  }= doctor || {};

  const muiTheme = createMuiTheme({});
  const useStyles = makeStyles((theme) => {
    return {
      root: {
          boxShadow: 'none',
          margin: '0px',
          width: '100%',
          // display: 'grid',
          // padding: '5px',
      },
      playIcon: {
        marginTop: '-20px',
        // margin: '-20px',
        width: '1em',
        height: '1em',
        color: '#4136F1',
      },
      replayIcon: {
        marginTop: '-20px',
        // margin: '-20px',
        width: '1em',
        height: '1em',
        color: '#4136F1',
      },
      pauseIcon: {
        marginTop: '-20px',
        // margin: '-20px',
        width: '1em',
        height: '1em',
        color: '#4136F1',
      },
      progressTime: {
        padding: '0px',
        color: '#000000',
        opacity: '0.6',
      },
      mainSlider: {
        padding: '0px',
        color: '#4136F1',
        height: '18px'
      },
    };
  });
  return (
    <div>
      <div className="topAppointment">
        <div className="leftTop">
        <h2 className="color-appoiment-h2"><NavLink to="/appointment"><span>Appointments</span></NavLink>Audio Record & Transcript</h2>
        </div>
        <div className="rightTop">
          <a href="#!">
            <img src={ico_bell} alt="" />
            <span className="count">3</span>
          </a>
          <NavLink to="/update-profile" className="avatar">
            <img src={avatarUrl} alt="" />
          </NavLink>
        </div>
      </div>
      <div className="recording">
      <div className="left">
        <div className="title-left">
          <h5>Audio Record</h5>
          <p className="font-weight-bold mb-1">{displayDate}</p>
          <p>From : {displayStartTime} to {displayEndTime}</p>
        </div>
        <div className="audio">
          <div className="audio-recording">
            <img src={img_doctor} alt="" />
            <p>Dr. {firstName} {lastName}</p>
          </div>
          <div className="text-center main-content-record mt-4">
            <ThemeProvider theme={muiTheme}>
                  <AudioPlayer
                        width="100%"
                        useStyles={useStyles}
                        src={fileURI}
                        loop={false}
                        volume={false}
                        variation="primary"
                        // order={1}
                  />
            </ThemeProvider>
         {/* <div className="group-btn-audio">
         <div>
            <img className="mr-4" src={pre} alt='' />
            <img src={ico_pre} alt='' />
          </div>
          <div>
            <img className="mr-4" src={ico_next} alt='' />
            <img src={next} alt='' />
          </div>
         </div> */}
          </div>
        </div>
      </div>
      <div className="right">
        <p className="title">Transcript</p>
        <div className="transcript">
          {
            listTranscript.length > 0 ? (
              listTranscript.map((item, key) => {
                if (item && item.role === 'Doctor' && item.content) {
                  return (
                    <div className="text-doctor" key={key}>
                      <p className="name-left">
                        <span className="pr-2">
                          <img src={ico_doctor} alt="" />
                        </span>
                        Dr.{doctor.firstName} {doctor.lastName}
                      </p>
                      <div className="description">
                        <p>{item.content}</p>
                      </div>
                    </div>
                  );
                } else if (item && item.role === 'Patient' && item.content) {
                  return (
                    <div className="text-patient" key={key}>
                      <p className="name-right">
                        <span className="pr-2">
                          <img src={ico_patient} alt="" />
                        </span>
                        Patient
                      </p>
                      <div className="description">
                        <p>{item.content}</p>
                      </div>
                    </div>
                  );
                }
              })
            ) : (
              <div className="text-center mt-5">
                <FileCopyIcon className="icon-file"/>
                <span>No data Transcript</span>
              </div>)
          }

        </div>
      </div>
    </div>
    </div>
  );
}
