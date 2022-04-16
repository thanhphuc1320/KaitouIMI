import React from 'react';
import { useHistory } from 'react-router-dom';

import Navbar from '../navbar';

// assests
import mobile_bg from '../../../img/bg-mobile-max.png';
import background2 from '../../../img/bg2.png';
import { Button } from '@stories/Button/Button';
import * as Styled from './styled';

const LandingHeader = () => {
  const history = useHistory();

  const gotoSignUp = () => {
    history.push('/sign-up');
  };

  return (
    <Styled.Header>
      <div className="content-header">
        <div className="container">
          <Navbar />
        </div>
        <div className="item-header container">
          <div className="row row-mobile">
            <div className="col-md-12 col-lg-6 col-12">
              <img
                src={mobile_bg}
                alt="mobile_bg"
                style={{
                  paddingLeft: 30,
                  position: 'relative',
                  paddingTop: 50,
                }}
              />
            </div>
            <div className="col-md-12 col-lg-6 col-12">
              <div className="text-mobile">
                <h3>Leading Platform </h3>
                <h3>For Medical Second Opinion</h3>
                <div
                  style={{
                    display: 'flex',
                    marginTop: 30,
                    marginBottom: 30,
                    marginLeft: 30,
                  }}
                >
                  <div
                    className="left-border"
                    style={{ marginRight: '20px' }}
                  ></div>
                  <div className="caption-header">
                    <p>
                      Connect with world-class physicians for second opinions &
                      medical advice. All at your fingertips.
                    </p>
                  </div>
                </div>
                <div className="gr-btn-signup-homepage">
                  <Button
                    style={{
                      width: '300px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    id="mySignUp"
                    className="coming-soon "
                    onClick={() => gotoSignUp()}
                    label="Sign Up for Personal Account"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text">
            <div className="left-border"></div>
            <div>
              <p>Leading Platform</p>
              <p>For Medical Second Opinion</p>
              <span className="caption-top-banner">
                Connect with world-class physicians for second opinions &
                medical advice. All at your fingertips.
              </span>
              <Button
                style={{
                  width: '300px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                className="coming-soon"
                onClick={() => gotoSignUp()}
                label="Sign Up for Personal Account"
              />
            </div>
          </div>
          <div className="bg2-img bg2-img-mobile">
            <img src={background2} alt="background2" />
          </div>
        </div>
      </div>
    </Styled.Header>
  );
};

export default LandingHeader;
