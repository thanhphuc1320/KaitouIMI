import { call, put } from 'redux-saga/effects';

import {
  createRequestApiCall,
  updateRequestApiCall,
  getRequestsApiCall,
  deleteRequestApiCall,
  updateRequestApiCallForFiltered,
  getSmartRecordReaderApiCall
} from '../apiCalls/request.api';

import {
  // Create Request
  createRequestSuccessfully,
  createRequestFailed,
  // Update Request
  updateRequestSuccessfully,
  updateRequestFilteredSuccessfully,
  // Get Request
  getRequestsSuccessfully,
  getRequestsFailed,
  // Delete Request
  deleteRequestSuccessfully,
  deleteRequestFailed,
  getSmartRecordReaderSuccessfully,
  getSmartRecordReaderFailed
} from '../store/actions/request.action';
import { createDefaultError, updateRequestFailed, updataRequestForFilteredFailed } from '../utils';

/**
 * ==================
 * GET REQUEST
 * ==================
 */
export function* getRequestsSaga(action) {
  try {
    const res = yield call(getRequestsApiCall, action.payload);
    if (!res.data.code) {
      const requests = res.data;
      yield put(getRequestsSuccessfully(requests, action.payload.page));
    } else {
      yield put(getRequestsFailed(res.data.errors));
    }
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(getRequestsFailed(errors));
  }
}

/**
 * ==================
 * CREATE REQUEST
 * ==================
 */
export function* createRequestSaga(action) {
  try {
    let request = action.payload || {};
    const res = yield call(createRequestApiCall, request);
    if (!res.data.code && Number.isInteger(request.type))
      yield put(createRequestSuccessfully(res.data));
    else put(createRequestFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(createRequestFailed(errors));
  }
}

/**
 * ==================
 * UPDATE REQUEST
 * ==================
 */
export function* updateRequestSaga(action) {
  const request = action.payload || {};
  const { requestId, data } = request;
  if (
    requestId &&
    data.status &&
    data.mode &&
    [1].includes(data.mode) &&
    [0, 1, 2, 3, 4].includes(data.status)
  ) {
    try {
      const res = yield call(updateRequestApiCall, request);
      if (!res.data.code && Number.isInteger(res.data.type)){
        yield put(updateRequestSuccessfully(res.data));
      }

      else yield put(updateRequestFailed(res.data.errors));
    } catch (e) {
      const errors = createDefaultError(e);
      yield put(updateRequestFailed(errors));
    }
  } else {
    // FIXME: Handle error
  }
}

export function* updateRequestForFilteredSaga(action) {
  const request = action.payload || {};
  const { id, bloodTest } = request;
  if( id || bloodTest){
    try {
      const res = yield call(updateRequestApiCallForFiltered, request);
      if (!res.data.code){
        yield put(updateRequestFilteredSuccessfully(res.data.bloodTest));
      }
      else yield put(updataRequestForFilteredFailed(res.data.errors));
    } catch (e) {
      const errors = createDefaultError(e);
      yield put(updataRequestForFilteredFailed(errors));
    }
  } else {
    // FIXME: Handle error
  }
}

/**
 * ==================
 * DELETE REQUEST
 * ==================
 */
export function* deleteRequestSaga(action) {
  const requestId = action.payload || {};
  try {
    const res = yield call(deleteRequestApiCall, requestId);
    if (!res.data.code) yield put(deleteRequestSuccessfully({ requestId }));
    yield put(deleteRequestFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(deleteRequestFailed(errors));
  }
}

export function* getSmartRecordReaderDoctorSaga(action) {
  try {
    const res = yield call(getSmartRecordReaderApiCall, action.payload);
    if (!res.data.code) yield put(getSmartRecordReaderSuccessfully(res.data));
    yield put(getSmartRecordReaderFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(getSmartRecordReaderFailed(errors));
  }
}
