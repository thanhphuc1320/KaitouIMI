/* eslint-disable import/prefer-default-export */
import {
  CREATE_REQUEST_API,
  CREATE_REQUEST_SUCCESSFULLY,
  CREATE_REQUEST_FAILED,
  GET_REQUESTS_API,
  GET_REQUESTS_SUCCESSFULLY,
  GET_REQUESTS_FAILED,
  UPDATE_REQUEST_API,
  UPDATE_REQUEST_SUCCESSFULLY,
  UPDATE_REQUEST_FAILED,
  UPDATE_REQUEST_FILTERED_API,
  UPDATE_REQUEST_FILTERED_SUCCESSFULLY,
  UPDATE_REQUEST_FILTERED_FAILED,
  DELETE_REQUEST_API,
  DELETE_REQUEST_SUCCESSFULLY,
  DELETE_REQUEST_FAILED,
  GET_SMART_READER_DOCTOR_API,
  GET_SMART_READER_DOCTOR_SUCCESSFULLY,
  GET_SMART_READER_DOCTOR_FAILED
} from '../../constant';

/**
 * ==================
 * CREATE REQUEST
 * ==================
 */
export const createRequest = (request) => ({
  type: CREATE_REQUEST_API,
  payload: request,
});

export const createRequestSuccessfully = (request) => ({
  type: CREATE_REQUEST_SUCCESSFULLY,
  payload: request,
});

export const createRequestFailed = (error) => ({
  type: CREATE_REQUEST_FAILED,
  payload: error,
});

/**
 * ==================
 * GET REQUEST
 * ==================
 */
export const getRequests = (options) => ({
  type: GET_REQUESTS_API,
  payload: options,
});

export const getRequestsFailed = () => ({
  type: GET_REQUESTS_FAILED,
});

export const getRequestsSuccessfully = (requests, page) => ({
  type: GET_REQUESTS_SUCCESSFULLY,
  payload: {
    requests,
    page
  },
});

/**
 * ==================
 * UPDATE
 * ==================
 */
export const updateRequest = (request) => ({
  type: UPDATE_REQUEST_API,
  payload: request,
});

export const updateRequestFailed = () => ({
  type: UPDATE_REQUEST_FAILED,
});

export const updateRequestSuccessfully = (request) => ({
  type: UPDATE_REQUEST_SUCCESSFULLY,
  payload: request,
});

/**
 * ==================
 * UPDATE FILTERED
 * ==================
 */
 export const updateRequestFiltered = (request) => ({
  type: UPDATE_REQUEST_FILTERED_API,
  payload: request,
});

export const updateRequestFilteredFailed = () => ({
  type: UPDATE_REQUEST_FILTERED_FAILED,
});

export const updateRequestFilteredSuccessfully = (request) => ({
  type: UPDATE_REQUEST_FILTERED_SUCCESSFULLY,
  payload: request,
});

/**
 * ==================
 * DELETE
 * ==================
 */
export const deleteRequest = (requestId) => ({
  type: DELETE_REQUEST_API,
  payload: requestId,
});

export const deleteRequestFailed = () => ({
  type: DELETE_REQUEST_FAILED,
});

export const deleteRequestSuccessfully = (requestId) => ({
  type: DELETE_REQUEST_SUCCESSFULLY,
  payload: requestId,
});

export const getSmartRecordReader = (payload) => {
  return ({
    type: GET_SMART_READER_DOCTOR_API,
    payload: payload,
  })
};

export const getSmartRecordReaderSuccessfully = (data) => ({
  type: GET_SMART_READER_DOCTOR_SUCCESSFULLY,
  payload: data
});

export const getSmartRecordReaderFailed = (requestId) => ({
  type: GET_SMART_READER_DOCTOR_FAILED
});
