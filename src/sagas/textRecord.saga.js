import { call, put } from 'redux-saga/effects';
import { getTextRecordApi } from '../apiCalls/textRecord.api';
import {
    getTextRecordSuccessfully,
    getTextRecordFailed
}from '../store/actions/textRecord.action';
import { createDefaultError } from '../utils';

export function* getDataRecording(action) {
    const url = action.payload;
    try {
      const res = yield call(getTextRecordApi, url);
      if (!res.data.code) yield put(getTextRecordSuccessfully(res.data));
      else yield put(getTextRecordFailed(res.data.errors));
    } catch (e) {
      const errors = createDefaultError(e);
      yield put(getTextRecordFailed(errors));
    }
  }