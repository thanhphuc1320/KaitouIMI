import { call, put } from 'redux-saga/effects';

import { getNotifications, markAsRead } from '../apiCalls/notification.api';
import {
	getNotificationsSuccessfully,
	getNotificationsFailed,
} from '../store/actions/notification.action';
import { createDefaultError } from '../utils';

export function* getNotificationsSaga(action) {
	try {
		const res = yield call(getNotifications, action.payload);

		if (!res.data.code)
			yield put(getNotificationsSuccessfully(res.data));
		else
			yield put(getNotificationsFailed(res.data.errors));
	} catch (errors) {
    yield put(getNotificationsFailed(createDefaultError(errors)));
	}
}

export function* markAsReadSaga(action) {
	try {
		yield call(markAsRead, action.payload);
	} catch (errors) {
		console.error(errors);
	}
}