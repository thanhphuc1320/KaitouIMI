/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import Register from '../../layouts/auth/register';
import Notification from '../../layouts/notification';

import { attemptRegister } from '../../store/actions/auth.action';
import {
  EMAIL_IS_IN_WRONG_FORMAT,
  PASSWORD_DOES_NOT_SATISFY_REQUIREMENT,
  ERRORS,
  UNKNOWN_ERROR,
  PASSWORD_DOES_NOT_MATCH,
  ATTEMPT_REGISTER_FAILED,
} from '../../constant';
import { validateEmail, validatePassword } from '../../utils';

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: {
        value: null,
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
      // Error from server
      serverError: {
        error: null,
      },
    };
  }

  onClick(e) {
    const currentState = { ...this.state };
    const { email, password, confirmedPassword } = { ...currentState };

    // Reset Error
    email.error = null;
    password.error = null;
    confirmedPassword.error = null;

    if (email.value === null || email.value === '') {
      email.error = 'Please enter your email';
      currentState.email = email;
    }

    if (password.value === null || password.value === '') {
      password.error = 'Please enter your password';
      currentState.password = password;
    }

    if (
      password.value !== confirmedPassword.value ||
      (password.value !== null && confirmedPassword.value === null)
    ) {
      confirmedPassword.error = 'Password does not match';
      currentState.confirmedPassword = confirmedPassword;
    }

    if (!email.error && !password.error && !confirmedPassword.error) {
      this.props.attemptRegister({
        email: email.value,
        password: password.value,
        role: 'patient',
      });
    }
    this.setState(currentState, () => {});
  }

  validateConfirmedPassword(currentState, error) {
    const confirmedPasswordObject = { ...currentState.confirmedPassword };
    const passwordObject = { ...currentState.password };
    if (passwordObject.value === confirmedPasswordObject.value)
      confirmedPasswordObject.error = null;
    else confirmedPasswordObject.error = error;

    currentState.confirmedPassword = confirmedPasswordObject;
  }

  validateField(fieldName, currentState, validateFunction, error) {
    const object = { ...currentState[fieldName] };
    const isFieldValid = validateFunction(object.value);
    if (!isFieldValid) {
      object.error = error;
    } else {
      object.error = null;
    }
    currentState[fieldName] = object;
  }

  handleChange(e) {
    const currentState = { ...this.state };
    const { email, password, confirmedPassword, serverError } = {
      ...currentState,
    };
    const { name } = e.target;
    let { error } = this.props || {};

    // email.error = '';
    // password.error = '';
    // confirmedPassword.error = '';

    serverError.error = '';
    error[ATTEMPT_REGISTER_FAILED] = {};

    if (name === 'email') {
      email.value = e.target.value;
      currentState.email = email;
      this.validateField(
        'email',
        currentState,
        validateEmail,
        EMAIL_IS_IN_WRONG_FORMAT
      );
    }
    if (name === 'password') {
      password.value = e.target.value;
      currentState.password = password;
      this.validateField(
        'password',
        currentState,
        validatePassword,
        PASSWORD_DOES_NOT_SATISFY_REQUIREMENT
      );
    }

    if (name === 'confirmedPassword') {
      confirmedPassword.value = e.target.value;
      currentState.confirmedPassword = confirmedPassword;
      this.validateConfirmedPassword(currentState, PASSWORD_DOES_NOT_MATCH);
    }

    this.setState(currentState, () => {});
  }

  render() {
    const { user, location, error } = this.props || {};
    const { errors } = error[ATTEMPT_REGISTER_FAILED] || {};
    const accepted = user.accepted ? user.accepted : [];
    const { email, password, confirmedPassword, serverError } = {
      ...this.state,
    };
    const isRegisterPath = location.pathname === '/signup';
    const content =
      'Email has been sent to verify your email, please check your mail box. Thanks!';

    console.log(errors);
    // Email Error
    if (errors && errors.email) {
      email.error = ERRORS.email[errors.email.msg] || UNKNOWN_ERROR;
    }

    // Password Error
    if (errors && errors.password) {
      password.error = ERRORS.password[errors.password.msg] || UNKNOWN_ERROR;
    }

    // Server Error
    if (errors && errors.server) {
      // FIX_ME
      serverError.error = ERRORS.server[errors.server.msg] || UNKNOWN_ERROR;
    }

    // Redirect to confirmation page
    return isRegisterPath && accepted.length ? (
      <Notification content={content} />
    ) : (
      <Register
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
  return bindActionCreators({ attemptRegister }, dispatch);
}

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(withRouter(RegisterPage));
