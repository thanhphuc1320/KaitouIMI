/* eslint-diasble (react/jsx-filename-extension) */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import moment from 'moment';

import defaultAva from '@img/d_ava.png';
import icon_image from '@img/imi/icon_image-orange.png';
import ico_search from '@img/imi/ico-search.png';
import { formatAMPM } from '../../../utils';
import ico_alarm_bell from '@img/imi/alarm-bell-blue.png';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ico_calander from '@img/imi/ico-calendar-oval.png';
import ireader_icon from '@img/imi/ireader_icon.png';
import iDoctor_icon from '@img/imi/iDoctor_icon.png';
import '../../../static/css/test-result.css';

export default function AppointmentPage() {
  const history = useHistory();
  const user = useSelector((state) => state.user);
  const [dataRequestsSort, setDataRequestsSort] = useState(null);
  const { avatarUrl = defaultAva } = user;
  useEffect(() => {
    const dataSortDate = user.requests.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const dataTemp = dataSortDate.reduce((arr, obj) => {
      const day = moment(obj.createdAt).valueOf();
      const convertDay = moment(obj.createdAt).format('MM-DD-YYYY');

      if (day != '') (arr[convertDay] = arr[convertDay] || []).push(obj);
      return arr;
    }, {});
    setDataRequestsSort(dataTemp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.requests]);

  const getName = (userInfo) => {
    let name = '';
    if (
      (userInfo.firstName && userInfo.firstName.length > 0) ||
      (userInfo.lastName && userInfo.lastName.length > 0)
    ) {
      name = `${userInfo?.firstName || ''}${userInfo?.lastName || ''}`;
    } else {
      name = userInfo.email;
    }
    return name;
  };

  const showDetailRequest = (item) => {
    if (item.type === 6) {
      history.push(`/iReader-result/${item._id}`);
    } else {
      history.push(`/all-file-test-result/${item.type}/${item._id}`);
    }
  };

  const getDate = (key) => {
    const dateRequest = moment(Number(key)).format('DD-MM-YYYY');
    const today = moment().format('DD-MM-YYYY');
    if (dateRequest === today) {
      return `Today, ${moment(Number(key)).format('LL')}`;
    } else {
      return moment(Number(key)).format('LL');
    }
  };

  return (
    <div className="appointment-new">
      <div className="topAppointment">
        <div className="leftTop">
          <h2 className="color-appoiment-h2">
            <NavLink to="/">
              <span>Home</span>
            </NavLink>
            Test Results
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
            <img src={user.avatarUrl ? user.avatarUrl : avatarUrl} alt="" />
          </NavLink>
        </div>
      </div>

      <div className="patient-rest-result patient-rest-result-new">
        <div className="d-flex w-100 justify-content-between">
          <div>
            <span className="title name">Hi, {getName(user)}!</span>
            <span style={{ paddingTop: '0.5rem' }} className="note">
              Let's review your test result!
            </span>
          </div>
          <div className="sort-resutl">
            <img src={ico_calander} alt="" />
            <p>List by day</p>
          </div>
        </div>
        <div className="main-content-file w-100">
          {dataRequestsSort &&
            Object.keys(dataRequestsSort).map((key, index) => {
              const timeStamp = new Date(key);
              return (
                <div key={index} className="mr-3">
                  {
                    <span className="mb-3 mt-3 date-time d-block">
                      {getDate(timeStamp)}
                    </span>
                  }
                  {dataRequestsSort[key].map((item, indexItem) => {
                    const [bookingTime, bookingTimeExtra] = formatAMPM(
                      item.createdAt
                    );

                    return (
                      <div
                        className="item-image content-result-test"
                        key={indexItem}
                        onClick={() => showDetailRequest(item)}
                        key={indexItem}
                      >
                        <div style={{ display: 'flex', height: '100%' }}>
                          <div className=" list-result-test">
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  item?.type === 6 ? ireader_icon : iDoctor_icon
                                }
                                className="icon-image"
                              />
                              <span className="margin-left-45">
                                {item?.type === 5
                                  ? 'Smart'
                                  : item?.type === 6
                                  ? 'iReader'
                                  : 'iDoctor'}
                              </span>
                            </div>
                            <div className="detail-result">
                              <span
                                className="font-weight-bold"
                                style={
                                  item.status === 0
                                    ? { color: '#28C2A5' }
                                    : item.status === 1
                                    ? { color: '#F7931E' }
                                    : item.status === 5
                                    ? { color: '#FF4500' }
                                    : { color: '#2F80ED' }
                                }
                              >
                                {item.status === 0
                                  ? 'Pending'
                                  : item.status === 1
                                  ? 'Approved'
                                  : item.status === 5
                                  ? 'Draft'
                                  : 'Completed'}
                              </span>
                              <span>
                                {getDate(timeStamp)} at {bookingTime}{' '}
                                {bookingTimeExtra}
                              </span>
                              <span>
                                <MoreHorizIcon className="icon-file" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

          {user.requests.length === 0 && (
            <div className="text-center mt-5">
              <InsertCommentIcon className="icon-file" />
              <span>No request</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
