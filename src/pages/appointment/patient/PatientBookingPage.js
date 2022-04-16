import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

// Components
import Avatar from 'material-ui/Avatar';
import DatePicker from 'react-datepicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import TimeSelectionView from '../components/TimeSelectionView';
import FileUploadView from '../components/FileUploadAppointment';

// CSS
import 'react-datepicker/dist/react-datepicker.css';
import 'react-multi-carousel/lib/styles.css';
import '../../../static/css/appointment.css';

// Redux
import {
  bookAppointment,
  getAppointments,
  updateAppointment,
} from '../../../store/actions/appointment.action';

// API
import { getDoctorList } from '../../../apiCalls/user.api';
import { getAppointment } from '../../../apiCalls/appointment.api';

// Utils
import { convertMilisecondToDate } from '../../../utils';

export default function PatientBookingPage(props) {
  const { appointmentId } = props.match.params || null;
  const { appointments = [] } = useSelector(
    (state) => state.appointment
  );
  const [patientModify, setPatientModify] = useState(null);
  const dispatch = useDispatch();
  const DEBOUNCE_DELAY = 600;

  // Update requestsToReview in user object
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [bookedAppointmentId, setBookedAppointmentId] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [createdAppointment, setCreatedAppointment] = useState(false);
  const [isUpdateAppointment, setUpdateAppointment] = useState(false);
  const [uploadImages, setUploadImages] = useState([]);
  const [uploadVideos, setUploadVideos] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [patientNote, setPatienNote] = useState('');
  const history = useHistory();
  const { doctorlist = []} = useSelector((state) => state.user);
  
  const getAppointmentsDispatcher = (queryParams) =>
    dispatch(getAppointments(queryParams));
  const debouncedGetAppointments = useCallback(
    debounce(getAppointmentsDispatcher, DEBOUNCE_DELAY),
    []
  );

  const handleDateChange = (date) => {
    setStartDate(date);
    debouncedGetAppointments({ dateAndTime: date.setHours(0,0), endDateAndTime: new Date(date).setHours(23,59) });
  };

  // Use for Modify Appointment
  useEffect(() => {
    if (appointmentId) {
      getAppointment({ _id: appointmentId })
        .then((res) => {
          const currentAppointment = res.data[0];
          const { doctor = {}, image = [], video = [], patientNote } =
            currentAppointment || {};

          setUploadVideos(video);
          setPatienNote(patientNote);
          setUploadImages(image);
          setSelectedDoctor(doctor);
        })
        .catch((e) => console.log('error', e));
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUploadImages, setUploadVideos, setSelectedDoctor, setPatienNote]);

  // Use for regular booking Page
  useEffect(() => {
    getDoctorList({pageSize: 0, page: 0})
      .then((res) => {
        setDoctorList(res.data);
        setSelectedDoctor(res.data[0]);
      })
      .catch((e) => console.log(e));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDoctorList]);

   // Get Appointment when user select different doctor
  useEffect(() => {
    if (selectedDoctor)
      dispatch(
        getAppointments({
          dateAndTime: startDate.setHours(0,0),
          endDateAndTime: new Date(startDate).setHours(23,59),
          doctor: selectedDoctor._id,
        })
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoctor]);

  const availableAppointments = appointments
    .filter(
      (appointment) =>
        appointment.status === 0 &&
        appointment.doctor?._id === selectedDoctor?._id
    )
    .sort((a, b) => new Date(a.dateAndTime) - new Date(b.dateAndTime));

  const dateInDisplay = startDate.toLocaleString('default', {
    month: 'long',
    day: 'numeric',
  });

  /**
   * Book Appointment
   */
  const handleBookAppointment = async () => {
    if (!bookedAppointmentId) return;
    const appointment = {
      mode: 2,
      appointmentId: bookedAppointmentId,
      status: 1,
      image: uploadImages || [],
      video: uploadVideos || [],
      patientNote,
      doctorId: selectedDoctor._id,
    };
    console.log({ image: appointment.image });
    await dispatch(bookAppointment(appointment));
    setCreatedAppointment(true);
    setTimeout(() => {
      history.push(`/appointment/${bookedAppointmentId ? bookedAppointmentId : appointmentId}`)
    }, 1000) 
  };

  /**
   * Modify Appointment
   */
  const handleModifyAppointment = async () => {
    // FIXME: Need to provide error message
    if (patientModify === appointmentId) return;
    const appointment = {
      mode: 2,
      appointmentId,
      newAppointmentId: patientModify,
      status: 1,
      image: uploadImages || [],
      video: uploadVideos || [],
      patientNote,
      doctorId: selectedDoctor._id,
    };
    await dispatch(updateAppointment(appointment));
    setBookedAppointmentId(patientModify)
    setUpdateAppointment(true)
    setTimeout(() => {
      history.push(`/appointment/${bookedAppointmentId ? bookedAppointmentId : appointmentId}`)
    }, 1000) 
  };

  return (
    <div className="box-flex">
      <div className="main-left">
        <div className="block-doctor">
          <div className="top-block-doctor">
            <h2>Your Doctor</h2>
            <div className="form-group">
              {selectedDoctor && (
                <SelectField
                  value={selectedDoctor}
                  onChange={(e, i, value) => setSelectedDoctor(value)}
                  className="form-control"
                >
                  {doctorList.map((doctor, index) => (
                    <MenuItem
                      key={index}
                      value={doctor}
                      primaryText={`${doctor.firstName || `N'A`} ${
                        doctor.lastName || `N'A`
                      }`}
                    />
                  ))}
                </SelectField>
              )}
            </div>
          </div>

          {selectedDoctor && (
            <div className="block-doctor-content">
              <div className="avatar">
                <Avatar
                  className="upload-avatar"
                  src={selectedDoctor.avatarUrl}
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
                <h4>
                  {selectedDoctor.firstName || 'N/A'}{' '}
                  {selectedDoctor.lastName || 'N/A'}
                </h4>
                <p>{selectedDoctor.bio || 'N/A'}</p>
                <p className="status">Online</p>
              </div>
            </div>
          )}
        </div>

        <TimeSelectionView
          availableAppointment={availableAppointments}
          buttonName={appointmentId ? 'Modify' : 'Book'}
          handleAppointmentIdChange={
            appointmentId ? setPatientModify : setBookedAppointmentId
          }
          handleSubmitAppointment={
            appointmentId ? handleModifyAppointment : handleBookAppointment
          }
          dateInDisplay={dateInDisplay}
          patientModify={patientModify}
          appointmentId={appointmentId}
        />
      </div>
      <div className="main-right">
        <div className="block-picker">
          <DatePicker
            selected={startDate}
            onChange={(date) => handleDateChange(date)}
            minDate={moment().toDate()}
            inline
          />
        </div>
        <div className="block-upload">
          <div className="left-upload">
            <FileUploadView
              fileUploadType="video"
              uploadFiles={uploadVideos}
              setUploadFiles={setUploadVideos}
            />
            <FileUploadView
              fileUploadType="image"
              uploadImages={uploadImages}
              setUploadImages={setUploadImages}
            />
          </div>
          <div className="right-upload">
            <div className="item-upload">
              <h4>Describe Your Need</h4>
              <textarea
                onChange={(e) => setPatienNote(e.target.value)}
                rows={4}
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
