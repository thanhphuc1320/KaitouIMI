import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import Avatar from 'material-ui/Avatar';
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';
import styles from '../../layouts/styles/userProfileStyle';
import DatePicker from 'react-datepicker';
import { getDoctorList } from '../../store/actions/user.action';
import { uploadMultiple } from '../../utils';
import ico_alarm_bell from '../../img/imi/alarm-bell-blue.png';
import ico_search from '../../img/imi/ico-search.png';
import avatarUrl from '../../img/d_ava.png';
import img_default from '../../img/imi/ico-img-default.png';
import ico_add from '../../img/imi/ico-add-schdule.png';
import { formatAMPM } from '../../utils';

import { useHistory } from 'react-router-dom';

import { toast } from 'react-toastify';
import { uploadPublicFileApiCall } from '../../apiCalls/file.api';
import {
  bookAppointment,
  getAppointments,
  updateAppointment,
} from '../../store/actions/appointment.action';

import ico_video_call from '../../img/imi/ico-video-call.png';
export default function CreateAppointment() {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user) || {};
  const { doctorlist = [] } = useSelector((state) => state.user);
  const { appointments = [] } = useSelector((state) => state.appointment);
  const createAppointment = useSelector(
    (state) => state.appointment.createAppointment
  );
  const [startDate, setStartDate] = useState(new Date());
  const pageSize = 20;
  const [search, setTextSearch] = useState('');
  const [page, setPage] = useState(1);
  const dateNow = moment(new Date()).format('DD/MM/YYYY');
  const timeNow = new Date().getHours();
  const [listDataResult, setListDataResult] = useState([]);
  const [isShow, setIsShow] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTimeAppointment, setSelectedTimeAppointment] = useState(null);
  const [patientNote, setPatientNote] = useState("");
  const [fileTestType, setFileTestType] = useState('bloodTest');
  let upcomingAppointmentList = [];

  const [listFile, setListFile] = useState([]);

  const listSchedule = [
    { key: '00AM', time: '0 AM', list: [] },
    { key: '01AM', time: '1 AM', list: [] },
    { key: '02AM', time: '2 AM', list: [] },
    { key: '03AM', time: '3 AM', list: [] },
    { key: '04AM', time: '4 AM', list: [] },
    { key: '05AM', time: '5 AM', list: [] },
    { key: '06AM', time: '6 AM', list: [] },
    { key: '07AM', time: '7 AM', list: [] },
    { key: '08AM', time: '8 AM', list: [] },
    { key: '09AM', time: '9 AM', list: [] },
    { key: '10AM', time: '10 AM', list: [] },
    { key: '11AM', time: '11 AM', list: [] },
    { key: '12PM', time: '12 PM', list: [] },
    { key: '01PM', time: '1 PM', list: [] },
    { key: '02PM', time: '2 PM', list: [] },
    { key: '03PM', time: '3 PM', list: [] },
    { key: '04PM', time: '4 PM', list: [] },
    { key: '05PM', time: '5 PM', list: [] },
    { key: '06PM', time: '6 PM', list: [] },
    { key: '07PM', time: '7 PM', list: [] },
    { key: '08PM', time: '8 PM', list: [] },
    { key: '09PM', time: '9 PM', list: [] },
    { key: '10PM', time: '10 PM', list: [] },
    { key: '11PM', time: '11 PM', list: [] },
  ];

  let data = {
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    address: '',
    patientNumber: '',
    hospitalId: '',
    typeOfCare: '',
    specialist: '',
    avatarUrl: '',
  };
  const getdoctorlist = () => {
    dispatch(getDoctorList({ pageSize: pageSize, page: page, search: search }));
  };
  useEffect(() => {
    setListDataResult(listSchedule);
    getdoctorlist();
  }, []);

  useEffect(() => {
    if (listDataResult.length > 0) {
      getOffsetPoint();
    }
  }, [listDataResult]);

  const getOffsetPoint = () => {
    const elmnt = document.getElementById('point-active');
    elmnt.scrollIntoView({ block: 'center' });
  };

  const searchDoctor = (event) => {
    const value = event.target.value;
    setTextSearch(event.target.value);
    dispatch(getDoctorList({ pageSize: pageSize, page: page, search: value }));
  };
  let toastId = null;
  const notify = () =>
    (toastId = toast('Uploading File..', {
      className: 'toast-container',
    }));

  const handleInputChange = (e) => {
    const { files } = e.target || [];
    const listPromise = [];
    if (files.length >= 1) {
      let countFile = listFile.length + files.length;
      if (countFile > 5) {
        toast.error('You can not upload more than 5 pictures file', {
          className: 'error-toast-container',
          autoClose: 2000,
        });
      } else {
        notify();
        for (let index = 0; index < files.length; index++) {
          const file = files[index];
          const fileType = file['type'];
          const uploadingData = {
            file,
            fileTestType,
            patientId: user._id,
            fileName: file.name,
          };
          listPromise.push(uploadMultiple(uploadingData, index));
          if (listPromise.length === files.length) {
            Promise.all(listPromise)
              .then((resDataPublic) => {
                let dataResult = [...listFile, ...resDataPublic];
                setListFile(dataResult);
              })
              .catch((e) => console.log(e));
          }
        }
      }
    }
  };
  const addAppointment = () => {
    const uploadImages = listFile.map((item) => {
      if (item.publicFileUrl) {
        return item;
      }
    });
    const appointment = {
      mode: 2,
      appointmentId: selectedTimeAppointment._id,
      status: 1,
      image: uploadImages || [],
      video: [],
      patientNote: patientNote,
      doctorId: selectedDoctor._id,
    };
    if (selectedTimeAppointment._id && selectedDoctor._id) {
      dispatch(bookAppointment(appointment))
    }
  }
  const onBack = () =>{
    history.push('/appointment')
  }

  const getNameDoctor = (e) => {
    if (selectedDoctor.firstName || selectedDoctor.lastName) {
      return `${selectedDoctor?.firstName || ''} ${
        selectedDoctor?.lastName || ''
      }`;
    } else {
      return selectedDoctor.email;
    }
  };

  const selectTimeAppointment = (item, index) => {
    const data = item.list[index];
    setSelectedTimeAppointment({ ...data, index });
  };
  const handleSelectedDoctor = (item, index) => {
    setSelectedDoctor({ ...item, index });
  };
  useEffect(() => {
    if (selectedDoctor)
      dispatch(
        getAppointments({
          dateAndTime: startDate.setHours(0, 0),
          endDateAndTime: new Date(startDate).setHours(23, 59),
          doctor: selectedDoctor._id,
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoctor]);

  useEffect(() => {
    if (createAppointment) {
      history.push(`/summary-appointment/${createAppointment._id}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createAppointment]);

  useEffect(() => {
    if (doctorlist) setSelectedDoctor({ ...doctorlist[0], index: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorlist]);

  useEffect(() => {
    if (appointments.length > 0) {
      appointments.map((appointment) =>{
        if(new Date(appointment.dateAndTime) > new Date())
          upcomingAppointmentList.push(appointment)
      })
      const dataAppointments = upcomingAppointmentList.reduce((arr, obj) => {
        const hhStart = moment(obj.dateAndTime).format('hh')
        const timeAStart = moment(obj.dateAndTime).format('A')
        const hhEnd = moment(obj.endDateAndTime).format('hh')
        const timeAEnd = moment(obj.endDateAndTime).format('A')
        const keyStart = `${hhStart}${timeAStart}`
        const keyEnd = `${hhEnd}${timeAEnd}`
        const longTime = Number(hhEnd) - Number(hhStart)
        if (longTime >= 1) {
          let dataTemp = {...obj}
          for(let i = 1; i<=longTime; i++) {
            let keyTemp = `${Number(hhStart) + i}${timeAStart}`
            let keyTempPrev = `${Number(hhStart) + i - 1}${timeAStart}`
            if (Number(hhStart) < 10) {
              keyTemp = `0${keyTemp}`
              keyTempPrev = `0${keyTempPrev}`
            }
            dataTemp.className = "two-time"
            const lengthArray = arr[keyTempPrev]?.length
            
            if (hhStart != "" && obj.status === 0) {
              if (lengthArray > 0) {
                arr[keyTempPrev][lengthArray - 1].className = 'one-time'
              }
              (arr[keyTemp] = arr[keyTemp] || []).push(dataTemp)
            }
          }
        }

        else{
          if (hhStart != "" && obj.status === 0) (arr[keyStart] = arr[keyStart] || []).push(obj)
        }
        return arr
      }, {});
      listSchedule.forEach((item) => {
        Object.keys(dataAppointments).forEach((keyData, index) => {
          if (item.key === keyData) {
            item.list = dataAppointments[keyData];
          }
        });
      });
      setListDataResult(listSchedule);
    } else {
      setListDataResult(listSchedule);
    }
  }, [appointments]);
  return (
    <div className="appointment-new">
      <div className="topAppointment">
        <div className="leftTop">
          <h2 className="color-appoiment-h2">
            <NavLink to="/appointment">
              <span>Appointment</span>
            </NavLink>
            Set up your appointment
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
            <img src={user.avatarUrl ? user.avatarUrl : avatarUrl} alt="" />
          </NavLink>
        </div>
      </div>
      <div className="container-admin">
        <div className="left">
          <div className="date-picker-admin ml-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              inline
            />
          </div>
          <div className="search-admin form-group mr-3 mt-3 mb-3 pl-3">
            <input
              className="form-control"
              type="text"
              name="search"
              placeholder="Find doctor"
              onChange={(event) => searchDoctor(event)}
            />
            <img src={ico_search} alt="" />
          </div>
          <div className="schedule-doctor mt-2">
            <p className="pl-3">Today, {dateNow}</p>
            <div className="list-schedule-doctor">
              {doctorlist.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={
                      selectedDoctor && selectedDoctor.index === index
                        ? 'border-top-unset list-doctor-admin'
                        : 'border-top-list-doctor list-doctor-admin'
                    }
                    onClick={() => handleSelectedDoctor(item, index)}
                  >
                    <div
                      className={
                        selectedDoctor && selectedDoctor.index === index
                          ? 'active-doctor'
                          : 'unactive-doctor'
                      }
                    >
                      <span
                        className={
                          item.active ? 'status-active' : 'status-unactive'
                        }
                      ></span>
                      <p>
                        {item.firstName} {item.lastName}
                      </p>
                      {!item.firstName && !item.lastName && <p>{item.email}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="right">
          <div className="schedule-content">
            <div className="grid">
              <div className="box-1">GMT +7</div>
              <div className="note-schedule">
                {moment(startDate).format('LL')}
              </div>
            </div>
            {listDataResult.map((item, index) => {
              return (
                <div key={index} className="grid item-appoiment">
                  <div className="box-1 p-re-grid">
                    <div
                      id={index + 1 == timeNow ? 'point-active' : ''}
                      className={index + 1 == timeNow ? 'active-slot-time' : ''}
                    >
                      {item.time}
                    </div>
                  </div>
                  <div className=" border-bottom-grid">
                    {item.list.map((e, indexItem) => {
                      const { dateAndTime, endDateAndTime } = e;
                      const [time, timeExtra] = formatAMPM(
                        new Date(dateAndTime)
                      );
                      const [endTime, endTimeExtra] = formatAMPM(
                        new Date(endDateAndTime)
                      );
                      return (
                        <div
                          key={indexItem}
                          className = {`${( selectedTimeAppointment && selectedTimeAppointment._id === e._id)? 'active-time-doctor active': 'active-time-doctor' } 
                          ${e.className ? e.className : 'margin-bottom-time'}
                          `}
                          onClick={() => selectTimeAppointment(item,indexItem)}
                        >
                          <p className="name">
                            {getNameDoctor(e)}
                            <img className="ml-3" src={ico_video_call} alt="" />
                          </p>
                          <div className="time">
                            <p>
                              {time} {timeExtra}
                            </p>
                            <p className="border-time"></p>
                            <p>
                              {endTime} {endTimeExtra}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="appointment-right">
            <h4>Please tell us what is your problem!</h4>
            <div>
              <div className="list-pic">
            {
              listFile.length <2 ? (
                <div className="panel-body mt-2">
                <input
                  accept="image/jpeg,image/gif,image/png"
                  id="outlined-button-file-avatar-upload"
                  multiple={true}
                  type="file"
                  onChange={(e) => handleInputChange(e)}
                  name="upload-avatar"
                  style={styles.FileInput}
                />
                <div className="upload-avatar-wrap">
                  <div className="avatar-personal custom-width">
                    <Avatar
                      className="upload-avatar"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        height: '200px',
                        width: '250px',
                        objectFit: 'none',
                        borderRadius: '32px',
                        backgroundColor: '#F7931E',
                      }}
                    />
                    <div className="tilte-upload-more">
                      {listFile.length > 0 && (<img className = "content-pic"
                        src={listFile[0].publicFileUrl} alt=""/>)}
                      {listFile?.length === 0 && (<img src={img_default} alt='' />)}
                      {listFile?.length === 0 && (
                        <p className="mb-0">Upload your image/video</p>
                      )}
                    </div>
                    {listFile.length === 0 && (<label htmlFor="outlined-button-file-avatar-upload">
                      <div className="upload-avatar-overlay">
                        <CloudUploadIcon style={styles.CloudUploadIcon} />
                      </div>
                    </label>)}
                  </div>
                </div>
              </div>
              ): ''
            }
                 {
                   listFile?.length >1 ? (
                    <div className="grid-add-pic">
                    {listFile && listFile.map((value, index) => {
                      return (
                        <div className="center" key={index}>
                           <img className="item-pic" src={value.publicFileUrl ?value.publicFileUrl : img_default} />
                        </div>
                      );
                    })}
                  </div>
                   ):''
                 }
              </div>
            </div>
            {listFile?.length > 0 ? (
              <div className="form-group">
                <input
                  accept={
                    'file_extension,image/*,application/pdf' ||
                    'file_extension|audio/*|image/*|media_type'
                  }
                  id={`outlined-button-file-image`}
                  type="file"
                  multiple={true}
                  onChange={(e) => handleInputChange(e)}
                  style={{ display: 'none' }}
                  onClick={(e) => (e.target.value = null)}
                  disabled={false}
                />
                <label
                  className="add-more"
                  htmlFor={`outlined-button-file-image`}
                >
                  Add more image or video
                </label>
              </div>
            ) : (
              ''
            )}
            <div className="describe">
              <div className="item-upload">
                <p>Describe Your Need</p>
                <textarea
                  onChange={(e) => setPatientNote(e.target.value)}
                  placeholder="Type what you would like to discuss"
                  value={patientNote}
                />
              </div>
            </div>
            <div className="btn-group-appointment">
              <button className="cancel mr-4" onClick={onBack}>
                cancel
              </button>
              <button className="add-appointment-new" onClick={addAppointment}>
                <img src={ico_add} alt="" className="mr-3" />
                Add Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
