import styled, { css } from 'styled-components';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export const ContainerImagePreview = styled.div`
  height: 60vh;

  @media screen and (max-width: 1024px){
    height: auto;
  }

  @media screen and (max-width: 768px){
    height: auto;
  }
`;

export const ImagePreview = styled.div`
  height: calc(100% - 85px);
  div {
    height: 100%;
  }
  img {
    object-fit: cover;
    height: 100%;
    width: 100%;
    @media screen and (max-width: 425px){
      height: auto;
    }
  }
  .react-pdf__Page {
    align-items: normal;
    display: contents !important;
  }
`;

export const HeaderPreview = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 1px 3px 2px #d4d4d4;
  .iconFullScreenImage{
    margin-top: 0.25rem !important; 
    cursor: pointer;
  }
  .img-review{
    font-size: 22px;
    color: #4266FF;
    font-weight: bold;
    line-height: 38px;
  }
`;

export const ItemsShare = styled.div`
  width: 50%;
  float: right;
  padding-top: 10px;
  flex-direction: column;
  .slick-list {
    margin-left: 10px;
    margin-right: 10px;
  }
  .slick-initialized .slick-slide {
    padding: 0px 10px 0px 10px;
    overflow: hidden;
    height: 10rem;
  }
  .slick-prev:before, .slick-next:before {
    font-size: 35px;
    color: #736666;
  }
  .slick-slider {
    margin-right: 20px;
  }
  .slick-slider img{ 
     height: 100%;
     object-fit: cover;
  }
  .slick-slider div{ 
    height: 100%;
  }
  .preview-next-nav, .preview-prev-nav{
    display: none !important;
  }
  .slick.prev, .slick-next {
    width: auto;
    height: auto;
  }
  @media screen and (max-width: 1024px) {
    width: 100%;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
  }

  @media screen and (max-width: 425px) {
    width: 100%;
  }

`;

export const ImageContent = styled.div`
  position: relative;
  width: 33%;
  transition: all 0.5s;
  opacity: 1;
  border-radius: 24px;
  overflow: hidden;

  @media screen and (max-width: 1024px){
    width: 100%;
    margin-top: 150px;
  }

  @media screen and (max-width: 768px){
    width: 100%;
    margin-top: 115px;
  }

  @media screen and (max-width: 425px){
    width: 100%;
    padding-top: 10px;
    height: 30vh;
    margin-top: 50px;
  }
`;

export const NoteFromDoctorContainer = styled.div`
  position: absolute;
  background-color: #FFFFFF;
  float: right;
  border-radius: 24px;
  position: relative;
  margin-top: 40px;
  padding: 20px 30px;
  box-shadow: 0px 0px 6px -1px #b9b9b9;
  .note-st {
    padding-bottom: 30px;
    border-bottom: 1px #d4d4d4 dashed;
    @media screen and (max-width: 425px){
      padding-bottom: 10px;
      font-size: 10px;
    }
  }
  .note-st2{
    padding-top: 1.5rem;
    @media screen and (max-width: 425px){
      font-size: 10px;
    }
  }
`;

export const IconFromDoctor = styled.div`
  flex-direction: column;
  display: flex;
  position: absolute;
  left: -50px;
  top: 46px;

  @media screen and (max-width: 425px){
    top: 15px;
  }
`;

export const ControllerButton = styled.div`
  margin-bottom: -2rem;
  width: 100px;
  height: 100px;
  ${(props) =>
    props.bgImage &&
    css`
      background-image: url(${props.bgImage});
    `}
  @media screen and (max-width: 425px){
    width: 56px;
    height: 65px;
    background-size: cover;
    margin-left: 20px;
    margin-top: 10px;
  }
  .icon-fullscreen {
    margin-top: 10px;
  }
`;
export const TextController = styled.div`
  position: absolute;
  top: 60px;
  right: 28rem;
  color: white;
  font-weight: bold;
  background-color: #F7931E;
  width: 220px;
  border-bottom-left-radius: 18px;
  border-top-left-radius: 18px;
  padding: 10px;
  @media screen and (max-width: 425px){
    top: 15px;
    right: 17rem;
    height: auto;
    width: 110px;
    font-size: 10px;
    padding: 5px;
  }
`;