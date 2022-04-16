/* eslint-disable import/prefer-default-export */
import {
  ATTEMPT_LOGIN_API,
  ATTEMPT_LOGIN_FAILED,
  ATTEMPT_LOGIN_SUCCESSFULLY,
  ATTEMPT_LOGOUT,
  ATTEMPT_REGISTER_API,
  ATTEMPT_REGISTER_FAILED,
  ATTEMPT_REGISTER_SUCCESSFULLY,
  GET_USER_IDENTITY_API,
  GET_USER_IDENTITY_FAILED,
  GET_USER_IDENTITY_SUCCESSFULLY,
} from '../../constant';

/**
 * ==================
 * LOGOUT
 * ==================
 */
export const attemptLogin = user => ({
  type: ATTEMPT_LOGIN_API,
  payload: user,
});

export const attemptLoginFailed = error => ({
  type: ATTEMPT_LOGIN_FAILED,
  payload: error,
});

export const attemptLoginSuccessfully = user => ({
  type: ATTEMPT_LOGIN_SUCCESSFULLY,
  payload: user,
});

/**
 * ==================
 * REGISTER
 * ==================
 */
export const attemptRegister = user => ({
  type: ATTEMPT_REGISTER_API,
  payload: user,
});

export const attemptRegisterFailed = error => ({
  type: ATTEMPT_REGISTER_FAILED,
  payload: error,
});

export const attemptRegisterSuccessfully = user => ({
  type: ATTEMPT_REGISTER_SUCCESSFULLY,
  payload: user,
});

/**
 * ==================
 * GET TOKEN
 * ==================
 */

export const getUserIdentity = token => ({
  type: GET_USER_IDENTITY_API,
  payload: token,
});

export const getUserIdentityFailed = () => ({
  type: GET_USER_IDENTITY_FAILED,
});

export const getUserIdentitySuccessfully = user => ({
  type: GET_USER_IDENTITY_SUCCESSFULLY,
  payload: user,
});

/**
 * ==================
 * LOGOUT
 * ==================
 */
export const attemptLogout = () => ({
  type: ATTEMPT_LOGOUT,
});
