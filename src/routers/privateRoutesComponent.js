/* eslint-disable max-classes-per-file */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Route,
  useLocation,
  NavLink,
  useParams,
  useHistory,
} from 'react-router-dom';

import defaultAva from '../img/d_ava.png';
import { DOCTOR_ROLE, ADMIN_ROLE } from '../constant';

// Main Page
import OldDashboardPage from '../pages/dashboard/oldDashboard/oldDashboardPage';
import PatientDashboard from '../pages/dashboard/patientDashboard';
import DoctorDashboard from '../pages/dashboard/doctorDashboard';
import AdminDashboard from '../pages/dashboard/adminDashboard';

// Appointment
import PatientBookingPage from '../pages/appointment/patient/PatientBookingPage';
import RobotControlPage from '../pages/appointment/doctor/RobotControlPage';
import DoctorAppointment from '../pages/appointment/doctor/DoctorAppointment';
import PatientAppointment from '../pages/appointment/patient/PatientAppointment';
import DoctorAppointmentDetail from '../pages/appointment/doctor/DoctorAppointmentDetail';
import AdminHomepage from '../pages/admin/homePage';
import CreateProfile from '../pages/admin/createProfile';
import TranscriptRecording from '../pages/admin/transcriptAudioRecording';

//Smart Record Reader Page
import SmartRecordReaderPage from '../pages/SmartRecordReaderPage';
import SmartRecordReaderOfDoctor from '../pages/smartRecordReaderOfDoctor';

// Request Page
import CreateRequestPage from '../pages/request/CreateRequestPage';
import RequestDetailForPatientPage from '../pages/request/RequestDetailForPatientPage';
import RequestDetailForDoctorPage from '../pages/request/RequestDetailForDoctorPage';
import ResultSmartRecordOfDoctor from '../pages/resultSmartRecordDoctor';

//Call Page
import Calling from '@containers/calling';

// User Profile
import UpdateUserProfilePage from '../pages/patientNew/profile/EditProfile';
import ViewUserProfilePage from '../pages/patientNew/profile/ViewUserProfilePage';
import PatientAppointmentDetail from '../pages/appointment/patient/PatientAppointmentDetail';

// Notification
import NottificationCenter from '../components/notifications-center';

//admin
import HomeAdmin from 'pages/admin/homePageAdmin';
import DoctorAdmin from 'pages/admin/doctorAdmin';
import PatientAdmin from 'pages/admin/patientAdmin';
import AddUserAdmin from 'pages/admin/componentAdmin/addUserAdmin';
import RobotAdmin from 'pages/admin/robotAdmin';
import AddRobotAdmin from 'pages/admin/componentAdmin/addRobot';
import EditRobotAdmin from 'pages/admin/componentAdmin/editRobotAdmin';

//appointment new
import PatientHome from 'pages/patientNew/patientDashboard';
import AppointmentPatient from 'pages/patientNew/appointmentPatient';
import CreateAppointment from 'pages/patientNew/createAppointment';
import SummaryAppointment from 'pages/patientNew/summaryAppointment';
import SmartReader from 'pages/patientNew/smartReader/smartReader';
import Opinion from 'pages/patientNew/secondOpinion/opinion';
import SecondOpinion from 'pages/patientNew/secondOpinion/secondOpinion';
import TestResult from '../pages/patientNew/testResult/test-result';
import AllFileTestResult from '../pages/patientNew/testResult/list-file-test-result';
import MedicalHistory from '../pages/patientNew/medicalHistory/medicalHistory';
import EditResult from '../pages/patientNew/smartReader/editResult';
import IDoctor_Result from '../pages/patientNew/testResult/iDoctor-Result';
import IReader_Result from '../pages/patientNew/testResult/iReader-Result';

