import styled from 'styled-components';

export const Header = styled.div`
  position: relative;
  background: url(${require('../../../img/Bg.png')}) no-repeat 0 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 920px;

  @media screen and (max-width: 765px){
    background: url(${require('../../../img/bg-mobile-modal.png')}) no-repeat 0 0;
    height: 815px !important;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  }
  @media screen and (width: 768px){
    height: 1350px;
  }
`;
