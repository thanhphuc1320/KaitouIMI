import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';
import styles from '../../layouts/styles/userProfileStyle';
import { useHistory } from 'react-router-dom';

import ico_alarm_bell from '../../img/imi/alarm-bell-blue.png';
import ico_search from '../../img/imi/ico-search.png';
import avatarUrl from '../../img/d_ava.png';
import img_default from '../../img/imi/ico-img-default.png';
import moment from 'moment';

import { cancelAppointment, getAppointment } from '../../apiCalls/appointment.api';
import { getPublicUrlApiCall } from '../../apiCalls/file.api';

import {
  formatAMPM,
  isURL
} from '../../utils';

export default function SummaryAppointment(props) {
  const history = useHistory();
  const params = useParams()
  const dispatch = useDispatch()
  const appointmentId = params.idAppointment;
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [displayTimeZone, setDisplayTimeZone] = useState(null);
  const [nameDoctor, setNameDoctor] = useState('');
  const [displayDate, setDisplayDate] = useState();
  const [timeAppointment, setTimeAppointment] = useState();
  const [timeExtraAppointment, setTimeExtraAppointment] = useState();
  const [appointmentConvert, setAppointmentConvert] = useState([]);
  const appointment = useSelector((state) => state.appointment);

  const listFile=[

    {data: 'data'},
    {data: 'data'},
    {data: 'data'},
    {data: 'data'},
  ]
  const {
    dateAndTime = '',
    doctor = {},
    image = [],
    video = [],
    patientNote = '',
  } = currentAppointment || {};

  const onBackToCreate = () =>{
    history.push('/create-appointment');
  }

  const getNameDoctor = () => {
    if((currentAppointment && currentAppointment.doctor?.firstName) ||( currentAppointment && currentAppointment.doctor?.lastname)){
      setNameDoctor(`${currentAppointment.doctor?.firstName || ''} ${
        currentAppointment.doctor?.lastName || ''
      }`)
    }else{
      setNameDoctor(currentAppointment.doctor.email)
    }
  }
  const handleCancelAppointment = () => {
    cancelAppointment({ appointmentId }).then(() => {
      history.push('/appointment')
    })
  }
  useEffect(() => {
    let date = ''
    if (currentAppointment) {
      date = new Date(currentAppointment.dateAndTime)
      getNameDoctor()
      const displayDateTemp =
        new Date(dateAndTime).toLocaleString('default', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }) || '';
      const [displayTime, displayTimeExtra] = formatAMPM(dateAndTime) || '';
      setDisplayDate(displayDateTemp)
      setTimeAppointment(displayTime)
      setTimeExtraAppointment(displayTimeExtra)
      let dataResult = []
      currentAppointment.image.forEach(itemFile => {
        getPublicUrlApiCall({ itemUrl: itemFile.fileUrl, redirect: false })
          .then((resDataPublic) => {
            if (!resDataPublic.data.code) {
              const dataFile = {
                fileUrl: resDataPublic.data.signedUrl
              }
              dataResult = [...dataResult, dataFile]
              setAppointmentConvert(dataResult)
            }
          })
      });
    }
  }, [currentAppointment]);
  useEffect(() => {
    async function getListAppoinment() {
      const list = await getAppointment({ _id: appointmentId })
      if (list.data.code) { 
      } else setCurrentAppointment(list.data[0])
      if (appointment.hasRecord && list.data[0].audios.length <= currentAppointment?.audios.length || 0) {
        await getListAppoinment(); 
      }
    }

    getListAppoinment()
  }, [appointmentId]);
  return (
    <div className="appointment-new">
      <div className="topAppointment">
        <div className="leftTop">
          <h2 className="color-appoiment-h2">
            <NavLink to="/appointment-new">
              <span>Appointment</span>
            </NavLink>
            Summary of your appointment
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
          <a href="#!" className="avatar">
            <img src={(currentAppointment && currentAppointment.doctor.avatarUrl) ? currentAppointment.doctor.avatarUrl : avatarUrl} alt="" />
          </a>
        </div>
      </div>
      <div className="content-summary">
          <div className="left-summary">
            <h2>Your Appointment</h2>
            <div className="content-summary-info">
              <div className="top-summary-info">
                <div className="left-summary-info mt-3">
                  <img className="avatar" src={(currentAppointment && currentAppointment.doctor.avatarUrl) ? currentAppointment.doctor.avatarUrl : avatarUrl} alt='' />
                  <div className="info">
                    <p>
                    {nameDoctor}
                    </p>
                    <span className="mt-2 mb-2">California Amergency Center</span>
                    <p className="status">
                      <span></span>Online
                    </p>
                  </div>
                </div>
              </div>
              <div className="bottom-summary-info">
                  <p>Your appointment will be open on</p>
                  <h2>{displayDate}</h2>
                  <h1>{timeAppointment}{timeExtraAppointment}</h1>
                  <span>GMT+0700</span>
                  <div className="btn-ground-summary">
                      <button className="btn-modify mr-2" onClick={onBackToCreate}>Modify Appointment</button>
                      <button className="btn-camcel" onClick={handleCancelAppointment}>Cancel Appointment</button>
                  </div>
              </div>
            </div>
          </div>
          <div className="right-summary">
            <div className="list-pic-summary">
              <div className="grid-add-pic">
                {appointmentConvert && appointmentConvert.map((item, index) => {
                  return (
                    <div className="panel-body mt-2" key={index}>
                      <div className="upload-avatar-wrap">
                        <div className="avatar-personal custom-width-summary">
                          <div className="tilte-upload-more w-100 h-100">
                            <img src={item.fileUrl} alt=""  className="w-100 h-100"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="describe">
              <div className="item-upload upload-summary">
                <p>Describe Your Need</p>
                <textarea
                  disabled={true}
                  placeholder="Type what you would like to discuss"
                  value={patientNote}
                />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
