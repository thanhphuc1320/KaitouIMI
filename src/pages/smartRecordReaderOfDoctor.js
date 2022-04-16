import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { NavLink } from 'react-router-dom';

import OldPatientDashboard from './../pages/dashboard/oldDashboard/oldPatientDashboard';
import { getSmartRecordReader } from '../store/actions/request.action'

import arrow_down from '../img/imi/arrow_down.svg';
import ico_bell from '../img/imi/alarm-bell-black.png';
import defaultAva from '../img/d_ava.png';

const SmartRecordReaderOfDoctor = () => {
  const dispatch = useDispatch()
  const [dateChoose, setDateChoose] = useState(new Date());
  const user = useSelector((state) => state.user);
  const filteredUser = { ...user };
  const smartRecordReaderDoctor = useSelector((state) => state.request.doctorRequests);
  const [filteredUserFilter, setFilteredUser] = useState(filteredUser);
  const { avatarUrl = defaultAva } = user;

  const handleChangeDate = (event) => {
    const dataTemp = smartRecordReaderDoctor.filter((item) => {
      return (
        moment(item.createdAt).format('DD/MM/YYYY') ===
        moment(event).format('DD/MM/YYYY')
        && item.type === 5
      );
    });
    filteredUser.requests = dataTemp;
    setFilteredUser({ ...filteredUser });
    setDateChoose(event);
  };

  useEffect(() => {
    const data = {
      type: 5,
      version: 2.1
    }
    dispatch(getSmartRecordReader(data));
  }, [])

  useEffect(() => {
    if (smartRecordReaderDoctor) {
      handleChangeDate(dateChoose);
    }
  }, [smartRecordReaderDoctor])

  return (
    <div className="patient-full-page">
      <div className="topAppointment">
        <div className="leftTop">
          <h2>
            <span className="customSpan">Smart Record Reader</span>
          </h2>
        </div>
        <div className="rightTop">
          <a href="#!">
            <img src={ico_bell} alt="" />
            <span className="count">3</span>
          </a>
          <NavLink to='/update-profile' className="avatar">
            <img src={avatarUrl} alt="" />
          </NavLink>
        </div>
      </div>
      <div className="medical-history  p-5">
        <div className="title-home clearfix">
          <h2>Activities</h2>
          <p className="date-picker-actives d-flex">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                id="activities-date-picker"
                disableToolbar
                variant="inline"
                format="DD/MM/YYYY"
                value={dateChoose}
                onChange={handleChangeDate}
              />
            </MuiPickersUtilsProvider>
            <img
              src={arrow_down}
              alt=''
              onClick={() =>
                document
                  .getElementById('activities-date-picker')
                  .click()
              }
            />
          </p>
        </div>
        <div className="">
          <OldPatientDashboard user={filteredUserFilter} role={user.role}/>
        </div>
      </div>
    </div>
  );
};
export default SmartRecordReaderOfDoctor;
