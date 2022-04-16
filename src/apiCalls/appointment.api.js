import { APPOINTMENT_URI, HOST, TOKEN_KEY } from '../constant';

import axios from 'axios';
import { getTokenFromLocalStorage } from '../utils';

/**
 * POST /appointment
 *
 * ================================================== *
 * [D1] Doctor is able to create available time slot  *
 * Mode: 1                                            *
 * dateAndTime: "07/11/2020 14:00 GMT-7"              *
 * endDateAndTime: "07/11/2020 15:30 GMT-7"           *
 * status = 0 (free)                                  *
 * ================================================== *

 * ================================================== *
 * [D4] Doctor is able to add note to an appointment  *
 * Mode: 2                                            *
 * doctorNote: "Eat more vegie"                       *
 * ================================================== *

 * ================================================== *
 * [P4] Patient is able to book an appointment        *
 * Mode: 2                                            *
 * appointmentId: 1sd197vn273cs9d2n7f2613ba           *
 * newAppointmentId: xyz789 (Optional)                *
 * status = 1 (booked/busy)                           *
 * image: [imageSchema],                              *
 * video: [videoSchema],                              *
 * patientNote: String,                               *
 * ================================================== *
 */
export function createOrUpdateAppointment(data) {
  return axios({
    method: 'post',
    url: `${HOST}${APPOINTMENT_URI}`,
    data,
    headers: { Authorization: `Bearer ${getTokenFromLocalStorage(TOKEN_KEY)}` },
  });
}

/**
 * [P6] Patient is able to cancel an appointment
 * @param {appointmentId} data
 */
export function cancelAppointment(data) {
  return axios({
    method: 'delete',
    url: `${HOST}${APPOINTMENT_URI}?appointmentId=${data.appointmentId}`,
    headers: { Authorization: `Bearer ${getTokenFromLocalStorage(TOKEN_KEY)}` },
  });
}

/**
 * GET/
 *
 * ======================================================== *
 * [D2] Doctor is able to see all available time +          *
 * (free/booked) appointments  in a specific date           *
 * dateAndTime: "07/11/2020"                                *
 * ======================================================== *
 *
 * ======================================================== *
 * [P1] Patient is able to see past/upcoming appointments   *
 * timeline = 0 or 1 (past or upcoming)                     *
 * ======================================================== *
 *
 * ======================================================== *
 * [P2] Patient is able to see all appointments (free/busy) *
 * of a chosen doctor & on chosen date                      *
 * doctor = {doctorId}                                      *
 * dateAndTime: "07/11/2020"                                *
 * ======================================================== *
 *
 * ======================================================== *
 * [DP3] Get more detail about an appointment               *
 * _id: {appointmentId}                                     *
 * ======================================================== *
 *
 * @param {_id, status, timeline, dateAndTime, patient, doctor } data
 */
export function getAppointment(data) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  const {
    _id = '',
    status = '',
    timeline = '',
    dateAndTime = '',
    endDateAndTime = '',
    patient = '',
    doctor = '',
    offSet = 0,
  } = data;
  const url = `${HOST}${APPOINTMENT_URI}?_id=${_id}&patient=${patient}&doctor=${doctor}&status=${status}&timeline=${timeline}&dateAndTime=${dateAndTime}&endDateAndTime=${endDateAndTime}&offSet=${offSet}`;

  return axios({
    method: 'GET',
    url,
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * GET/ all
 * Get all appointments (within a month of a year and from a doctor)
 *
 * @param {_id, status, timeline, dateAndTime, patient, doctor } data
 */
export function getAllAppointments({ month, year, doctorId }) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'get',
    url: `${HOST}${APPOINTMENT_URI}/all?month=${month}&year=${year}&doctorId=${doctorId}`,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getAllAppointmentsCaoThang(data) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  const {
    _id = '',
    status = '',
    timeline = '',
    dateAndTime = '',
    endDateAndTime = '',
    patient = '',
    doctor = '',
    offSet = 0,
  } = data;
  const url = `${HOST}${APPOINTMENT_URI}?_id=${_id}&patient=${patient}&doctor=${doctor}&status=${status}&timeline=${timeline}&dateAndTime=${dateAndTime}&endDateAndTime=${endDateAndTime}&offSet=${offSet}`;
  return axios({
    method: 'get',
    url: url,
    headers: {Authorization: `Bearer ${token}`}
  })
}

/**
 * GET/ all-time
 * Get appointments of all time from all doctors
 */
export function getAllTimeAppointments() {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'get',
    url: `${HOST}${APPOINTMENT_URI}/all-time`,
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * GET/ date-in-future
 * Get all appointments date in future to show sign in calendar
 *
 * @param { doctor } data
 */
export function getAllAppointmentsDateInFuture({ doctorId }) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'get',
    url: `${HOST}${APPOINTMENT_URI}/date-in-future?doctorId=${doctorId}`,
    headers: { Authorization: `Bearer ${token}` },
  });
}
