import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Swal from 'sweetalert2';
import moment from 'moment'

import defaultAva from '../../img/d_ava.png';
import ico_search from '../../img/imi/ico-search-admin.png';
import ico_alarm_bell from '../../img/imi/alarm-bell-blue.png';
import ico_add_schedule from '../../img/imi/ico-add-schdule.png';
import ico_robot from '../../img/imi/Union.png';

import { getAdminRobots, syncRobots } from '../../store/actions/robot.action';

export default function RobotAdmin(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { adminRobots = [] } = useSelector((state) => state.robot);
  const { dataSyncRobots = [] } = useSelector((state) => state.robot);
  const {isFetching = {}} = useSelector((state) => state.loading);

  const editDetailRobot = (e, item) => {
    if (!isFetching) {
    history.push(`/robot-admin/${item._id}`)
    }
  }

  const syncDataRobots = () => {
    dispatch(syncRobots());
  }

  useEffect(() => {
    dispatch(getAdminRobots());
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dataSyncRobots.length > 0) {
      dispatch(getAdminRobots());
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSyncRobots]);

  return (
    <div className="sub-content-admin">
      <div className="header-content-admin mb-4">
        <div className="left">
          <p>Robots List </p>
          <button className="btn-add-listPatient" onClick={syncDataRobots}>
            Sync Robot <img className="ml-5" src={ico_add_schedule} alt="" />
          </button>
        </div>

        <div className="right">
          <span>A new Robot was added by Admin</span>
          <a href="#">
            <img src={ico_alarm_bell} />
            <span className="count">3</span>
          </a>
          <div className="find-admin">
            <div className="search-admin form-group mr-3 mt-3 mb-3">
              <input
                className="form-control"
                type="text"
                name="search"
                placeholder="Find Robot"
              />
              <img src={ico_search} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="content-list">
        {adminRobots.length > 0 ? (
          <div
            className="list-admin"
            id="list-doctor"
          >
            {adminRobots.map((item, index) => {
              return (
                <div
                  key={index}
                  className="item-grid"
                  onClick={(e) => editDetailRobot(e, item)}
                >
                  <a>
                    <img
                      src={item?.image || defaultAva}
                      alt=""
                    />
                  </a>
                  <div className="p-2">
                    <h3>{item.name}</h3>
                    <p>{item.location}</p>
                  </div>
                  <div className="detail">
                    <span className={item.status !== 'online' ? 'status-active' : 'status-unactive'}></span>
                    <span>
                      {
                        item.status === 'online' ?  'In call' : 'Available'
                      }
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-data d-flex justify-content-center align-items-center">
            <img src={ico_robot} className="icon-robot mr-3 mb-2"/>
            <div className="center">No Robot</div>
          </div>
        )}
      </div>
    </div>
  )
}