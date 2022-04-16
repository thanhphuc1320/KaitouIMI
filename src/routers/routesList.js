import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, withRouter, Link, useHistory } from 'react-router-dom';
import $ from 'jquery';
import { attemptLogout } from '../store/actions/auth.action';
import { TOKEN_KEY } from '../constant';

const { REACT_APP_LOGIN_PAGE, NODE_ENV } = process.env;

function RoutesList(props) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    $('.sidebar-nav ul .has-child .child-menu').hide();
    $('.sidebar-nav ul .has-child > a').on('click', (e) => {
      e.preventDefault();
      $(this).toggleClass('active');
      $(this).next('.child-menu').slideToggle(300);
    });
  });

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    dispatch(attemptLogout());
    history.push('/login');
  };

  const styles = {
    activeStyle: {
      background: '#2454AB',
      borderLeft: '5px solid #58DAF7',
      display: 'flex',
      height: '53px'
    },
  };

  const stylesAdmin = {
    activeStyle: {
      // background: '#014d7c',
      borderLeft: '5px solid #0023BA',
      color: '#F7931E',
    },
  };

  const checkActive = (match, location, path) => {
    const arrayPathname = location.pathname.split('/')
    if (arrayPathname.length > 1 && arrayPathname[1] === path) {
      return true;
    } else return false
  }
  
  return (
    <div className="sidebar-nav">
      {user.token && (
        <ul>
          <li className="link_home">
            <NavLink
              exact
              to="/"
              toggleMenu={props.toggleMenu}
              activeStyle={user.role === 'admin' ? stylesAdmin.activeStyle : styles.activeStyle}
            >
              <span className="material-icons" />
              <p className="mb-0 d-inline-block">Home</p>
            </NavLink>
          </li>
          {/* {user.role === 'patient' && NODE_ENV !== 'production'? (
            <div>
              <li className="link_home">
                <NavLink
                  onClick={() => <index toggleMenu={props.toggleMenu} />}
                  exact
                  to="/home-page"
                  activeStyle={user.role === 'admin' ? stylesAdmin.activeStyle : styles.activeStyle}
                >
                  <span className="material-icons" />
                  New Home
                </NavLink>
              </li>
            </div>
          ) : null} */}
          {user.role === 'patient' ? (
            <div>
              <li className="link_result">
                <NavLink
                  onClick={() => <index toggleMenu={props.toggleMenu} />}
                  exact
                  to="/all-file-test-result"
                  isActive={(match, location) => checkActive(match, location, 'all-file-test-result')}
                  activeStyle={user.role === 'admin' ? stylesAdmin.activeStyle : styles.activeStyle}
                >
                  <div className="d-flex">
                    <span className="material-icons" />
                    <span className="mt-1">Test Results</span>
                  </div>
                </NavLink>
              </li>
            </div>
          ) : null
          }
          {/* {
            user.role === "patient" ? ( 
            <div>
              <li className="link_medical">
                <NavLink
                  onClick={() => <index toggleMenu={props.toggleMenu} />}
                  exact
                  to="/medical-history"
                  activeStyle={user.role === 'admin' ? stylesAdmin.activeStyle : styles.activeStyle}
                >
                  <div className="d-flex">
                  <span className="material-icons" />
                  <span className="mt-1">Medical History</span>
                  </div>
                </NavLink>
              </li>
            </div>
          ) : null
          } */}
         { 
         user.role !== 'admin' && user.role !== 'patient'? ( 
         <div>
           <li className="link_appoint">
            <NavLink
              onClick={() => <index toggleMenu={props.toggleMenu} />}
              exact
              to="/appointment"
              activeStyle={user.role === 'admin' ? stylesAdmin.activeStyle : styles.activeStyle}
            >
              <div className="d-flex">
                <span className="material-icons" />
                <span className="mt-1">Appointment</span>
              </div>
            </NavLink>
            </li>
         </div>
         ):null }
           {/* {user.role === 'patient' ? (
            <div>
              <li className="link_appoint">
                <NavLink
                  onClick={() => <index toggleMenu={props.toggleMenu} />}
                  exact
                  to="/appointment-new"
                  activeStyle={styles.activeStyle}
                >
                  <div className="d-flex">
                    <span className="material-icons" />
                    <span className="mt-1">Appointment</span>
                  </div>
                </NavLink>
              </li>
            </div>
          ) : null} */}
          {/* { 
         user.role !== 'admin'? ( 
         <div>
           <li className="link_settings">
            <NavLink
              onClick={() => <index toggleMenu={props.toggleMenu} />}
              exact
              to="/preference"
              activeStyle={user.role === 'admin' ? stylesAdmin.activeStyle : styles.activeStyle}
            >
              <div className="d-flex">
                <span className="material-icons" />
                <span className="mt-1">Preferences</span>
              </div>
            </NavLink>
            </li>
         </div>
         ):null } */}

          {/* <li className="link_settings">
            {user.role !== 'admin' ? (
              <NavLink
                exact
                to="/preference"
                toggleMenu={props.toggleMenu}
                activeStyle={user.role === 'admin' ? stylesAdmin.activeStyle : styles.activeStyle}
              >
                <span className="material-icons" />
                <span className="mt-1">Preferences</span>
              </NavLink>
            ) : null}
          </li> */}
          {user.role === 'doctor' ? (
            <div>
              <li className="link_appoint">
                <NavLink
                  onClick={() => <index toggleMenu={props.toggleMenu} />}
                  exact
                  to="/smart-record-reader"
                  activeStyle={user.role === 'admin' ? stylesAdmin.activeStyle : styles.activeStyle}
                >
                  <div className="d-flex">
                    <span className="material-icons" />
                    <span className="mt-1">Smart Reader</span>
                  </div>
                </NavLink>
              </li>
              <li className="link_appoint">
                <NavLink
                  onClick={() => <index toggleMenu={props.toggleMenu} />}
                  exact
                  to="/my-requests"
                  activeStyle={user.role === 'admin' ? stylesAdmin.activeStyle : styles.activeStyle}
                >
                  <div className="d-flex">
                    <span className="material-icons" />
                    <span className="mt-1">My Requests</span>
                  </div>
                </NavLink>
              </li>
            </div>
          ) : null}
          {user.role === 'admin' ? (
            <div>
              <li className="link_patient">
                <NavLink
                  onClick={() => <index toggleMenu={props.toggleMenu} />}
                  exact
                  to="/patient-admin"
                  isActive={(match, location) => checkActive(match, location, 'patient-admin')}
                  activeStyle={user.role === 'admin' ? stylesAdmin.activeStyle : styles.activeStyle}
                >
                  <div className="d-flex">
                    <span className="material-icons"/>
                    <span className="mt-1">Patients</span>
                  </div>
                </NavLink>
              </li>
            </div>
          ) : null}
           {user.role === 'admin' ? (
            <div>
              <li className="link_doctor">
                <NavLink
                  onClick={() => <index toggleMenu={props.toggleMenu} />}
                  exact
                  to="/doctor-admin"
                  isActive={(match, location) => checkActive(match, location, 'doctor-admin')}
                  activeStyle={user.role === 'admin' ? stylesAdmin.activeStyle : styles.activeStyle}
                >
                  <div className="d-flex">
                    <span className="material-icons" />
                    <span className="mt-1">Doctors</span>
                  </div>
                </NavLink>
              </li>
            </div>
          ) : null}
          {user.role === 'admin' ? (
            <div>
              <li className="link_robot">
                <NavLink
                  onClick={() => <index toggleMenu={props.toggleMenu} />}
                  exact
                  to="/robot-admin"
                  isActive={(match, location) => checkActive(match, location, 'robot-admin')}
                  activeStyle={user.role === 'admin' ? stylesAdmin.activeStyle : styles.activeStyle}
                >
                  <div className="d-flex">
                    <span className="material-icons" />
                    <span className="mt-1">Robots</span>
                  </div>
                </NavLink>
              </li>
            </div>
          ) : null}
           {user.role === 'admin' ? (
            <div>
              <li className="link_setting">
                <NavLink
                  onClick={() => <index toggleMenu={props.toggleMenu} />}
                  exact
                  to="#"
                  isActive={(match, location) => checkActive(match, location, 'robot-admin')}
                  // activeStyle={user.role === 'admin' ? stylesAdmin.activeStyle : styles.activeStyle}
                >
                  <div className="d-flex">
                    <span className="material-icons" />
                    <span className="mt-1">Setting</span>
                  </div>
                </NavLink>
              </li>
            </div>
          ) : null}
         <li className="sign_out_app colorStyle">
            <NavLink to="/login" onClick={() => logout()}>
              <i className="material-icons sign-out" style={{margin:'1px 5px 0px 4px'}}>
                power_settings_new
              </i>
              <span style={{marginLeft: '10px'}}>Sign Out</span>
            </NavLink>
          </li>
        </ul>
      )}
    </div>
  );
}

export default withRouter(RoutesList);
