import './styles.css';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getNotificationsApi,
  markAsReadApi,
} from '../../store/actions/notification.action';

import ico_bell from '../../img/imi/alarm-bell-black.png';
import empty_inbox from '../../img/inbox.png';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const NottificationCenter = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);
  const [toggleFlag, setToggleFlag] = useState(false);
  const [minTimeLoading, setMinTimeLoading] = useState(false);

  useEffect(() => {
    !notifications.all.length && getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = () => {
    setMinTimeLoading(true);
    const taoLaSetTimeout = setTimeout(() => {
      setMinTimeLoading(false);
      clearTimeout(taoLaSetTimeout);
    }, 1000);

    dispatch(getNotificationsApi(notifications.page));
  };

  const onClickedMsg = (msg) => {
    if (!msg.hasRead) {
      dispatch(markAsReadApi(msg._id));
    }
  };

  const renderMsg = () =>
    notifications.all.map((msg) => (
      <li
        key={msg._id}
        className="msg-item"
        onClick={() => onClickedMsg(msg)}
        style={{ opacity: msg.hasRead ? 0.7 : 1 }}
      >
        <div className="msg-content">
          <span className="msg-title">{msg.title}</span>
          <span className="msg-text">{msg.content}</span>
        </div>
      </li>
    ));

  const renderEmptyItem = () => (
    <div className="msg-empty">
      <div>
        <img src={empty_inbox} alt='' />
      </div>
      <p>No Notices Right Now!</p>
      <span>You're up-to-date! Would work well</span>
    </div>
  );

  const buttonLoadMore = () => {
    return (
      <li className="text-center mt-3">
        <Button variant="outlined" color="primary" onClick={getList} disabled={notifications.loading || minTimeLoading}>
          {
            notifications.loading || minTimeLoading
              ? <CircularProgress />
              : 'Loadmore'
          }
        </Button>
      </li>
    )
  };

  const renderNotifications = () => (
    <div>
      <ul className="msg-list">
        {notifications.all.length ? renderMsg() : renderEmptyItem()}
        {notifications.all.length > 0 && buttonLoadMore()}
      </ul>
    </div>

  );

  return (
    <div className="msg-container">
      <img src={ico_bell} onClick={() => setToggleFlag(!toggleFlag)} alt='' />
      {notifications.numOfNewMsg > 0 && (
        <span className="count">{notifications.numOfNewMsg}</span>
      )}
      {toggleFlag && renderNotifications()}
    </div>
  );
};

export default NottificationCenter;