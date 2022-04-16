import React from 'react';

// Material UI
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

const Login = props => {
  const { serverError, email, handleChange, password, onClick } = props;
  const style = {
    background: '#23c8aa',
  };

  return (
    <div>
      <div className="login-wrapper">
        <div className="login-fields">
          <h3>Login {/* <a href="">Forgot Password?</a> */}</h3>
          {serverError && serverError.error && (
            <p style={styles.textFieldMessageError}>{serverError.error}</p>
          )}
          <TextField
            id="email"
            floatingLabelText="Email"
            fullWidth
            onChange={handleChange}
            value={email.value}
            name="email"
          />
          {email.error && (
            <p style={styles.textFieldMessageError}>{email.error}</p>
          )}
          <TextField
            id="pass"
            floatingLabelText="Password"
            fullWidth
            onChange={handleChange}
            value={password.value}
            name="password"
            type="password"
          />
          {password.error && (
            <p style={styles.textFieldMessageError}>{password.error}</p>
          )}

          <h3>
            <a href="/forgot-password" style={{ paddingLeft: 0 }}>
              Forgot Password?
            </a>
            <a href="/signup"> Don't have an account?</a>
          </h3>

          <div className="pt20">
            <RaisedButton
              style={style}
              onClick={onClick}
              primary
              fullWidth
              label="Login"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
