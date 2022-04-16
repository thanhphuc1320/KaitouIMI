import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import FlashRecord from '../flashRecord';
import { Button } from '@stories/Button/Button';

import ico_alarm_bell from '@img/imi/alarm-bell-blue.png';
import ico_search from '@img/imi/ico-search.png';
import defaultAva from '@img/d_ava.png';

export default function CreateAppointment() {
  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(false);
  const { avatarUrl } = user;

  const history = useHistory();
  const onNext = () => {
    setActiveTab(true);
  };
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
            <img src={avatarUrl ? avatarUrl : defaultAva} alt="" />
          </NavLink>
        </div>
      </div>
      <div>
        {!activeTab ? (
          <div className="content-opinion">
            <div>
              <div className="d-flex justify-content-center">
                <p
                  className="title-upload title-reader"
                  style={{ marginBottom: '6rem', width: '75%' }}
                >
                  Welcome to IMI's iReader! We will walk you through a few
                  simple steps to help you understand your blood test.
                </p>
              </div>
              <div className="form-group ml-87">
                <div className="gr-btn-smartReader">
                  <Button
                    style={{
                      marginTop: '0px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    className="btn btn-blue-submit"
                    onClick={() => onNext()}
                    label="Start"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <FlashRecord type="iReader" />
          </div>
        )}
      </div>
    </div>
  );
}
