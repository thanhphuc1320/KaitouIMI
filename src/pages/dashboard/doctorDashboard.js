import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import '../../static/css/doctor-dashboard.css';

// import RequestView from './subcomponents/RequestView';
import PatientView from './subcomponents/PatientView';
import NottificationCenter from '../../components/notifications-center';

import avatarUrl from '../../img/d_ava.png';
import RequestView from '@containers/request';

const DoctorDashboard = () => {
  const headerList = ['Request', 'Patient'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [headerMode, setHeaderMode] = useState(0);

  const user = useSelector((state) => state.user);

  const avatar = user.avatarUrl ? user.avatarUrl : avatarUrl;

  const handleHeaderModeChange = (key) => {
    setHeaderMode(key);
    setCurrentIndex(0);
  };

  return (
    <div className="main-container dashboard-page">
      <div className="topAppointment">
        <div className="leftTop">
          {headerList.map((item, key) =>
            key === headerMode ? (
              <span
                className="link"
                onClick={() => handleHeaderModeChange(key)}
              >
                {item}
              </span>
            ) : (
              <span
                className="link active"
                onClick={() => handleHeaderModeChange(key)}
              >
                {item}
              </span>
            )
          )}
        </div>
        <div className="rightTop">
          <NottificationCenter />
          <NavLink to='/update-profile' className="avatar">
            <img src={avatar} alt='' />
          </NavLink>
        </div>
      </div>
      {headerList[headerMode] === 'Request' ? (
        <RequestView setCurrentIndex={setCurrentIndex} />
      ) : (
        <PatientView
          setCurrentIndex={setCurrentIndex}
          currentIndex={currentIndex}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
