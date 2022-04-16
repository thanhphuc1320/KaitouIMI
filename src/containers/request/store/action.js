import {
  GET_REQUESTS_SUCCESSFULLY,
  GET_REQUESTS_API,
  CHANGE_MODE,
  CHANGE_PAGE,
  CHANGE_TAB,
  SELECT_REQUEST,
  UPDATE_REQUEST_IN_DOCTOR_SUCCESSFULLY,
  UPDATE_REQUEST_IN_DOCTOR_FAILED,
} from './action-types';
import {
  UPDATE_REQUEST_API_IN_DOCTOR
} from '../../../constant'
export const getRequests = (payload) => {
  return ({
    type: GET_REQUESTS_API,
    payload,
  })
};

export const getRequestsSuccessfully = (payload, request, firstData) => ({
  type: GET_REQUESTS_SUCCESSFULLY,
  payload,
  request,
  firstData
});

export const updateRequestInDoctor = (request) => {
  return ({
    type: UPDATE_REQUEST_API_IN_DOCTOR,
    payload: request,
  })
};

export const updateRequestInDoctorFailed = () => ({
  type: UPDATE_REQUEST_IN_DOCTOR_FAILED,
});

export const updateRequestInDoctorSuccessfully = (request) => ({
  type: UPDATE_REQUEST_IN_DOCTOR_SUCCESSFULLY,
  payload: request,
});


export const changeMode = (payload) => ({ type: CHANGE_MODE, payload });
export const changePage = (payload) => ({ type: CHANGE_PAGE, payload });
export const changeTab = (payload) => ({ type: CHANGE_TAB, payload });
export const selectRequest = (payload) => ({ type: SELECT_REQUEST, payload });
