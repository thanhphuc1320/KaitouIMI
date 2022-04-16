import {
    GET_TEXT_RECORDING_SUCCESSFULLY,
  } from '../../constant';
  
  export default function ( textRecord = { data: {} }, action) {
    const { type, payload } = action;
    switch (type) {
      case GET_TEXT_RECORDING_SUCCESSFULLY: {
        return {
          ...textRecord,
          ...{data: payload}
        };
      }
      default:
        return textRecord;
    }
  }