import '../../static/css/admin-dashboard.css';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
  convertToDiseaseName,
  convertToStatusName,
} from '../../utils';
import {getDoctorList, getPatientList } from '../../apiCalls/user.api';

import { getAllTimeAppointments } from '../../apiCalls/appointment.api';
import { getRequestsApiCall } from '../../apiCalls/request.api';
import CreateUserView from './subcomponents/CreateUserView';

const AdminDashboard = () => {
  const options = ['Request Stats', 'Doctor Actitivies', 'Patient Activities', 'Create User', 'Lists'];
  const listModes = ['Requests', 'Doctor', 'Patient']; 
  const [optionIndex, setOptionIndex] = useState(0);
  const [listModeIndex, setListModeIndex] = useState(0);
  const [requestList, setRequestList] = useState([]);
  const [appointmentList, setAppointmentList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);

  const getStatsFromRequests = () => {
    const stats = {};
    requestList.map(request => {
      const date = request.createdAt.substring(0, 7);
      const formattedDate = moment(date).format("MMMM yyyy");
      if (stats[formattedDate]) stats[formattedDate]++;
      else stats[formattedDate] = 1;
    });
    return Object.keys(stats).map((key) =>  { 
      return { x: key, y: stats[key] } 
    });
  }

  const getTypeListsFromRequests = () => {
    const types = {};
    requestList.map(request => {
      const { type } = request;
      if (types[type]) types[type]++;
      else types[type] = 1;
    })
    return Object.keys(types).map((key) =>  { 
      return { x: convertToDiseaseName(key), y: types[key] } 
    });
  };

  const getStatusListsFromRequests = () => {
    const statuses = {};
    requestList.map(request => {
      const { status } = request;
      if (statuses[status]) statuses[status]++;
      else statuses[status] = 1;
    })
    return Object.keys(statuses).map((key) =>  { 
      return { x: convertToStatusName(key), y: statuses[key] } 
    });
  };

  const getTimelineListsFromAppointments = () => {
    const joinedCall = {
      'Has joined call': 0,
      'Has not joined call': 0
    };
    appointmentList.map(appointment => {
      const { endDateAndTime } = appointment;
      if (new Date() >= new Date(endDateAndTime)) joinedCall['Has joined call']++;
      else joinedCall['Has not joined call']++;
    })
    return Object.keys(joinedCall).map((key) =>  { 
      return { x: key, y: joinedCall[key] } 
    });
  };

  const generatePatientActivities = () => {
    const sentRequests = getStatusListsFromRequests()
      .filter(data => data.x === 'Waiting');
    return sentRequests.concat(getTypeListsFromRequests());
  };

  const generateDoctorActivities = () => {
    const acceptedRequests = getStatusListsFromRequests()
      .filter(data => data.x === 'In Progress' || data.x === 'Completed');
    return acceptedRequests.concat(getTimelineListsFromAppointments());
  };

  const user = useSelector((state) => state.user);

  useEffect(() => {
    const data = { token: user.token, limit: 10 };
    getRequestsApiCall(data)
      .then((res) => setRequestList(res.data))
      .catch((e) => console.log(e));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRequestList]);

  useEffect(() => {
    getAllTimeAppointments()
      .then((res) => setAppointmentList(res.data))
      .catch((e) => console.log(e));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppointmentList]);

  useEffect(() => {
    getPatientList()
      .then((res) => setPatientList(res.data))
      .catch((e) => console.log(e));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPatientList]);

  useEffect(() => {
    getDoctorList()
      .then((res) => setDoctorList(res.data))
      .catch((e) => console.log(e));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDoctorList]);

  return (
    <div className="admin-dashboard-container">
      <div className="tabs-admin">
        {options.map((item, key) => (
          <a
            href="#!"
            className={`${optionIndex === key ? 'active' : ''}`}
            onClick={() => setOptionIndex(key)}
          >
            {item}
          </a>
        ))}
      </div>
      {optionIndex === 0 && <div className="vertical-alignment">
        {getStatsFromRequests().map((data, key) => 
          <div key={key} className="horizontal-alignment">
            <h4><b>{data.x}</b>: {data.y} requests</h4>
          </div>
        )}
      </div>}
      {optionIndex === 1 && <div className="vertical-alignment">
        {generateDoctorActivities().map((data, key) => 
          <div key={key} className="horizontal-alignment">
            <h4><b>{data.x}</b>: {data.y} requests</h4>
          </div>
        )}
      </div>}
      {optionIndex === 2 && <div className="vertical-alignment">
        {generatePatientActivities().map((data, key) => 
          <div key={key} className="horizontal-alignment">
            <h4><b>{data.x}</b>: {data.y} requests</h4>
          </div>
        )}
      </div>}
      {optionIndex === 3 && <CreateUserView />}
      {optionIndex === 4 && <div className="vertical-alignment">
        <div className="tabs-admin">
          {listModes.map((item, key) => (
            <a
              href="#!"
              className={`${listModeIndex === key ? 'active' : ''}`}
              onClick={() => setListModeIndex(key)}
            >
              {item}
            </a>
          ))}
        </div>
        {listModeIndex === 0 && requestList.map((request, key) => 
          <div key={key} className="horizontal-alignment">
            <h4><b>{request._id}</b>: {request.createdAt}</h4>
          </div>
        )}
        {listModeIndex === 1 && doctorList.map((doctor, key) => 
          <div key={key} className="horizontal-alignment">
            <h4><b>{doctor._id}</b>: {doctor.email}</h4>
          </div>
        )}
        {listModeIndex === 2 && patientList.map((patient, key) => 
          <div key={key} className="horizontal-alignment">
            <h4><b>{patient._id}</b>: {patient.email}</h4>
          </div>
        )}
      </div>}
    </div>
  );
};

export default AdminDashboard;
