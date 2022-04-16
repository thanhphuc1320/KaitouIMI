import styled, { css } from 'styled-components';

export const DoctorTabSwitchBar = styled.div`
  background: #e2e2e2;
  border-radius: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 40px 0;
`;

export const DoctorTabButton = styled.a`
  cursor: pointer;
  color: #797979;
  font-size: 16px;
  width: 33.33%;
  text-align: center;
  padding: 5px 0;
  font-weight: bold;
  border-radius: 25px;
  &:hover {
    text-decoration: none;
    color: #4266ff;
  }
  @media screen and (max-width: 375px){
    font-size: 13px;
  }
  ${(props) =>
    props.active &&
    css`
      background: #ffffff;
      color: #4266ff;
      filter: drop-shadow(-5px 0 11.5px rgba(0, 0, 0, 0.16));
    `}
`;

export const DoctorTabContent = styled.div`
  cursor: pointer;
  position: relative;
  background: #fff;
  margin-bottom: 30px;
  border-radius: 24px;
  -webkit-filter: drop-shadow(0px 5px 17.5px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0px 5px 17.5px rgba(0, 0, 0, 0.2));
  background: #FFF;
  -webkit-background: #FFF;
  min-height: 80px;
  display: flex;
  align-items: center;
  &:after {
    content: '';
    width: 6px;
    height: 10px;
    margin-left: 10px;
    float: right;
    background: url('../../img/imi/arrow-next.png') no-repeat 0 0;
    background-size: cover;
  }
  ${(props) =>
    props.active ?
    css`
      background-image: linear-gradient(94deg, #64c4b9 0%, #00cec9 100%);
      &:after {
        background: url('../../img/imi/arrow-pre.png') no-repeat 0 0;
        background-size: cover;
      }
      ${ContentRightInfo} {
        margin-left: 100px;
        border-right: 2px dashed #e2e2e2;
      }

      ${ContentRightInfo} h4, p {
        color: #fff;
      } 
      ${Avatar} {
        position: absolute;
        left: -17px;
        width: 100px;
        height: 100px;
        img {
          width: 100%;
          height: 100%;
          border: 2px solid #fff;
        }
      }
      @media screen and (max-width:375px){
        ${ContentRightInfo} h4, p {
          font-size: 15px;
        }
      }
    ` : css `h4, P {
      color: #797979;
    }` 
  }
`;

export const Avatar = styled.p`
  float: left;
  margin-right: 10px;
  margin-bottom: 0;
  margin-left: 10px;
  width: 75px;
  height: 75px;
  display: block;
  img {
    border-radius: 50%;
    box-shadow: 1px 2px 4px 1px #d1d1d1;
    height: 100%;
    width: 100%;
    background-color:white;
    object-fit: cover;
  }
  @media screen and (max-width: 375px){
    // width: 100px;
  }
`;

export const ContentRightInfo = styled.div`
  // margin-left: 70px;
  width: calc(100% - 150px)
  margin-top: 0;
  padding-top: 0;
  flex-grow: 1;
  // color: #797979;
  @media screen and (max-width: 1024px){
    h4, P {
      font-size: 15px !important;
    }
  }
  @media screen and (max-width: 375px){
    h4, P {
      font-size: 15px;
    }
  }
`;

export const RequestAction = styled.div`
  position: relative;
  flex-basis: 30%;
  height: 100%;
  text-align: center;
  a {
    color: #e2ff00 !important;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
  @media screen and (max-width: 425px){
    width: 45px;
    flex-basis: unset;
  }
`;
