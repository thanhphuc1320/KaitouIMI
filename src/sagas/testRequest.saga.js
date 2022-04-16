import { call, put } from 'redux-saga/effects';
import { getTestResultApi } from '../apiCalls/testResult.api';
import {
    getTestResultSuccessfully,
    getTestResultFailed
}from '../store/actions/testResult.action';
import { createDefaultError } from '../utils';

export function* getDataTestResult(action) {
    try {
      const res = yield call(getTestResultApi);
      if (!res.data.code) yield put(getTestResultSuccessfully(res.data));
      else yield put(getTestResultFailed(res.data.errors));
    } catch (e) {
      const errors = createDefaultError(e);
      yield put(getTestResultFailed(errors));
    }
  }
