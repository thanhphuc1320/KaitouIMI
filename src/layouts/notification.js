import React from 'react';
const Notification = props => (
  <div className="login-wrapper">
    <div className="login-fields text-center">
      <h3>
        <i className="material-icons">email</i>
      </h3>

      <div className="pt20">
        <p>{props.content}</p>
      </div>
    </div>
  </div>
);

export default Notification;
