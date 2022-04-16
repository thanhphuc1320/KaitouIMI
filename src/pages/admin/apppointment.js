import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import { getAllAppointmentsCaoThang } from '../../store/actions/appointment.action';
import { attemptLogout } from '../../store/actions/auth.action';
import { TOKEN_KEY } from '../../constant';

import DialogApoitment from '../../components/dialog/dialogApoitment';
import defaultAva from '@img/d_ava.png';

import '../../static/css/appointment.css';

export default function AdminAppoiment() {
  const history = useHistory();
  const { appointments = [] } = useSelector((state) => state.appointment);
  const dispatch = useDispatch();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [appointmentDetail, setAppointmentDetail] = useState({});
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  useEffect(() => {
    dispatch(getAllAppointmentsCaoThang({ month: month, year: year }));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllAppointmentsCaoThang]);

  const openDialog = (item) => {
    setAppointmentDetail(item);
    setIsOpenDialog(true);
  };

  const handleClose = () => {
    setIsOpenDialog(false);
  };

  return (
    <div className="ct-appointment-homepage">
      <div className="ct-appointment-right">
        <div className="header-content">
          <div className="time">
            <p>Yesterday</p>
            <p className="click-time">Today</p>
            <p>Tomorrow</p>
          </div>
        </div>
        <div className="appointment-container-right">
        {appointments.map((item, index) => {
          if (item.patient) {
            return (
              <div className="container-item-right">
                <div className="right-item-call" key={index}>
                  <div className="item-call-avatar">
                    <img
                      src={
                        item.patient?.avatarUrl
                          ? item.patient?.avatarUrl
                          : defaultAva
                      }
                      alt=""
                    />
                  </div>
                  <div className="item-call-detail">
                    {item.patient ? (
                      item.patient?.firstName ? (
                        <span>
                          {item.patient?.firstName} {item.patient?.lastName}
                        </span>
                      ) : (
                        <span>{item.patient?.email}</span>
                      )
                    ) : (
                      <span>User</span>
                    )}
                    <p>32 years, {item.patient?.address}</p>
                  </div>
                  {/* <button className="btn" onClick={() => openDialog(item)}>Join Call </button>
                   */}
                  <div
                    className="item-call-submit"
                    onClick={() => openDialog(item)}
                  >
                    <p>Join call</p>
                  </div>
                </div>
              </div>
            );
          }
        })}
        </div>
      </div>
      <DialogApoitment
        isOpenFile={isOpenDialog}
        appointmentDetail={appointmentDetail}
        handleClose={(e) => handleClose(e)}
      />
    </div>
  );
}
