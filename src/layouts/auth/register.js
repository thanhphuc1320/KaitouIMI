import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
  },
  loginError: {
    borderRadius: '4px',
    textAlign: 'center',
    padding: '4px 0px 4px 0px',
    margin: '0px',
    background: 'rgb(255, 157, 68)',
    p: {
      margin: '0px',
      color: 'white',
    },
  },
  textFieldMessageError: {
    color: 'rgb(255, 54, 52)',
    fontWeight: '600',
  },
};

const Register = props => {
  const style = {
    background: '#23c8aa',
  };

  return (
    <div>
      <div className="login-wrapper">
        <div className="login-fields">
          <h3>Register</h3>
          <TextField
            id="email"
            floatingLabelText="Email"
            fullWidth
            onChange={props.handleChange}
            value={props.email.value}
            type="email"
            name="email"
          />
          {props.email.error && (
            <p style={styles.textFieldMessageError}>{props.email.error}</p>
          )}
          <TextField
            id="pass"
            floatingLabelText="Password"
            fullWidth
            onChange={props.handleChange}
            value={props.password.value}
            type="password"
            name="password"
          />
          {props.password.error && (
            <p style={styles.textFieldMessageError}>{props.password.error}</p>
          )}

          <TextField
            id="confirmedPassword"
            floatingLabelText="Confirmed your password"
            fullWidth
            onChange={props.handleChange}
            value={props.confirmedPassword.value}
            name="confirmedPassword"
            type="password"
          />

          {props.confirmedPassword.error && (
            <p style={styles.textFieldMessageError}>
              {props.confirmedPassword.error}
            </p>
          )}

          <div className="pt20">
            <RaisedButton
              style={style}
              onClick={props.onClick}
              primary
              fullWidth
              label="Sign Up"
            />
          </div>
          <br />
          <a href="/login">Already have an account?</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
