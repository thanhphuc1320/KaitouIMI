import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as Styled from './styled';

import logoAccount from '@img/logo-account.png';
import closeAccount from '@img/close-account.png';

const ResetPassword = (props) => {
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    setLoginLoading(false);
  }, []);

  const handleResetPassword = () => {
    // setLoginLoading(true);
    props.onClick();
  };

  const handleEnterLogin = (evt) => {
    if (evt.keyCode === 13 || evt.key === 'Enter') {
      handleResetPassword();
    }
  };
  return (
    <div>
      <div id="myModalLogin">
        <div className="modal-content">
          <div className="modal-header">
            <img src={logoAccount} className="modal-logo" />
            <Link to="/home" className="close-modal">
              <img
                src={closeAccount}
                className="close"
                id="modal-forgot-close-btn"
              />
            </Link>
          </div>
          <div className="modal-body modalMenu">
            <div className="login-box">
              <form>
                <div className="top-form">
                  <h3>Enter new password</h3>
                  <div className="link-share"></div>
                </div>
                <Styled.LoginBox>
                  <div className="user-box form-group">
                    <svg
                      viewBox="0 0 29 23"
                      fill="#8e949c"
                      width="29"
                      height="23"
                    >
                      <path
                        fillRule="evenodd"
                        d="M26.3623 0H2.54026C1.14131 0 0 1.14007 0 2.54026V19.4754C0 20.8708 1.13623 22.0156 2.54026 22.0156H26.3623C27.7578 22.0156 28.9026 20.8794 28.9026 19.4754V2.54026C28.9026 1.14481 27.7663 0 26.3623 0ZM26.0115 1.69351L14.5051 13.1999L2.89923 1.69351H26.0115ZM1.69351 19.1247V2.88286L9.8494 10.9688L1.69351 19.1247ZM2.89099 20.3221L11.052 12.1611L13.9116 14.9961C14.2426 15.3243 14.7768 15.3233 15.1065 14.9935L17.8948 12.2053L26.0116 20.3221H2.89099ZM27.2091 19.1246L19.0922 11.0078L27.2091 2.89093V19.1246Z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <input
                      className="form-control"
                      disabled={true}
                      id="email"
                      type="email"
                      name="email"
                      value={props.email.value}
                      autoFocus
                      placeholder="Your Email"
                      required
                      onChange={props.handleChange}
                    />
                  </div>
                </Styled.LoginBox>
                <Styled.LoginBox>
                  <div className="user-box form-group">
                    <svg
                      viewBox="0 0 20 26"
                      fill="#8e949c"
                      width="20"
                      height="26"
                      fillRule="evenodd"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.27435 8.3551H4.87943V4.6445C4.87943 2.08342 7.17847 0 10.0044 0C12.8301 0 15.1291 2.08342 15.1291 4.6445V8.3551H18.7344C19.1551 8.3551 19.4961 8.69629 19.4961 9.11682V18.8583C19.4961 22.7962 16.2923 26 12.3544 26H7.65414C3.71622 26 0.512436 22.7962 0.512436 18.8583V9.11682C0.512634 8.69629 0.853622 8.3551 1.27435 8.3551ZM13.6057 4.6445C13.6057 2.92349 11.9902 1.52344 10.0044 1.52344C8.01854 1.52344 6.40286 2.92349 6.40286 4.6445V8.3551H13.6057V4.6445ZM2.03607 18.8583C2.03607 21.9561 4.55629 24.4766 7.65434 24.4766H12.3544C15.4522 24.4766 17.9727 21.9561 17.9727 18.8583V9.87854H2.03607V18.8583Z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <input
                      className="form-control"
                      id="password"
                      type="password"
                      name="password"
                      value={props.password.value}
                      placeholder="Your Password"
                      required
                      onChange={props.handleChange}
                    />
                  </div>
                </Styled.LoginBox>
                <Styled.LoginBox>
                  <div className="user-box form-group">
                    <svg
                      viewBox="0 0 20 26"
                      fill="#8e949c"
                      width="20"
                      height="26"
                      fillRule="evenodd"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.27435 8.3551H4.87943V4.6445C4.87943 2.08342 7.17847 0 10.0044 0C12.8301 0 15.1291 2.08342 15.1291 4.6445V8.3551H18.7344C19.1551 8.3551 19.4961 8.69629 19.4961 9.11682V18.8583C19.4961 22.7962 16.2923 26 12.3544 26H7.65414C3.71622 26 0.512436 22.7962 0.512436 18.8583V9.11682C0.512634 8.69629 0.853622 8.3551 1.27435 8.3551ZM13.6057 4.6445C13.6057 2.92349 11.9902 1.52344 10.0044 1.52344C8.01854 1.52344 6.40286 2.92349 6.40286 4.6445V8.3551H13.6057V4.6445ZM2.03607 18.8583C2.03607 21.9561 4.55629 24.4766 7.65434 24.4766H12.3544C15.4522 24.4766 17.9727 21.9561 17.9727 18.8583V9.87854H2.03607V18.8583Z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <input
                      className="form-control"
                      type="password"
                      name="confirmedPassword"
                      id="confirmedPassword"
                      value={props.confirmedPassword.value}
                      placeholder="Confirmed your password"
                      required
                      onChange={props.handleChange}
                    />
                  </div>
                </Styled.LoginBox>
                <span
                  style={{
                    width: '50%',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  className="btn-backToHome"
                  onClick={handleResetPassword}
                >
                  {loginLoading ? (
                    <CircularProgress className="isLoadingProgress" />
                  ) : null}
                  SUBMIT
                </span>
              </form>
            </div>
          </div>
          <div className="modal-footer">
            <p>Version 2.0.1</p>
          </div>
        </div>
      </div>
      <div className="desktop-login">
        <div className="row">
          <div className="col-4 col-md-4 col-lg-4 p0">
            <div className="main-left-login">
              <h3>Hello, Friend! </h3>
              <p>
                Enter your personal detail and let we help <br /> you take care
                your health
              </p>
            </div>
          </div>
          <div className="col-8 col-md-8 col-lg-8 p0">
            <div className="modal-login modal-login-dektop">
              <div className="content-login">
                <div className="modal-body modalMenu">
                  <div className="login-box row">
                    <div className="col-6 mx-auto col-lg-8 col-md-6">
                      <form>
                        <div className="top-form">
                          <h3 className="font-size40">Enter new password</h3>
                          <div className="link-share"></div>
                        </div>
                        <Styled.LoginBox>
                          <div className="user-box">
                            <svg
                              viewBox="0 0 29 23"
                              fill="#8e949c"
                              width="29"
                              height="23"
                            >
                              <path
                                fillRule="evenodd"
                                d="M26.3623 0H2.54026C1.14131 0 0 1.14007 0 2.54026V19.4754C0 20.8708 1.13623 22.0156 2.54026 22.0156H26.3623C27.7578 22.0156 28.9026 20.8794 28.9026 19.4754V2.54026C28.9026 1.14481 27.7663 0 26.3623 0ZM26.0115 1.69351L14.5051 13.1999L2.89923 1.69351H26.0115ZM1.69351 19.1247V2.88286L9.8494 10.9688L1.69351 19.1247ZM2.89099 20.3221L11.052 12.1611L13.9116 14.9961C14.2426 15.3243 14.7768 15.3233 15.1065 14.9935L17.8948 12.2053L26.0116 20.3221H2.89099ZM27.2091 19.1246L19.0922 11.0078L27.2091 2.89093V19.1246Z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            <input
                              className="form-control"
                              disabled={true}
                              id="email"
                              type="email"
                              name="email"
                              value={props.email.value}
                              autoFocus
                              placeholder="Your email"
                              onChange={props.handleChange}
                              onKeyUp={(evt) => handleEnterLogin(evt)}
                              required
                            />
                          </div>
                        </Styled.LoginBox>
                        <Styled.LoginBox>
                          <div className="user-box">
                            <svg
                              viewBox="0 0 20 26"
                              fill="#8e949c"
                              width="20"
                              height="26"
                              fillRule="evenodd"
                            >
                              <path
                                fillRule="evenodd"
                                d="M1.27435 8.3551H4.87943V4.6445C4.87943 2.08342 7.17847 0 10.0044 0C12.8301 0 15.1291 2.08342 15.1291 4.6445V8.3551H18.7344C19.1551 8.3551 19.4961 8.69629 19.4961 9.11682V18.8583C19.4961 22.7962 16.2923 26 12.3544 26H7.65414C3.71622 26 0.512436 22.7962 0.512436 18.8583V9.11682C0.512634 8.69629 0.853622 8.3551 1.27435 8.3551ZM13.6057 4.6445C13.6057 2.92349 11.9902 1.52344 10.0044 1.52344C8.01854 1.52344 6.40286 2.92349 6.40286 4.6445V8.3551H13.6057V4.6445ZM2.03607 18.8583C2.03607 21.9561 4.55629 24.4766 7.65434 24.4766H12.3544C15.4522 24.4766 17.9727 21.9561 17.9727 18.8583V9.87854H2.03607V18.8583Z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            <input
                              className="form-control"
                              id="password"
                              type="password"
                              name="password"
                              value={props.password.value}
                              placeholder="Your Password"
                              onChange={props.handleChange}
                              onKeyUp={(evt) => handleEnterLogin(evt)}
                              required
                            />
                          </div>
                        </Styled.LoginBox>
                        <Styled.LoginBox>
                          <div className="user-box">
                            <svg
                              viewBox="0 0 20 26"
                              fill="#8e949c"
                              width="20"
                              height="26"
                              fillRule="evenodd"
                            >
                              <path
                                fillRule="evenodd"
                                d="M1.27435 8.3551H4.87943V4.6445C4.87943 2.08342 7.17847 0 10.0044 0C12.8301 0 15.1291 2.08342 15.1291 4.6445V8.3551H18.7344C19.1551 8.3551 19.4961 8.69629 19.4961 9.11682V18.8583C19.4961 22.7962 16.2923 26 12.3544 26H7.65414C3.71622 26 0.512436 22.7962 0.512436 18.8583V9.11682C0.512634 8.69629 0.853622 8.3551 1.27435 8.3551ZM13.6057 4.6445C13.6057 2.92349 11.9902 1.52344 10.0044 1.52344C8.01854 1.52344 6.40286 2.92349 6.40286 4.6445V8.3551H13.6057V4.6445ZM2.03607 18.8583C2.03607 21.9561 4.55629 24.4766 7.65434 24.4766H12.3544C15.4522 24.4766 17.9727 21.9561 17.9727 18.8583V9.87854H2.03607V18.8583Z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            <input
                              className="form-control"
                              type="password"
                              name="confirmedPassword"
                              id="confirmedPassword"
                              value={props.confirmedPassword.value}
                              placeholder="Confirmed your password"
                              onChange={props.handleChange}
                              onKeyUp={(evt) => handleEnterLogin(evt)}
                              required
                            />
                          </div>
                        </Styled.LoginBox>
                      </form>
                      <div className="d-flex w-100 d-flex justify-content-center w-100">
                        <span
                          style={{
                            width: '50%',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          className="btn-backToHome"
                          onClick={handleResetPassword}
                        >
                          {loginLoading ? (
                            <CircularProgress className="isLoadingProgress" />
                          ) : null}
                          SUBMIT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
