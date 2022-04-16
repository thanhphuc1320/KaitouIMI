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

const ForgotPassword = props => (
  <div className="login-wrapper">
    <div className="login-fields">
      <h3>Enter your mail</h3>
      {props.serverError && props.serverError.error && (
        <p style={styles.textFieldMessageError}>{props.serverError.error}</p>
      )}
      <TextField
        id="email"
        name="email"
        floatingLabelText="Email"
        fullWidth
        onChange={props.handleChange}
        value={props.email.value}
        type="email"
      />
      {props.email.error && (
        <p style={styles.textFieldMessageError}>{props.email.error}</p>
      )}
      <div className="pt20">
        <RaisedButton
          label="Confirm"
          onClick={props.onClick}
          primary
          fullWidth
        />
      </div>
    </div>
  </div>
);

export default ForgotPassword;
