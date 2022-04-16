import axios from './axios';
import { APPOINTMENT_URI, HOST } from '@constant';

export const getAppointment = (data) => {
  return axios({
    url: `${HOST}${APPOINTMENT_URI}`,
    method: 'GET',
    params: data,
  });
};

export const updateAppointment = (data) => {
  return axios({ url: `${HOST}${APPOINTMENT_URI}`, method: 'POST', data });
};