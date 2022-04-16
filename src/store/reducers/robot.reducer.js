import {
  GET_ROBOT_SUCCESSFULLY,
  GET_ADMIN_ROBOTS_SUCCESSFULLY,
  GET_ADMIN_ROBOT_SUCCESSFULLY,
  UPDATE_ADMIN_ROBOT_SUCCESSFULLY,
  SYNC_ROBOTS_SUCCESSFULLY,
  SET_HOME_PAGE_SUCCESSFULLY,
  GET_REMOTE_LINK_SUCCESSFULLY,
  DELETE_REMOTE_LINK_SUCCESSFULLY
} from '../../constant';

export default function ( robot = {robots: [], remoteLink: {}, updateRobot: null }, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_ROBOT_SUCCESSFULLY: {
      return {
        ...robot,
        ...{ robots: payload }
      };
    }
    case GET_ADMIN_ROBOTS_SUCCESSFULLY: {
      return {
        ...robot,
        ...{ adminRobots: payload }
      };
    }
    case GET_ADMIN_ROBOT_SUCCESSFULLY: {
      return {
        ...robot,
        ...{ adminRobots: payload }
      };
    }
    case UPDATE_ADMIN_ROBOT_SUCCESSFULLY: {
      return {
        ...robot,
        ...{ updateRobot: payload }
      };
    }
    case SYNC_ROBOTS_SUCCESSFULLY: {
      return {
        ...robot,
        ...{ dataSyncRobots: payload }
      };
    }
    case SET_HOME_PAGE_SUCCESSFULLY: {
      return {
        ...robot,
      };
    }
    case GET_REMOTE_LINK_SUCCESSFULLY: {
      return {
        ...robot,
        ...{ remoteLink: payload }
      };
    }
    case DELETE_REMOTE_LINK_SUCCESSFULLY: {
      return {
        ...robot,
      };
    }
    default:
      return robot;
  }
}
