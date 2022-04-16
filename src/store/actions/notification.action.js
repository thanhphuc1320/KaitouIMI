import {
	GET_NOTIFICATIONS,
	GET_NOTIFICATIONS_SUCCESSFULLY,
	GET_NOTIFICATIONS_FAILED,
	MARK_AS_READ,
} from '../../constant';

export const getNotificationsApi = (page) => ({
	type: GET_NOTIFICATIONS,
	payload: page,
});

export const getNotificationsSuccessfully = (data) => ({
	type: GET_NOTIFICATIONS_SUCCESSFULLY,
	payload: data,
});

export const getNotificationsFailed = (error) => ({
	type: GET_NOTIFICATIONS_FAILED,
	payload: error,
});

export const markAsReadApi = (payload) => ({
	type: MARK_AS_READ,
	payload,
});
