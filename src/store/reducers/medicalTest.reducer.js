import {
    UPDATE_MEDICAL_TEST_SUCCESS
  } from '../../constant';
  
  export default function (medicalTest = [] , action) {
    const { type } = action;
    const medicalTestList = action.payload
    switch (type) {
      case UPDATE_MEDICAL_TEST_SUCCESS:
        return {
          ...medicalTestList,
        };
      default:
        return medicalTest;
    }
  }
