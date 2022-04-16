import {
  CREATE_APPOINTMENT_API,
  CREATE_APPOINTMENT_SUCCESSFULLY,
  CREATE_APPOINTMENT_FAILED,
  GET_APPOINTMENTS_API,
  GET_APPOINTMENTS_SUCCESSFULLY,
  GET_APPOINTMENTS_FAILED,
  BOOK_APPOINTMENT_API,
  BOOK_APPOINTMENT_SUCCESSFULLY,
  BOOK_APPOINTMENT_FAILED,
  UPDATE_APPOINTMENT_API,
  UPDATE_APPOINTMENT_SUCCESSFULLY,
  UPDATE_APPOINTMENT_FAILED,
  CANCEL_APPOINTMENT_API,
  CANCEL_APPOINTMENT_SUCCESSFULLY,
  CANCEL_APPOINTMENT_FAILED,
  GET_ALL_APPOINTMENTS_API,
  GET_ALL_APPOINTMENTS_SUCCESSFULLY,
  GET_ALL_APPOINTMENTS_FAILED,
  GET_ALL_APPOINTMENTS_CAO_THANG_API,
  GET_ALL_APPOINTMENTS_CAO_THANG_SUCCESSFULLY,
  GET_ALL_APPOINTMENTS_CAO_THANG_FAILED,
  GET_ALL_APPOINTMENTS_DATE_IN_FUTURE_API,
  GET_ALL_APPOINTMENTS_DATE_IN_FUTURE_SUCCESSFULLY,
  GET_ALL_APPOINTMENTS_DATE_IN_FUTURE_FAILED,
  RECORD_APPOINTMENT
} from '../../constant';

/**
 * CREATE APPOINTMENT
 */
export const createAppointment = (appointment) => ({
  type: CREATE_APPOINTMENT_API,
  payload: appointment,
});

export const createAppointmentSuccessfully = (appointment) => ({
  type: CREATE_APPOINTMENT_SUCCESSFULLY,
  payload: appointment,
});

export const createAppointmentFailed = (error) => ({
  type: CREATE_APPOINTMENT_FAILED,
  payload: error,
});

/**
 * GET APPOINTMENT
 */
export const getAppointments = (queryParams) => ({
  type: GET_APPOINTMENTS_API,
  payload: queryParams,
});

export const getAppointmentsSuccessfully = (appointments) => ({
  type: GET_APPOINTMENTS_SUCCESSFULLY,
  payload: appointments,
});

export const getAppointmentsFailed = (errors) => ({
  type: GET_APPOINTMENTS_FAILED,
  payload: errors,
});

/**
 * BOOK APPOINTMENT
 */
export const bookAppointment = (appointment) => ({
  type: BOOK_APPOINTMENT_API,
  payload: appointment,
});

export const bookAppointmentSuccessfully = (createdAppointment) => ({
  type: BOOK_APPOINTMENT_SUCCESSFULLY,
  payload: createdAppointment,
});

export const bookAppointmentFailed = (errors) => ({
  type: BOOK_APPOINTMENT_FAILED,
  payload: errors,
});

/**
 * UPDATE APPOINTMENT
 */
export const updateAppointment = (appointment) => ({
  type: UPDATE_APPOINTMENT_API,
  payload: appointment,
});

export const updateAppointmentSuccessfully = (appointment) => ({
  type: UPDATE_APPOINTMENT_SUCCESSFULLY,
  payload: appointment,
});

export const updateAppointmentFailed = (errors) => ({
  type: UPDATE_APPOINTMENT_FAILED,
  payload: errors,
});

/**
 * CANCEL APPOINTMENT
 */
export const cancelAppointment = (appointment) => ({
  type: CANCEL_APPOINTMENT_API,
  payload: appointment,
});

export const cancelAppointmentSuccessfully = (appointment) => ({
  type: CANCEL_APPOINTMENT_SUCCESSFULLY,
  payload: appointment,
});

export const cancelAppointmentFailed = (errors) => ({
  type: CANCEL_APPOINTMENT_FAILED,
  payload: errors,
});

/**
 * GET ALL APPOINTMENTS (IN A MONTH)
 */
export const getAllAppointments = (queryParams) => ({
  type: GET_ALL_APPOINTMENTS_API,
  payload: queryParams,
});

export const getAllAppointmentsSuccessfully = (appointments) => ({
  type: GET_ALL_APPOINTMENTS_SUCCESSFULLY,
  payload: appointments,
});

export const getAllAppointmentsFailed = (errors) => ({
  type: GET_ALL_APPOINTMENTS_FAILED,
  payload: errors,
});
/**
 * GET ALL APPOINTMENTS FOR CAO THANG (IN A MONTH)
 */
export const getAllAppointmentsCaoThang = (queryParams) => ({
  type: GET_ALL_APPOINTMENTS_CAO_THANG_API,
  payload: queryParams,
});

export const getAllAppointmentsCaoThangSuccessfully = (appointments) => ({
  type: GET_ALL_APPOINTMENTS_CAO_THANG_SUCCESSFULLY,
  payload: appointments,
});

export const getAllAppointmentsCaoThangFailed = (errors) => ({
  type: GET_ALL_APPOINTMENTS_CAO_THANG_FAILED,
  payload: errors,
});

/**
 * GET ALL APPOINTMENTS DATE IN FUTURE
 */
export const getAllAppointmentsDateInFuture = (queryParams) => ({
  type: GET_ALL_APPOINTMENTS_DATE_IN_FUTURE_API,
  payload: queryParams,
});

export const getAllAppointmentsDateInFutureSuccessfully = (appointments) => ({
  type: GET_ALL_APPOINTMENTS_DATE_IN_FUTURE_SUCCESSFULLY,
  payload: appointments,
});

export const getAllAppointmentsDateInFutureFailed = (errors) => ({
  type: GET_ALL_APPOINTMENTS_DATE_IN_FUTURE_FAILED,
  payload: errors,
});

export const recordAppoiment = (data) => ({
  type: RECORD_APPOINTMENT,
  payload: data,
});

