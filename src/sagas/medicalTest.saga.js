import { call, put } from 'redux-saga/effects';

import {
  updateMedicalTestList
} from '../apiCalls/user.api';

import {
  updateMedicalTestSuccessfully,
  updateMedicalTestFailed
} from '../store/actions/medicalTest.action';
import { createDefaultError } from '../utils';
/**
 * Used when Doctor first create avaialable appointment
 * @param {} action
 */

export function* updateMedicalTest(action) {
  const medicalTest = action.payload || {};
  try {
    const res = yield call(updateMedicalTestList, medicalTest);
    if (!res.data.code) yield put(updateMedicalTestSuccessfully(res.data));
    else yield put(updateMedicalTestFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(updateMedicalTestFailed(errors));
  }
}
