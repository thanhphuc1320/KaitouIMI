/* eslint-diasble (react/jsx-filename-extension) */
import React from 'react';
import { useSelector } from 'react-redux';

import OldPatientDashboard from './oldPatientDashboard';
import OldDoctorDashboard from './oldDoctorDashboard';

import { DOCTOR_ROLE, PATIENT_ROLE } from '../../../constant';

export default function OldDashboardPage() {
  const user = useSelector((state) => state.user) || {};
  const request = useSelector((state) => state.request) || {};
  const { role, requests } = user;
  const { requestsToReview } = request;

  const filteredRequests = {};
  const filteredUser = { ...user };

  // Filter requests based on status for doctor dashboard
  if (role === DOCTOR_ROLE && requestsToReview && requestsToReview.length) {
    filteredRequests['0'] = requestsToReview.filter(
      (request) => request.status === 0 || !request.status
    );
    filteredRequests['1'] = requestsToReview.filter(
      (request) => request.status === 1
    );
    filteredRequests['2'] = requestsToReview.filter(
      (request) => request.status === 2
    );
    filteredUser.requestsToReview = filteredRequests;
  }

  // Filtered request for PATIENT
  if (role === PATIENT_ROLE && requests && requests.length) {
    filteredRequests['0'] = requests.filter(
      (request) => request.status === 0 || !request.status
    );
    filteredRequests['1'] = requests.filter((request) => request.status === 1);
    filteredRequests['2'] = requests.filter((request) => request.status === 2);

    filteredUser.requests = filteredRequests;
  }

  // Update requestsToReview in user object
  return (
    <div className="doctor-dashboard-page">
      {role === DOCTOR_ROLE ? (
        <OldDoctorDashboard user={filteredUser} request={request} />
      ) : (
        <OldPatientDashboard user={filteredUser} />
      )}
    </div>
  );
}
