import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { NavLink } from 'react-router-dom';
// Material UI
import Carousel from 'react-multi-carousel';

// CSS
import 'react-datepicker/dist/react-datepicker.css';
import 'react-multi-carousel/lib/styles.css';
import '../../static/css/appointment-new.css'

// Image
import avatarUrl from '../../img/d_ava.png';
import ico_add from '../../img/imi/ico-add-green.png';
import img_empty from '../../img/imi/line-empty-up.png';
import ico_call from '../../img/imi/ico-call-phone-blue.png';
import ico_call_end from '../../img/imi/ico-call-end.png';
import ico_alarm_bell from '../../img/imi/alarm-bell-blue.png';
import ico_search from '../../img/imi/ico-search.png';
import moment from 'moment';

// Redux
import { getAppointments } from '../../store/actions/appointment.action';

// Helper functions
import { formatAMPM } from '../../utils';
import { Link } from 'react-router-dom';

// Custom Styles
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

export default function AppointmentPatient() {
  const user = useSelector((state) => state.user) || {};
  const { appointments } = useSelector((state) => state.appointment) || [];
  const [dataUser, setDataUser] = useState(user);
  const dispatch = useDispatch();

  // Update requestsToReview in user object
  const [startDate] = useState(new Date());
  let upcomingAppointmentList = [];
  let previousAppointmentList = [];
  useEffect(() => {
    // TODO: [PATIENT] fetch appointments by doctor
    dispatch(getAppointments({ patient: user._id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  // Sort by date
  appointments
    .sort((a, b) => new Date(a.dateAndTime) - new Date(b.dateAndTime))
    .map((appointment) => {
      if (new Date(appointment.dateAndTime) > startDate)
        upcomingAppointmentList.push(appointment);
      else previousAppointmentList.push(appointment);
    });

  return (
   <div className ="appointment-new">
     <div className="topAppointment">
        <div className="leftTop">
          <h2>Appointments</h2>
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
              <img src={dataUser.avatarUrl ? dataUser.avatarUrl : avatarUrl} alt='' />
            </NavLink>
          </div>
      </div>
      <div className="ml-3 mr-3 mt-4">
      <div className="appoint-content-add">
        <div className="add-appointment">
          <Link className="btn btn-blue" to="/create-appointment">
          Create Appointment
            <span className="ico-add">
              <img src={ico_add} alt="" />
            </span>
          </Link>
          {!appointments && !appointments.length && (
            <div className="arrow-slider" />
          )}
        </div>
        <UpcomingAppointmentView appointments={upcomingAppointmentList} />
        <PreviousAppointmentView appointments={previousAppointmentList} />
      </div>
    </div>
   </div>
  );
}

const UpcomingAppointmentView = ({ appointments }) => {
  return !appointments || !appointments.length ? (
    <div className="appoint-empty mt-2">
      <div className="book-appoint-destop">
        <div className="d-flex">
          <img src={img_empty} alt="" />
          <p>
            You don’t have any appointment <br /> Let’s create your appointment
          </p>
        </div>
      </div>
      <div className="book-appoint-mobile">
        <p className="book-appoint-mobile">
          You don’t have any appointment <br /> Let’s create your appointment
        </p>
      </div>
    </div>
  ) : (
    <div className="list-doctor-appoint">
      <Carousel responsive={responsive}>
        {appointments.map((appointment) => {
          const bookingDate = new Date(
            appointment.dateAndTime
          ).toLocaleString('default', { month: 'short', day: 'numeric' });
          const [bookingTime, bookingTimeExtra] = formatAMPM(
            appointment.dateAndTime
          );
          const res = bookingDate.split(' ');
          return (
            <Link to={`/summary-appointment/${appointment._id}`}>
              <div className={`list-doctor-appoint-item`}>
                <a href="#!">
                  <img alt=" " src={ico_call} className="ico-call" />
                </a>
                <p className="image">
                  <img src={appointment.doctor.avatarUrl} alt="" />
                </p>
                <div className="info">
                  <h3>
                    Dr{' '}
                    {appointment.doctor.firstName
                      ? appointment.doctor.firstName
                      : ''}{' '}
                    {appointment.doctor.lastName
                      ? appointment.doctor.lastName
                      : ''}
                  </h3>
                  <p>{appointment.doctor.bio}</p>
                </div>
                <div className="doctor-calendar">
                  <div className="time">
                    <p>{bookingTime}</p>
                    <span>{bookingTimeExtra}</span>
                  </div>
                  <div className="date">
                    <span>{res[0]}</span>
                    <p>{res[1]} </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </Carousel>
    </div>
  );
};

const PreviousAppointmentView = ({ appointments }) => (
  <div className="content-add">
    <div className="appoint-list">
      <div className="appoint-header">
        <div className="appoint-item-date header-item">Date</div>
        <div className="appoint-item-time header-item">Time</div>
        <div className="appoint-item-doctor header-item">Doctor</div>
        <div className="appoint-item-details header-item">Details</div>
      </div>
      <div className="appoint-content">
        {appointments.map((appointment, index) => {
          const bookingDate = moment(appointment.dateAndTime).format('YYYY/MM/DD');
          const [dateAndTime, bookingTimeExtra] = formatAMPM(
            appointment.dateAndTime
          );
          const [endDateAndTime, endDateAndTimeBookingTimeExtra] = formatAMPM(
            appointment.endDateAndTime
          );
          return (
            <div className="content-item" key={index}>
              <div className="appoint-item-date">
                <p>{bookingDate}</p>
              </div>
              <div className="appoint-item-time">
                {dateAndTime} {bookingTimeExtra} - {endDateAndTime}{' '}
                {endDateAndTimeBookingTimeExtra}
              </div>
              <div className="appoint-item-doctor">
                <div className="item-doctor-info">
                  <p className="image">
                    <img alt=" " src={appointment.doctor?.avatarUrl} />
                  </p>
                  <div className="doctor-info">
                    <h3>{appointment.doctor.email}</h3>
                    <p>{appointment.doctor.bio}</p>
                  </div>
                </div>
              </div>
              <div className="appoint-item-details">
                <Link
                  className="link-btn"
                  to={`/summary-appointment/${appointment._id}`}
                >
                  View
                </Link>
                <img src={ico_call_end} className="ico_call_end" alt="" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
