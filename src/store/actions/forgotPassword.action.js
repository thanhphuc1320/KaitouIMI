/* eslint-disable import/prefer-default-export */
import {
  FORGOT_PASSWORD_API,
  FORGOT_PASSWORD_FAILED,
  FORGOT_PASSWORD_SUCCESSFULLY,
  RESET_PASSWORD_API,
  RESET_PASSWORD_FAILED,
  RESET_PASSWORD_SUCCESSFULLY,
} from '../../constant';

/**
 * ==================
 * FORGOT PASSWORD
 * ==================
 */
export const forgotPassword = user => ({
  type: FORGOT_PASSWORD_API,
  payload: user,
});

export const forgotPasswordFailed = error => ({
  type: FORGOT_PASSWORD_FAILED,
  payload: error,
});

export const forgotPasswordSuccessfully = user => ({
  type: FORGOT_PASSWORD_SUCCESSFULLY,
  payload: user,
});

/**
 * ==================
 * RESET PASSWORD
 * ==================
 */
export const resetPassword = user => ({
  type: RESET_PASSWORD_API,
  payload: user,
});

export const resetPasswordFailed = error => ({
  type: RESET_PASSWORD_FAILED,
  payload: error,
});

export const resetPasswordSuccessfully = user => ({
  type: RESET_PASSWORD_SUCCESSFULLY,
  payload: user,
});
