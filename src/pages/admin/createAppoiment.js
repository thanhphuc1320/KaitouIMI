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

import TimeSelectionView from '../appointment/components/TimeSelectionView';

// CSS
import 'react-datepicker/dist/react-datepicker.css';
import 'react-multi-carousel/lib/styles.css';
import '../../static/css/appointment.css';

// Redux
import {
  bookAppointment,
  getAppointments,
  updateAppointment,
} from '../../store/actions/appointment.action';
import { getPatientList } from '../../store/actions/user.action';

import { getDoctorList } from '../../apiCalls/user.api';
// import { getAppointment } from './../../apiCalls/appointment.api';

import defaultAva from './../../img/d_ava.png';

export default function PatientBookingPage(props) {
  // const { appointmentId } = props?.match?.params || null;
  const { appointments = [] } = useSelector(
    (state) => state.appointment
  );
  const [patientModify, setPatientModify] = useState(null);
  const dispatch = useDispatch();
  const DEBOUNCE_DELAY = 600;

  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [bookedAppointmentId, setBookedAppointmentId] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [createdAppointment, setCreatedAppointment] = useState(false);
  const [isUpdateAppointment, setUpdateAppointment] = useState(false);
  const [uploadImages, setUploadImages] = useState([]);
  const [uploadVideos, setUploadVideos] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [patientNote, setPatienNote] = useState('');
  const history = useHistory();
  const [loadMore, setLoadMore] = useState(true);
  const { patientlist = [] } = useSelector((state) => state.user);

  const getAppointmentsDispatcher = (queryParams) =>
    dispatch(getAppointments(queryParams));
  const debouncedGetAppointments = useCallback(
    debounce(getAppointmentsDispatcher, DEBOUNCE_DELAY),
    []
  );

  const handleDateChange = (date) => {
    setStartDate(date);
    debouncedGetAppointments({ dateAndTime: date.setHours(0, 0), endDateAndTime: new Date(date).setHours(23, 59) });
  };

  // Use for regular booking Page
  useEffect(() => {
    getDoctorList({page: 1, pageSize: 0})
      .then((res) => {
        setDoctorList(res.data);
        setSelectedDoctor(res.data[0]);
      })
      .catch((e) => console.log(e));
  }, [setDoctorList]);

  // Get Appointment when user select different doctor
  useEffect(() => {
    if (selectedDoctor)
      dispatch(
        getAppointments({
          dateAndTime: startDate.setHours(0, 0),
          endDateAndTime: new Date(startDate).setHours(23, 59),
          doctor: selectedDoctor._id,
        })
      );
    // dispatch(getPatientList({ pageSize: 20, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoctor]);
  useEffect(() => {
    getData(loadMore);
  }, []);

  const getData = (load) => {
    if (load) {
      dispatch(getPatientList({ pageSize: 20, page: 1 }));
      setSelectedPatient(patientlist[0])
    }
  };
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
    await dispatch(bookAppointment(appointment));
    setCreatedAppointment(true);
    setTimeout(() => {
      // history.push(`/appointment/${bookedAppointmentId ? bookedAppointmentId : appointmentId}`)
    }, 1000)
  };

  /**
   * Modify Appointment
   */
  const handleModifyAppointment = async () => {
    // FIXME: Need to provide error message
    // if (patientModify === appointmentId) return;
    const appointment = {
      mode: 2,
      newAppointmentId: patientModify,
      status: 1,
      image: uploadImages || [],
      video: uploadVideos || [],
      patientNote,
      doctorId: selectedDoctor._id,
    };
    await dispatch(updateAppointment(appointment));
    // setBookedAppointmentId(patientModify)
    setUpdateAppointment(true)
    setTimeout(() => {
      // history.push(`/appointment/${bookedAppointmentId ? bookedAppointmentId : appointmentId}`)
    }, 1000)
  };

  return (
    <div className="box-flex p-4">
      <div className="main-left">
        <div className="block-doctor">
          <div className="block-user pr-2">
            <div className="top-block-doctor d-flex align-items-center">
              <h2>Your Doctor</h2>
              <div className="form-group m-0">
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
                        primaryText={`${doctor.firstName || `N'A`} ${doctor.lastName || `N'A`
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
                    src={selectedDoctor.avatarUrl || defaultAva}
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

          <div className="block-user mt-4 pr-2">
            <div className="top-block-doctor d-flex align-items-center">
              <h2>Your Patient</h2>
              <div className="form-group m-0">
                {selectedPatient && (
                  <SelectField
                    value={selectedPatient}
                    onChange={(e, i, value) => setSelectedPatient(value)}
                    className="form-control"
                  >
                    {patientlist.map((patient, index) => (
                      <MenuItem
                        key={index}
                        value={patient}
                        primaryText={`${patient.firstName || `N'A`} ${patient.lastName || `N'A`
                          }`}
                      />
                    ))}
                  </SelectField>
                )}
              </div>
            </div>
            {selectedPatient && (
              <div className="block-doctor-content">
                <div className="avatar">
                  <Avatar
                    className="upload-avatar"
                    src={selectedPatient.avatarUrl || defaultAva}
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
                    {selectedPatient.firstName || 'N/A'}{' '}
                    {selectedPatient.lastName || 'N/A'}
                  </h4>
                  <p>{selectedPatient.bio || 'N/A'}</p>
                  <p className="status">Online</p>
                </div>
              </div>
            )}
          </div>

        </div>
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
        <TimeSelectionView
          availableAppointment={availableAppointments}
          buttonName={'Book'}
          handleAppointmentIdChange={
            setBookedAppointmentId
          }
          handleSubmitAppointment={
            handleBookAppointment
          }
          dateInDisplay={dateInDisplay}
          patientModify={patientModify}
        // appointmentId={appointmentId}
        />
      </div>
    </div>
  );
}
