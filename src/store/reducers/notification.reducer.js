import _ from 'lodash';
import {
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_SUCCESSFULLY,
  GET_NOTIFICATIONS_FAILED,
  MARK_AS_READ,
} from '../../constant';

const initValue = {
  page: 1,
  numOfNewMsg: 0,
  all: [],
  loading: false
};

export default function (notifications = initValue, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_NOTIFICATIONS: 
      return {...notifications, loading: true}
    case GET_NOTIFICATIONS_SUCCESSFULLY:
      return {
        ...notifications,
        all: _.concat(notifications.all, payload.notifications),
        numOfNewMsg: payload.count,
        page: payload.nextPage,
        loading: false
      };

    case MARK_AS_READ: {
      _.find(notifications.all, { _id: payload }).hasRead = true;
      return {
        ...notifications,
        all: notifications.all,
        numOfNewMsg: notifications.numOfNewMsg - 1,
      };
    }

    case GET_NOTIFICATIONS_FAILED:
    default:
      return notifications;
  }
}