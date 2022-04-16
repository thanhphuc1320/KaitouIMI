import { call, put } from 'redux-saga/effects';
import { 
  getRobotList,
  setHomePage,
  getRemoteLink,
  deleteRemoteLink,
  getAdminRobots,
  syncAdminRobots,
  updateAdminRobot,
  getAdminRobot
} from '../apiCalls/robot.api';
import {
    getRobotSuccessfully,
    getRobotFailed,
    getAdminRobotsSuccessfully,
    getAdminRobotsFailed,
    setHomePageSuccessfully,
    setHomePageFailed,
    getRemoteLinkSuccessfully,
    getRemoteLinkFailed,
    deleteRemoteLinkFailed,
    deleteRemoteLinkSuccessfully,
    syncRobotsSuccessfully,
    syncRobotsFailed,
    updateAdminRobotFailed,
    updateAdminRobotSuccessfully,
    getAdminRobotSuccessfully,
    getAdminRobotFailed
}from '../store/actions/robot.action';
import { createDefaultError } from '../utils';

export function* getRobotsSaga(action) {
    try {
      const res = yield call(getRobotList);
      if (!res.data.code) yield put(getRobotSuccessfully(res.data));
      else yield put(getRobotFailed(res.data.errors));
    } catch (e) {
      const errors = createDefaultError(e);
      yield put(getRobotFailed(errors));
    }
  }

export function* getAdminRobotsSaga(action) {
  try {
    const res = yield call(getAdminRobots);
    if (!res.data.code) yield put(getAdminRobotsSuccessfully(res.data));
    else yield put(getAdminRobotsFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(getAdminRobotsFailed(errors));
  }
}

export function* getAdminRobotSaga(action) {
  try {
    const res = yield call(getAdminRobot, action.payload);
    if (!res.data.code) yield put(getAdminRobotSuccessfully(res.data));
    else yield put(getAdminRobotFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(getAdminRobotFailed(errors));
  }
}

export function* updateAdminRobotSaga(action) {
  try {
    const res = yield call(updateAdminRobot, action.payload);
    if (!res.data.code) yield put(updateAdminRobotSuccessfully(res.data));
    else yield put(updateAdminRobotFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(updateAdminRobotFailed(errors));
  }
}

export function* syncRobotsSaga(action) {
  try {
    const res = yield call(syncAdminRobots);
    if (!res.data.code) yield put(syncRobotsSuccessfully(res.data));
    else yield put(syncRobotsFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(syncRobotsFailed(errors));
  }
}

export function* setHomePageSaga(action) {
  try {
    const res = yield call(setHomePage, action.payload);
    if (!res.data.code) yield put(setHomePageSuccessfully(res.data));
    else yield put(setHomePageFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(setHomePageFailed(errors));
  }
}

export function* getRemoteLinkSaga(action) {
  try {
    const res = yield call(getRemoteLink, action.payload);
    if (!res.data.code) yield put(getRemoteLinkSuccessfully(res.data));
    else yield put(getRemoteLinkFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(getRemoteLinkFailed(errors));
  }
}

export function* deleteRemoteLinkSaga(action) {
  try {
    const res = yield call(deleteRemoteLink, action.payload);
    if (!res.data.code) yield put(deleteRemoteLinkSuccessfully(res.data));
    else yield put(deleteRemoteLinkFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(deleteRemoteLinkFailed(errors));
  }
}