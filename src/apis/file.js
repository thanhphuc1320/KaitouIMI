import axios from './axios';
import {
  ENV,
  HOST,
  OLD_FILE_UPLOAD_URI,
  FILE_URI,
  FIREBASE_REGISTRATION_TOKEN,
  FILE_AUDIO_APPOINTMENT_UPLOAD_URI,
  APPOINTMENT_URI,
} from '@constant';

export const uploadFile = (data) => {
  const { file, patientId } = data;
  const fcmToken = localStorage.getItem(FIREBASE_REGISTRATION_TOKEN);

  const fileBody = new FormData();
  fileBody.append('file', file);
  fileBody.append('registrationToken', fcmToken);
  fileBody.append('fileTestType', file.type);
  fileBody.append('fileName', file.name);
  fileBody.append('patientId', patientId);
  fileBody.append('env', ENV);

  return axios({
    method: 'post',
    url: `${HOST}${OLD_FILE_UPLOAD_URI}?version=2`,
    data: fileBody,
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isPublic: false,
  });
};

export const getSignedFileUrl = (url) =>
  axios({ method: 'GET', url: `${HOST}${FILE_URI}?cloudUrl=${url}` });

export const updateAppointment = (data) => {
  return axios({ url: `${HOST}${APPOINTMENT_URI}`, method: 'POST', data });
};

export const uploadAudioFile = (data) => {
  const { appointmentId, files, text_language_code, requestId } = data;

  const fileBody = new FormData();
  if (appointmentId) {
    fileBody.append('appointment_id', appointmentId);
  }
  if (requestId) {
    fileBody.append('request_id', requestId);
  }
  if (text_language_code === 'English') {
    fileBody.append('text_language_code', 'en_US');
  }
  if (text_language_code === 'Vietnamese') {
    fileBody.append('text_language_code', 'vi_VN');
  }
  files.forEach((file) => {
    fileBody.append('file', file);
  });

  return axios({
    method: 'post',
    url: `${FILE_AUDIO_APPOINTMENT_UPLOAD_URI}`,
    data: fileBody,
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isPublic: true,
  });
};
