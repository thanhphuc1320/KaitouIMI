import React, { useState } from 'react';
import { useCalling } from '../../use-calling'
import ZoomIn from '@assets/icons/zoom-in.png';
import ZoomOut from '@assets/icons/zoom-out.png';
import IosDownload from '@assets/icons/ios-download.png';
import InformationOutline from '@assets/icons/information-circle-outline.png';
import EditPen from '@assets/icons/awesome-pen.png';
import {
  ImageControlerContainer,
  ControllerButtonReview,
  ImageVerticalControlerContainer,
  ListControllIconReview,
} from '../styled';

const ImageControler = ({ onChangeImage }) => {
  const [role, setRole] = useState(false);
  const [type, setType] = useState(false);
  const calling = useCalling();
  let temp = [];
  const isFullScreenImage = calling.isFullScreenImage;
  const getType = calling.currentImage?.fileType || '';
  Promise.all(getType).then(value => {
    temp = value[0];
    if (temp){
      if(temp === 'v'){
        setType(true);
      } else {
        setType(false);
     }
    } 
    return temp;
  })

  const handleToggleRole = () => {
    setRole(true);
  };

  return (
    <ImageControlerContainer type={type} fullScreen={isFullScreenImage}>
      <ImageVerticalControlerContainer role={role} onClick={handleToggleRole}>
        <ControllerButtonReview bgrImage={InformationOutline}/>
        <ControllerButtonReview bgrImage={InformationOutline}/>
      </ImageVerticalControlerContainer>
      <ListControllIconReview>
        <ControllerButtonReview bgrImage={EditPen}/>
        <ControllerButtonReview bgrImage={IosDownload}/>
        <ControllerButtonReview bgrImage={ZoomOut}/>
        <ControllerButtonReview bgrImage={ZoomIn}/>
      </ListControllIconReview>
    </ImageControlerContainer>
  );
};

export default ImageControler;
