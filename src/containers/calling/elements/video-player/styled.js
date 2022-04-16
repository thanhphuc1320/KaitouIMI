import styled, { css } from 'styled-components';

import metro_attachment from '@assets/icons/ico-upload.png';
import ico_voice_mute from '@assets/icons/ico-voice-mute.png';

export const ControllerBtn = styled.div`
  margin: 10px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-position: center center;
  background-size: 15px;
  background-repeat: no-repeat;
  background-color: #fcfcfc;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.502);
  cursor: pointer;
  transition: 0.33s;
  &:hover {
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.502);
  }
  &:active {
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.502);
  }
  ${(props) =>
    props.active &&
    css`
      background-color: #001ef5;
      &.hangUpBtn {
        background-color: #fc2d2c;
      }
    `}
  ${(props) =>
    props.bgImage &&
    css`
      background-image: url(${props.bgImage});
    `}
  ${(props) =>
    props.role &&
    css`
      position: absolute;
      right: 125px
    `}
  ${(props) =>
    props.activeVoice &&
    css`
      background: none;
      background-size: cover;
      background-image: url(${ico_voice_mute});
    `}
  &.record-icon {
    background-size: 56px;
    background-position: center -8px;
    ${(props) =>
      props.active &&
      css`
        opacity:0.33;
    `}
  }
  .isLoadingRecord {
    width: 20px !important;
    height: 20px !important;
    margin-left: 7px !important;
    margin-top: 7px !important;
  }
`;

export const VideoPlayer = styled.div`
  width: 60%;
  flex-grow: 1;
  margin-right: 1rem;

  @media screen and (max-width: 425px){
    margin-right: 0rem;
  }
`;

export const MainScreen = styled.div`
  position: relative;
  background-color: white;
  border-radius: 24px;
  height: 60vh;
  transition: all 0.5s;

  @media screen and (max-width: 425px){
    height: 36vh;
  }
`;

export const RemoteVideo = styled.video`
  width: 100%;
  height: calc(100% - 86px);
  object-fit: cover;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
`;

export const LocalVideo = styled.video`
  position: absolute;
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #ffffff;
  background-color: #fff;
  transition: all 0.5s;
  
  @media screen and (max-width: 768px){
    position: absolute;
    width: 150px;
    height: 150px;
    bottom: -65px;
    left: 25px;
   
  }

  @media screen and (max-width: 425px){
    width: 100px;
    height: 100px;
    bottom: -55px;
  }

`;

export const Profile = styled.div`
  position: absolute;
  bottom: -150px;
  left: 140px;
  transform: translateX(-50%);
  text-align: center;
  .years-old {
    color: #CCCCCC;
  }

  @media screen and (max-width: 768px){
    position: absolute;
    bottom: -110px;
    left: 100px;
    transform: translateX(-50%);
    text-align: center;
    .years-old {
      color: #CCCCCC;
    }
  }

  @media screen and (max-width: 425px){
    display: none;
  }
`;

export const VideoControlerContainer = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  bottom: 10px;
  padding-right: 10px;
  ${(props) =>
    props.role &&
    css`
      display: flex;
      align-items: center;
   
    `}
`;

export const ListColumnButton = styled.div`
    display: flex;
  ${(props) =>
    props.role &&
    css`
       flex-direction: column;
        position:absolute;
        bottom: 50px;
        left: 110px;
        @media screen and (max-width: 425px){
          left: 55px !important;
        }
    `}
  @media screen and (max-width: 425px){
    flex-direction: column;
    position:absolute;
    bottom: 50px;
    left: 110px;
  }
`;

export const ListRowButton = styled.div`
    display: flex;
  ${(props) =>
    props.role &&
    css`
      display: flex;
    `}
`;

export const TopBar = styled.div`
  height: 86px;
  background: #fff;
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  box-shadow: 2px 2px 5px -1px #898989;
`;

export const TopBarIcon = styled.img`
  margin: 0.5rem 0.5rem 0  0.5rem ;
`;

export const TopBarLabel = styled.span`
  margin: 1rem 0.5rem 0 0;
`;

export const TopBarBtn = styled.div`
  float: right;
  align-items: center;
  width: 35px;
  height: 35px;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 50%;
  margin-top: 22px;
  margin-right: 25px;
  cursor: pointer;
  ${(props) =>
    props.bgrImage &&
    css`
    background-image: url(${props.bgrImage});
    `}
`;

export const UploadFile = styled(TopBarBtn)`
  border-radius:0%;
  background-image: url(${metro_attachment});
`;
