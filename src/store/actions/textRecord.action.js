/* eslint-disable import/prefer-default-export */

import {
    GET_TEXT_RECORDING,
    GET_TEXT_RECORDING_SUCCESSFULLY,
    GET_TEXT_RECORDING_FAILED,
  } from '../../constant';
  
  export const getTextRecord = data => ({
    type: GET_TEXT_RECORDING,
    payload: data,
  });
  
  export const getTextRecordSuccessfully = data => ({
    type: GET_TEXT_RECORDING_SUCCESSFULLY,
    payload: data,
  });
  
  export const getTextRecordFailed = () => ({
    type: GET_TEXT_RECORDING_FAILED,
  });