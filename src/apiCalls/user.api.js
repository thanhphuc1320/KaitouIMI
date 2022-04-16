/* eslint-disable import/prefer-default-export */

import { HOST, TOKEN_KEY, USERS_URI, API_URL } from '../constant';

import axios from 'axios';
import { getTokenFromLocalStorage } from '../utils';

/**
 * ==================
 * POST /users
 * Update User Profile
 * ==================
 */
export function updateUserApiCall(user) {
  const { userId, data } = user;
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'put',
    url: `${HOST}${USERS_URI}`,
    // FIX_ME : replace mock data
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}
export function updateUserApiCallNew(user) {
  const { data } = user;
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'put',
    url: `${HOST}${USERS_URI}`,
    // FIX_ME : replace mock data
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}

/**
 * ==================
 * DELETE /users
 * Delete User Profile
 * ==================
 */
export function deleteUserApiCall(user) {
  const { userId, email } = user;
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'delete',
    url: `${HOST}${USERS_URI}`,
    // FIX_ME : replace mock data
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { userId, email }
  });
}

/**
 * ==================
 * GET /users/doctors
 * Get doctor list for a Patient
 * ==================
 */
export function getDoctorList({page, pageSize, search}) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'get',
    url: `${HOST}${USERS_URI}/doctors`,
    params:{search,pageSize,page},
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * ==================
 * GET /users/patients
 * Get patient list for a Doctor
 * ==================
 */
export function getPatientList({page, pageSize, search}) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'get',
    url: `${HOST}${USERS_URI}/patients`,
    params:{search,pageSize,page},
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getUserId(id) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'get',
    url: `${HOST}${USERS_URI}/profile/${id}`,
    headers: { Authorization: `Bearer ${token}` },
  });
}


/**
 * ==================
 * POST /users/create
 * REGISTER
 * ==================
 */
export function createUserApiCall(user) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'post',
    url: `${HOST}${USERS_URI}/create`,
    headers: { Authorization: `Bearer ${token}` },
    data: user,
  });
}

export function getMedicalHistoryList() {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'get',
    url: `${HOST}/medical-history`,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateMedicalHistoryList(data) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'post',
    url: `${HOST}/medical-history`,
    headers: { Authorization: `Bearer ${token}` },
    data
  });
}

export function sendForgotPasswordCallAPI(data) {
  return axios({
    method: 'post',
    url: `${HOST}/forgot-password`,
    data
  });
}

 