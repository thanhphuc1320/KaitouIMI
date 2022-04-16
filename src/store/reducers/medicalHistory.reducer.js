import {
    GET_MEDICAL_HISTORY_SUCCESSFULLY,
    UPDATE_MEDICAL_HISTORY_SUCCESSFULLY
  } from '../../constant';
  
  export default function (medicalHistory = [] , action) {
    const { type } = action;
    const medicalHistoryList = action.payload
    switch (type) {
      case GET_MEDICAL_HISTORY_SUCCESSFULLY:
        return {
          ...medicalHistoryList,
        };
      case UPDATE_MEDICAL_HISTORY_SUCCESSFULLY:
        return {
          ...medicalHistory,
        };
      default:
        return medicalHistory;
    }
  }
