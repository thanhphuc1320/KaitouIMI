import React from 'react';
import { useDispatch } from 'react-redux';
import { changeMode } from '../store/action';
import { DoctorTabSwitchBar, DoctorTabButton } from './styled';

export default ({ currentMode, modeTitles }) => {
  const dispatch = useDispatch();

  return (
    <DoctorTabSwitchBar>
      {modeTitles.map((mode, idx) => (
        <DoctorTabButton
          key={mode}
          active={currentMode.status === idx}
          onClick={() => dispatch(changeMode(mode))}
        >
          {mode === 'Waiting'
            ? 'Pending'
            : mode === 'Processing'
            ? 'Accepted'
            : 'Completed'}
        </DoctorTabButton>
      ))}
    </DoctorTabSwitchBar>
  );
};
