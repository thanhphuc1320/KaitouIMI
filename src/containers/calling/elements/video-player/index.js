import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import VideoControler from './controller';
import { useCalling } from '../../use-calling';
import { useSelector } from 'react-redux';

import icon_phone from '@assets/icons/icon-phone.png';
import ico_fullscreen from '@assets/icons/ico-fullscreen.png';
import * as Styled from './styled';

const VideoPlayer = () => {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const user = useSelector((state) => state.user);

  const { remoteStream, localStream, controller, upload } = useCalling();
  const { firstName, lastName, dob } = user || 'N/A';

  useEffect(() => {
    if (localStream) localVideo.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteStream) remoteVideo.current.srcObject = remoteStream;
  }, [remoteStream]);

  const handleUploadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = e.target.files[0];
      upload({ file, user });
    };
    input.click();
  };

  const getBirthday = () => moment().year() - moment(dob).year();

  return (
    <Styled.VideoPlayer>
      <Styled.MainScreen>
        <Styled.TopBar>
          <Styled.TopBarIcon src={icon_phone} />
          <Styled.TopBarLabel>System Doctor</Styled.TopBarLabel>
          <Styled.TopBarBtn
            onClick={controller.toggleFullScreen}
            bgrImage={ico_fullscreen}
          />
          {user.role !== "robot" ? <Styled.UploadFile onClick={handleUploadFile} /> : null}
        </Styled.TopBar>

        <Styled.RemoteVideo ref={remoteVideo} autoPlay playsInline />
        <Styled.LocalVideo ref={localVideo} autoPlay playsInline muted />

        <Styled.Profile>
          <div>
            {firstName}
            {lastName}
          </div>
          <div className="years-old">{getBirthday()} years old</div>
        </Styled.Profile>

        <VideoControler />
      </Styled.MainScreen>
    </Styled.VideoPlayer>
  );
};

export default VideoPlayer;
