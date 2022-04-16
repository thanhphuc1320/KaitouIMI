/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import ForgotPassword from '../../layouts/forgot-password/forgotPassword';
import Notification from '../../layouts/notification';
import { forgotPassword } from '../../store/actions/forgotPassword.action';
import {
  EMAIL_IS_IN_WRONG_FORMAT,
  ERRORS,
  UNKNOWN_ERROR,
  FORGOT_PASSWORD_URI,
  FORGOT_PASSWORD_FAILED,
} from '../../constant';
import { validateEmail } from '../../utils';

class ForgotPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: {
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
    const email = { ...currentState.email };

    // Reset Error
    email.error = '';

    if (email.value === null || email.value === '') {
      email.error = 'Please enter your email';
      currentState.email = email;
    }
    if (!email.error) {
      this.props.forgotPassword({ email: email.value });
    }

    this.setState(currentState, () => {});
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
    const email = { ...currentState.email };

    email.error = '';
    const { error } = this.props || {};
    error[FORGOT_PASSWORD_FAILED] = {};

    if (e.target.name === 'email') {
      email.value = e.target.value;
      currentState.email = email;
      this.validateField(
        'email',
        currentState,
        validateEmail,
        EMAIL_IS_IN_WRONG_FORMAT
      );
    }

    this.setState(currentState, () => {});
  }

  render() {
    const { user, location, error } = this.props || {};
    const { errors } = error[FORGOT_PASSWORD_FAILED] || {};
    const { email, serverError } = { ...this.state };
    const { emailConfirmation } = user || {};

    const isForgotPasswordPath = location.pathname === FORGOT_PASSWORD_URI;
    const content =
      'Email with a reset-password link has been sent, please check your mail box to change your password. Thanks!';

    // Email Error
    if (errors && errors.email) {
      email.error = ERRORS.email[errors.email.msg] || UNKNOWN_ERROR;
    }

    // Server Error
    if (errors && errors.server) {
      // FIX_ME
      serverError.error = ERRORS.server[errors.server.msg] || UNKNOWN_ERROR;
    }

    return emailConfirmation && isForgotPasswordPath ? (
      <Notification content={content} />
    ) : (
      <ForgotPassword
        handleChange={(e) => this.handleChange(e)}
        onClick={(e) => this.onClick(e)}
        email={email}
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
  return bindActionCreators({ forgotPassword }, dispatch);
}

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(withRouter(ForgotPasswordPage));
