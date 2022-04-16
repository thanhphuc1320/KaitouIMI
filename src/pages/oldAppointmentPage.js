/* eslint-diasble (react/jsx-filename-extension) */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createAppointment,
  getAppointments,
  bookAppointment,
} from '../store/actions/appointment.action';
import {
  convertDate,
  convertMilisecondToDate,
  formatAMPM,
  isURL,
} from '../utils';

// import MaterialTable from 'material-table';
import Avatar from 'material-ui/Avatar';
import DatePicker from 'react-datepicker';
import { InputBase, TextField, Button } from '@material-ui/core';
import 'react-datepicker/dist/react-datepicker.css';

import {
  DOCTOR_ROLE,
  PATIENT_ROLE,
  IMAGE_MODE,
  IMAGE_TYPES,
  PDF_MODE,
  PDF_TYPE,
} from '../constant';

import Carousel from 'react-multi-carousel';
import DialogPdfPreview from '../components/dialog/dialogPdfPreview';
import 'react-multi-carousel/lib/styles.css';

import avatarUrl from '../img/d_ava.png';

import '../static/css/appointment.css';
import ico_bell from '../img/imi/alarm-bell-black.png';
import ico_add from '../img/imi/ico-add-green.png';
import img_empty from '../img/imi/line-empty-up.png';
import ico_add_green from '../img/imi/icon-add-gradient.png';
import img_empty_down from '../img/imi/line-empty-down.png';

import ico_play from '../img/imi/ico-play-circle.png';
import ico_fullscreen from '../img/imi/ico-fullscreen-screen.png';
import {
  oldUploadFileApiCall,
  getPublicUrlApiCall,
} from '../apiCalls/file.api';

