import React from 'react';

import ico_fullscreen_rounded from '@assets/icons/ico-fullscreen-rounded.png';
import ico_alarm_rounded from '@assets/icons/ico-alarm-rounded.png';
import {
  NoteFromDoctorContainer,
  IconFromDoctor,
  ControllerButton,
  TextController
} from './styled'

const NoteFromDoctor = () => {
  return (
    <NoteFromDoctorContainer>
      <IconFromDoctor>
        <ControllerButton
          bgImage={ico_alarm_rounded}
          className="icon-note"
        />
        <ControllerButton
          bgImage={ico_fullscreen_rounded}
          className="icon-fullscreen"
        />
      </IconFromDoctor>
      <div className="note">
        <h5 className="note-st"> Remember to exercise twice every day. </h5>
        <h5 className="note-st2"> Remember to exercise twice every day. </h5>
      </div>
    </NoteFromDoctorContainer>
  );
};

export default NoteFromDoctor;
