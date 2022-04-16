import styled, { css } from 'styled-components';

export const ControllerButtonReview = styled.div`
  margin: 5px;
  width: 35px;
  height: 35px;
  background-position: center center;
  background-size: 15px;
  background-repeat: no-repeat;
  border-radius: 50%;
  right: 0;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.502);
  background-color: #fcfcfc;
  ${(props) =>
    props.active &&
    css`
      background-color: #001ef5;
    `}
  ${(props) =>
    props.bgrImage &&
    css`
    background-image: url(${props.bgrImage});
    `}
`;
export const ImageControlerContainer = styled.div`
  position: absolute;
  bottom: 15px;
  ${(props) =>
    props.type && props.fullScreen &&
    css`
    display: none;
    `}
`;
export const ImageVerticalControlerContainer = styled.div`
`;
export const ListControllIconReview = styled.div`
  display: flex;
`;
