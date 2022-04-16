import React from 'react';

import TabBar from './tab-bar';
import TabContent from './tab-content';

import { FlexItem } from '../styled';

export default ({ modes, currentMode }) => {
  const modeTitles = Object.keys(modes);

  return (
    <FlexItem className="left">
      <TabBar currentMode={currentMode} modeTitles={modeTitles} />
      {currentMode && <TabContent currentMode={currentMode} />}
    </FlexItem>
  );
};
