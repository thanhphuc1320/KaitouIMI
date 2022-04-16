import {
    GET_ROBOT_API,
    GET_ROBOT_SUCCESSFULLY,
    GET_ROBOT_FAILED,
    GET_ADMIN_ROBOTS_API,
    GET_ADMIN_ROBOTS_SUCCESSFULLY,
    GET_ADMIN_ROBOTS_FAILED,
    GET_ADMIN_ROBOT_API,
    GET_ADMIN_ROBOT_SUCCESSFULLY,
    GET_ADMIN_ROBOT_FAILED,
    UPDATE_ADMIN_ROBOT_API,
    UPDATE_ADMIN_ROBOT_SUCCESSFULLY,
    UPDATE_ADMIN_ROBOT_FAILED,
    SYNC_ROBOTS_API,
    SYNC_ROBOTS_SUCCESSFULLY,
    SYNC_ROBOTS_FAILED,
    SET_HOME_PAGE,
    SET_HOME_PAGE_SUCCESSFULLY,
    SET_HOME_PAGE_FAILED,
    GET_REMOTE_LINK,
    GET_REMOTE_LINK_SUCCESSFULLY,
    GET_REMOTE_LINK_FAILED,
    DELETE_REMOTE_LINK,
    DELETE_REMOTE_LINK_FAILED,
    DELETE_REMOTE_LINK_SUCCESSFULLY
} from '../../constant';

export const getRobot = payload => ({
    type: GET_ROBOT_API,
    payload,
});

export const getRobotSuccessfully = (robot) => ({
    type: GET_ROBOT_SUCCESSFULLY,
    payload: robot
});

export const getRobotFailed = (error) => ({
    type: GET_ROBOT_FAILED,
    payload: error
})

export const getAdminRobots = () => ({
    type: GET_ADMIN_ROBOTS_API
});

export const getAdminRobotsSuccessfully = (robot) => ({
    type: GET_ADMIN_ROBOTS_SUCCESSFULLY,
    payload: robot
});

export const getAdminRobotsFailed = (error) => ({
    type: GET_ADMIN_ROBOTS_FAILED,
    payload: error
})

export const getAdminRobot = (data) => ({
    type: GET_ADMIN_ROBOT_API,
    payload: data
});

export const getAdminRobotSuccessfully = (robot) => ({
    type: GET_ADMIN_ROBOT_SUCCESSFULLY,
    payload: robot
});

export const getAdminRobotFailed = (error) => ({
    type: GET_ADMIN_ROBOT_FAILED,
    payload: error
})

export const updateAdminRobot = (robot) => {
    return {
        type: UPDATE_ADMIN_ROBOT_API,
        payload: robot
    }
};

export const updateAdminRobotSuccessfully = (robot) => ({
    type: UPDATE_ADMIN_ROBOT_SUCCESSFULLY,
    payload: robot
});

export const updateAdminRobotFailed = (error) => ({
    type: UPDATE_ADMIN_ROBOT_FAILED,
    payload: error
})

export const syncRobots = () => ({
    type: SYNC_ROBOTS_API
});

export const syncRobotsSuccessfully = (robot) => ({
    type: SYNC_ROBOTS_SUCCESSFULLY,
    payload: robot
});

export const syncRobotsFailed = (error) => ({
    type: SYNC_ROBOTS_FAILED,
    payload: error
})

export const setHomePage = payload => ({
    type: SET_HOME_PAGE,
    payload,
});

export const setHomePageSuccessfully = (robot) => ({
    type: SET_HOME_PAGE_SUCCESSFULLY,
    payload: robot
});

export const setHomePageFailed = (error) => ({
    type: SET_HOME_PAGE_FAILED,
    payload: error
})

export const getRemoteLink = payload => ({
    type: GET_REMOTE_LINK,
    payload,
});

export const getRemoteLinkSuccessfully = (robot) => ({
    type: GET_REMOTE_LINK_SUCCESSFULLY,
    payload: robot
});

export const getRemoteLinkFailed = (error) => ({
    type: GET_REMOTE_LINK_FAILED,
    payload: error
})

export const deleteRemoteLink = payload => ({
    type: DELETE_REMOTE_LINK,
    payload,
});

export const deleteRemoteLinkSuccessfully = (robot) => ({
    type: DELETE_REMOTE_LINK_SUCCESSFULLY,
    payload: robot
});

export const deleteRemoteLinkFailed = (error) => ({
    type: DELETE_REMOTE_LINK_FAILED,
    payload: error
})
