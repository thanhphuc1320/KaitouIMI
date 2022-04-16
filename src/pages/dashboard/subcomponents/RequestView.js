import { PAGE_LIMIT, PATIENT_ROLE } from '../../../constant.js';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  convertDate,
  convertMilisecondToDate,
  convertToDiseaseName,
  convertFamilyDisease,
  convertIsSmoking,
  convertSmokingYear,
  convertDrinkingAlcohol,
} from '../../../utils';
import {
  getRequests,
  updateRequest,
} from '../../../store/actions/request.action';
import { useDispatch, useSelector } from 'react-redux';

import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import img_default_ava from '../../../img/imi/default-ava.png';
import styles from '../styles';
import ProfileView from './ProfileView';
import ListItem from './ListItem';
import TestResultsPanelView from './TestResultsPanelView';
import RequestDetailPanelView from './RequestDetailPanelView';

const RequestView = ({ setCurrentIndex }) => {
  const tabList = [
    'Profile',
    'Test Results',
    'Medical History',
    'Request details',
  ];
  const bottomBoundary = useRef(null);
  const requestModeList = ['Waiting', 'Processing', 'Completed'];

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const request = useSelector((state) => state.request);
  const { requestsToReview = [] } = request;

  const [answersRequestId, setAnswersRequestId] = useState(false);
  const [requestMode, setRequestMode] = useState(0);
  const [dropdownTab, setDropdownTab] = useState(false);
  const [data, setData] = useState({
    0: {
      status: 0,
      tab: tabList[3],
      requestInView: 0,
      page: 0,
      restructuredRequests: [],
      hasMore: true,
      pageY: 0,
    },
    1: {
      status: 1,
      tab: tabList[3],
      requestInView: 0,
      page: 0,
      restructuredRequests: [],
      hasMore: true,
      pageY: 0,
    },
    2: {
      status: 2,
      tab: tabList[3],
      requestInView: 0,
      page: 0,
      restructuredRequests: [],
      hasMore: true,
      pageY: 0,
    },
  });

  const { tab, requestInView } = data[requestMode];

  const buildThresholdList = () => {
    let thresholds = [];
    let numSteps = 20;

    for (let i = 1.0; i <= numSteps; i++) {
      let ratio = i / numSteps;
      thresholds.push(ratio);
    }

    thresholds.push(0);
    return thresholds;
  };

  const scrollObserver = useCallback((requestMode) => {
    return new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        const prevY = data[requestMode].pageY;

        const { y } = firstEntry.boundingClientRect;
        const page = data[requestMode].page;

        if (prevY > y && firstEntry.isIntersecting) {
          const requestModeInfo = {
            token,
            status: requestMode,
            page: page,
            limit: PAGE_LIMIT,
            version: '2.1',
          };
          dispatch(getRequests(requestModeInfo));
          data[requestMode] = { ...data[requestMode], page: page + 1 };
        }

        data[requestMode] = { ...data[requestMode], pageY: y };
        setData({ ...data });
        return;
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: buildThresholdList(),
      }
    );
  });

  useEffect(() => {
    const node = bottomBoundary.current;
    const observerCallBack = scrollObserver(requestMode);

    if (node) observerCallBack.observe(node);

    return () => {
      if (node) observerCallBack.disconnect(node);
    };
  }, [bottomBoundary, requestMode]);

  // Called once whenever the whole page is updated
  useEffect(() => {
    const requestModeInfo = {
      token,
      status: requestMode,
      page: 0,
      limit: PAGE_LIMIT,
      version: '2.1',
    };
    !requestsToReview.length && dispatch(getRequests(requestModeInfo));

    data[requestMode] = { ...data[requestMode], page: 1 };
    setData({ ...data });  
  }, [dispatch]);

  const {
    token,
    role = PATIENT_ROLE,
    avatarUrl = img_default_ava,
    firstName,
    lastName,
    bio,
  } = user;
  // Sorting based on createdAt
  requestsToReview.sort(
    (itemA, itemB) =>
      convertDate(itemB.createdAt) - convertDate(itemA.createdAt)
  );

  const restructuredRequestsToReview = requestsToReview
    .filter(
      (request) =>
        request.user !== null &&
        request.status === requestMode &&
        request.type > 0
    )
    .map((request) => {
      const {
        type,
        createdAt,
        status,
        _id,
        user,
        addedInfo,
        questions,
        comments,
        biopsy,
        bloodTest,
        radiology,
        urineTest,
        video,
      } = request;

      return {
        createdAt: convertMilisecondToDate(createdAt, 'string') || '',
        type: convertToDiseaseName(type) || '',
        _id,
        status,
        user,
        addedInfo,
        questions,
        comments,
        medical: user.medical,
        tests: [biopsy, bloodTest, radiology, urineTest, video],
      };
    });

  data[requestMode].restructuredRequests = restructuredRequestsToReview || [];

  if (
    (restructuredRequestsToReview.length > 0 &&
      restructuredRequestsToReview.length ===
        data[requestMode].restructuredRequests.length) ||
    restructuredRequestsToReview.length < PAGE_LIMIT
  ) {
    // FIXME: hasMore
    // data[requestMode] = { ...data[requestMode], hasMore: false };
    // setData({ ...data, ...data[requestMode] });
  }

  const currentRequest =
    data[requestMode].restructuredRequests[requestInView] || {};
  const { user: patient, medical = {}, tests } = currentRequest || {};

  const setCurrentRequest = (key) => {
    setCurrentIndex(key);
    data[requestMode] = { ...data[requestMode], requestInView: key };
    setData({ ...data, ...data[requestMode] });
  };

  const setCurrentTab = (tab) => {
    data[requestMode] = { ...data[requestMode], tab };
    setData({ ...data, ...data[requestMode] });
    handleDropdownTab();
  };

  const handleDropdownTab = () => {
    if (!dropdownTab) setDropdownTab(true);
    else setDropdownTab(false);
  };
  const ListDropdown = ({ name }) => (
    <li>
      <a onClick={() => setCurrentTab(name)}>{name}</a>
    </li>
  );

  const handleRequestMode = (key) => {
    setRequestMode(key);
    if (!requestsToReview.length && data[key].page === 0) {
      const requestModeInfo = {
        token,
        status: key,
        page: 0,
        limit: PAGE_LIMIT,
        version: '2.1',
      };
      dispatch(getRequests(requestModeInfo));
      data[key] = { ...data[key], page: 1 };
      setData({ ...data });
    }
  };

  let toastId = null;

  const notifyChangingStatus = () =>
    (toastId = toast('Updating Status...', {
      className: 'toast-container',
    }));

  const updateRequestFailed = () => {
    toast.error('Update status failed', {
      className: 'error-toast-container',
      autoClose: 1000,
    });
  };

  const changeRequestStatus = (e, requestId, status, mode) => {
    notifyChangingStatus();
    if (mode === 1) {
      dispatch(updateRequest({ requestId, data: { status, mode } }));

      setTimeout(() => {
        toast.update(toastId, {
          render: 'Redirect to Request Detail',
          type: toast.TYPE.INFO,
          className: 'update-toast-container',
          progressClassName: 'update-progress-bar',
          autoClose: 1000,
        });
        setAnswersRequestId(requestId);
      }, 1000);
    } else updateRequestFailed();
  };

  if (answersRequestId)
    return <Redirect to={`/requests/${answersRequestId}`} />;

  return (
    <div className="box-flex main-content-doctor">
      <div className="main-left">
        <div className="tabs-doctor">
          {requestModeList.map((mode, key) => (
            <a
              className={`${requestMode === key ? 'active' : ''}`}
              onClick={() => handleRequestMode(key)}
            >
              {mode}
            </a>
          ))}
        </div>
        <div className="content-tabs-doctor">
          <div className="list-customer">
            {data[requestMode].restructuredRequests.map((request, key) => (
              <div
                className={`item-customer clearfix ${
                  data[requestMode].requestInView === key ? 'active' : ''
                }`}
                onClick={() => {
                  setCurrentTab(tabList[3]);
                  setDropdownTab(false);
                  setCurrentRequest(key);
                }}
              >
                <p className="image">
                  <img src={avatarUrl} />
                </p>
                <div className="right-info">
                  <div className="left">
                    <h4>
                      {request.user
                        ? `${request.user.firstName} ${request.user.lastName}`
                        : 'N/A'}
                    </h4>
                    <p>{request.type}</p>
                  </div>
                  {/*<div className="right-arrow" />*/}
                </div>
                {requestMode === 0 && (
                  <div className="block-btn-action">
                    <a
                      onClick={(e) => changeRequestStatus(e, request._id, 1, 1)}
                    >
                      Answer
                    </a>
                  </div>
                )}
                {/* (e, requestId, status, mode) => */}
                {requestMode === 1 && (
                  <div className="block-btn-action">
                    <a href={`/requests/${request._id}`}>Edit</a>
                  </div>
                )}
                {requestMode === 2 && (
                  <div className="block-btn-action">
                    <a
                      onClick={(e) => changeRequestStatus(e, request._id, 1, 1)}
                    >
                      Re-open
                    </a>
                  </div>
                )}
              </div>
            ))}
            <div
              id="bottom-boundary"
              style={styles.bottomBoundary}
              ref={bottomBoundary}
            ></div>
          </div>
        </div>
      </div>
      <div className="main-right">
        <div className="new-block-right-doctor">
          {data[requestMode] &&
            data[requestMode].restructuredRequests.length > 0 && (
              <div className="block-right-doctor-content">
                <div className="block-main-dropdown">
                  <div className="main-dropdown">
                    {/* const tabList = [
                      'Profile',
                      'Test Results',
                      'Medical History',
                      'Request details',
                    ]; */}
                    {tab === tabList[0] && patient && (
                      <p
                        className="label-dropdown"
                        onClick={() => handleDropdownTab()}
                      >
                        {tabList[0]}
                      </p>
                    )}
                    {tab === tabList[1] && tests && (
                      <p
                        className="label-dropdown"
                        onClick={() => handleDropdownTab()}
                      >
                        {tabList[1]}
                      </p>
                    )}
                    {tab === tabList[2] && medical && (
                      <p
                        className="label-dropdown"
                        onClick={() => handleDropdownTab()}
                      >
                        {tabList[2]}
                      </p>
                    )}
                    {tab === tabList[3] && (
                      <p
                        className="label-dropdown"
                        onClick={() => handleDropdownTab()}
                      >
                        {tabList[3]}
                      </p>
                    )}
                    {dropdownTab ? (
                      <ul className="list-dropdown">
                        {tabList.map((tab) => (
                          <ListDropdown name={tab} />
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>

                {tab === tabList[0] && (
                  <div className="box-info-customer">
                    <ProfileView
                      patient={patient}
                      requestId={currentRequest._id}
                    />
                  </div>
                )}
                {tab === tabList[1] && (
                  <div className="box-info-customer">
                    <TestResultsPanelView
                      currentRequest={currentRequest}
                      tests={tests}
                    />
                  </div>
                )}
                {tab === tabList[2] && (
                  <div className="box-info-customer">
                    <HistoryView medical={medical} />
                  </div>
                )}
                {tab === tabList[3] && (
                  <RequestDetailPanelView request={currentRequest} />
                )}
              </div>
            )}
          {data[requestMode] &&
            data[requestMode].restructuredRequests.length === 0 && (
              <div>No request available...</div>
            )}
        </div>
      </div>
    </div>
  );
};

const HistoryView = ({ medical }) => (
  <div>
    <ul className="list-info">
      <ListItem title="Blood" body={medical.bloodType || 'N/A'} />
      <ListItem title="Height" body={medical.userHeight || 'N/A'} />
      <ListItem title="Weight" body={medical.userWeight || 'N/A'} />
      <ListItem title="Smoking" body={convertIsSmoking(medical.isSmoking)} />
      <ListItem
        title="Smoking for"
        body={convertSmokingYear(medical.smokingYear)}
      />
      <ListItem
        title="Drinking"
        body={convertDrinkingAlcohol(medical.drinkingAlcohol)}
      />
      <ListItem
        title="Family has cancer"
        body={convertFamilyDisease(medical.familyCancer)}
      />
      <ListItem title="Cancer Type" body={medical.familyCancerType || 'N/A'} />
      <ListItem
        title="Family has high blood"
        body={convertFamilyDisease(medical.familyHighBlood)}
      />
      <ListItem
        title="Family has high Cholesterol"
        body={convertFamilyDisease(medical.familyHighCholesterol)}
      />
      <ListItem
        title="Family has diabetes"
        body={convertFamilyDisease(medical.familyDiabetes)}
      />
    </ul>
  </div>
);

export default RequestView;
