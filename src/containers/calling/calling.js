import React, { useEffect, useRef } from 'react';
import { useCalling } from './use-calling';
import { useSelector } from 'react-redux';

import VideoPlayer from './elements/video-player';
import ImageReviewer from './elements/image-reviewer';
import ImageShared from './elements/image-reviewer/image-shared';
import NoteFromDoctor from './elements/image-reviewer/note-from-doctor';
import {
  TextController
} from './elements/image-reviewer/styled'

import * as Styled from './styled';

const Calling = () => {
  const ref = useRef();
  const calling = useCalling();
  const user = useSelector((state) => state.user);
  // const getImageLenght = calling
  const getLengthImg = calling.appointmentData?.image.length;
  const getLengthVideo = calling.appointmentData?.video?.length;
  if(getLengthImg === 0 && getLengthVideo === 0){
    calling.isFullScreen = true;
  }
  useEffect(() => {
    ref.current = calling.localStream;
  }, [calling.localStream]);

  useEffect(() => {
    calling.connectSocket();
    return () => {
      calling.disconnectSocket();
      ref.current && ref.current.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Styled.VideoPlayerWrapper fullScreen={calling.isFullScreen} fullScreenImage={calling.isFullScreenImage}>
        <VideoPlayer />

        <ImageReviewer />

        <div className="w-100 calling-bottom" style={{position: 'relative'}}>
          {
            (user.role === 'robot' || user.role === 'patient') ? (
              <div>
                <TextController>Note from doctor</TextController>
                <NoteFromDoctor/>
              </div>
            ) : (<ImageShared />)
          }
        </div>
      </Styled.VideoPlayerWrapper>

    </div>
  );
};

export default Calling;
