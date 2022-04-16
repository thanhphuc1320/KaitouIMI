/* eslint-disable import/prefer-default-export */

import axios from 'axios';
import { HOST, LOGIN_URI, USERS_URI, IDENTITY_URI } from '../constant';

/**
 * ==================
 * POST /login
 * LOGIN
 * ==================
 */
export function attemptLoginApiCall(user) {
  return axios({
    method: 'post',
    url: `${HOST}${LOGIN_URI}`,
    data: user,
  });
}

/**
 * ==================
 * POST /register
 * REGISTER
 * ==================
 */
export function attemptRegisterApiCall(user) {
  return axios({
    method: 'post',
    url: `${HOST}${USERS_URI}`,
    data: user,
  });
}

/**
 * ==================
 * POST /identity
 * GET USER IDENTITY
 * ==================
 */
export function getUserIdentityApiCall(token) {
  return axios({
    method: 'post',
    url: `${HOST}${IDENTITY_URI}`,
    data: {
      token,
    },
  });
}
