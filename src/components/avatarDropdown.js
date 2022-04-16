import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { attemptLogout } from '../store/actions/auth.action';
import { TOKEN_KEY } from '../constant';
import defaultAva from '../img/d_ava.png';

class AvatarDropdown extends Component {
  constructor() {
    super();
    this.state = {
      toggle: false,
    };
    this.showProfile = this.showProfile.bind(this);
    // For hide dropdown when click outside of the component
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ toggle: false });
    }
  }

  showProfile() {
    this.setState({ toggle: !this.state.toggle });
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.props.attemptLogout();
  }

  render() {
    const toggleProfile = classNames({
      'slide-content': true,
      profile: true,
      toggle: this.state.toggle,
    });

    const avatarUrl = this.props.avatarUrl || defaultAva;
    const email = this.props.email || '';
    return (
      <div ref={this.setWrapperRef}>
        <div className="notification-wrapper">
          <button onClick={this.showProfile}>
            <Avatar
              src={avatarUrl}
              size={35}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'cover',
              }}
            />
          </button>
          <div className={toggleProfile}>
            <div className="inner-title">
              Profile <div>{email}</div>
            </div>

            <div className="profile-links">
              <a href="/view-profile">
                <i className="material-icons face">face</i> View Profile
              </a>
              <a href="/update-profile">
                <i className="material-icons edit">edit</i> Update Profile
              </a>
              <a href="/" onClick={() => this.logout()}>
                <i className="material-icons sign-out">power_settings_new</i>{' '}
                Sign out
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({ attemptLogout }, dispatch);
}

export default connect(null, matchDispatchToProps)(AvatarDropdown);
