/* eslint-disable react/prefer-stateless-function */
import { Avatar } from 'material-ui';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PATIENT_ROLE } from '../../../constant';
import defaultAva from '@img/d_ava.png';
import close_icon from '@img/imi/icon-add-gradient.png';
import icon_book_appointment from '@img/imi/icon_book_appointment.png';
import icon_create_request from '@img/imi/icon_create_request.png';
import icon_record_Reader from '@img/imi/icon_record_Reader.png';
import '../../../static/css/patient-dashboard.css';
import {
  convertDate,
  convertMilisecondToDate,
  convertToDiseaseName,
  convertToStatusName
} from '../../../utils';
import FlashRecordPage from '../../flash-record/FlashRecordPage';
import CreateRequestPage from '../../request/CreateRequestPage';
import SubmitProgressPage from '../../submit-progress/SubmitProgressPage';

export default function DetailPatientDashboard(props) {
  const [activeTab, setActiveTab] = useState(props.activeTab);
  const [dateChoose] = useState(new Date());
  const user = useSelector((state) => state.user) || {};
  const filteredUser = { ...user };
  const [filteredUserFilter ,setFilteredUser] = useState(filteredUser);
  const request = useSelector((state) => state.request);

  useEffect(() => {
    setFilteredUser({ ...filteredUser });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, request]);
  const filteredRequests = {};
  const {
    avatarUrl = defaultAva,
    firstName,
    lastName,
    requests = [],
    email = '',
    role,
    address,
    dob,
  } = user;
  if (role === PATIENT_ROLE && requests && requests.length) {
    filteredRequests['0'] = requests.filter(
      (request) =>
        (request.status === 0 || !request.status) &&
        moment(request.createdAt).format('DD/MM/YYYY') ===
          moment(dateChoose).format('DD/MM/YYYY')
    );
    filteredRequests['1'] = requests.filter((request) => request.status === 1);
    filteredRequests['2'] = requests.filter((request) => request.status === 2);
    filteredUser.requests = filteredRequests;
  }

  if (requests) {
    filteredRequests[0] = requests.filter(
      (request) => request.status === 0 || !request.status
    );
    filteredRequests[1] = requests.filter((request) => request.status === 1);
    filteredRequests[2] = requests.filter((request) => request.status === 2);
  }
  /*
    Status:
    - 0: Waiting
    - 1: In Progress
    - 2: Completed
    - 3: Rejected
    - 4: Claimed
  */
  let i = 1;
  const filteredRequestsToReview = filteredRequests[2] || [];
  const restructuredRequests = [];
  filteredRequestsToReview
    .sort((a, b) => convertDate(b.createdAt) - convertDate(a.createdAt))
    .map((req) => {
      const { type, createdAt, status, _id} = req;
      const newRequest = {
        id: i,
        createdAt: convertMilisecondToDate(createdAt, 'string') || '',
        type: convertToDiseaseName(type) || '',
        _id,
        status: convertToStatusName(status || 0),
        patientEmail: email,
      };
      restructuredRequests.push(newRequest);
      i += 1;
    });
  const goToAppointmentPage = (e) => {
    props.history.push('/appointment');
  };

  const getBirthday = () => {
    return moment().year() - moment(dob).year();
  };

  return (
    <div className="patient-home-page">
      {activeTab !== 0 && activeTab !== 1 && activeTab !== 5 ? (
        <div className="patient-home-content">
          <div className="patient-home-content--content">
            <div className="baner-detail-patient">
              <div className="detail-patient-left">
                <div className="title-detail">
                  <p>Medical History</p>
                </div>
                  <div className="detail-content">
                    <a href="#!" className="icon_close_detail" onClick={() => props.onSetActiveTab(-1)}>
                      <img alt="description of image" src={close_icon} />
                    </a>
                    <div className="box-info-customer-detail-patient">
                      <ul className="list-unstyled">
                        <li>
                          <span>Blood</span>{' '}
                          <strong >O+</strong>
                        </li>
                        <li>
                          <span>Height</span> <strong>165cm</strong>
                        </li>
                        <li>
                          <span>Weight</span> <strong>60kg</strong>
                        </li>
                        <li>
                          <span>Smoke</span>
                          <strong>No</strong>
                        </li>
                        <li>
                          <span>Smoking for</span>
                          <strong>No</strong>
                        </li>
                        <li>
                          <span>Drinking</span>
                          <strong>No</strong>
                        </li>
                        <li>
                          <span>Family has cancer</span>
                          <strong>No info</strong>
                        </li>
                        <li>
                          <span>Type of cancer</span>
                          <strong>No info</strong>
                        </li>
                      </ul>
                    </div>
                  </div>
              </div>
              <div className="detail-patient-right">
                <div className="box-profile-detail-patient">
                  <div className="info">
                    <p className="avatar">
                      <Avatar
                        className="upload-avatar"
                        src={avatarUrl}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          height: '200px',
                          width: '200px',
                          objectFit: 'cover',
                        }}
                      />
                    </p>
                    <h2 className="full-name m-0">
                      {firstName} {lastName}
                    </h2>
                    <p className="info">
                      {getBirthday()} years, {address}
                    </p>
                  </div>
                </div>
                <div className="medical-history-detail-patient pt-4 mt-5">
                  <button
                    className={
                      activeTab === 0
                        ? 'btn-gradient-yellow'
                        : 'gradient-blue-detail-patient'
                    }
                    onClick={() => props.onSetActiveTab(0)}
                  >
                    <p>Smart Record Reader</p>
                    <img src={icon_record_Reader} className="icon-absolute" alt='' />
                  </button>
                  <button
                    className={
                      activeTab === 1
                        ? 'btn-gradient-yellow'
                        : 'gradient-blue-detail-patient'
                    }
                    onClick={() => props.onSetActiveTab(1)}
                  >
                    <p> Create Request</p>
                    <img src={icon_create_request} className="icon-absolute" alt='' />
                  </button>
                  <button
                    className="gradient-blue-detail-patient"
                    onClick={(e) => goToAppointmentPage(e)}
                  >
                    <p> Ask question</p>
                    <img
                    
                      src={icon_book_appointment}
                      className="icon-absolute"
                      alt=''
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="patient-full-page">
          {activeTab === 0 && <FlashRecordPage onSetActiveTab={setActiveTab} />}
          {activeTab === 1 && <CreateRequestPage onUploaded={setActiveTab} />}
          {activeTab === 3 && <SubmitProgressPage />}
          {activeTab === 5 && (
            <DetailPatientDashboard onSetActiveTab={setActiveTab} />
          )}
        </div>
      )}
    </div>
  );
}
