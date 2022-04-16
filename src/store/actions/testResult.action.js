/* eslint-disable import/prefer-default-export */

import {
    GET_TEST_RESULT,
    GET_TEST_RESULT_FAILED,
    GET_TEST_RESULT_SUCCESSFULLY,
  } from '../../constant';
  
  export const getTestResult = data => ({
    type: GET_TEST_RESULT,
    payload: data,
  });
  
  export const getTestResultSuccessfully = data => ({
    type: GET_TEST_RESULT_SUCCESSFULLY,
    payload: data,
  });
  
  export const getTestResultFailed = () => ({
    type: GET_TEST_RESULT_FAILED,
  });
  