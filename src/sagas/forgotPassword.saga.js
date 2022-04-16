/* eslint-disable import/prefer-default-export */
import { call, put } from 'redux-saga/effects';

import {
  forgotPasswordApiCall,
  resetPasswordApiCall,
} from '../apiCalls/forgotPassword.api';

import {
  forgotPasswordSuccessfully,
  forgotPasswordFailed,
  resetPasswordFailed,
  resetPasswordSuccessfully,
} from '../store/actions/forgotPassword.action';
import { createDefaultError } from '../utils';

/**
 * ==================
 * FORGOT PASSWORD
 * ==================
 */
export function* forgotPasswordSaga(action) {
  const user = action.payload;
  if (user.email || user.email !== '') {
    try {
      const res = yield call(forgotPasswordApiCall, user);
      if (!res.data.code) yield put(forgotPasswordSuccessfully(res.data));
      else yield put(forgotPasswordFailed(res.data));
    } catch (e) {
      const errors = createDefaultError(e);
      yield put(forgotPasswordFailed(errors));
    }
  } else {
    // FIXME: Handle error
    yield put(forgotPasswordFailed());
  }
}

/**
 * ==================
 * RESET PASSWORD
 * ==================
 */
export function* resetPasswordSaga(action) {
  const user = action.payload;
  if (user.password || user.password !== '') {
    try {
      const res = yield call(resetPasswordApiCall, user);
      if (!res.data.code) {
        // window.location.pathname = '/login'
        // window.location.search = ''
        yield put(resetPasswordSuccessfully(res.data));
      } else {
        yield put(resetPasswordFailed(res.data.errors));
      }
    } catch (e) {
      const errors = createDefaultError(e);
      yield put(resetPasswordFailed(errors));
    }
  } else {
    // FIXME: Handle Error
    yield put(resetPasswordFailed());
  }
}
