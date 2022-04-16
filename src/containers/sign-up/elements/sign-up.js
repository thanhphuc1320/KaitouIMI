import React, { useEffect, useState } from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { attemptRegister } from '../../../store/actions/auth.action';

import * as Styled from '../../login/elements/styled';

import email from '../../img/email.png';
import password from '../../img/password.png';
import userAccount from '../../img/user-account.png';
import logoAccount from '../../img/logo-account.png';
import closeAccount from '../../img/close-account.png';
import securitySignup from '../../img/security-signup.png';
import ico_check from '../../../img/imi/ico-check-green.png';
import hide_pass from '../../../img/imi/hide-pass.png';
import show_pass from '../../../img/imi/show-pass.png';
import ico_delete from '../../../img/imi/ico-delete.png';
import { Button } from '@stories/Button/Button';

import CircularProgress from '@material-ui/core/CircularProgress';

const SignUp = () => {
  const formData = {
    firstName: '',
    lastName: '',
    emailInput: '',
    passwordInput: '',
    invitationCode: '',
  };

  const [dataForm, setDataForm] = useState(formData);
  const [checkClickSignUp, setCheckClickSignUp] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [character, setCharacter] = useState();
  const [specialNumber, setSpecialNumber] = useState();
  const [lowercaseUppercase, setLowercaseUppercase] = useState();

  const dispatch = useDispatch();
  const history = useHistory();
  const requestSendLogin = useSelector((state) => {
    return state;
  });

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateCharacter = (password) => {
    var passCharacter = /^(?!.*\s).{8,20}$/;
    return passCharacter.test(password);
  };

  const validateSpecialNumber = (password) => {
    var passSpecialNumber = /(?=.*\d)(?=.*[^a-zA-Z0-9])/;
    return passSpecialNumber.test(password);
  };

  const validateLowercaseUppercase = (password) => {
    var passLowercaseUppercase = /(?=.*[a-z])(?=.*[A-Z])/;
    return passLowercaseUppercase.test(password);
  };

  const validInvatation = (invitation) => {
    if (invitation !== '') {
      return invitation.replace(/^\s+|\s+$/gm, '');
    }
    return false;
  };

  const handleOnChange = (event, fieldName) => {
    if (fieldName === 'passwordInput') {
      let valuePass = event.target.value;
      const checkCharacter = validateCharacter(valuePass);
      const checkSpecialNumber = validateSpecialNumber(valuePass);
      const checkLowercaseUppercase = validateLowercaseUppercase(valuePass);
      if (!checkCharacter) {
        setCharacter('fail');
      } else {
        setCharacter('done');
      }
      if (!checkSpecialNumber) {
        setSpecialNumber('fail');
      } else {
        setSpecialNumber('done');
      }
      if (!checkLowercaseUppercase) {
        setLowercaseUppercase('fail');
      } else {
        setLowercaseUppercase('done');
      }
    }
    setDataForm({ ...dataForm, [fieldName]: event.target.value });
  };
  useEffect(() => {
    if (checkClickSignUp) {
      if (
        requestSendLogin.error.ATTEMPT_REGISTER_FAILED?.code === 400 &&
        requestSendLogin.error.ATTEMPT_REGISTER_FAILED?.errors?.invitation
          ?.msg === `"invitation" must be one of [imi-premium, imi-normal]`
      ) {
        setLoginLoading(false);
        setCheckClickSignUp(false);
        window.alert('Invalid invititation code !');
      } else if (
        requestSendLogin.error.ATTEMPT_REGISTER_FAILED?.code === 409 &&
        requestSendLogin.error.ATTEMPT_REGISTER_FAILED?.errors?.invitation
          ?.msg === `"invitation" must be one of [imi-premium, imi-normal]`
      ) {
        setLoginLoading(false);
        setCheckClickSignUp(false);
        window.alert('Another user with this email already exists !');
      }
    }
    if (checkClickSignUp && requestSendLogin.user?.userCreate?.email) {
      window.alert(
        'You have signed up successfully ! Please check your email for activation.'
      );
      setLoginLoading(false);
      setCheckClickSignUp(false);
      window.location = '/login';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestSendLogin.error]);

  const checkValidRegister = (
    email,
    password,
    invitation,
    firstName,
    lastName
  ) => {
    const checkEmail = validateEmail(email);
    const checkInvatation = validInvatation(invitation);
    if (checkEmail && checkInvatation) {
      return true;
    } else {
      if (!firstName) {
        setLoginLoading(false);
        window.alert('Your first name is Invalid');
        return false;
      }
      if (!lastName) {
        setLoginLoading(false);
        window.alert('Your last name is Invalid');
        return false;
      }
      if (!checkEmail) {
        setLoginLoading(false);
        window.alert('Your email is Invalid');
        return false;
      }
      if (!checkInvatation) {
        setLoginLoading(false);
        window.alert('Invalid invititation code !');
        return false;
      }
      if (!password) {
        setLoginLoading(false);
        window.alert('Your password is Invalid !');
        return false;
      }
    }
  };

  const handleSignUp = () => {
    setLoginLoading(true);
    const request = {
      firstName: dataForm.firstName,
      lastName: dataForm.lastName,
      email: dataForm.emailInput,
      password: dataForm.passwordInput,
      invitationCode: dataForm.invitationCode,
    };
    if (
      checkValidRegister(
        request.email,
        request.password,
        request.invitationCode,
        request.firstName,
        request.lastName
      )
    ) {
      dispatch(
        attemptRegister({
          email: request.email,
          password: request.password,
          firstName: request.firstName,
          lastName: request.lastName,
          role: 'patient',
          invitation: request.invitationCode,
        })
      );
      setCheckClickSignUp(true);
    }
  };
  const onShowPass = () => {
    setShow(!show);
  };

  const handleBackHome = (evt) => {
    if (evt === 1) {
      history.push('/home');
    } else {
      history.push('/login');
    }
  };

  return (
    <div>
      <div>
        <div id="myModalSignUp">
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
                    <h3>Create Account</h3>
                    {/* <div className="link-share">
                      <img src={facebook} />
                      <img src={instagram} />
                      <img src={linked} />
                    </div> */}
                    <p>Please use your email for registration</p>
                  </div>
                  <Styled.LoginBox>
                    <div className="user-box form-group">
                      <svg
                        viewBox="0 0 18 21"
                        fill="#8e949c"
                        width="18"
                        height="21"
                        fillRule="evenodd"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.00001 10C6.23858 10 4.00001 7.76142 4.00001 5C4.00001 2.23858 6.23858 0 9.00001 0C11.7614 0 14 2.23858 14 5C14 7.76142 11.7614 10 9.00001 10ZM9.00001 8C10.6569 8 12 6.65685 12 5C12 3.34315 10.6569 2 9.00001 2C7.34315 2 6.00001 3.34315 6.00001 5C6.00001 6.65685 7.34315 8 9.00001 8ZM0.977676 20.9998C1.52982 21.0121 1.98742 20.5745 1.99976 20.0223C2.12226 14.5373 4.37763 13 8.99995 13C13.8804 13 16.1174 14.5181 15.9954 19.9777C15.9831 20.5298 16.4207 20.9874 16.9729 20.9998C17.525 21.0121 17.9826 20.5745 17.9949 20.0223C18.141 13.4819 15.0479 11 8.99995 11C3.22369 11 0.145765 13.4627 0.000254371 19.9777C-0.0120777 20.5298 0.425529 20.9874 0.977676 20.9998Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <input
                        className="form-control"
                        type="text"
                        name="firstName"
                        autoFocus
                        placeholder="Your first name"
                        onChange={(event) => handleOnChange(event, 'firstName')}
                        required
                      />
                    </div>
                  </Styled.LoginBox>

                  <Styled.LoginBox>
                    <div className="user-box form-group">
                      <svg
                        viewBox="0 0 18 21"
                        fill="#8e949c"
                        width="18"
                        height="21"
                        fillRule="evenodd"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.00001 10C6.23858 10 4.00001 7.76142 4.00001 5C4.00001 2.23858 6.23858 0 9.00001 0C11.7614 0 14 2.23858 14 5C14 7.76142 11.7614 10 9.00001 10ZM9.00001 8C10.6569 8 12 6.65685 12 5C12 3.34315 10.6569 2 9.00001 2C7.34315 2 6.00001 3.34315 6.00001 5C6.00001 6.65685 7.34315 8 9.00001 8ZM0.977676 20.9998C1.52982 21.0121 1.98742 20.5745 1.99976 20.0223C2.12226 14.5373 4.37763 13 8.99995 13C13.8804 13 16.1174 14.5181 15.9954 19.9777C15.9831 20.5298 16.4207 20.9874 16.9729 20.9998C17.525 21.0121 17.9826 20.5745 17.9949 20.0223C18.141 13.4819 15.0479 11 8.99995 11C3.22369 11 0.145765 13.4627 0.000254371 19.9777C-0.0120777 20.5298 0.425529 20.9874 0.977676 20.9998Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <input
                        className="form-control"
                        type="text"
                        name="lastName"
                        placeholder="Your last name"
                        onChange={(event) => handleOnChange(event, 'lastName')}
                        required
                      />
                    </div>
                  </Styled.LoginBox>

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
                        type="email"
                        name="email"
                        placeholder="Your email"
                        onChange={(event) =>
                          handleOnChange(event, 'emailInput')
                        }
                        required
                      />
                    </div>
                  </Styled.LoginBox>

                  <Styled.LoginBox className="position-relative">
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
                        name="password"
                        placeholder="Your Password"
                        type={show ? 'text' : 'password'}
                        onChange={(event) =>
                          handleOnChange(event, 'passwordInput')
                        }
                        required
                      />
                    </div>
                    <div className="ico-show-pass" onClick={onShowPass}>
                      {!show ? (
                        <img
                          style={{
                            width: '32px',
                            height: '32px',
                            top: '12px',
                            right: '12px',
                          }}
                          src={show_pass}
                          alt=""
                        />
                      ) : (
                        <img src={hide_pass} alt="" />
                      )}
                    </div>
                  </Styled.LoginBox>
                  <div className="check-status-pass">
                    {character === 'done' && (
                      <div>
                        <img className="mr-2" src={ico_check} alt="" />
                        Must be 8 characters or more in length
                      </div>
                    )}
                    {character === 'fail' && (
                      <div>
                        <img
                          style={{ width: '18px', height: '18px' }}
                          className="mr-2"
                          src={ico_delete}
                          alt=""
                        />
                        Must be 8 characters or more in length
                      </div>
                    )}
                    {specialNumber === 'done' && (
                      <div>
                        <img className="mr-2" src={ico_check} alt="" />
                        Contain a special character and a number
                      </div>
                    )}
                    {specialNumber === 'fail' && (
                      <div>
                        <img
                          style={{ width: '18px', height: '18px' }}
                          className="mr-2"
                          src={ico_delete}
                          alt=""
                        />
                        Contain a special character and a number
                      </div>
                    )}
                    {lowercaseUppercase === 'done' && (
                      <div>
                        <img className="mr-2" src={ico_check} alt="" />
                        Contain at least a lowercase and an uppercase character
                      </div>
                    )}
                    {lowercaseUppercase === 'fail' && (
                      <div>
                        <img
                          style={{ width: '18px', height: '18px' }}
                          className="mr-2"
                          src={ico_delete}
                          alt=""
                        />
                        Contain at least a lowercase and an uppercase character
                      </div>
                    )}
                  </div>
                  <Styled.LoginBox>
                    <div className="user-box form-group">
                      <img src={securitySignup} style={{ width: '27px' }} />
                      <input
                        className="form-control"
                        type="password"
                        name="invitationCode"
                        placeholder="Invititation Code"
                        onChange={(event) =>
                          handleOnChange(event, 'invitationCode')
                        }
                        required
                      />
                    </div>
                  </Styled.LoginBox>
                  <div className="gr-btn-signUp">
                    <Button
                      className="btn-signup mT10"
                      label="Register"
                      loading={loginLoading}
                      onClick={() => handleSignUp()}
                    />
                  </div>

                  <span
                    style={{
                      display: 'block',
                      marginTop: '10px',
                      color: 'black',
                      fontSize: '12px',
                    }}
                  >
                    {' '}
                    Have an account?{' '}
                    <Link
                      to="/login"
                      className="close-modal "
                      style={{
                        color: '#007bff',
                        fontSize: '14px',
                        fontWeight: '550',
                        cursor: 'pointer',
                      }}
                    >
                      Login
                    </Link>
                  </span>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <p>Version 2.0.1</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row desktop">
        <div className="col-8 col-md-8 col-lg-8 p0">
          <div className="modal-login modal-login-dektop">
            <div className="content-login">
              <div className="modal-body modalMenu">
                <div className="login-box row">
                  <div className="col-6 mx-auto col-lg-6 col-md-6">
                    <form>
                      <div className="top-form">
                        <h3 className="font-size40">Create Account</h3>
                        <p>Please use your email for registration</p>
                      </div>
                      <Styled.LoginBox>
                        <div className="user-box">
                          <img src={userAccount} />
                          <input
                            className="form-control"
                            id="firstName"
                            type="text"
                            name="firstName"
                            placeholder="Your first name"
                            autoFocus
                            onChange={(event) =>
                              handleOnChange(event, 'firstName')
                            }
                            required
                          />
                        </div>
                      </Styled.LoginBox>
                      <Styled.LoginBox>
                        <div className="user-box">
                          <img src={userAccount} />
                          <input
                            className="form-control"
                            id="lastName"
                            type="text"
                            name="lastName"
                            placeholder="Your last name"
                            onChange={(event) =>
                              handleOnChange(event, 'lastName')
                            }
                            required
                          />
                        </div>
                      </Styled.LoginBox>
                      <Styled.LoginBox>
                        <div className="user-box login-register">
                          <img src={email} />
                          <input
                            className="form-control"
                            id="email"
                            type="email"
                            placeholder="Your Email"
                            name="email"
                            onChange={(event) =>
                              handleOnChange(event, 'emailInput')
                            }
                            required
                          />
                        </div>
                      </Styled.LoginBox>
                      <Styled.LoginBox className="position-relative">
                        <div className="user-box login-register">
                          <img src={password} />
                          <input
                            className="form-control"
                            id="passwordRegis"
                            type={show ? 'text' : 'password'}
                            name="password"
                            placeholder="Your Password"
                            onChange={(event) =>
                              handleOnChange(event, 'passwordInput')
                            }
                            required
                          />
                        </div>
                        <div className="ico-show-pass" onClick={onShowPass}>
                          {!show ? (
                            <img
                              style={{
                                width: '32px',
                                height: '32px',
                                top: '12px',
                                right: '12px',
                              }}
                              src={show_pass}
                              alt=""
                            />
                          ) : (
                            <img src={hide_pass} alt="" />
                          )}
                        </div>
                      </Styled.LoginBox>
                      <div className="check-status-pass">
                        {character === 'done' && (
                          <div>
                            <img className="mr-2" src={ico_check} alt="" />
                            Must be 8 characters or more in length
                          </div>
                        )}
                        {character === 'fail' && (
                          <div>
                            <img
                              style={{ width: '18px', height: '18px' }}
                              className="mr-2"
                              src={ico_delete}
                              alt=""
                            />
                            Must be 8 characters or more in length
                          </div>
                        )}
                        {specialNumber === 'done' && (
                          <div>
                            <img className="mr-2" src={ico_check} alt="" />
                            Contain a special character and a number
                          </div>
                        )}
                        {specialNumber === 'fail' && (
                          <div>
                            <img
                              style={{ width: '18px', height: '18px' }}
                              className="mr-2"
                              src={ico_delete}
                              alt=""
                            />
                            Contain a special character and a number
                          </div>
                        )}
                        {lowercaseUppercase === 'done' && (
                          <div>
                            <img className="mr-2" src={ico_check} alt="" />
                            Contain at least a lowercase and an uppercase
                            character
                          </div>
                        )}
                        {lowercaseUppercase === 'fail' && (
                          <div>
                            <img
                              style={{ width: '18px', height: '18px' }}
                              className="mr-2"
                              src={ico_delete}
                              alt=""
                            />
                            Contain at least a lowercase and an uppercase
                            character
                          </div>
                        )}
                      </div>
                      <Styled.LoginBox>
                        <div className="user-box login-register">
                          <img src={securitySignup} style={{ width: '27px' }} />
                          <input
                            className="form-control"
                            type="password"
                            name="invitationCode"
                            placeholder="Invititation Code"
                            onChange={(event) =>
                              handleOnChange(event, 'invitationCode')
                            }
                            required
                          />
                        </div>
                      </Styled.LoginBox>
                      <div className="d-flex justify-content-center">
                        <Button
                          className="btn-backToHome backToHome-sign-up"
                          label="Back to Home"
                          onClick={() => handleBackHome(1)}
                        />
                        <div className="gr-btn-signUp">
                          <Button
                            className="btn-signup"
                            label="Register"
                            loading={loginLoading}
                            onClick={() => handleSignUp()}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4 col-md-4 col-lg-4 p0">
          <div className="main-left-login">
            <h3>Welcome Back!</h3>
            <p>
              To keep connected with us please login <br />
              with your personal info
            </p>
            <Button
              className="btn-submit mT10"
              label="Login"
              onClick={() => handleBackHome(2)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
