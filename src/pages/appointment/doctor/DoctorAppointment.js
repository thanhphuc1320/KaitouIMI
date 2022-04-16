import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import {
  createAppointment,
  getAppointments,
  getAllAppointmentsDateInFuture,
} from '../../../store/actions/appointment.action';
import { clearError } from '../../../store/actions/error.action';
import { formatAMPM, convertMilisecondToDate } from '../../../utils';

import DatePicker from 'react-datepicker';
import { InputBase, TextField } from '@material-ui/core';
import 'react-datepicker/dist/react-datepicker.css';

import 'react-multi-carousel/lib/styles.css';

import '../../../static/css/appointment.css';
import ico_add_green from '../../../img/imi/icon-add-gradient.png';
import img_empty_down from '../../../img/imi/line-empty-down.png';

import { Redirect } from 'react-router';
import { toast } from 'react-toastify';

import _ from 'lodash';

const styles = {
  textField: {
    width: '90px',
  },
  previewButton: {
    marginLeft: '10px',
    fontSize: '10px',
  },
};

export default function DoctorAppointment(props) {
  const user = useSelector((state) => state.user) || {};
  const { appointments = [] } = useSelector((state) => state.appointment);
  const { appointmentDates = [] } = useSelector((state) => state.appointmentDateInFuture);
  const { CREATE_APPOINTMENT_FAILED } = useSelector((state) => state.error);
  const dispatch = useDispatch();

  if (CREATE_APPOINTMENT_FAILED) {
    const errorMessage = CREATE_APPOINTMENT_FAILED.server.readableMsg;
    toast.error(errorMessage, {
      className: 'error-toast-container',
      autoClose: 4000,
    });

    dispatch(clearError());
  }

  // Update requestsToReview in user object
  const today = new Date();
  const tomorrow = new Date();
  const nexttomorrow = new Date();
  tomorrow.setDate(today.getDate()+1);
  nexttomorrow.setDate(tomorrow.getDate()+1);

  const beginingOfDay = new Date().setHours(0, 0, 0);
  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState('07:30');
  const [duration, setDuration] = useState(60);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const DEBOUNCE_DELAY = 600;

  const debouncedGetAppointments = useCallback(
    debounce(
      (queryParams) => dispatch(getAppointments(queryParams)),
      DEBOUNCE_DELAY
    ),
    []
  );

  useEffect(() => {
    dispatch(
      getAppointments({ dateAndTime: startDate.setHours(0,0), endDateAndTime: new Date(startDate).setHours(23,59) })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAppointments]);

  useEffect(() => {
    dispatch(
      getAllAppointmentsDateInFuture({ doctorId: user._id })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllAppointmentsDateInFuture]);

  const handleDateChange = (date) => {
    date.setHours(0,0);
    setStartDate(date);
    debouncedGetAppointments({ dateAndTime: date.setHours(0,0), endDateAndTime: new Date(date).setHours(23,59)});
  };

  const dateInDisplay = startDate.toLocaleString('default', {
    month: 'long',
    day: 'numeric',  
  });

  appointments.sort(
    (a, b) => new Date(a.dateAndTime) - new Date(b.dateAndTime)
  );
  // Manipulate the appointmentDates
  let finalApptDates = [];

  const initFinalApptDates = () => {
    const latestApptDates = appointmentDates[0] || [];
      finalApptDates = latestApptDates.map(dateTime => new Date(dateTime)) || [];
  }
  initFinalApptDates();

  const delay = (ms) => new Promise(resolve =>
    setTimeout(resolve, ms)
  );

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
      dateAndTime: dateAndTime.valueOf(),
      endDateAndTime: endDateAndTime.valueOf(),
    };
    dispatch(createAppointment(newAppointment));
    dispatch(
      getAllAppointmentsDateInFuture({ doctorId: user._id })
    );
    delay(2000).then(() => initFinalApptDates());
  };

  const AppointmentListView = () => (
    <div className="right-doctor">
      {!appointments || appointments.length === 0 ? (
        <div>
          <h2>Today’s Appoinments</h2>
          <div className="content-right-doctor mb-3">
            <div className="empty-right-doctor">
              {startDate >= new Date() ? (
                <div>
                  <p>
                    You don’t have any appointment
                    <br />
                    Let add your available time
                  </p>
                  <p>
                    <img src={img_empty_down} alt='' />
                  </p>
                </div>
              ) : (
                <p>You cannot create appointment in the past</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="block-available">
          <h2>{dateInDisplay}</h2>
          <div className="content-available">
            <ul>
              {appointments.map((appointment) => {
                const {
                  status,
                  _id,
                  patient = {},
                  dateAndTime,
                  endDateAndTime,
                } = appointment;
                const [time, timeExtra] = formatAMPM(new Date(dateAndTime));
                const [endTime, endTimeExtra] = formatAMPM(
                  new Date(endDateAndTime)
                );
                const { firstName = 'N/A', lastName = '' } = patient || {};
                return (
                  <li
                    className={
                      new Date(dateAndTime) < new Date()
                        ? `item-available ${
                            status === 1 ? 'active' : 'disable'
                          }`
                        : `item-available ${status === 1 ? 'active' : ''}`
                    }
                    onClick={() =>
                      status === 1 && setSelectedAppointmentId(_id)
                    }
                  >
                    {status === 1 ? (
                      <div className="left-available">
                        <img className="avatar" src={appointment.patient.avatarUrl} alt='' />
                        <span>
                          {firstName} {lastName}
                        </span>
                      </div>
                    ) : (
                      <div className="left-available">Available Time</div>
                    )}
                    <div className="right-available">
                      <p>
                        {time} {timeExtra} - {endTime} {endTimeExtra}
                      </p>
                      {/* <span></span> */}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  return selectedAppointmentId ? (
    <Redirect to={`/appointment/${selectedAppointmentId}`} />
  ) : (
    <div className="doctor-apointment">
      <div className="left-doctor">
        <div className="top-calendar">
          <DatePicker
            selected={startDate}
            highlightDates={finalApptDates}
            onChange={(date) => {
              handleDateChange(date);
            }}
            inline
          />
        </div>
        {startDate >= beginingOfDay && (
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
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                />
              </p>
              <p>
                <span className="d-flex justify-content-center align-items-center">
                  <label className="text-grey">Duration</label>
                  <TextField
                    type="number"
                    variant="outlined"
                    label=""
                    value={duration}
                    style={styles.textField}
                    onChange={(e) => setDuration(e.target.value)}
                    inputProps={{ step: 5 }}
                  />
                  minutes
                </span>
              </p>
              <a
              href="#!"
                className="ico_add"
                onClick={(e) => handleCreateAppointment(e)}
              >
                <img src={ico_add_green} alt='' />
              </a>
            </div>
          </div>
        )}
      </div>
      <AppointmentListView />
    </div>
  );
}
