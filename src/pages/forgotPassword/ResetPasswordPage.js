/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect, withRouter } from 'react-router-dom';
import qs from 'query-string';

import ResetPassword from '../../layouts/forgot-password/resetPassword';
import { resetPassword } from '../../store/actions/forgotPassword.action';
import { attemptLogout } from '../../store/actions/auth.action';
import {
  PASSWORD_DOES_NOT_SATISFY_REQUIREMENT,
  PASSWORD_DOES_NOT_MATCH,
  ERRORS,
  UNKNOWN_ERROR,
  TOKEN_KEY,
  RESET_PASSWORD_FAILED,
} from '../../constant';
import { validatePassword } from '../../utils';
import Notification from '../../layouts/notification';

class ResetPasswordPage extends Component {
  constructor(props) {
    super(props);
    const value = qs.parse(this.props.location.search);
    const { email, token } = value;
    this.state = {
      email: {
        value: email,
        error: null,
      },
      password: {
        value: null,
        error: null,
      },
      confirmedPassword: {
        value: null,
        error: null,
      },
      serverError: {
        error: null,
      },
      token: token,
      resetClick: false,
    };
  }

  UNSAFE_componentWillMount() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      setTimeout(() => {
        this.props.attemptLogout();
        localStorage.removeItem(TOKEN_KEY);
      }, 300);
    }
  }

  onClick(e) {
    const currentState = { ...this.state };
    const { error } = this.props || {};
    let { password, confirmedPassword, token, email, errorReset} = {
      ...currentState,
    };

    password.error = null;
    confirmedPassword.error = null;
    email.error = null;
    errorReset = true;

    if (password.value === null || password.value === '') {
      password.error = 'Please enter your password';
      currentState.password = password;
    }

    const isValid = validatePassword(password.value);
    if (!isValid){
      window.alert('The password must be 9 characters or more in length and contain a special character, a number, a lowcase character and an uppercase character')
      return;
    }

    if (confirmedPassword.value === null || confirmedPassword.value === '') {
      confirmedPassword.error = 'Please confirm your password';
      currentState.confirmedPassword = confirmedPassword;
      window.alert('Please confirm your password');
    }

    if (confirmedPassword.value !== password.value){
      window.alert('Password does not match')
      return;
    }

    if (
      password.value !== confirmedPassword.value ||
      (password.value !== null && confirmedPassword.value === null)
    ) {
      confirmedPassword.error = 'Password does not match';
      currentState.confirmedPassword = confirmedPassword;
    }

    if (!password.error && !confirmedPassword.error) {
      this.props.resetPassword({
        password: password.value,
        confirmedPassword: confirmedPassword.value,
        email: email.value,
        token,
      });
    }

    this.setState(currentState, () => {});
  }

  validateField(fieldName, currentState, validateFunction, error) {
    const object = { ...currentState[fieldName] };
    const isFieldValid = validateFunction(object.value);
    if (!isFieldValid){
      object.error = error;
    }else {object.error = null;

    }

    currentState[fieldName] = object;
  }

  validateConfirmedPassword(currentState, error) {
    const confirmedPasswordObject = { ...currentState.confirmedPassword };
    const passwordObject = { ...currentState.password };
    if (passwordObject.value === confirmedPasswordObject.value)
      {
      confirmedPasswordObject.error = null;}
    else {
      confirmedPasswordObject.error = error;
    }

    currentState.confirmedPassword = confirmedPasswordObject;
  }

  handleChange(e) {
    const currentState = { ...this.state };
    const { password, confirmedPassword, email } = { ...currentState };
    const { name } = e.target;
    const { error } = this.props || {};
    error[RESET_PASSWORD_FAILED] = {};

    password.error = '';
    confirmedPassword.error = '';
    email.error = '';

    switch (name) {
      case 'password':
        password.value = e.target.value;
        currentState.password = password;
        this.validateField(
          'password',
          currentState,
          validatePassword,
          PASSWORD_DOES_NOT_SATISFY_REQUIREMENT,

        );
        break;
      case 'confirmedPassword':
        confirmedPassword.value = e.target.value;
        currentState.confirmedPassword = confirmedPassword;
        this.validateConfirmedPassword(currentState, PASSWORD_DOES_NOT_MATCH);
        break;
      default:
        break;
    }

    this.setState(currentState, () => {});
  }

  render() {
    const { user, error } = this.props || {};
    const { errors } = error[RESET_PASSWORD_FAILED] || {};
    const { emailConfirmation } = user || {};
    const { email, password, resetClick, confirmedPassword, serverError, formSubmit } = {
      ...this.state,
    };
    const content = `Congratulation, you have successfully changed your password, You will be redirected to Login Page in a few seconds!`;

    // Email Error
    if (errors && errors.email) {
      email.error = ERRORS.email[errors.email.msg] || UNKNOWN_ERROR;
    }

    // Password Error
    if (errors && errors.password) {
      password.error = ERRORS.password[errors.password.msg] || UNKNOWN_ERROR;
    }

    console.log('error.RESET_PASSWORD_FAILED: ', error.RESET_PASSWORD_FAILED?.password);
    if (error.RESET_PASSWORD_FAILED?.password){
      window.alert("New password cannot be the same as the old password");
    }
    // Server Error
    if (errors && errors.server) {
      // FIX_ME
      serverError.error = ERRORS.server[errors.server.msg] || UNKNOWN_ERROR;
    }

    if (!resetClick && emailConfirmation) {
      setTimeout(() => this.setState({ resetClick: true }), 3000);
      const value = qs.parse(this.props.location.search);
      const { token } = value;
      // localStorage.setItem('userToken', token);
      return <Notification content={content} />;
    }
    return emailConfirmation && resetClick ? (
      <Redirect to="/login"/>
    ) : (
      <ResetPassword
        handleChange={(e) => this.handleChange(e)}
        onClick={(e) => this.onClick(e)}
        email={email}
        password={password}
        confirmedPassword={confirmedPassword}
        serverError={serverError}
      />
    );
  }
}

// Store
function mapStateToProps(state) {
  return {
    user: state.user,
    error: state.error,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({ attemptLogout, resetPassword }, dispatch);
}

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(withRouter(ResetPasswordPage));
