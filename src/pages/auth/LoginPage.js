/* eslint-disable react/prop-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect, withRouter } from 'react-router-dom';

import Login from '../../layouts/auth/login';
import { attemptLogin } from '../../store/actions/auth.action';
import {
  LOGIN_URI,
  EMAIL_IS_IN_WRONG_FORMAT,
  ERRORS,
  UNKNOWN_ERROR,
  ATTEMPT_LOGIN_FAILED,
} from '../../constant';
import { validateEmail } from '../../utils';

class LoginPage extends Component {
  // TODO: This is a skeleton to refractor to React Hooks
  // const user = useSelector((state) => state.user);
  // const dispatch = useDispatch();

  // const initialState = {
  //   value: null,
  //   error: null,
  // };

  // const [email, setEmail] = useState(initialState);
  // const [password, setPassword] = useState(initialState);
  // const [serverMessage, setServerMessage] = useState(initialState);

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
      // Error from server
      serverError: {
        error: null,
      },
    };
  }

  onClick(e) {
    const currentState = { ...this.state };
    const { email, password } = { ...currentState };

    // Reset Error
    email.error = null;
    password.error = null;

    if (email.value === null || email.value === '') {
      email.error = 'Please enter your email';
      currentState.email = email;
    }
    if (password.value === null || password.value === '') {
      password.error = 'Please enter your password';
      currentState.password = password;
    }
    if (
      !email.error &&
      email.value !== null &&
      !password.error &&
      password.value !== null
    ) {
      this.props.attemptLogin({ email: email.value, password: password.value });
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
    const { email, password, serverError } = { ...currentState };
    const { name } = e.target;
    const { error } = this.props || {};
    error[ATTEMPT_LOGIN_FAILED] = {};
    serverError.error = '';
    password.error = '';
    email.error = '';

    switch (name) {
      case 'email':
        email.value = e.target.value;
        currentState.email = email;
        this.validateField(
          'email',
          currentState,
          validateEmail,
          EMAIL_IS_IN_WRONG_FORMAT
        );
        break;
      case 'password':
        password.value = e.target.value;
        currentState.password = password;
        break;
      default:
        break;
    }

    this.setState(currentState, () => {});
  }

  render() {
    // If login sucessfully, Only redirect to '/' when current path is login.
    // Otherwise, keep current path and do not redirect

    const { user, location, error } = this.props || {};
    const { errors } = error[ATTEMPT_LOGIN_FAILED] || {};
    const { token } = user;
    const { email, password, serverError } = { ...this.state };

    const isLoginPath = location.pathname === LOGIN_URI;

    // Get Error From Server;

    // Email Error
    if (errors && errors.email) {
      email.error = ERRORS.email[errors.email.msg] || UNKNOWN_ERROR;
    }

    // Password Error
    if (errors && errors.password) {
      password.error = ERRORS.password[errors.password.msg] || UNKNOWN_ERROR;
    }

    // FIXME:
    // Server Error
    if (errors && errors.server)
      serverError.error = ERRORS.server[errors.server.msg] || UNKNOWN_ERROR;

    return token && isLoginPath ? (
      <Redirect to="/" />
    ) : (
      <Login
        handleChange={(e) => this.handleChange(e)}
        onClick={(e) => this.onClick(e)}
        email={email}
        password={password}
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
  return bindActionCreators({ attemptLogin }, dispatch);
}

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(withRouter(LoginPage));
