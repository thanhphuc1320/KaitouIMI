import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import AddOutlined from '@material-ui/icons/AddOutlined';
import AvatarDropdown from './avatarDropdown';
import defaultAva from '../img/d_ava.png';

class Header extends Component {
  render() {
    const { user } = this.props || {};

    const button_style = {
      borderRadius: 5,
      border: 0,
      fontFamily: 'Nunito, sans-serif',
      fontWeight: '600',
      outline: 'none',
      padding: '5px 30px',
      textTransform: 'none',
      background: 'none',
      border: '1px solid #23c8aa',
    };

    const avatarUrl = user.avatarUrl || defaultAva;
    const email = user.email;
    return (
      <header className="an-header">
        <div className="header-right">
          {user.role === 'patient' && (
            <Button href="/create-request" style={button_style} color="primary">
              {' '}
              <AddOutlined />
            </Button>
          )}
          {(user.token || user.email) && (
            <AvatarDropdown avatarUrl={avatarUrl} email={email} />
          )}
        </div>
      </header>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Header);
