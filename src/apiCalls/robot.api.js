import { HOST, TOKEN_KEY, USERS_URI, API_URL } from '../constant';

import axios from 'axios';
import { getTokenFromLocalStorage } from '../utils';

/**
 * ==================
 * GET /robots/bots
 * Get robot list for a Doctor
 * ==================
 */
export function getRobotList() {
    const token = getTokenFromLocalStorage(TOKEN_KEY);
    return axios({
      method: 'get',
      url: `${HOST}/robots/bots`,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

export function getAdminRobots() {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'get',
    url: `${HOST}/robots/managerBots`,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getAdminRobot(request) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'get',
    url: `${HOST}/robots/${request.id}`,
    headers: { Authorization: `Bearer ${token}` },
  });
} 

export function updateAdminRobot(request) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'put',
    url: `${HOST}/robots`,
    data: request,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function syncAdminRobots() {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'get',
    url: `${HOST}/robots/syncOhmni`,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function setHomePage(request) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'put',
    url: `${HOST}/robots/setHomePage`,
    data: request.params,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getRemoteLink(request) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'get',
    url: `${HOST}/robots/bots/remoteLink/${request.botId}`,
    data: request.params,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function deleteRemoteLink(request) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'DELETE',
    url: `${HOST}/robots/bots/remoteLink/${request.botId}/${request.tokenVideo}`,
    headers: { Authorization: `Bearer ${token}` },
  });
}