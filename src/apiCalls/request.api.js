import axios from 'axios';
import { HOST, REQUESTS_URI, TOKEN_KEY } from '../constant';
import { getTokenFromLocalStorage } from '../utils';

/**
 * ==================
 * GET /requests
 * [DOCTOR] Get all Requests
 * ==================
 */
export function getRequestsApiCall(data) {
  const { token, version = '2', status, page = 0, limit } = data;
  return axios({
    method: 'get',
    url: `${HOST}${REQUESTS_URI}?version=${version}&status=${status}&page=${page}&limit=${limit}`,
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * ==================
 * POST /requests
 * [PATIENT] Create Request
 * ==================
 */
export function createRequestApiCall(request) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'post',
    url: `${HOST}${REQUESTS_URI}`,
    data: request,
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * ==================
 * POST /requests/{requestId}
 * Get Request Detail
 * ==================
 */
export function getRequestDetailApiCall(requestId) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'get',
    url: `${HOST}${REQUESTS_URI}/${requestId}`,
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * ==================
 * POST /requests/{requestid}
 * [Doctor] Update Request
 * ==================
 */
export function updateRequestApiCall(request) {
  const { requestId, data } = request;
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'post',
    url: `${HOST}${REQUESTS_URI}/${requestId}`,
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
}

/**
 * ==================
 * PUT /requests
 * [Doctor] Update Label from Filtered Request
 * ==================
 */
 export function updateRequestApiCallForFiltered(request) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'put',
    url: `${HOST}${REQUESTS_URI}`,
    headers: { Authorization: `Bearer ${token}` },
    data: request,
  });
}


/**
 * ==================
 * DELETE /requests
 * [PATIENT] Delete Request
 * ==================
 */
export function deleteRequestApiCall(requestId) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'delete',
    url: `${HOST}${REQUESTS_URI}/${requestId}`,
    headers: { Authorization: `Bearer ${token}` },
  });
} 

export function getSmartRecordReaderApiCall(data) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'GET',
    url: `${HOST}${REQUESTS_URI}?type=${data.type}&version=${data.version}`,
    headers: { Authorization: `Bearer ${token}` },
  });
}
