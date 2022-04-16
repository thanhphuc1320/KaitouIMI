import { call, put } from 'redux-saga/effects';

import {
  createOrUpdateAppointment,
  getAppointment,
  cancelAppointment,
  getAllAppointments,
  getAllAppointmentsCaoThang,
  getAllAppointmentsDateInFuture,
} from '../apiCalls/appointment.api';

import {
  createAppointmentSuccessfully,
  createAppointmentFailed,
  getAppointmentsSuccessfully,
  getAppointmentsFailed,
  bookAppointmentSuccessfully,
  bookAppointmentFailed,
  updateAppointmentSuccessfully,
  updateAppointmentFailed,
  cancelAppointmentSuccessfully,
  cancelAppointmentFailed,
  getAllAppointmentsSuccessfully,
  getAllAppointmentsFailed,
  getAllAppointmentsCaoThangSuccessfully,
  getAllAppointmentsCaoThangFailed,
  getAllAppointmentsDateInFutureSuccessfully,
  getAllAppointmentsDateInFutureFailed,
} from '../store/actions/appointment.action';
import { createDefaultError } from '../utils';

/**
 * Used when Doctor first create avaialable appointment
 * @param {} action
 */
export function* createAppointmentSaga(action) {
  const appointment = action.payload || {};
  try {
    const res = yield call(createOrUpdateAppointment, appointment);
    if (!res.data.code) yield put(createAppointmentSuccessfully(res.data));
    else yield put(createAppointmentFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(createAppointmentFailed(errors));
  }
}

export function* getAppointmentsSaga(action) {
  try {
    const queryParams =
      {
        ...action.payload,
        offSet: new Date(2016, 4, 1).getTimezoneOffset(),
      } || {};
    const res = yield call(getAppointment, queryParams);

    if (!res.data.code) yield put(getAppointmentsSuccessfully(res.data));
    else yield put(getAppointmentsFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(getAppointmentsFailed(errors));
  }
}

export function* bookAppointmentSaga(action) {
  const appointment = action.payload || {};
  try {
    const res = yield call(createOrUpdateAppointment, appointment);
    if (!res.data.code) {
      yield put(bookAppointmentSuccessfully(res.data));
    } else {
      yield put(bookAppointmentFailed(res.data.errors));
    }
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(bookAppointmentFailed(errors));
  }
}

export function* updateAppointmentSaga(action) {
  const appointment = action.payload || {};
  try {
    const res = yield call(createOrUpdateAppointment, appointment);
    if (!res.data.code) yield put(updateAppointmentSuccessfully(res.data));
    else yield put(updateAppointmentFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(updateAppointmentFailed(errors));
  }
}

export function* cancelAppointmentSaga(action) {
  const data = action.payload || {};
  try {
    const res = yield call(cancelAppointment, data);
    const { appointmentId } = data;
    if (!res.data.code)
      yield put(cancelAppointmentSuccessfully({ appointmentId }));
    else yield put(cancelAppointmentFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(cancelAppointmentFailed(errors));
  }
}

export function* getAllAppointmentsSaga(action) {
  const queryParams = action.payload || {};
  try {
    const res = yield call(getAllAppointments, queryParams);
    if (!res.data.code) yield put(getAllAppointmentsSuccessfully(res.data));
    else yield put(getAllAppointmentsFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(getAllAppointmentsFailed(errors));
  }
}

export function* getAllAppointmentsCaoThangSaga(action){
  const queryParams = action.payload || {};
  try{
    const res = yield call(getAllAppointmentsCaoThang, queryParams);
    if(!res.data.code) yield put(getAllAppointmentsCaoThangSuccessfully(res.data));
    else yield put(getAllAppointmentsCaoThangFailed(res.data.errors));
  } catch(e){
    const errors = createDefaultError(e);
    yield put(getAllAppointmentsCaoThangFailed(errors));
  }
}

export function* getAllAppointmentsDateInFutureSaga(action) {
  const queryParams = action.payload || {};
  try {
    const res = yield call(getAllAppointmentsDateInFuture, queryParams);
    if (!res.data.code)
      yield put(getAllAppointmentsDateInFutureSuccessfully(res.data));
    else yield put(getAllAppointmentsDateInFutureFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(getAllAppointmentsDateInFutureFailed(errors));
  }
}