const styles = {
  textField: {
    width: '100px',
  },
  previewButton: {
    marginLeft: '10px',
    fontSize: '10px',
  },
};

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export default function AppointmentPage() {
  const user = useSelector((state) => state.user) || {};
  const { appointments } = useSelector((state) => state.appointment) || [];
  const { role } = user;
  const dispatch = useDispatch();

  // Update requestsToReview in user object
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState('07:30');
  const [duration, setDuration] = useState(60);

  const dateInDisplay = startDate.toLocaleString('default', {
    month: 'long',
    day: 'numeric',
  });

  const availableAppointmentSlots = appointments.filter(
    (appointment) => appointment.status === 0
  );

  const bookings =
    role === PATIENT_ROLE
      ? appointments.filter(
          (appointment) =>
            appointment.patient && appointment.patient._id === user._id
        )
      : appointments.filter((appointment) => appointment.doctor === user._id);

  const [valPatientAppointmentList, setValPatientAppointmentList] = useState(
    'patientAppointmentList'
  ); // change to
  const [valDoctorAddTimeSlot, setValDoctorAddTimeSlot] = useState(
    'doctorAddTimeSlot'
  ); // change to "info"
  const [patientBooking, setPatientBooking] = useState(null);

  const handleCreateAppointment = () => {
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const day = startDate.getDate();
    const hours = startTime.split(':')[0];
    const minutes = startTime.split(':')[1];

    const dateAndTime = new Date(year, month, day, hours, minutes);
    const endDateAndTime = new Date(
      dateAndTime.getTime() + duration * 60 * 1000
    );

    const newAppointment = {
      mode: 1,
      status: 0,
      dateAndTime,
      endDateAndTime,
    };
    dispatch(createAppointment(newAppointment));
  };

  const goToPatientSetupAppointment = () => {
    setValPatientAppointmentList('patientAppointmentSetup');
  };

  const handleBookAppointment = () => {
    if (!patientBooking) return;
    const appointment = {
      mode: 2,
      appointmentId: patientBooking,
      status: 1,
      image: uploadImages || [],
    };
    dispatch(bookAppointment(appointment));
    setValPatientAppointmentList('patientAppointmentList');
  };

  useEffect(() => {
    dispatch(
      getAppointments({
        dateAndTime: convertMilisecondToDate(startDate),
      })
    );
    // TODO: [PATIENT] fetch appointments by doctor
  }, [startDate]);

  const [linkFileToOpen, setLinkFileToOpen] = useState(null);
  const [fileTypeToOpen, setFileTypeToOpen] = useState(null);
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

  // const [addedInfo, setAddedInfo] = useState(null);
  const [uploadImages, setUploadImages] = useState([]);
  // const [uploadVideos, setUploadVideos] = useState([]);

  const handleUploadFile = (e) => {
    const { files } = e.target || [];
    if (files.length > 0) {
      const file = files[0];
      const fileType = file['type'];
      const uploadingData = {
        file,
        patientId: user._id,
      };
      oldUploadFileApiCall(uploadingData)
        .then((res) => {
          const { fileName, fileType, fileUrl } = res.data;
          getPublicUrlApiCall({ itemUrl: fileUrl, redirect: false })
            .then((res) => {
              if (!res.data.code) {
                const { signedUrl } = res.data;
                const uploadedFile = {
                  fileName,
                  fileType,
                  publicFileUrl: signedUrl,
                };
                setUploadImages(uploadImages.concat([uploadedFile]));
              }
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    }
  };

  const onRemoveFile = (e, index) => {
    setUploadImages([
      ...uploadImages.slice(0, index),
      ...uploadImages.slice(index + 1),
    ]);
  };

  return (
    <div className="appointment-page">
      <div className="topAppointment">
        <div className="leftTop">
          <h2>Appointments</h2>
        </div>
        <div className="rightTop">
          <a href="#">
            <img src={ico_bell} />
            <span className="count">3</span>
          </a>
          <a href="#" className="avatar">
            <img src={avatarUrl} />
          </a>
        </div>
      </div>
      {role === DOCTOR_ROLE ? (
        <div>
          {valDoctorAddTimeSlot === 'doctorAddTimeSlot' ? (
            <div className="doctor-apointment">
              <div className="left-doctor">
                <div className="top-calendar">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    inline
                  />
                </div>
                <div className="bottom-doctor-available">
                  <h2>Add in available time</h2>
                  <div className="doctor-available-content">
                    <p>{dateInDisplay}</p>
                    <p>
                      <InputBase
                        id="time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 min
                        }}
                      />
                    </p>
                    <p>
                      <span>
                        <TextField
                          type="number"
                          variant="outlined"
                          label="Duration"
                          value={duration}
                          style={styles.textField}
                          onChange={(e) => setDuration(e.target.value)}
                          inputProps={{
                            step: 5,
                          }}
                        />{' '}
                        minutes
                      </span>
                    </p>
                    <a
                      className="ico_add"
                      onClick={(e) => handleCreateAppointment(e)}
                    >
                      <img src={ico_add_green} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="right-doctor">
                {!appointments || appointments.length === 0 ? (
                  <div>
                    <h2>Today’s Appoinments</h2>
                    <div className="content-right-doctor">
                      <div className="empty-right-doctor">
                        <p>
                          You don’t have any appointment
                          <br />
                          Let add your available time
                        </p>
                        <p>
                          <img src={img_empty_down} />
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="block-available">
                    <h2>{dateInDisplay}</h2>
                    <div className="content-available">
                      <ul>
                        {bookings.map((booking) => {
                          const [time, timeExtra] = formatAMPM(
                            new Date(booking.dateAndTime)
                          );
                          return booking.status === 1 ? (
                            <li
                              className="item-available active"
                              onClick={() => setValDoctorAddTimeSlot('info')}
                            >
                              <div className="left-available">
                                <img
                                  className="avatar"
                                  src={booking.patient.avatarUrl}
                                />
                                <span>
                                  {booking.patient.firstName}{' '}
                                  {booking.patient.lastName}
                                </span>
                              </div>
                              <div className="right-available">
                                <p>{time}</p>
                                <span>{timeExtra}</span>
                              </div>
                            </li>
                          ) : (
                            <li className="item-available">
                              <div className="left-available">
                                Available Time
                              </div>
                              <div className="right-available">
                                <p>{time}</p>
                                <span>{timeExtra}</span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="content-summary">
              <div className="left-summary">
                <h2>JuLy 18, Friday</h2>
                <div className="content-summary-info">
                  <div className="top-summary-info">
                    <div className="left-summary-info">
                      <img className="avatar" src={avatarUrl} />
                      <span>Amanda</span>
                    </div>
                    <div className="right-summary-info">
                      <p>9:45</p>
                      <span>AM</span>
                    </div>
                  </div>
                  <div className="bottom-summary-info">
                    <div className="item-summary-info">
                      <p>Email:</p>
                      <p>Amanda@imi.ai</p>
                    </div>
                    <div className="item-summary-info">
                      <p>Gender:</p>
                      <p>Female</p>
                    </div>
                    <div className="item-summary-info">
                      <p>Birthday</p>
                      <p>1960/02/29</p>
                    </div>
                    <div className="item-summary-info">
                      <p>Biography</p>
                      <p>Prime Minister</p>
                    </div>
                    <div className="item-summary-info">
                      <p>Phone:</p>
                      <p>010-7740-5685</p>
                    </div>
                    <div className="item-summary-info">
                      <p>Address:</p>
                      <p>White House</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="right-summary">
                <div className="right-summary-block block-flex">
                  <div className="left">
                    <h3>Video</h3>
                  </div>
                  <div className="right">
                    <p>Vdieo 1</p>
                    <img src={ico_play} />
                  </div>
                </div>
                <div className="right-summary-block block-flex">
                  <div className="left">
                    <h3>Images</h3>
                  </div>
                  <div className="right">
                    <p>3 images</p>
                    <img src={ico_fullscreen} />
                  </div>
                </div>
                <div className="right-summary-block">
                  <h3>Question</h3>
                  <div className="content-summary-block">
                    <textarea placeholder="For this photo, please tell me my actual situation. "></textarea>
                  </div>
                </div>
                <div className="block-btn">
                  <button className="btn btn-gradient">Join Call</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="ml-3 mr-3">
          {valPatientAppointmentList === 'patientAppointmentList' ? (
            <div className="appoint-content-add">
              <div className="add-appointment">
                <a
                  className="btn btn-gradient"
                  onClick={() => goToPatientSetupAppointment()}
                >
                  Book an appointment
                  <span className="ico-add">
                    <img src={ico_add} />
                  </span>
                </a>
                {!bookings && !bookings.length && (
                  <div className="arrow-slider"></div>
                )}
              </div>
              <div className="content-add">
                {!bookings || !bookings.length ? (
                  <div className="appoint-empty">
                    <img src={img_empty} />
                    <p>
                      You don’t have any appointment <br /> Let’s create your
                      appointment
                    </p>
                  </div>
                ) : (
                  <div className="list-doctor-appoint">
                    <Carousel responsive={responsive}>
                      {bookings.map((booking) => {
                        const bookingDate = new Date(
                          booking.dateAndTime
                        ).toLocaleString('default', {
                          month: 'long',
                          day: 'numeric',
                        });
                        const [bookingTime, bookingTimeExtra] = formatAMPM(
                          booking.dateAndTime
                        );
                        return (
                          <div
                            className={`list-doctor-appoint-item ${
                              booking.status === 1 ? 'active' : ''
                            }`}
                          >
                            <p className="image">
                              <img src={avatarUrl} />
                            </p>
                            <div className="info">
                              <h3>Jame Conner </h3>
                              <p>California Amergency Center</p>
                            </div>
                            <div className="doctor-calendar">
                              <div className="time">
                                <p>{bookingTime}</p>
                                <span>{bookingTimeExtra}</span>
                              </div>
                              <div className="date">
                                <p>{bookingDate}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </Carousel>
                  </div>
                )}
                <div>
                  <h3 className="tit">Previous Appointments</h3>
                  <div className="appoint-list">
                    <div className="appoint-header">
                      <div className="appoint-item-date header-item">Date</div>
                      <div className="appoint-item-time header-item">Time</div>
                      <div className="appoint-item-doctor header-item">
                        Doctor
                      </div>
                      <div className="appoint-item-details header-item">
                        Details
                      </div>
                    </div>
                    <div className="appoint-content">
                      <div className="content-item">
                        <div className="appoint-item-date">
                          <p>2020/5/1</p>
                        </div>
                        <div className="appoint-item-time">
                          <p>9:45AM - 10:15AM</p>
                        </div>
                        <div className="appoint-item-doctor">
                          <div className="item-doctor-info">
                            <p className="image">
                              <img src={avatarUrl} />
                            </p>
                            <div className="doctor-info">
                              <h3>Jame Conner</h3>
                              <p>California Amergency Center</p>
                            </div>
                          </div>
                        </div>
                        <div className="appoint-item-details">
                          <a className="link-btn" href="#">
                            View
                          </a>
                        </div>
                      </div>
                      <div className="content-item">
                        <div className="appoint-item-date">
                          <p>2020/5/1</p>
                        </div>
                        <div className="appoint-item-time">
                          <p>9:45AM - 10:15AM</p>
                        </div>
                        <div className="appoint-item-doctor">
                          <div className="item-doctor-info">
                            <p className="image">
                              <img src={avatarUrl} />
                            </p>
                            <div className="doctor-info">
                              <h3>Jame Conner</h3>
                              <p>California Amergency Center</p>
                            </div>
                          </div>
                        </div>
                        <div className="appoint-item-details">
                          <a className="link-btn" href="#">
                            View
                          </a>
                        </div>
                      </div>
                      <div className="content-item">
                        <div className="appoint-item-date">
                          <p>2020/5/1</p>
                        </div>
                        <div className="appoint-item-time">
                          <p>9:45AM - 10:15AM</p>
                        </div>
                        <div className="appoint-item-doctor">
                          <div className="item-doctor-info">
                            <p className="image">
                              <img src={avatarUrl} />
                            </p>
                            <div className="doctor-info">
                              <h3>Jame Conner</h3>
                              <p>California Amergency Center</p>
                            </div>
                          </div>
                        </div>
                        <div className="appoint-item-details">
                          <a className="link-btn" href="#">
                            View
                          </a>
                        </div>
                      </div>
                      <div className="content-item">
                        <div className="appoint-item-date">
                          <p>2020/5/1</p>
                        </div>
                        <div className="appoint-item-time">
                          <p>9:45AM - 10:15AM</p>
                        </div>
                        <div className="appoint-item-doctor">
                          <div className="item-doctor-info">
                            <p className="image">
                              <img src={avatarUrl} />
                            </p>
                            <div className="doctor-info">
                              <h3>Jame Conner</h3>
                              <p>California Amergency Center</p>
                            </div>
                          </div>
                        </div>
                        <div className="appoint-item-details">
                          <a className="link-btn" href="#">
                            View
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="box-flex">
              <div className="main-left">
                <div className="block-doctor">
                  <h2>Doctor</h2>
                  <div className="block-doctor-content">
                    <div className="avatar">
                      <Avatar
                        className="upload-avatar"
                        src={avatarUrl}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          height: '130px',
                          width: '130px',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                    <div className="right-info">
                      <h4>Jame Conner </h4>
                      <p>California Amergency Center</p>
                      <p className="status">
                        <span></span>Online
                      </p>
                    </div>
                  </div>
                </div>
                <div className="time-doctor">
                  <h2>{dateInDisplay}</h2>
                  <div className="time-doctor-content">
                    <ul className="list-time">
                      {availableAppointmentSlots.map((timeslot) => {
                        const [time, timeExtra] = formatAMPM(
                          new Date(timeslot.dateAndTime)
                        );
                        return (
                          <li className="left-time">
                            <div className="left-time">
                              {time + '' + timeExtra}
                            </div>
                            <div className="right-check">
                              <input
                                type="radio"
                                name="time-doctor"
                                value={timeslot._id}
                                onClick={(e) => setPatientBooking(timeslot._id)}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <button
                    className="btn-gradient-yellow"
                    onClick={() => handleBookAppointment()}
                  >
                    Book
                  </button>
                </div>
              </div>
              <div className="main-right">
                <div className="block-picker">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    inline
                  />
                </div>
                <div className="block-upload">
                  <div className="left-upload">
                    <div className="item-upload">
                      <h4>Upload your video</h4>
                      <a href="#">Choose your video</a>
                    </div>
                    <div className="item-upload">
                      <h4>Upload your image</h4>
                      <a>
                        <input
                          type="file"
                          value=""
                          onChange={(e) => handleUploadFile(e)}
                          onClick={(e) => {
                            e.target.value = null;
                          }}
                        />
                        <ul>
                          {uploadImages &&
                            uploadImages.length > 0 &&
                            uploadImages.map((image, idx) => (
                              <li>
                                <Button
                                  variant="outlined"
                                  component="span"
                                  style={styles.previewButton}
                                  onClick={() =>
                                    handleOpenPdfPreview(
                                      image.publicFileUrl,
                                      image.fileType
                                    )
                                  }
                                >
                                  Image {idx + 1}
                                </Button>
                                <Button
                                  variant="outlined"
                                  component="span"
                                  style={styles.previewButton}
                                  onClick={(e) => onRemoveFile(e, idx)}
                                >
                                  Remove
                                </Button>
                              </li>
                            ))}
                        </ul>
                      </a>
                    </div>
                  </div>
                  <div className="right-upload">
                    <div className="item-upload">
                      <h4>Describe Your Need</h4>
                      <textarea placeholder="Type what you would like to discuss"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Dialog for previewing pdfs files */}
      <DialogPdfPreview
        fileModeToOpen={fileModeToOpen}
        isOpenFile={isOpenFile}
        file={linkFileToOpen}
        handleCloseFilePreview={(e) => handleCloseFilePreview(e)}
      />
    </div>
  );
}
