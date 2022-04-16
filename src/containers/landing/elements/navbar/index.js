import React, { useState } from 'react';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Login from '../../../login';

// assests
import './menu-animation.css';
import logo from '../../../img/logo-footer.png';
import close_btn from '../../../img/close.png';
import logout_btn from '../../../img/logout.png';
import { Button } from '@stories/Button/Button';
import * as Styled from './styled';
import { NavLink, Link, useHistory } from 'react-router-dom';

const Navbar = () => {
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const [isActive, setIsActive] = useState(false);

  let menuItems = [
    { name: 'Home', path: '/home', active: true },
    { name: 'About us', path: '/health', active: false },
    { name: 'Product', path: '/home', active: false },
    { name: 'Pricing', path: '/home', active: false },
    { name: 'Contact', path: '/home', active: false },
  ];

  const handleLogin = (type) => {
    if (type === 1) {
      window.location = '/login';
    } else {
      history.push('/sign-up');
    }
    // TODO: redirect to login page
  };

  const onChangePageLanguage = (evt) => {
    // TODO: handle on change page language
    // for now, only support Vietnamese
  };

  const onClickMenuItem = (item) => {
    setIsActive(true);

    // set all item active status to false
    menuItems = menuItems.map((elm) => {
      return { ...elm, active: elm.path === item.path ? true : false };
    });

    history.push(item.path);

    if (item.path === '/home') {
      setShowMenu(false);
    }
  };

  let boxClass = ['nav-item'];

  // useEffect=(() => {

  // }, [isActive])

  const renderMenu = () => (
    <ReactCSSTransitionGroup
      transitionName="menu"
      transitionAppear={true}
      transitionLeave={false}
      transitionEnter={false}
      transitionAppearTimeout={300}
    >
      <Styled.MenuContainer>
        <Styled.MenuContent>
          <div className="menu__header">
            <img src={logo} className="logo" />
            <img
              src={close_btn}
              className="close"
              onClick={() => setShowMenu(false)}
            />
          </div>

          <Styled.MobileMenu>
            {menuItems.map((item, index) => (
              <Styled.MobileMenuItem key={index}>
                <a
                  className={`nav-item ${item.active && 'active'}`}
                  onClick={() => onClickMenuItem(item)}
                >
                  {item.name}
                </a>
              </Styled.MobileMenuItem>
            ))}

            <Styled.MobileMenuItem>
              <NavLink to="/login">Login</NavLink>
            </Styled.MobileMenuItem>

            <Styled.MobileMenuItem>
              {/* <button type="button" className="btn-sign btn-signMobile">
                Sign up
              </button> */}
              {/* <NavLink to="/sign-up" className="btn-sign btn-signMobile">
                Sign up
              </NavLink> */}
              <Button
                className="btn-sign btn-signMobile"
                onClick={() => handleLogin(2)}
                label="Sign up"
              />
            </Styled.MobileMenuItem>

            {/* <Styled.MobileMenuItem>
              <p className="menu__btn-logout">
                <img src={logout_btn} />
                &nbsp; Logout
              </p>
            </Styled.MobileMenuItem> */}
          </Styled.MobileMenu>

          <div className="menu__footer">
            <p>Version 2.0.1</p>
          </div>
        </Styled.MenuContent>
      </Styled.MenuContainer>
    </ReactCSSTransitionGroup>
  );

  return (
    <>
      {showMenu && renderMenu()}
      <nav className="navbar navbar-expand-lg navbar-light">
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setShowMenu(true)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <a className="navbar-brand mR0">
          <img src={logo} className="logo" alt="logo" />
        </a>
        <label className="switch mR0">
          <input type="checkbox" checked onChange={onChangePageLanguage} />
          <span className="slider round"></span>
          <p className="p-checkBoxText">
            <span className="span-left">VN</span>
          </p>
        </label>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto"></ul>
          <div className="form-inline my-2 my-lg-0 hmenu">
            <ul className="nav justify-content-end content-center">
              {menuItems.map((item, index) => (
                <li
                  className={`nav-item ${item.active && 'active'}`}
                  key={index}
                >
                  <a onClick={() => onClickMenuItem(item)}>{item.name}</a>
                </li>
              ))}
            </ul>
            <Button
              className="btn-sign"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => handleLogin(1)}
              label="Login"
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
