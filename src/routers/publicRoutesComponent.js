/* eslint-disable max-classes-per-file */
import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TOKEN_KEY } from '../constant';

import LandingContainer from '@containers/landing';
import LoginContainer from '@containers/login';
import ForgotPassword from '@containers/forgotPassword';
import SignUpContainer from '@containers/sign-up';
import HealthContainer from '@containers/health';

import ForgotPasswordPage from '../pages/forgotPassword/ForgotPasswordPage';
import ResetPasswordPage from '../pages/forgotPassword/ResetPasswordPage';

export default function PublicRoutesComponent() {
  const history = useHistory();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.token && user.role && history.location.pathname !== '/reset-password' && localStorage.getItem(TOKEN_KEY)) {
      history.replace('/');
    } else if ((!user.token && !user.role && history.location.pathname === '/login' && localStorage.getItem(TOKEN_KEY))
      || (history.location.pathname === '/v2/users/confirm' && !localStorage.getItem(TOKEN_KEY))
      && history.location.pathname !== '/reset-password') {
      history.replace('/login');
    } else if ((history.location.pathname === '/')) {
      history.replace("/home")
    }
  }, [user.token]);

  return (
    <div>
      <Switch>
        <Route exact path="/home" component={LandingContainer} />
        <Route exact path="/login" component={LoginContainer} />
        <Route exact path="/forgotPassword" component={ForgotPassword} />
        <Route exact path="/sign-up" component={SignUpContainer} />
        <Route exact path="/health" component={HealthContainer} />
        <Route exact path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
      </Switch>
    </div>
  );
}
