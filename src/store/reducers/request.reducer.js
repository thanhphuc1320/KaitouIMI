import {
  CREATE_REQUEST_SUCCESSFULLY,
  GET_REQUESTS_SUCCESSFULLY,
  UPDATE_REQUEST_SUCCESSFULLY,
  DELETE_REQUEST_SUCCESSFULLY,
  GET_USER_IDENTITY_SUCCESSFULLY,
  UPDATE_REQUEST_FILTERED_SUCCESSFULLY,
  GET_SMART_READER_DOCTOR_SUCCESSFULLY
} from '../../constant';
import { toast } from 'react-toastify';

export default function (
  request = { requestsToReview: [], patientRequests: [] },
  action
) {
  const { type, payload, firstData } = action;
  let { requestsToReview, patientRequests } = request;
  switch (type) {
    case GET_USER_IDENTITY_SUCCESSFULLY:
      if(payload.role !== "doctor"){
        return {
          ...request,
          ...{ patientRequests: patientRequests.concat(payload.requests) },
        };
      }else {
        return {
          ...request,
          ...{ patientRequests: payload },
        };
      }
    case GET_REQUESTS_SUCCESSFULLY: {
      if(firstData){
        return {
          ...request,
          ...{ requestsToReview: payload.concat() },
        }
      }else {
        return {
          ...request,
          ...{ requestsToReview: requestsToReview.concat(payload.requests) },
        };
      }

      // : { ...request, ...{ requestsToReview: payload.requests } };
    }
    case CREATE_REQUEST_SUCCESSFULLY:
      return {
        ...request,
        ...{ patientRequests: [...patientRequests, payload] },
      };
    case UPDATE_REQUEST_SUCCESSFULLY: {
      const index = requestsToReview.findIndex(
        (request) => request?._id === payload._id
      );
      const newRequestsToReview = [
        ...requestsToReview.slice(0, index),
        payload,
        ...requestsToReview.slice(index + 1),
      ];
      return { ...request, ...{ requestsToReview: newRequestsToReview } };
      };
    case UPDATE_REQUEST_FILTERED_SUCCESSFULLY: {
      return { ...request};
      };
    case DELETE_REQUEST_SUCCESSFULLY: {
      const { requestId } = payload;
      const newRequests = patientRequests.filter(
        (request) => request._id !== requestId
      );
      return { ...request, ...{ patientRequests: newRequests } };
    } 
    case GET_SMART_READER_DOCTOR_SUCCESSFULLY: {
      return {
        ...request,
        ...{ doctorRequests: payload }
      };
    } 
    default:
      return request;
  }
}
