/* eslint-disable import/prefer-default-export */

import axios from 'axios';

import {
  FILE_UPLOAD_URI,
  FILE_AUDIO_APPOINTMENT_UPLOAD_URI,
  FIREBASE_REGISTRATION_TOKEN,
  TOKEN_KEY,
  HOST,
  FILE_URI,
  OLD_FILE_UPLOAD_URI,
  ENV,
} from '../constant';
import { getTokenFromLocalStorage } from '../utils';

/**
 * ==================
 * POST
 * upload audio
 * ==================
 */
export const uploadAppointmentAudioFileApiCall = (data) => {
  const { appointmentId, files } = data;

  const fileBody = new FormData();
  fileBody.append('appointment_id', appointmentId);
  files.forEach((file) => {
    console.log(file);
    fileBody.append('file', file);
  });

  return axios({
    method: 'post',
    url: `${FILE_AUDIO_APPOINTMENT_UPLOAD_URI}`,
    data: fileBody,
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  });
};

/**
 * ==================
 * POST /file-upload
 * upload
 * ==================
 */
export const uploadFileApiCall = (data) => {
  const { file, patientId, fileTestType } = data;
  const registrationToken = localStorage.getItem(FIREBASE_REGISTRATION_TOKEN);

  const fileBody = new FormData();
  fileBody.append('file', file);
  fileBody.append('registrationToken', registrationToken);
  fileBody.append('fileTestType', fileTestType);
  fileBody.append('patientId', patientId);
  fileBody.append('env', ENV);

  return axios({
    method: 'post',
    url: `${FILE_UPLOAD_URI}`,
    data: fileBody,
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  });
};

/**
 * ==================
 * POST /file-upload
 * upload
 * ==================
 */
export const uploadPublicFileApiCall = (data) => {
  const { file, patientId, fileTestType } = data;
  const registrationToken = localStorage.getItem(FIREBASE_REGISTRATION_TOKEN);

  const fileBody = new FormData();
  fileBody.append('file', file);
  fileBody.append('registrationToken', registrationToken);
  fileBody.append('fileTestType', fileTestType);
  fileBody.append('patientId', patientId);
  fileBody.append('isPublic', '1');
  fileBody.append('env', ENV);

  return axios({
    method: 'post',
    url: `${FILE_UPLOAD_URI}`,
    data: fileBody,
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  });
};

export const oldUploadFileApiCall = (data) => {
  const { file, patientId, fileName, requestId = '' } = data;
  const url = `${HOST}${OLD_FILE_UPLOAD_URI}?version=2`;
  const registrationToken = localStorage.getItem(FIREBASE_REGISTRATION_TOKEN);
  const token = getTokenFromLocalStorage(TOKEN_KEY);

  const fileBody = new FormData();
  fileBody.append('file', file);
  fileBody.append('patientId', patientId);
  fileBody.append('requestId', requestId);
  fileBody.append('fileName', fileName);
  fileBody.append('registrationToken', registrationToken);
  fileBody.append('fileTestType', file.type);

  return axios({
    method: 'post',
    url,
    data: fileBody,
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPublicUrlApiCall = (data) => {
  const { itemUrl, redirect, requestId } = data;
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'get',
    url: `${HOST}${FILE_URI}?cloudUrl=${itemUrl}&redirect=${redirect}&requestId=${requestId}`,
    headers: { Authorization: `Bearer ${token}` },
  });
};
