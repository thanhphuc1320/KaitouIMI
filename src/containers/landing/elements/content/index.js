import './styles.css';
import React, { useRef, useEffect } from 'react';
import Slider from 'react-slick';

import BGfone from '../../../img/bg-fone.png';
import GroupImg from '../../../img/group.png';
import PhoneImg from '../../../img/icon-phone.png';
import PrevImg from '../../../img/prev.png';
import NextImg from '../../../img/next-slider.png';

import { dataContact } from './dataContact.js';

const ContentContainer = (props) => {
  const sliderUser = useRef(null);
  const sliderUserMobile = useRef(null);
  const sliderIcon = useRef(null);
  const sliderIconMobile = useRef(null);
  const featureSlider = useRef(null);
  const featureSliderMobile = useRef(null);
  const [state, setState] = React.useState(false);

  useEffect(() => {
    setState(true);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    responsive: [
      {
        breakpoint: 1201,
        settings: {
          slidesToScroll: 1,
          slidesToShow: 1,
        },
      },
    ],
  };
  const settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const clickedPrev = () => {
    sliderUser.current.slickPrev();
    sliderUserMobile.current.slickPrev();
  };

  const clickedNext = () => {
    sliderUser.current.slickNext();
    sliderUserMobile.current.slickNext();
  };

  return (
    <div>
      <div className="content2 c2-dektop">
        <div className="container d-flex">
          <div className="left-slider">
            {state && (
              <div>
                <Slider
                  className="icon-slider"
                  ref={sliderIcon}
                  asNavFor={featureSlider.current}
                  centerMode={true}
                  slidesToShow={5}
                  slidesToScroll={1}
                  arrows={true}
                  vertical={true}
                  swipe={true}
                  verticalSwiping={true}
                  infinite={true}
                  focusOnSelect={true}
                >
                  {dataContact.dataSystem.map((item, index) => (
                    <div className="wrap-inside" key={index}>
                      <div>
                        <img alt="" src={item.icon} />
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            )}

            <Slider
              ref={featureSlider}
              asNavFor={sliderIcon.current}
              slidesToShow={1}
              slidesToScroll={1}
              fade={true}
              arrows={false}
              vertical={true}
              swipe={false}
            >
              {dataContact.dataSystem.map((data, index) => (
                <div className="text-contact" key={index}>
                  <p className="text-contact1">Features</p>
                  <span>{data.SliderItem}</span>
                  <p className="text-contact2">{data.SliderContent}</p>
                </div>
              ))}
            </Slider>
          </div>

          <div className="contact-img">
            <img src={GroupImg} alt="" />
          </div>
        </div>
      </div>
      {/****************************** C2 MOBILE ***************************************/}

      <div className="content2 c2-mobile">
        <div className="c2-margin">
          <img alt="" src={GroupImg} className="review-web" />
        </div>
        <div className="text-main-mobile">
          <div>
            <Slider
              ref={featureSliderMobile}
              asNavFor={sliderIconMobile.current}
              slidesToShow={1}
              slidesToScroll={1}
              fade={true}
              arrows={false}
              swipe={false}
            >
              {dataContact.dataSystem.map((data, index) => (
                <div className="text-contact" key={index}>
                  <p className="text-contact1">Features</p>
                  <p className="text-center">{data.SliderItem}</p>
                  <p className="text-contact2">{data.SliderContent}</p>
                </div>
              ))}
            </Slider>
            <Slider
              className="icon-slider"
              ref={sliderIconMobile}
              asNavFor={featureSliderMobile.current}
              centerMode={true}
              slidesToShow={3}
              slidesToScroll={1}
              variableWidth={true}
              arrows={true}
              swipe={true}
              infinite={true}
              focusOnSelect={true}
            >
              {dataContact.dataSystem.map((item, index) => (
                <div className="wrap-inside" key={index}>
                  <div>
                    <img src={item.icon} alt="" />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      {/**********************************C3 content**********************************/}
      <div className="infomation container c3-dektop">
        <div className="info-left">
          <div className="present">
            <h3>Our Commitments</h3>
            <div className="top-info">
              <p className="left-text-info">
                Cost-saving <span className="line-info" />
              </p>
              <p className="text-bottom-info">
                3X cost saving compared to traditional methods.
              </p>
            </div>
            <div className="top-info">
              <p className="left-text-info">
                Your satisfation <span className="line-info" />
              </p>
              <p className="text-bottom-info">
                100% of our users gave positive feedback for their on &amp; off
                platform experiences.
              </p>
            </div>
            <div className="top-info">
              <p className="left-text-info">
                Time-saving <span className="line-info" />
              </p>
              <p className="text-bottom-info">
                No more time wasted on the noisy internet to search for reliable
                doctors for second opinion.
              </p>
            </div>
          </div>
        </div>
        <div className="info-right">
          <div className="img-phone">
            <img src={PhoneImg} alt="" />
            <div className="img-after" />
          </div>
        </div>
      </div>
      {/**********************************C3 MOBILE**********************************/}
      <div className="c3-mobile">
        <div className="c3-top-mobile">
          <img
            src={BGfone}
            style={{ position: 'absolute', top: '-140px', zIndex: '1' }}
            alt=""
          />
        </div>
        <div className="c3-middle-mobile" style={{ paddingTop: '330px' }}>
          <h4>Our Commitments</h4>
          <ul>
            <li>
              <h3>Cost-saving</h3>
              <p>3X cost saving compared to traditional methods.</p>
            </li>
            <li>
              <h3>Your satisfation</h3>
              <p>
                100% of our users gave positive feedback for their on &amp; off
                platform experiences.
              </p>
            </li>
            <li>
              <h3>Time-saving </h3>
              <p>
                No more time wasted on the noisy internet to search for reliable
                doctors for second opinion.
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/************************** C4 Content **********************/}
      <div className="content-user c4-dektop">
        <p className="title">Our Success Stories</p>
        <div className="silders center slider-dektop slider-content-home">
          <Slider {...settings} ref={sliderUser}>
            {dataContact.data.map((item) => {
              return (
                <div className="user-contact mr-39 item-slider-content">
                  <div className="img-user">
                    <img src={item.avatar} alt="" />
                  </div>
                  <div className="text-user">
                    <h3>{item.name}</h3>
                    <p>{item.country}</p>
                    <p>{item.age}</p>
                    <p className="p-text-details">{item.content}</p>
                  </div>
                  <div className="comma" />
                </div>
              );
            })}
          </Slider>
        </div>
        <div className="plusSlider">
          <a className="prev-dektop cursor" href="#!">
            <img alt="" src={PrevImg} onClick={() => clickedPrev()} />
          </a>
          <a className="next-dektop cursor" href="#!">
            <img alt="" src={NextImg} onClick={() => clickedNext()} />
          </a>
        </div>
      </div>
      {/************************** C4 MOBILE **********************/}
      <div className="content-user c4-mobile center">
        <p className="title">Our Success Stories</p>
        <div className="row">
          <div className="col-md-12 col-12">
            <div className="silders center-mobile circle-mobile">
              <Slider {...settings2} ref={sliderUserMobile}>
                {dataContact.data.map((item) => {
                  return (
                    <div className="user-contact item-slider-content">
                      <div className="img-user">
                        <img src={item.avatar} alt="" />
                      </div>
                      <div className="text-user">
                        <h3>{item.name}</h3>
                        <p>{item.country}</p>
                        <p>{item.age}</p>
                        <p className="p-text-details">{item.content}</p>
                      </div>
                      <div className="comma" />
                    </div>
                  );
                })}
              </Slider>
            </div>
            <div className="plusSlider arrow-slider plusMobile">
              <a className="prev-circle-mobile cursor" href="#!">
                <img src={PrevImg} onClick={() => clickedPrev()} alt="" />
              </a>
              <a className="next-circle-mobile cursor" href="#!">
                <img src={NextImg} onClick={() => clickedNext()} alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContentContainer;
