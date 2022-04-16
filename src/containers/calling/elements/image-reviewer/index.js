import React from 'react';
import Controler from './controller';
import Xray from './Xray';
import * as Styled from './styled';

const ImageReviewer = () => {
  return (
    <Styled.ImageContent>
      <Xray/>
      <Controler/>
    </Styled.ImageContent>
  );
};

export default ImageReviewer;
