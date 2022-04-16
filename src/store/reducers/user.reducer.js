import {
  ATTEMPT_REGISTER_SUCCESSFULLY,
  ATTEMPT_LOGIN_SUCCESSFULLY,
  GET_USER_IDENTITY_SUCCESSFULLY,
  ATTEMPT_LOGOUT,
  UPDATE_USER_SUCCESSFULLY,
  FORGOT_PASSWORD_SUCCESSFULLY,
  RESET_PASSWORD_SUCCESSFULLY,
  CREATE_REQUEST_SUCCESSFULLY,
  CREATE_USER_SUCCESSFULLY,
  SEND_FORGOT_PASSWORD_SUCCESSFULLY,
  GET_DOCTOR_LIST_SUCCESSFULLY,
  GET_PATIENT_LIST_SUCCESSFULLY,
  GET_USERS_ID_SUCCESSFULLY,
  DELETE_USER_SUCCESSFULLY,
  UPDATE_USER_FAILED
} from '../../constant';

const data = {
  numOfCreateUserRequest: 0,
  createUserResponse: null,
  requests: [],
  doctorlist: [],
  patientlist: [],
  userCreate: {},
  userprofile:{},
  userprofileAdminUpdate: null,
  errorUpdateUser: null
}

export default function (user = data, action) {
  const { type, payload } = action;

  switch (type) {
    case ATTEMPT_LOGIN_SUCCESSFULLY:
      return {...payload};
    case ATTEMPT_REGISTER_SUCCESSFULLY:
      return {
        ...user,
        userCreate: payload,
      }
    case UPDATE_USER_SUCCESSFULLY:
      if (user._id === payload._id) {
        return {
          ...user,
          ...payload
        };
      } else {
        return {
          ...user,
          ...{userprofileAdminUpdate: payload}
        };
      }
    case GET_USER_IDENTITY_SUCCESSFULLY:
      return { ...user, ...payload };
    // Forgot Password
    case FORGOT_PASSWORD_SUCCESSFULLY:
    case RESET_PASSWORD_SUCCESSFULLY:
      return { ...user, ...{ emailConfirmation: payload } };
    case ATTEMPT_LOGOUT:
      return {};

    case CREATE_REQUEST_SUCCESSFULLY:
      return {
        ...user,
        ...{ requests: [...user.requests, payload], createRequest: payload },
      };

    case CREATE_USER_SUCCESSFULLY:
      return {
        ...user,
        numOfCreateUserRequest: user.numOfCreateUserRequest + 1,
        createUserResponse: payload,
      }
    case SEND_FORGOT_PASSWORD_SUCCESSFULLY:
      return {
        ...user,
        createUserResponse: payload,
      }
    case GET_DOCTOR_LIST_SUCCESSFULLY: 
      if (payload?.queryParams?.page === 1) {
        user.doctorlist = []
      }
      return{
        ...user,
        doctorlist: [...user.doctorlist, ...payload.data],
      }
    case GET_PATIENT_LIST_SUCCESSFULLY:
      if (payload?.queryParams?.page === 1) {
        user.patientlist = []
      }
      return{
        ...user,
        patientlist: [...user.patientlist, ...payload.data],
      }
    case GET_USERS_ID_SUCCESSFULLY:
      return{
        ...user,
        userProfile: payload,
      }
    case DELETE_USER_SUCCESSFULLY:
      return {
        ...user
      }
    case UPDATE_USER_FAILED:
      return {
        ...user,
        errorUpdateUser: payload,

      }
    default:
      return user;
  }
}
