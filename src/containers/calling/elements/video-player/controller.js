import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCalling } from '../../use-calling';
import icon_end_call from '@assets/icons/icon_end_call.png';
import material_video_call from '@assets/icons/material-video-call.png';
import icon_voice from '@assets/icons/icon_voice.png';
import record_icon from '@img/imi/record-icon-2.png';
import awesome_camera from '@assets/icons/awesome-camera.png';
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import {
  VideoControlerContainer,
  ControllerBtn,
  ListRowButton,
  ListColumnButton
} from './styled';

const VideoControler = () => {
  const calling = useCalling();
  const user = useSelector((state) => state.user);
  const [audio, setAudio] = useState(false);
  const [voice, setVoice] = useState(true);
  const [role, setRole] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const [textLanguageCode, setTextLanguageCode] = useState('');
  const getRole = user.role;
  let temp = [];

  const handleToggleAudio = () => {
    setAudio(!audio);
  };

  const handleClick = (event) => {
    if (calling.isRecord) {
      calling.controller.toggleRecord(textLanguageCode)
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = (value) => {
    setAnchorEl(false);
    setTextLanguageCode(value)
    calling.controller.toggleRecord(value)
  };

  Promise.all(getRole).then(value => {
    temp = value[0]
      if (temp === 'd'){
        setRole(true)
      }else{
        setRole(false)
      }
      return temp;
  })
  const handleToggleVoice = () => {
    setVoice(!voice);
    calling.controller.toggleAudio()
  };

  return (
    <VideoControlerContainer>
      <ControllerBtn
        active={calling.isVoice}
        activeVoice={!calling.isVoice}
        onClick={handleToggleVoice}
        bgImage={icon_voice}/>
      <ListColumnButton role={role}>
        {
          getRole !== 'patient' && (
            <ControllerBtn
              aria-controls="simple-menu"
              className="record-icon"
              active={calling.isRecord}
              onClick={handleClick}
              bgImage={!calling.isLoadingRecord && record_icon}
            >
              {calling.isLoadingRecord && <CircularProgress className="isLoadingRecord"/>}
            </ControllerBtn>
          )
        }
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
        >
          <MenuItem onClick={() => handleClose('en-US')}>English</MenuItem>
          <MenuItem onClick={() => handleClose('vi-VN')}>Viet Nam</MenuItem>
        </Menu>
        <ControllerBtn
          active={audio}
          onClick={handleToggleAudio}
          bgImage={awesome_camera}
        />
      </ListColumnButton>
      <ListRowButton role={role}>
        <ControllerBtn
          active={calling.isVideo}
          onClick={calling.controller.toggleVideo}
          bgImage={material_video_call}/>
        <ControllerBtn
          className="hangUpBtn"
          disabled={!calling.canHangUp}
          active={calling.canHangUp}
          onClick={calling.controller.hangUp}
          bgImage={icon_end_call}
        />
      </ListRowButton>
    </VideoControlerContainer>
  );
};

export default VideoControler;
