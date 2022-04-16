import React, { useState, useEffect, useRef } from 'react';
import { getPatientList } from '../../../apiCalls/user.api';
import img_default_ava from '../../../img/imi/default-ava.png';
import styles from '../styles';
import ProfileView from './ProfileView';

const PatientView = ({ setCurrentIndex, currentIndex }) => {
  const bottomBoundary = useRef(null);
  const [patientList, setPatientList] = useState([]);

  useEffect(() => {
    getPatientList()
      .then((res) => {
        const sortedPatientList = res.data.sort((a,b) => 
          a.firstName.localeCompare(b.firstName));
        setPatientList(sortedPatientList);
        setCurrentIndex(0);
      })
      .catch((e) => console.log(e));
  }, [setPatientList, setCurrentIndex]);
  
  return (
    <div className="box-flex main-content-doctor">
      <div className="main-left">
        <div className="content-tabs-doctor">
          <div className="list-customer">
            {patientList.map((patient, key) => (
                <div
                  key={key}
                  className={`item-customer clearfix ${
                    currentIndex === key ? 'active' : ''
                  }`}
                  onClick={() => setCurrentIndex(key)}
                >
                  <p className="image">
                    <img src={img_default_ava} alt='' />
                  </p>
                  <div className="right-info">
                    <div className="left">
                      <h4>
                        {patient
                          ? `${patient.firstName} ${patient.lastName}`
                          : 'N/A'}
                      </h4>
                      <p>{patient.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            <div
              id="bottom-boundary"
              style={styles.bottomBoundary}
              ref={bottomBoundary}
            ></div>
          </div>
        </div>
      </div>
      <div className="main-right">
        <div className="new-block-right-doctor">
          {patientList && patientList.length > 0 && (
            <div className="block-right-doctor-content">
              <div className="box-info-customer">
                <ProfileView patient={patientList[currentIndex]} />
              </div>
            </div>
          )}
          {patientList && patientList.length === 0 && (
            <div>No patients available...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientView;