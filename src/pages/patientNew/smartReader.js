import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import FlashRecord from './flashRecord';

import ico_alarm_bell from '../../img/imi/alarm-bell-blue.png';
import ico_search from '../../img/imi/ico-search.png';
import defaultAva from '../../img/d_ava.png';

export default function CreateAppointment() {
    const user = useSelector((state) => state.user);
    const {avatarUrl} = user;
    const history = useHistory();

    return (
        <div className="appointment-new">
        <div className="topAppointment">
          <div className="leftTop">
            <h2 className="color-appoiment-h2">
              <NavLink to="/">
                <span>Home</span>
              </NavLink>
              iReader
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
              <img src={avatarUrl ? avatarUrl : defaultAva} alt='' />
           </NavLink>
          </div>
        </div>
        <div>
        <FlashRecord/>
        </div>
        </div>
    )
}