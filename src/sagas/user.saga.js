import { call, put } from 'redux-saga/effects';

import { updateUserApiCall, createUserApiCall, updateUserApiCallNew, sendForgotPasswordCallAPI, getDoctorList, getPatientList, getUserId, deleteUserApiCall} from '../apiCalls/user.api';

import {
  updateUserSuccessfully,
  updateUserFailed,
  createdUserSuccessfully,
  sendForgotPasswordSuccessfully,
  getDoctorListSuccessfully,
  getDoctorListFailed,
  getPatientListSuccessfully,
  getPatientListFailed,
  createDefaultFailed,
  sendForgotPasswordFailed,
  getUserIdSuccessfully,
  getUserIdFailed,
  deleteUserSuccessfully,
  deleteUserFailed

} from '../store/actions/user.action';
import { createDefaultError } from '../utils';

export function* updateUserSaga(action) {
  const user = action.payload || {};
  try {
    const res = yield call(updateUserApiCall, user);
    if (!res.data.code) yield put(updateUserSuccessfully(res.data));
    else {
      yield put(updateUserFailed(res.data.errors))
    };
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(updateUserFailed(errors));
  }
}

export function* updateUserSagaNew(action) {
  const user = action.payload || {};
  try {
    const res = yield call(updateUserApiCallNew, user);
    if (!res.data.code) yield put(updateUserSuccessfully(res.data));
    else yield put(updateUserFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(updateUserFailed(errors));
  }
}

export function* createUserSaga({ payload }) {
  try {
    const res = yield call(createUserApiCall, payload);
    if(!res.data.code) yield put(createdUserSuccessfully(res.data));
    else yield put(createDefaultFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(createDefaultFailed(errors));
  }
}

export function* sendForgotPassword({ payload }) {
  try {
    const res = yield call(sendForgotPasswordCallAPI, payload);
    yield put(sendForgotPasswordSuccessfully(res.data));
  } catch (e) {
    yield put(createDefaultError(e));
  }
}

export function* getDoctorListSaga(action){
  const queryParams = action.payload || {};
  try {
    const res = yield call(getDoctorList, queryParams);
    yield put(getDoctorListSuccessfully({
      queryParams,
      data: res.data
    }));
  } catch (e) {
    yield put(getDoctorListFailed(e));
  }
}

export function* getPatientListSaga(action){
  const queryParams = action.payload || {};
  try {
    const res = yield call(getPatientList, queryParams);
    yield put(getPatientListSuccessfully({
      queryParams,
      data: res.data
    }));
  } catch (e) {
    yield put(getPatientListFailed(e));
  }
}
export function* getUserIdSaga(action){
  const queryParams = action.payload || {};
  try {
    const res = yield call(getUserId, queryParams);
    yield put(getUserIdSuccessfully({
      queryParams,
      data: res.data
    }));
  } catch (e) {
    yield put(getUserIdFailed(e));
  }
}
export function* deteleUserSaga(action){
  const queryParams = action.payload || {};
  try {
    const res = yield call(deleteUserApiCall, queryParams);
    console.log("ggg");
    yield put(deleteUserSuccessfully({
      queryParams,
      data: res.data
    }));
  } catch (e) {
    console.log("fff");
    yield put(deleteUserFailed(e));
  }
}
