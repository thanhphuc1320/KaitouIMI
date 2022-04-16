import {
  CHANGE_MODE,
  CHANGE_TAB,
  CHANGE_PAGE,
  GET_REQUESTS_SUCCESSFULLY,
  SELECT_REQUEST,
  UPDATE_REQUEST_IN_DOCTOR_SUCCESSFULLY
} from './action-types';

import { convertMilisecondToDate, convertToDiseaseName } from '../../../utils';
// import { UPDATE_REQUEST_SUCCESSFULLY } from '@constant';

const initState = {
  currentMode: 'Waiting',
  modes: {
    Waiting: {
      status: 0,
      page: 0,
      tab: 3,
      requests: [],
      currentRequest: null,
    },
    Processing: {
      status: 1,
      page: 0,
      tab: 3,
      requests: [],
      currentRequest: null,
    },
    Completed: {
      status: 2,
      page: 0,
      tab: 3,
      requests: [],
      currentRequest: null,
    },
  },
};

const mappingRequestData = (requestsToReview) => 
  requestsToReview
    .filter((request) => request.user && request.type > 0)
    .map((request) => {
      return {
        ...request,
        createdAt: convertMilisecondToDate(request.createdAt, 'string') || '',
        type: convertToDiseaseName(request.type) || '',
        medical: request.user.medical,
        tests: [
          request.biopsy,
          request.bloodTest,
          request.radiology,
          request.urineTest,
          request.video,
        ],
      };
    });

export default (state = initState, action) => {
  const { type, payload, request } = action;
  const { currentMode, currentRequest, modes } = state;

  switch (type) {
    case GET_REQUESTS_SUCCESSFULLY: {
      const newData = mappingRequestData(payload);
      if (request.isClearData) {
        modes['Waiting'].requests = []
        modes['Waiting'].requests = [
          ...modes['Waiting'].requests,
          ...newData,
        ]
        modes['Waiting'].currentRequest = currentRequest || newData[0];
      } else {
        modes[currentMode].requests = [
          ...modes[currentMode].requests,
          ...newData,
        ];
        modes[currentMode].currentRequest = currentRequest || newData[0];
      }
      return { ...state };
    }

    case UPDATE_REQUEST_IN_DOCTOR_SUCCESSFULLY: {
      const listRequest = modes[currentMode].requests
      const newListRequest = []

      if(currentMode !== "Processing"){
        for(var i = 0; i < listRequest.length - 1; i++){
          if ( listRequest[i]._id === payload._id){
            listRequest.splice(i, 1)
          }
        }
        newListRequest = listRequest
      }
      return { ...state };
    }

    case CHANGE_MODE: {
      return {
        ...state,
        currentMode: payload,
      };
    }

    case CHANGE_TAB: {
      modes[currentMode].tab = payload;
      return { ...state };
    }

    case CHANGE_PAGE: {
      modes[currentMode].page = payload;
      return { ...state };
    }

    case SELECT_REQUEST: {
      modes[currentMode].currentRequest = payload;
      return { ...state };
    }

    default:
      return state;
  }
};
