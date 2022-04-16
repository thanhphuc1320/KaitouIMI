import React from 'react';
import { useSelector } from 'react-redux';

import ProfileView from '../../pages/dashboard/subcomponents/ProfileView';
import RequestDetailPanelView from '../../pages/dashboard/subcomponents/RequestDetailPanelView';
import TestResultsPanelView from '../../pages/dashboard/subcomponents/TestResultsPanelView';
import DoctorTab from './doctor-tab';
import DropDown from './drop-down';
import History from './history';

import { FlexBox, FlexItem } from './styled';

export default () => {
  const { modes, currentMode } = useSelector((s) => s.REFACTORED__request);
  const { tab, currentRequest } = modes[currentMode] || {};
  const { user, _id, medical, tests } = currentRequest || {};

  return (
    <FlexBox className="main-content-doctor">
      <DoctorTab currentMode={modes[currentMode]} modes={modes} />
      {currentRequest && (
        <FlexItem className="right">
          <DropDown tab={tab} />
          {tab === 0 && user && <ProfileView patient={user} requestId={_id} />}
          {tab === 1 && tests && (
            <TestResultsPanelView currentRequest={currentRequest} />
          )}
          {tab === 2 && medical && <History medical={medical} />}
          {tab === 3 && <RequestDetailPanelView request={currentRequest} />}
        </FlexItem>
      )}
    </FlexBox>
  );
};