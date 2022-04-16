import { call, put } from 'redux-saga/effects';

import { PAGE_LIMIT, TOKEN_KEY } from '../../../constant';
import { getTokenFromLocalStorage, createDefaultError } from '../../../utils';

import { getRequestsApiCall, updateRequestApiCall } from '../../../apiCalls/request.api';
import { changePage, getRequestsSuccessfully, updateRequestInDoctorSuccessfully, updateRequestInDoctorFailed } from './action';

export function* getRequestsSaga({ payload }) {
  const { firstData } = payload
  const payloadTemp = payload.currentMode ? payload.currentMode : payload
  const request = {
    ...payloadTemp,
    token: getTokenFromLocalStorage(TOKEN_KEY),
    version: '2.1',
    limit: PAGE_LIMIT,
    // limit: 2,
  };
  const res = yield call(getRequestsApiCall, request);
  if (!res.data.code) {
    yield put(getRequestsSuccessfully(res.data || [], payload, firstData));
    if (payload.page && res.data.length) {
      yield put(changePage(payload.page));
    }
  }
}

export function* updateRequestInDoctor(action) {
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
        yield put(updateRequestInDoctorSuccessfully(res.data));
      }
      else yield put(updateRequestInDoctorFailed(res.data.errors));
    } catch (e) {
      const errors = createDefaultError(e);
      yield put(updateRequestInDoctorFailed(errors));
    }
  } else {
    // FIXME: Handle error
  }
}
