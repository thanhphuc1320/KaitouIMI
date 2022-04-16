import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Material UI
import Carousel from 'react-multi-carousel';

// CSS
import 'react-datepicker/dist/react-datepicker.css';
import 'react-multi-carousel/lib/styles.css';
import '../../../static/css/appointment.css';

// Image
import ico_add from '../../../img/imi/ico-add-green.png';
import img_empty from '../../../img/imi/line-empty-up.png';
import ico_call from '../../../img/imi/ico-call-appoint.png';
import ico_call_end from '../../../img/imi/ico-call-end.png';
import ico_attach from '../../../img/imi/ico-attach.png';
import ico_record from '../../../img/imi/record-icon-2.png';

// Redux
import { getAppointments } from '../../../store/actions/appointment.action';

// Helper functions
import { formatAMPM } from '../../../utils';
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

export default function PatientAppointment() {
  const user = useSelector((state) => state.user) || {};
  const { appointments } = useSelector((state) => state.appointment) || [];
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
    <div className="ml-3 mr-3">
      <div className="appoint-content-add">
        <div className="add-appointment">
          <Link className="btn btn-gradient" to="/appointment/booking">
            Book an appointment
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
  );
}

const UpcomingAppointmentView = ({ appointments }) => {
  return !appointments || !appointments.length ? (
    <div className="appoint-empty">
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
        {appointments.map((appointment, index) => {
          const bookingDate = new Date(
            appointment.dateAndTime
          ).toLocaleString('default', { month: 'short', day: 'numeric' });
          const [bookingTime, bookingTimeExtra] = formatAMPM(
            appointment.dateAndTime
          );
          const res = bookingDate.split(' ');
          return (
            <Link to={`/appointment/${appointment._id}`}>
              <div className={`list-doctor-appoint-item`} key={index}>
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
    <h3 className="tit">Previous Appointments</h3>
    <div className="appoint-list">
      <div className="appoint-header">
        <div className="appoint-item-date header-item">Date</div>
        <div className="appoint-item-time header-item">Time</div>
        <div className="appoint-item-doctor header-item">Doctor</div>
        <div className="appoint-item-record header-item"></div>
        <div className="appoint-item-details header-item">Details</div>
      </div>
      <div className="appoint-content">
        {appointments.map((appointment, index) => {
          const bookingDate = new Date(
            appointment.dateAndTime
          ).toLocaleString('default', { month: 'long', day: 'numeric' });
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
                {dateAndTime} {bookingTimeExtra}- {endDateAndTime}{' '}
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
              <div className="appoint-item-record">
                <a
                  href={
                    appointment.audios[appointment.audios.length - 1]?.fileURI
                  }
                  className={
                    appointment.audios.length > 0 ? '' : 'record-hidden'
                  }
                  target="_blank"
                >
                  <div
                    className="icon__transript"
                    style={{
                      backgroundImage: `url(${ico_record})`,
                      width: 30,
                      height: 30,
                      backgroundSize: '47px 47px',
                    }}
                  ></div>
                  {/* <img src={ico_record} alt='' /> */}
                </a>
                <a
                  href={
                    appointment.audios[appointment.audios.length - 1]
                      ?.transcriptURI
                  }
                  className={
                    appointment.audios.length > 0 ? '' : 'record-hidden'
                  }
                  target="_blank"
                >
                  <div
                    className="icon__transript"
                    style={{
                      backgroundImage: `url(${ico_attach})`,
                      width: 30,
                      height: 30,
                      backgroundSize: '47px 47px',
                    }}
                  ></div>
                </a>
              </div>
              <div className="appoint-item-details">
                <Link
                  className="link-btn"
                  to={`/appointment/${appointment._id}`}
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
