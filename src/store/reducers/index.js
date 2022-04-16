import { combineReducers } from 'redux';
import user from './user.reducer';
import request from './request.reducer';
import REFACTORED__request from '@containers/request/store/reducer';
import appointment from './appointment.reducer';
import robot from './robot.reducer';
import appointmentDateInFuture from './appointment.date.in.future.reducer';
import loading from './loading.reducer';
import error from './error.reducer';
import notifications from './notification.reducer';
import testResult from './testResult.reducer';
import textRecord from './textRecord.reducer';
import medicalhistory from './medicalHistory.reducer';

const allReducers = combineReducers({
  user,
  request,
  appointment,
  robot,
  appointmentDateInFuture,
  error,
  loading,
  notifications,
  testResult,
  REFACTORED__request,
  textRecord,
  medicalhistory
});

export default allReducers;
