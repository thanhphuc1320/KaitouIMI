import { call, put } from 'redux-saga/effects';

import {
    getMedicalHistoryList,
    updateMedicalHistoryList
} from '../apiCalls/user.api';

import {
  getMedicalHistorySuccessfully,
  getMedicalHistoryFailed,
  updateMedicalHistorySuccessfully,
  updateMedicalHistoryFailed
} from '../store/actions/medicalHistory.action';
import { createDefaultError } from '../utils';
/**
 * Used when Doctor first create avaialable appointment
 * @param {} action
 */
export function* getMedicalHistory() {
  try {
    const res = yield call(getMedicalHistoryList);
    if (!res.data.code) yield put(getMedicalHistorySuccessfully(res.data));
    else yield put(getMedicalHistoryFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(getMedicalHistoryFailed(errors));
  }
}

export function* updateMedicalHistory(action) {
  const medicalHistory = action.payload || {};
  try {
    const res = yield call(updateMedicalHistoryList, medicalHistory);
    if (!res.data.code) yield put(updateMedicalHistorySuccessfully(res.data));
    else yield put(updateMedicalHistoryFailed(res.data.errors));
  } catch (e) {
    const errors = createDefaultError(e);
    yield put(updateMedicalHistoryFailed(errors));
  }
}