export default function PrivateRoutesComponent(props) {
  const user = useSelector((state) => state.user);
  let location = useLocation();
  const history = useHistory();
  const { role } = user;
  const { avatarUrl = defaultAva } = user;

  const getDashboard = (role) => {
    switch (role) {
      case DOCTOR_ROLE:
        return DoctorDashboard;
      case ADMIN_ROLE:
        return AdminDashboard;
      default:
        return PatientHome;
      // return PatientDashboard;
    }
  };

  const getAppointment = (role) =>
    role === DOCTOR_ROLE ? DoctorAppointment : AppointmentPatient;

  const getAppointmentDetail = (role) =>
    role === DOCTOR_ROLE ? DoctorAppointmentDetail : PatientAppointmentDetail;

  const getRequestDetail = (role) =>
    role === DOCTOR_ROLE
      ? RequestDetailForDoctorPage
      : RequestDetailForPatientPage;

  const pagePathName = location.pathname.split('/')[1];
  const pagePath = location.pathname.split('/');
  let pathName = '';
  if (pagePath[2] && pagePath[2] !== 'robot') {
    pathName = 'Summary of your appointment';
  }
  if (pagePath[2] && pagePath[2] === 'robot') {
    pathName = 'Robot';
  }

  useEffect(() => {
    if (
      !user.token &&
      !user.role &&
      history.location.pathname !== '/reset-password'
    ) {
      history.replace('/home');
    }
  }, [user.token]);

  useEffect(() => {
    props.callBackRouteDom(pagePathName);

    const indexRouter = listRouterPrivate.findIndex(
      (item) => item.path === history.location.pathname
    );
    if (indexRouter === -1 && pagePath.length == 2) {
      history.replace('/');
    }
  }, [history.location.pathname]);

  const listRouterPrivate = [
    {
      path: '/',
      component: user.role === 'admin' ? HomeAdmin : getDashboard(role),
    },
    {
      path: '/create-profile',
      component: CreateProfile,
    },
    {
      path: '/transcript-audio-recording/:appointmentId',
      component: TranscriptRecording,
    },
    {
      path: '/old-dashboard',
      component: OldDashboardPage,
    },
    {
      path: '/appointment/booking',
      component: PatientBookingPage,
    },
    {
      path: '/appointment',
      component: getAppointment(role),
    },
    {
      path: '/appointment/robot/:id',
      component: RobotControlPage,
    },
    {
      path: '/appointment/:appointmentId',
      component: getAppointmentDetail(role),
    },
    {
      path: '/appointment/patient/call',
      component: Calling,
    },
    {
      path: '/appointment/doctor/call',
      component: Calling,
    },
    {
      path: '/appointment/:appointmentId/modify',
      component: PatientBookingPage,
    },
    {
      path: '/update-profile',
      component: UpdateUserProfilePage,
    },
    {
      path: '/preference',
      component: ViewUserProfilePage,
    },
    {
      path: '/smart-record-reader',
      component: SmartRecordReaderPage,
    },
    {
      path: '/create-request',
      component: CreateRequestPage,
    },
    {
      path: '/requests/:requestId',
      component: getRequestDetail(role),
    },
    {
      path: '/test-result/:testResultId',
      component: TestResult,
    },
    {
      path: '/test-result',
      component: TestResult,
    },
    {
      path: '/all-file-test-result',
      component: AllFileTestResult,
    },
    {
      path: '/all-file-test-result/:type/:testResultId',
      component: TestResult,
    },
    {
      path: '/medical-history',
      component: MedicalHistory,
    },
    {
      path: '/home-admin',
      component: AdminHomepage,
    },
    {
      path: '/doctor-admin',
      component: DoctorAdmin,
    },
    {
      path: '/doctor-admin/:role',
      component: AddUserAdmin,
    },
    {
      path: '/patient-admin',
      component: PatientAdmin,
    },
    {
      path: '/patient-admin/:role',
      component: AddUserAdmin,
    },
    {
      path: '/doctor-admin/:role/:uuid',
      component: AddUserAdmin,
    },
    {
      path: '/patient-admin/:role/:uuid',
      component: AddUserAdmin,
    },
    {
      path: '/robot-admin',
      component: RobotAdmin,
    },
    {
      path: '/add-robot',
      component: AddRobotAdmin,
    },
    {
      path: '/robot-admin/:uuid',
      component: EditRobotAdmin,
    },
    {
      path: '/home-patient',
      component: PatientHome,
    },
    {
      path: '/appointment-new',
      component: AppointmentPatient,
    },
    {
      path: '/create-appointment',
      component: CreateAppointment,
    },
    {
      path: '/summary-appointment/:idAppointment',
      component: SummaryAppointment,
    },
    {
      path: '/smart-reader',
      component: SmartReader,
    },
    {
      path: '/smart-reader/edit',
      component: EditResult,
    },
    {
      path: '/opinion',
      component: Opinion,
    },
    {
      path: '/opinion/:id',
      component: Opinion,
    },
    {
      path: '/second-opinion',
      component: SecondOpinion,
    },
    {
      path: '/my-requests',
      component: SmartRecordReaderOfDoctor,
    },
    {
      path: '/request-detail-doctor/:id',
      component: ResultSmartRecordOfDoctor,
    },
    {
      path: '/iDoctor-result/:testResultId',
      component: IDoctor_Result,
    },
    {
      path: '/iReader-result/:testResultId',
      component: IReader_Result,
    },
  ];

  return (
    <div className="doctor-dashboard-page">
      {pagePathName === 'appointment' && user.role === 'doctor' && (
        <div className="appointment-page">
          <div className="topAppointment">
            <div className="leftTop">
              <h2 className="color-appoiment-h2">
                <NavLink to="/appointment">
                  <span>Appointments</span>
                </NavLink>
                {pathName}
              </h2>
            </div>
            <div className="rightTop">
              <NottificationCenter />
              {user.role !== 'patient' ? (
                <NavLink to="/update-profile" className="avatar">
                  <img alt="" src={avatarUrl} />
                </NavLink>
              ) : (
                <NavLink to="/upload-patient-profile" className="avatar">
                  <img alt="" src={avatarUrl} />
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
      {listRouterPrivate.map((itemRouter, index) => {
        return (
          <Route
            exact
            path={itemRouter.path}
            component={itemRouter.component}
            key={index}
          />
        );
      })}
    </div>
  );
}
