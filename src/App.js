import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, BrowserRouter as Router } from 'react-router-dom';

import classNames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import Swal from 'sweetalert2';

// Component
import Drawer from 'material-ui/Drawer';

import RoutesList from './routers/routesList';
import PrivateRoutesComponent from './routers/privateRoutesComponent';
import PublicRoutesComponent from './routers/publicRoutesComponent';

import logo from './img/imi/logo.png';
import menuBtn from './img/menu-btn.svg';
import { ToastContainer, toast } from 'react-toastify';

import { getUserIdentity } from './store/actions/auth.action';
import { TOKEN_KEY, FIREBASE_REGISTRATION_TOKEN } from './constant';

import messaging from './firebase';
import LinearProgress from 'material-ui/LinearProgress';
import { subscribeTopic } from './apiCalls/notification.api';
import { getNotificationsApi } from './store/actions/notification.action';
import appVersionChecker from './version-checker.js';
import { getRequests } from '../src/containers/request/store/action';

import './static/css/scaled-font.css';

const checkRoute = window.location.pathname;

export default function App() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [childData, setChildData] = useState(checkRoute);
  // const prevMenuOpen = useRef(menuOpen);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const url = new URL(window.location.href);
  const isToken = url.searchParams.has('token');
  const tokenParams = isToken ? url.searchParams.get('token') : '';
  const token = localStorage.getItem(TOKEN_KEY) || user.token || tokenParams;
  const loading = useSelector((state) => state.loading.isFetching || false);

  const styles = {
    LinearProgressSimple: {
      position: 'absolute',
      top: 0,
      zIndex: 100000,
    },
  };

  const callBackRoute = (childData) => {
    setChildData(childData);
  };

  useEffect(() => {
    appVersionChecker();
  }, [appVersionChecker]);

  // Sidebar collapse/open
  useEffect(() => {
    if (window.innerWidth < 991) setMenuOpen(false);
    const menuCollapseWithResize = () => {
      if (window.innerWidth < 991) setMenuOpen(false);
      else setMenuOpen(true);
    };
    window.addEventListener('resize', menuCollapseWithResize);

    return function cleanup() {
      window.removeEventListener('resize', menuCollapseWithResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  useEffect(() => {
    if (token) dispatch(getUserIdentity(token));

    if (messaging && token)
      return messaging
        .requestPermission()
        .then(() => {
          return messaging.getToken();
        })
        .then((token) => {
          localStorage.setItem(FIREBASE_REGISTRATION_TOKEN, token);
          console.log('[Firebase token]: ', token);

          subscribeTopic(token).then(() => {
            messaging.onMessage((payload) => {
              dispatch(getNotificationsApi(1));
              const {
                notification: { title, body },
              } = payload;

              const currentMode = {
                page: 0,
                status: 0,
                limit: 20,
                isClearData: true,
              };

              dispatch(getRequests(currentMode));

              // Swal.fire({
              //   title,
              //   text: body,
              //   toast: true,
              //   position: 'center',
              //   showConfirmButton: false,
              //   timer: 10000,
              //   timerProgressBar: true,
              // });
            });
          });
        })
        .catch((err) =>
          console.log('Unable to get permission to notify.', err)
        );
  }, [dispatch]);

  // Sidebar toggle
  const toggleMenu = () => {
    // console.log('prevMenuOpen: ', prevMenuOpen);
    setMenuOpen(true);
  };

  const closeToggle = () => {
    if (menuOpen === true) {
      if (window.innerWidth < 991) setMenuOpen(false);
    }
  };

  const headerStyle = { background: 'transparent', marginTop: '5px' };

  // Page content class change based on menu toggle
  const pageContent = classNames({
    'readmin-page-content': true,
    'menu-open': menuOpen,
  });

  const pageContentAdmin = classNames({
    'readmin-page-content-admin': true,
    'menu-open': menuOpen,
  });

  // Sidebar class based on bg color
  const sidebarClass = classNames({
    'menu-drawer': true,
    'has-bg': true,
  });

  // header left part with logo and toggle button
  const HeaderLogoWithMenu = () => (
    <div className="an-header" style={headerStyle}>
      <div className="header-left">
        <button onClick={() => toggleMenu()}>
          <img src={menuBtn} alt="menu" />
        </button>
      </div>
      <div className="header-center">
        <Link to="/" className="brand">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div
      className={
        user.role === 'admin'
          ? 'readmin-sidebar sidebar-admin'
          : 'readmin-sidebar'
      }
    >
      <HeaderLogoWithMenu />
      <Drawer
        open={menuOpen}
        className={sidebarClass}
        containerClassName="sidebar-initial-color"
      >
        <div
          className={
            user.role === 'admin' ? 'sidebar-overlay-admin' : 'sidebar-overlay'
          }
        />
        <Scrollbars>
          {/* FIXME: toggle Menu doesn't work when click on a route on the sidebar */}
          {token && <RoutesList user={user} toggleMenu={() => toggleMenu()} />}
        </Scrollbars>
      </Drawer>
    </div>
  );

  if (token && !user.role) return <div></div>;

  return (
    <div>
      <Router basename="/">
        {loading && <LinearProgress style={styles.LinearProgressSimple} />}
        {user.role !== 'robot' && user.role && localStorage.getItem(TOKEN_KEY) && (
          <div
            onClick={() => closeToggle()}
            className={
              user.role !== 'admin'
                ? childData !== 'iDoctor-result' &&
                  childData !== 'iReader-result'
                  ? pageContent
                  : null
                : pageContentAdmin
            }
          >
            {childData !== 'iDoctor-result' &&
            childData !== 'iReader-result' ? (
              <Sidebar />
            ) : null}
            <PrivateRoutesComponent
              user={user}
              callBackRouteDom={callBackRoute}
            />
          </div>
        )}
        {user.role &&
          user.role === 'robot' &&
          localStorage.getItem(TOKEN_KEY) && <PrivateRoutesComponent />}
        {(!user.role || (user.role && !localStorage.getItem(TOKEN_KEY))) && (
          <PublicRoutesComponent />
        )}
        <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
      </Router>
    </div>
  );
}
