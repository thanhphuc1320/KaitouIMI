import React, { useState, useEffect } from 'react';
import { NavLink,Link, useHistory  } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import { sendForgotPassword } from '../../../store/actions/user.action';

import * as Styled from './styled';
import email from '../../img/email.png';
import logoAccount from "../../img/logo-account.png"
import closeAccount from "../../img/close-account.png"
import CircularProgress from '@material-ui/core/CircularProgress';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const requestSendEmail = useSelector((state) => {
    return state.user
  });
  const [emailInput, setEmailInput] = useState('');
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const handleOnChange = event => {
    setEmailInput(event.target.value)
  }
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const checkMail = validateEmail(emailInput)
  const forgotPassword = (event) => {
    setLoginLoading(true)
    if(checkMail){
      event.preventDefault();
      setIsSendEmail(true)
      dispatch(sendForgotPassword({ email: emailInput }))
    }else{
      setLoginLoading(false)
      window.alert("Your email is Invalid")
    }

  }

  useEffect(() => {
    if (requestSendEmail.createUserResponse && isSendEmail) {
    setLoginLoading(false)
      Swal.fire({
        title: 'An email has been sent to you with password reset instructions!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        icon: 'success',
        timerProgressBar: true,
      }).then((result) => {
        history.push('/home')
      })
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestSendEmail]);

  return (
    <div>
      <div id="modal-forgot">
        <div className="modal-content">
          <div className="modal-header">
            <img src={logoAccount} className="modal-logo" />
            <Link to="/home" className="close-modal">
              <img src={closeAccount} className="close" id="modal-forgot-close-btn"/>
            </Link>
          </div>
          <div className="modal-body modalMenu">
            <div className="login-box">
              <form onSubmit={(event) => forgotPassword(event, false)}>
                <div className="top-form">
                  <h3>Enter your mail</h3>
                </div>
                <Styled.LoginBox>
                  <div className="user-box form-group">
                    <img src={email} />
                    <input type="email" name="email" placeholder="Your email" className="form-control" required onChange={(event) => handleOnChange(event)}/>
                  </div>
                </Styled.LoginBox>
                <button type="submit" className="btn-signup" disabled={isSendEmail}>
                  <span id="forgot-loading" className="spinner-border spinner-border-sm mr-1" role="status"
                    aria-hidden="true"></span>
                      {loginLoading ? (
                          <CircularProgress className="isLoadingProgress" />
                        ) : null}
                    Confirm
                </button>
              </form>
            </div>
          </div>
          <div className="modal-footer">
            <p>Version 2.0.1</p>
          </div>
        </div>
      </div>
      <div className="row desktop">
        <div className="col-4 col-md-4 col-lg-4 p0">
          <div className="main-left-login">
            <h3>Hello, Friend! </h3>
            <p>Enter your personal detail and let we help <br /> you take care your health</p>
            <NavLink to="/sign-up" className="btn-signup mT10">Register</NavLink>
          </div>
        </div>
        <div className="col-8 col-md-8 col-lg-8 p0">
          <div className="modal-login modal-login-dektop">
            <div className="content-login">
              <div className="modal-body modalMenu">
                <div className="login-box row">
                  <div className="col-6 mx-auto col-lg-6 col-md-6">
                    <form onSubmit={(event) => forgotPassword(event, false)}>
                      <div className="top-form">
                        <h3 className="font-size30">Enter your email</h3>
                      </div>
                      <Styled.LoginBox>
                        <div className="user-box form-group">
                          <img src={email} />
                          <input
                          type="email"
                          name="email"
                          placeholder="Your email"
                          required
                          onChange={(event) => handleOnChange(event)}
                          className="form-control"/>
                        </div>
                      </Styled.LoginBox>
                      <button type="submit" className="btn-signup mT10">
                        <span id="forgot-loading" className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                        {loginLoading ? (
                          <CircularProgress className="isLoadingProgress" />
                        ) : null}
                        Confirm
                      </button>
                    </form>
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
export default ForgotPassword;
