/* eslint-disable import/prefer-default-export */

import { HOST, TOKEN_KEY, NOTIFICATION_URI } from '../constant';

import axios from 'axios';
import { getTokenFromLocalStorage } from '../utils';

export function subscribeTopic(fcmToken) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);
  return axios({
    method: 'post',
    url: `${HOST}${NOTIFICATION_URI}/subscribe`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      fcmToken,
    },
  });
}

export function getNotifications(page) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);

  return axios({
    method: 'get',
    url: `${HOST}${NOTIFICATION_URI}?page=${page}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function markAsRead(msgId) {
  const token = getTokenFromLocalStorage(TOKEN_KEY);

  return axios({
    method: 'put',
    url: `${HOST}${NOTIFICATION_URI}/${msgId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
