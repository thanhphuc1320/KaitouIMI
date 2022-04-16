import {
    GET_TEST_RESULT_SUCCESSFULLY,
  } from '../../constant';
  
  export default function ( testResult = { data: {} }, action) {
    const { type, payload } = action;
    switch (type) {
      case GET_TEST_RESULT_SUCCESSFULLY: {
        return {
          ...testResult,
          ...{data: payload}
        };
      }
      default:
        return testResult;
    }
  }