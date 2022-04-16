import React from 'react';
import Dialog from 'material-ui/Dialog';
import './styles/dialog-pdf-preview.css';
import { Slide } from '@material-ui/core';
import defaultAva from '../../img/d_ava.png';
import { useHistory } from 'react-router-dom';

import { formatAMPM } from '../../utils';

const customContentStyle = {
  width: '300px',
  maxWidth: 'none',
};

const maxWidth = 'sm'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Dialog content can be scrollable.
 */
export default function DialogApoitment({
  isOpenFile,
  handleClose,
  fileModeToOpen,
  appointmentDetail
}) {
  const history = useHistory()
  const joinCall = () => {
    history.push(`appointment/patient/call?_id=${appointmentDetail._id}`)
  };

  const [dateAndTime, bookingTimeExtra] = formatAMPM(
    appointmentDetail.dateAndTime
  );
  const [endDateAndTime, endDateAndTimeBookingTimeExtra] = formatAMPM(
    appointmentDetail.endDateAndTime
  );

  return (
    <div>
      <Dialog open={isOpenFile} aria-labelledby="simple-dialog-title" contentStyle={customContentStyle} >
        <div className="dialog-call">
          <div className="item-call">
            <div className="background-user mb-3">
              <img
                src={
                  appointmentDetail.patient?.avatarUrl
                    ? appointmentDetail.patient?.avatarUrl
                    : defaultAva
                }
                alt
              />
            </div>
            <div className="detail-partient">
              {appointmentDetail.patient ? (
                appointmentDetail.patient?.firstName ? (
                  <span>
                    {appointmentDetail.patient?.firstName} {appointmentDetail.patient?.lastName}
                  </span>
                ) : (
                    <span>{appointmentDetail.patient?.email}</span>
                  )
              ) : (
                  <span>User</span>
                )}
            </div>
            <p>32 years, {appointmentDetail.patient?.address}</p>
            <p>Birth: 20/03/1989</p>
            <p>Phone: {appointmentDetail.patient?.phone}</p>
            <div className="mt-5 text-center">
              <span>
                Meetting with
              </span>
              <p className="detail-doctor">
                <span>Dr. {appointmentDetail.doctor?.firstName} {appointmentDetail.doctor?.lastName}</span>
              </p>
              <p className="time">
                From: {dateAndTime} {bookingTimeExtra}- {endDateAndTime}{' '} {endDateAndTimeBookingTimeExtra}
              </p>
            </div>
            <div className="d-flex mt-3">
              <button className="btn gradient-blue m-2" onClick={() => handleClose()}>Cancel </button>
              <button className="btn gradient-blue m-2" onClick={() => joinCall()}>Comfirm Info </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
