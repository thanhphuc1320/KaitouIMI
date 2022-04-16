/* eslint-disable import/prefer-default-export */

import {
  UPDATE_USER_API,
  UPDATE_USER_API_NEW,
  UPDATE_USER_SUCCESSFULLY,
  UPDATE_USER_FAILED,
  CREATE_USER_API,
  CREATE_USER_SUCCESSFULLY,
  SEND_FORGOT_PASSWORD_API,
  SEND_FORGOT_PASSWORD_SUCCESSFULLY,
  SEND_FORGOT_PASSWORD_FAILED,
  GET_DOCTOR_LIST_API,
  GET_DOCTOR_LIST_SUCCESSFULLY,
  GET_DOCTOR_LIST_FAILED,
  GET_PATIENT_LIST_API,
  GET_PATIENT_LIST_SUCCESSFULLY,
  GET_PATIENT_LIST_FAILED,
  CREATE_USER_FAILED,
  GET_USERS_ID_API,
  GET_USERS_ID_SUCCESSFULLY,
  GET_USERS_ID_FAILED,
  DELETE_USER_API,
  DELETE_USER_SUCCESSFULLY,
  DELETE_USER_FAILED

} from '../../constant';

/**
 * ==================
 * UPDATE USER PROFILE
 * ==================
 */
export const updateUser = user => ({
  type: UPDATE_USER_API,
  payload: user,
});

export const updateUserNew = user => ({
  type: UPDATE_USER_API_NEW,
  payload: user,
});

export const updateUserFailed = (payload) => ({
  type: UPDATE_USER_FAILED,
  payload: payload
});

export const updateUserSuccessfully = user => ({
  type: UPDATE_USER_SUCCESSFULLY,
  payload: user,
});

export const createUserApi = user => ({
  type: CREATE_USER_API,
  payload: user,
});

export const createdUserSuccessfully = payload => ({
  type: CREATE_USER_SUCCESSFULLY,
  payload,
});

export const createDefaultFailed = payload => ({
  type: CREATE_USER_FAILED,
  payload,
})

export const sendForgotPassword = payload => ({
  type: SEND_FORGOT_PASSWORD_API,
  payload,
});

export const sendForgotPasswordSuccessfully = payload => ({
  type: SEND_FORGOT_PASSWORD_SUCCESSFULLY,
  payload,
});

export const sendForgotPasswordFailed = payload => ({
  type: SEND_FORGOT_PASSWORD_FAILED,
  payload,
});

export const getDoctorList = user => ({
  type: GET_DOCTOR_LIST_API,
  payload: user
})

export const getDoctorListSuccessfully = doctorlist => ({
  type: GET_DOCTOR_LIST_SUCCESSFULLY,
  payload: doctorlist
})

export const getDoctorListFailed = user => ({
  type: GET_DOCTOR_LIST_FAILED,
  payload: user
})

export const getPatientList = (queryParams) => ({
  type: GET_PATIENT_LIST_API,
  payload: queryParams
})

export const getPatientListSuccessfully = patientlist => ({
  type: GET_PATIENT_LIST_SUCCESSFULLY,
  payload: patientlist
})

export const getPatientListFailed = user => ({
  type: GET_PATIENT_LIST_FAILED,
  payload: user
})
export const getUserId = (queryParams) => ({
  type: GET_USERS_ID_API,
  payload: queryParams
})

export const getUserIdSuccessfully = userprofile => ({
  type: GET_USERS_ID_SUCCESSFULLY,
  payload: userprofile
})

export const getUserIdFailed = user => ({
  type: GET_USERS_ID_FAILED,
  payload: user
})
export const deleteUser = (queryParams) => ({
  type: DELETE_USER_API,
  payload: queryParams
})

export const deleteUserSuccessfully = userprofile => ({
  type: DELETE_USER_SUCCESSFULLY,
  payload: userprofile
})

export const deleteUserFailed = user => ({
  type: DELETE_USER_FAILED,
  payload: user
})