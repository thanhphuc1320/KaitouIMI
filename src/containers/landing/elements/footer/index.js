import React from 'react';

import Appstore from '../../../img/app-store.png'
import GooglePlay from '../../../img/google-play.png'
import PhoneImg from '../../../img/phone.png'
import Mark from "../../../img/mark.png"
import EmailFooter from "../../../img/email-footer.png"
import FacebookImg from "../../../img/fb.png"
import InstaImg from "../../../img/camara.png"
import InImg from "../../../img/in.png"
import TalkImg from "../../../img/talk.png"
import LogoFooter from "../../../img/logo-footer.png"
import TalkMobile from "../../../img/talk-mobile.png"
import ArrowImg from "../../../img/arrow-bottom.png"
const Footer = () => {
  return (
    <div className="mr-T100">
      <div className="position-re">
      <div className="container app position-app app-desktop">
        <div className="row">
          <div className="col-sm-8 link-app">
            <a href className="cursor">
              DOWNLOAD APP
            </a>
            <p>Take care of your health today</p>
          </div>
          <div className="col-sm-4 store">
            <img
              src={Appstore}
              alt=""
              style={{ paddingRight: '70px', paddingBottom: '20px' }}
            />
            <div className="border-bottom" />
            <img
              src={GooglePlay}
              alt=""
              style={{ paddingRight: '39px', paddingTop: '20px' }}
            />
          </div>
        </div>
      </div>
      <div className="app-mobile">
        <div className="row">
          <div className="col-md-12 col-12">
            <div className="link-app">
              <a href className="cursor">
                DOWNLOAD APP
              </a>
              <p>Take care of your health today</p>
            </div>
            <div className="app-details">
              <img
                src={Appstore}
                alt=""
                style={{ paddingBottom: '50px', paddingTop: '50px' }}
              />
              <div className="border-bottom" />
              <img
                src={GooglePlay}
                alt=""
                style={{ paddingTop: '50px', paddingBottom: '50px' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="footer footer-dektop">
        <div className="container-footer w1600 padding-T184">
          <div className="row">
            <div className="col col-1" />
            <div className="col detail col-5">
              <div>
                <i>
                  <img src={Mark} alt="" />
                </i>
                <p className="mBT0">
                  US address: 3361 Granada Ct, Santa Clara, CA 95051
                </p>
                <p>VN address: 30 Nguyen Phi Khanh, Q 1, Tp Ho Chi Minh</p>
              </div>
              <div>
                <i>
                  <img src={PhoneImg} alt="" />
                </i>
                <p>1-415-497-1516</p>
              </div>
              <div>
                <i>
                  <img src={EmailFooter} alt="" />
                </i>
                <p>Email: contact@imi.ai</p>
              </div>
              <div className="detail-us">
                <img src={FacebookImg} alt="" />
                <img src={InstaImg} alt="" />
                <img src={InImg} alt="" />
              </div>
            </div>
            <div className="col col-lg-1" />
            <div className="col col-lg-2 detail-contact">
              <p>Quick link</p>
              <p>About Us</p>
              <p>Careers</p>
              <p>Terms</p>
              <p>Blogs</p>
            </div>
            <div className="col col-lg-3 detail-contact">
              <p>Department</p>
              <p>WebApp login</p>
              <p>Help Desk</p>
              <p>FAQs</p>
              <p>Contact Us</p>
            </div>
          </div>
          <div className="talk">
            <img src={TalkImg} alt="" />
          </div>
        </div>
        <div className="container w1600 padding-T60">
          <div className="row f-detail">
            <div className="col-1" />
            <div className="col-md-auto">
              <img src={LogoFooter} alt="" />
            </div>
            <div className="col">
              <p>Made with love in San Francisco.</p>
              <p>All Rights Reserved.</p>
            </div>
            <div className="col-5">
              <p className="mBT20">
                Stay up to date on the latest -Health news.
              </p>
              <div className>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    placeholder="Your Email"
                    className="input-mail"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary btn-send font-weight600">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="line">
          <p>
            © Copyright IMI-Health 2020. All Right Reserved. Designed and
            Developed by IMI
          </p>
        </div>
      </div>
      {/***************************** MOBILE ***********************************/}
      <div className="footer footer-mobile">
        <div className="row border-bottom-footer">
          <div className="col-md-6 col-6">
            <div className="detail-contact">
              <p>Quick link</p>
              <p>About Us</p>
              <p>Careers</p>
              <p>Terms</p>
              <p>Blogs</p>
            </div>
          </div>
          <div className="col-md-6 col-6">
            <div className="detail-contact">
              <p>Department</p>
              <p>WebApp login</p>
              <p>Help Desk</p>
              <p>FAQs</p>
              <p>Contact Us</p>
            </div>
          </div>
        </div>
        <div className="row border-bottom-footer mT30">
          <div className="col-md-12 col-12">
            <div className="detail">
              <div className="mBT40">
                <i>
                  <img src={Mark} alt="" />
                </i>
                <p className="mBT20">
                  US address: 3361 Granada Ct, Santa Clara, CA 95051
                </p>
                <p>VN address: 30 Nguyen Phi Khanh, Q 1, Tp Ho Chi Minh</p>
              </div>
              <div className="mBT40">
                <i>
                  <img src={PhoneImg} alt="" />
                </i>
                <p>1-415-497-1516</p>
              </div>
              <div className="mBT40">
                <i>
                  <img src={EmailFooter} alt="" />
                </i>
                <p>Email: contact@imi.ai</p>
              </div>
              <div className="detail-us">
                <img src={FacebookImg} alt="" />
                <img src={InstaImg} alt="" />
                <img src={InImg} alt="" />
              </div>
            </div>
          </div>
          <div className="talk">
            <img src={TalkMobile} alt="" />
          </div>
        </div>
        <div className="row mT30">
          <div className="col-md-12 col-12">
            <div className="f-detail f-detail-mobile">
              <div className="pR40 pL40">
                <img src={LogoFooter} alt="" />
                <p>Made with love in San Francisco. All Rights Reserved.</p>
                <img src={ArrowImg} className="mT70" />
                <p className="mBT30 f-p-mobile">
                  Stay up to date on the latest -Health news.
                </p>
              </div>
              <div className="text-input">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    placeholder="Your Email"
                    className="input-mail"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary btn-send font-weight600">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="line">
          <p>
            © Copyright IMI-Health 2020. All Right Reserved. Designed and
            Developed by IMI
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Footer;
