import { call, put } from 'redux-saga/effects';
import {
  attemptLoginApiCall,
  getUserIdentityApiCall,
  attemptRegisterApiCall,
} from '../apiCalls/auth.api';

import { TOKEN_KEY, FIREBASE_REGISTRATION_TOKEN } from '../constant';

import {
  // Login
  attemptLoginSuccessfully,
  attemptLoginFailed,
  // Register
  attemptRegisterSuccessfully,
  attemptRegisterFailed,
  // Identity
  getUserIdentityFailed,
  getUserIdentitySuccessfully,
} from '../store/actions/auth.action';
import { createDefaultError } from '../utils';

/**
 * ==================
 * LOGIN HANDLER
 * ==================
 */
export function* attemptLoginSaga(action) {
  const user = action.payload;
  if (
    user.email ||
    user.password ||
    user.email !== '' ||
    user.password !== ''
  ) {
    try {
      const res = yield call(attemptLoginApiCall, user);
      if (!res.data.code) {
        const { token } = res.data;
        localStorage.setItem(TOKEN_KEY, token);
        // window.location.pathname = '/'
        yield put(attemptLoginSuccessfully(res.data));
      } else {
        yield put(attemptLoginFailed(res.data));
      }
    } catch (e) {
      const errors = createDefaultError(e);
      yield put(attemptLoginFailed(errors));
    }
  } else {
    // TODO: pop up sth
    yield put(attemptLoginFailed());
  }
}

/**
 * ==================
 * REGISTER HANDLER
 * ==================
 */
export function* attemptRegisterSaga(action) {
  const user = action.payload;

  if (
    user.email ||
    user.password ||
    user.email !== '' ||
    user.password !== '' ||
    user.role ||
    user.role !== ''
  ) {
    try {
      const res = yield call(attemptRegisterApiCall, user);

      if (!res.data.code) {
        yield put(attemptRegisterSuccessfully(res.data));
      } else {
        // FIX_ME: add more link
        yield put(attemptRegisterFailed(res.data));
      }
    } catch (e) {
      const errors = createDefaultError(e);
      yield put(attemptRegisterFailed(errors));
    }
  } else {
    // TODO: pop up sth
    yield put(attemptRegisterFailed());
  }
}

/**
 * ==================
 * GET USER IDENTITY
 * ==================
 */
export function* getUserIdentitySaga(token) {
  // if (token && token !== null) {
  const res = yield call(getUserIdentityApiCall, token.payload);
  if (!res.data.code) {
    const user = res.data;
    if (user.token && user.token !== '') {
      yield put(getUserIdentitySuccessfully(res.data));
    } else {
      yield put(getUserIdentityFailed(res.data));
      localStorage.removeItem(FIREBASE_REGISTRATION_TOKEN);
      localStorage.removeItem(TOKEN_KEY);
    }
  } else {
    localStorage.removeItem(FIREBASE_REGISTRATION_TOKEN);
    localStorage.removeItem(TOKEN_KEY);
    console.log(res.data);
    yield put(getUserIdentityFailed(res.data));

    // return res.redirect('/')
    // TODO: pop up sths
  }
}
