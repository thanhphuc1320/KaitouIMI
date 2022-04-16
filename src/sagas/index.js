import { takeLatest, takeEvery } from 'redux-saga/effects';

import {
  ATTEMPT_LOGIN_API,
  GET_USER_IDENTITY_API,
  CREATE_REQUEST_API,
  GET_REQUESTS_API,
  UPDATE_REQUEST_API,
  UPDATE_REQUEST_FILTERED_API,
  DELETE_REQUEST_API,
  UPDATE_USER_API,
  UPDATE_USER_API_NEW,
  ATTEMPT_REGISTER_API,
  FORGOT_PASSWORD_API,
  SEND_FORGOT_PASSWORD_API,
  RESET_PASSWORD_API,
  CREATE_APPOINTMENT_API,
  GET_APPOINTMENTS_API,
  GET_ROBOT_API,
  GET_ADMIN_ROBOT_API,
  UPDATE_ADMIN_ROBOT_API,
  SYNC_ROBOTS_API,
  GET_ADMIN_ROBOTS_API,
  BOOK_APPOINTMENT_API,
  UPDATE_APPOINTMENT_API,
  CANCEL_APPOINTMENT_API,
  GET_DOCTOR_LIST_API,
  GET_PATIENT_LIST_API,
  GET_ALL_APPOINTMENTS_API,
  GET_ALL_APPOINTMENTS_CAO_THANG_API,
  GET_ALL_APPOINTMENTS_DATE_IN_FUTURE_API,
  GET_NOTIFICATIONS,
  MARK_AS_READ,
  CREATE_USER_API,
  GET_MEDICAL_HISTORY,
  UPDATE_MEDICAL_HISTORY,
  GET_REMOTE_LINK,
  SET_HOME_PAGE,
  DELETE_REMOTE_LINK,
  GET_TEST_RESULT,
  GET_TEXT_RECORDING,
  GET_USERS_ID_API,
  DELETE_USER_API,
  GET_SMART_READER_DOCTOR_API,
  UPDATE_REQUEST_API_IN_DOCTOR
} from '../constant';

import {
  attemptLoginSaga,
  attemptRegisterSaga,
  getUserIdentitySaga,
} from './auth.saga';

import {
  // getRequestsSaga,
  createRequestSaga,
  updateRequestSaga,
  updateRequestForFilteredSaga,
  deleteRequestSaga,
  getSmartRecordReaderDoctorSaga
} from './request.saga';

import { updateUserSaga,updateUserSagaNew, createUserSaga, sendForgotPassword, getDoctorListSaga, getPatientListSaga, getUserIdSaga, deteleUserSaga } from './user.saga';

import { forgotPasswordSaga, resetPasswordSaga } from './forgotPassword.saga';

import {
  createAppointmentSaga,
  getAppointmentsSaga,
  bookAppointmentSaga,
  updateAppointmentSaga,
  cancelAppointmentSaga,
  getAllAppointmentsSaga,
  getAllAppointmentsCaoThangSaga,
  getAllAppointmentsDateInFutureSaga,
} from './appointment.saga';

import {
  getRobotsSaga,
  setHomePageSaga,
  getRemoteLinkSaga,
  deleteRemoteLinkSaga,
  getAdminRobotsSaga,
  syncRobotsSaga,
  getAdminRobotSaga,
  updateAdminRobotSaga
} from './robot.saga';
import { getNotificationsSaga, markAsReadSaga } from './notification.saga';

import { getRequestsSaga, updateRequestInDoctor } from '@containers/request/store/saga';
import { getMedicalHistory, updateMedicalHistory } from './medicalHistory.saga'
import { getDataTestResult } from './testRequest.saga';
import { getDataRecording } from './textRecord.saga';

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* watcherSaga() {
  yield takeLatest(ATTEMPT_LOGIN_API, attemptLoginSaga);
  yield takeLatest(ATTEMPT_REGISTER_API, attemptRegisterSaga);
  yield takeLatest(GET_USER_IDENTITY_API, getUserIdentitySaga);
  yield takeLatest(UPDATE_REQUEST_API_IN_DOCTOR, updateRequestInDoctor);
  yield takeLatest(CREATE_REQUEST_API, createRequestSaga);
  yield takeLatest(GET_REQUESTS_API, getRequestsSaga);
  yield takeLatest(UPDATE_REQUEST_API, updateRequestSaga);
  yield takeLatest(UPDATE_REQUEST_FILTERED_API, updateRequestForFilteredSaga);
  yield takeLatest(DELETE_REQUEST_API, deleteRequestSaga);
  yield takeLatest(UPDATE_USER_API, updateUserSaga);
  yield takeLatest(UPDATE_USER_API_NEW, updateUserSagaNew);
  yield takeLatest(FORGOT_PASSWORD_API, forgotPasswordSaga);
  yield takeLatest(SEND_FORGOT_PASSWORD_API, sendForgotPassword);
  yield takeLatest(UPDATE_MEDICAL_HISTORY, updateMedicalHistory);
  yield takeLatest(RESET_PASSWORD_API, resetPasswordSaga);
  yield takeLatest(CREATE_APPOINTMENT_API, createAppointmentSaga);
  yield takeLatest(GET_APPOINTMENTS_API, getAppointmentsSaga);
  yield takeLatest(GET_ADMIN_ROBOT_API, getAdminRobotSaga);
  yield takeLatest(UPDATE_ADMIN_ROBOT_API, updateAdminRobotSaga);
  yield takeLatest(SYNC_ROBOTS_API, syncRobotsSaga);
  yield takeLatest(GET_ADMIN_ROBOTS_API, getAdminRobotsSaga);
  yield takeLatest(GET_ROBOT_API, getRobotsSaga);
  yield takeLatest(GET_REMOTE_LINK, getRemoteLinkSaga);
  yield takeLatest(SET_HOME_PAGE, setHomePageSaga);
  yield takeLatest(DELETE_REMOTE_LINK, deleteRemoteLinkSaga);
  yield takeLatest(BOOK_APPOINTMENT_API, bookAppointmentSaga);
  yield takeLatest(UPDATE_APPOINTMENT_API, updateAppointmentSaga);
  yield takeLatest(CANCEL_APPOINTMENT_API, cancelAppointmentSaga);
  yield takeLatest(GET_ALL_APPOINTMENTS_API, getAllAppointmentsSaga);
  yield takeLatest(GET_ALL_APPOINTMENTS_CAO_THANG_API, getAllAppointmentsCaoThangSaga);
  yield takeLatest(
    GET_ALL_APPOINTMENTS_DATE_IN_FUTURE_API,
    getAllAppointmentsDateInFutureSaga
  );
  yield takeLatest(GET_NOTIFICATIONS, getNotificationsSaga);
  yield takeEvery(MARK_AS_READ, markAsReadSaga);
  yield takeLatest(CREATE_USER_API, createUserSaga);
  yield takeLatest(GET_MEDICAL_HISTORY, getMedicalHistory);
  yield takeLatest(UPDATE_MEDICAL_HISTORY, updateMedicalHistory);
  yield takeLatest(GET_DOCTOR_LIST_API, getDoctorListSaga);
  yield takeLatest(GET_PATIENT_LIST_API, getPatientListSaga);
  yield takeLatest(GET_TEST_RESULT, getDataTestResult);
  yield takeLatest(GET_TEXT_RECORDING, getDataRecording);
  yield takeLatest(GET_USERS_ID_API, getUserIdSaga)
  yield takeLatest(DELETE_USER_API, deteleUserSaga)
  yield takeLatest(GET_SMART_READER_DOCTOR_API, getSmartRecordReaderDoctorSaga)
}
