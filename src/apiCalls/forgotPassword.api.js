/* eslint-disable import/prefer-default-export */

import axios from 'axios';
import { HOST, FORGOT_PASSWORD_URI } from '../constant';

/**
 * ==================
 * POST /forgot-password
 * FORGOT PASSWORD
 * Verify Email and send email
 * ==================
 */
export function forgotPasswordApiCall(user) {
  return axios({
    method: 'post',
    url: `${HOST}${FORGOT_PASSWORD_URI}`,
    data: user,
  });
}

/**
 * ==================
 * POST /forgot-password/reset
 * RESET PASSWORD
 * ==================
 */
export function resetPasswordApiCall(user) {
  return axios({
    method: 'post',
    url: `${HOST}${FORGOT_PASSWORD_URI}/reset`,
    data: user,
  });
}
