import React from 'react';
import Slider from 'react-slick';

import { useCalling } from '../../use-calling';

import { ItemsShare } from './styled';
import PdfPreview from '@components/dialog/pdfPreview';

const ImageShared = () => {
  const [file] = React.useState('https://pdfkit.org/demo/out.pdf')
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    height: 200,
    adaptiveHeight: true,
  };
  const calling = useCalling();
  const getImage = calling.appointmentData?.image || [];
  const getVideo = calling.appointmentData?.video || [];

  const getUrlImage = getImage.map((item) => {
    return item;
  });

  const getUrlVideo = getVideo.map((item) => {
    return item;
  })

  const getUrl = getUrlImage.concat(getUrlVideo);

  return (
    <ItemsShare>
      <h5> Images shared</h5>
      <Slider {...settings}>
        {getUrl.map((item) => {
          return (
            (item.fileType  === "video/mp4" || item.fileType === "video/webm") ? (
              <video
               key="index"
               className="xray-video"
               src={item.signedUrl}
               onClick={() => calling.controller.changeCurrentImage(item)}
               />
            ) : ( item.fileType === "application/pdf" ? (
              <PdfPreview pageNumber={1} file={file}
                onClick = {() => calling.controller.changeCurrentImage(item)}
              />
            ):(
              <img
                key="index"
                className="xray-img"
                src={item.signedUrl}
                onClick={() => calling.controller.changeCurrentImage(item)}
                alt='' 
              />
            ))
          )
        } )}
      </Slider>
    </ItemsShare>
  );
};

export default ImageShared;
