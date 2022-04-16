import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Redirect, Link } from 'react-router-dom';

import {
  getRequests,
  selectRequest,
  updateRequestInDoctor,
} from '../store/action';
// import { updateRequest } from '../../../store/actions/request.action';
import defaultAvatar from '@img/d_ava.png';

import {
  DoctorTabContent,
  Avatar,
  ContentRightInfo,
  RequestAction,
} from './styled';

export default ({ currentMode }) => {
  const dispatch = useDispatch();
  const [answersRequestId, setAnswersRequestId] = useState(false);

  let toastId = null;
  const { currentRequest } = currentMode;

  const getUserName = (user) => {
    if (!user || (!user.firstName && !user.lastName)) return 'N/A';
    return `${user.firstName || ''} ${user.lastName || ''}`;
  };

  const avatarUrl = defaultAvatar;

  const changeRequestStatus = () => {
    toastId = toast('Updating Status...', {
      className: 'toast-container',
    });
    dispatch(
      updateRequestInDoctor({
        requestId: currentRequest._id,
        data: { status: 1, mode: 1 },
      })
    );
    setTimeout(() => {
      toast.update(toastId, {
        render: 'Redirect to Request Detail',
        type: toast.TYPE.INFO,
        className: 'update-toast-container',
        progressClassName: 'update-progress-bar',
        autoClose: 1000,
      });
      setAnswersRequestId(currentRequest._id);
    }, 1000);
  };

  useEffect(() => {
    const currentModeTemp = {
      page: 0,
      status: 0,
      limit: 20,
      isClearData: true,
    };
    if (currentMode) {
      if (currentMode.requests.length) {
        dispatch(getRequests(currentModeTemp));
        return;
      }
      dispatch(getRequests(currentMode));
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [currentMode]);

  if (answersRequestId) {
    return <Redirect to={`/requests/${answersRequestId}`} />;
  }

  const handleSelectRequest = async (req) => {
    await dispatch(selectRequest(req));
  };

  const handleCheckTypeValid = (type) => {
    switch (type) {
      case 'Cancer':
        return true
      case 'Liver':
        return true
      case 'General':
        return true
      case 'Diabetes':
        return true
      default:
        return false
    }
  }
  return currentMode.requests.map((req) => {
    if (handleCheckTypeValid(req.type)) {
      return (
        <>
          <DoctorTabContent
            key={req._id}
            active={currentMode.currentRequest?._id === req._id}
            onClick={() => handleSelectRequest(req)}
          >
            <Avatar>
              <img
                src={req.user.avatarUrl ? req.user.avatarUrl : avatarUrl}
                alt="description of image"
              />
            </Avatar>

            <ContentRightInfo>
              <h4 className="mb-0 mt-2">{getUserName(req.user)}</h4>
              <p>{req.type}</p>
            </ContentRightInfo>

            {currentMode.status !== 1 ? (
              <RequestAction onClick={changeRequestStatus}>
                <a href="#">
                  {currentMode.status === 0 ? 'Answer' : 'Re-open'}
                </a>
              </RequestAction>
            ) : (
              <RequestAction>
                <Link to={`/requests/${currentMode.currentRequest._id}`}>
                  Accept
                </Link>
              </RequestAction>
            )}
          </DoctorTabContent>
        </>
      );
    } else {
      return;
    }
  });
};
