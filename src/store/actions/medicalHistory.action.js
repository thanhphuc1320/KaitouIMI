import {
    GET_MEDICAL_HISTORY,
    GET_MEDICAL_HISTORY_SUCCESSFULLY,
    GET_MEDICAL_HISTORY_FAILED,
    UPDATE_MEDICAL_HISTORY,
    UPDATE_MEDICAL_HISTORY_SUCCESSFULLY,
    UPDATE_MEDICAL_HISTORY_FAILED
  } from '../../constant';
  
  export const getMedicalHistory = () => ({
    type: GET_MEDICAL_HISTORY,
  });

  export const getMedicalHistorySuccessfully = (medicalHistory) => ({
      type: GET_MEDICAL_HISTORY_SUCCESSFULLY,
      payload: medicalHistory,
  });

  export const getMedicalHistoryFailed = (error) => ({
    type: GET_MEDICAL_HISTORY_FAILED,
    payload: error,
  });

  export const updateMedicalHistory = (payload) => ({
    type: UPDATE_MEDICAL_HISTORY,
    payload
  });

  export const updateMedicalHistorySuccessfully = (medicalHistory) => ({
    type: UPDATE_MEDICAL_HISTORY_SUCCESSFULLY,
    payload: medicalHistory,
  });

  export const updateMedicalHistoryFailed = (error) => ({
    type: UPDATE_MEDICAL_HISTORY_FAILED,
    payload: error,
  });
  
  