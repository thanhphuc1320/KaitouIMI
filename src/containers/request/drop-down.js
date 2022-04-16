import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeTab } from './store/action';
import { DropDown, DropDownLabel, DropDownList, DropDownItem } from './styled';

export default ({ tab }) => {
  const dispatch = useDispatch();
  const [dropdownTab, toggleDropDown] = useState(false);
  const tabList = [
    'Profile',
    'Test Results',
    'Medical History',
    'Request details',
  ];

  const handleChangeTab = (tabNum) => {
    dispatch(changeTab(tabNum));
    toggleDropDown(false);
  };

  return (
    <DropDown>
      <DropDownLabel onClick={() => toggleDropDown(!dropdownTab)}>
        {tabList[tab]}
      </DropDownLabel>
      {dropdownTab && (
        <DropDownList>
          {tabList.map((tab, idx) => (
            <DropDownItem key={idx}>
              <a onClick={() => handleChangeTab(idx)}>{tab}</a>
            </DropDownItem>
          ))}
        </DropDownList>
      )}
    </DropDown>
  );
};
