import styled, { css } from 'styled-components';
import {
  LocalVideo,
  MainScreen,
  Profile,
} from './elements/video-player/styled';
import { ImageContent, ImagePreview } from './elements/image-reviewer/styled';

export const VideoPlayerWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
  transition: 0.5s;
  ${(props) =>
    props.fullScreen &&
    css`
      margin-bottom: 0;
      .calling-bottom {
        display: none;
      }
      ${LocalVideo} {
        bottom: 40px;
      }
      ${MainScreen} {
        height: calc(100vh - 140px);
      }
      ${Profile} {
        display: none;
      }
      ${ImageContent} {
        width: 0%;
        opacity: 0;
        overflow: hidden;
      }
    `}

  ${(props) =>
    props.fullScreenImage &&
    css`
      margin-bottom: 0;
      .calling-bottom {
        display: none;
      }
      ${MainScreen} {
        display: none;
      }
      ${ImagePreview} {
        height: calc(100vh - 222px);
        img {
          width: auto;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        video {
          display: inline-block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .react-pdf__Page {
          display: flex !important;
        }
      }
      ${ImageContent} {
        width: 100%;
        height: calc(100vh - 140px);
      }
    `}
`;
