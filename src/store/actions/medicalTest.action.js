import {
    UPDATE_MEDICAL_TEST,
    UPDATE_MEDICAL_TEST_SUCCESS,
    UPDATE_MEDICAL_TEST_FAILED
  } from '../../constant';
  
  export const updateMedicalTest = (payload) => ({
    type: UPDATE_MEDICAL_TEST,
    payload
  });

  export const updateMedicalTestSuccessfully = (medicalHistory) => ({
    type: UPDATE_MEDICAL_TEST_SUCCESS,
    payload: medicalHistory,
  });

  export const updateMedicalTestFailed = (error) => ({
    type: UPDATE_MEDICAL_TEST_FAILED,
    payload: error,
  });
  
  