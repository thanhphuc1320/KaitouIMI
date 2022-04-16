import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { getAppointments } from '../../store/actions/appointment.action';
import { formatAMPM } from '../../utils';
import { Button } from '@stories/Button/Button';

import ico_bell from '@img/imi/alarm-bell-black.png';
import defaultAva from '@img/d_ava.png';
import ico_search from '@img/imi/ico-search.png';
import img_second from '@img/imi/img-second.png';
import img_reader from '@img/imi/img-reader.png';
import ico_calendar from '@img/imi/ico-calendar.png';
import 'react-toastify/dist/ReactToastify.css';
import { getUserIdentity } from 'store/actions/auth.action';
import { TOKEN_KEY } from '@constant';

export default function PatientHome(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);
  const { appointments } = useSelector((state) => state.appointment) || [];
  const token = localStorage.getItem(TOKEN_KEY);
  const { patientType } = user;
  const onSmartReader = () => {
    history.push('/smart-reader');
  };
  const onOpinion = () => {
    history.push('/opinion');
  };
  const { avatarUrl = defaultAva, firstName, lastName, email } = user;

  const [startDate] = useState(new Date());
  let upcomingAppointmentList = [];
  let previousAppointmentList = [];

  useEffect(() => {
    dispatch(getAppointments({ patient: user._id }));
    if (token) dispatch(getUserIdentity(token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  appointments
    .sort((a, b) => new Date(a.dateAndTime) - new Date(b.dateAndTime))
    .map((appointment) => {
      if (new Date(appointment.dateAndTime) > startDate)
        upcomingAppointmentList.push(appointment);
      else previousAppointmentList.push(appointment);
    });

  return (
    <div className="appointment-new">
      <div className="patient-full-page">
        <div className="topAppointment">
          <div className="leftTop">
            <h2>Home</h2>
          </div>
          <div className="rightTop">
            <div className="icon-search">
              <img src={ico_search} alt="" />
            </div>
            <div className="icon-bell mr-4">
              <img src={ico_bell} alt="" />
              <span className="count">3</span>
            </div>
            <NavLink to="/update-profile" className="avatar">
              <img src={avatarUrl} alt="" />
            </NavLink>
          </div>
        </div>
        <div className="home-page ">
          <div className="patient-home-content--content home-left">
            {patientType !== 'Normal' && (
              <div className="title-contact">
                <h2>
                  Hi,
                  {firstName || lastName ? (
                    <span>
                      {' '}
                      {firstName} {lastName}
                    </span>
                  ) : (
                    <span> {email}</span>
                  )}
                  !
                  <br />
                </h2>
                <p className="p1">How are you today?</p>
              </div>
            )}

            {patientType !== 'Normal' ? (
              <div>
                <div className="select-container">
                  <div className="medical-history-selection option-detail">
                    <div className="flex-base">
                      <img className="ml-14" src={img_reader} alt="" />
                      <div className="gr-btn-dashboard">
                        <Button
                          className="btn-gradient-yellow mt-3"
                          onClick={onSmartReader}
                          label="iReader"
                        />
                      </div>
                    </div>

                    <div className="flex-base">
                      <img
                        src={img_second}
                        alt=""
                        className="width-img mt-ml-img"
                      />
                      <div className="gr-btn-dashboard">
                        <Button
                          className="btn-gradient-yellow mt-3"
                          onClick={onOpinion}
                          label="iDoctor"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="iReader d-flex justify-content-center"
                style={{ alignItems: 'center', height: 'calc(100vh - 70px)' }}
              >
                <div className="flex-base-reader center size-button">
                  <img className="width-img-reader" src={img_second} alt="" />
                  <Button
                    className="btn-yellow mt-3"
                    onClick={onOpinion}
                    label="iDoctor"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="patient-home-content--content home-right">
            <div className="title-contact">
              {patientType === 'Normal' && (
                <div>
                  <h2>
                    Hi,
                    {firstName || lastName ? (
                      <span>
                        {' '}
                        {firstName} {lastName}
                      </span>
                    ) : (
                      <span> {email}</span>
                    )}
                    !
                    <br />
                  </h2>
                  <p className="p1" style={{ marginBottom: '29px' }}>
                    How are you today?
                  </p>
                </div>
              )}
              <p className="p2">Let's check your news, today!</p>
            </div>
            <div
              className={
                patientType === 'Normal'
                  ? 'list-block-detail second'
                  : 'list-block-detail'
              }
            >
              <div className="list-block-detail-content">
                <div className="block-detail active">
                  <div className="bg-white">
                    <img className="img-calendar" src={ico_calendar} alt="" />
                    {upcomingAppointmentList.length > 0 ? (
                      <span>
                        {upcomingAppointmentList.map((appointment, index) => {
                          const bookingDate = new Date(
                            appointment.dateAndTime
                          ).toLocaleString('default', {
                            month: 'short',
                            day: 'numeric',
                          });
                          const [bookingTime] = formatAMPM(
                            appointment.dateAndTime
                          );
                          const res = bookingDate.split(' ');
                          if (index === 0) {
                            return (
                              <span className="mb-0" key={index}>
                                You have an appointment with Doctor{' '}
                                {appointment.doctor.firstName
                                  ? appointment.doctor.firstName
                                  : ''}{' '}
                                at {bookingTime} {res[0]} {res[1]}
                              </span>
                            );
                          }
                        })}
                      </span>
                    ) : (
                      <span className="mb-0">
                        You do not have any appointments today
                      </span>
                    )}
                  </div>
                </div>
                {/* <div className="block-detail">
                <img src={ico_check} alt="" />
                <span>Your session 2's result is completed!</span>
              </div>
              <div className="block-detail">
                <img src={ico_check} alt="" />
                <span>
                  Your account has been successfully verified. Congratulations!
                </span>
              </div>
              <div className="block-detail">
                <img src={ico_check} alt="" />
                <span>Your session 1's result is completed!</span>
              </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
