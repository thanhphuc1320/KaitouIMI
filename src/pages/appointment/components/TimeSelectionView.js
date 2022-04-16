import React from 'react';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

// Helper functions
import { formatAMPM } from '../../../utils';

const TimeSelectionView = ({
  availableAppointment,
  handleAppointmentIdChange,
  handleSubmitAppointment,
  dateInDisplay,
  buttonName,
  patientModify,
  appointmentId
}) => (
  <div className="time-doctor">
    <h2>{dateInDisplay}</h2>
    <div className="time-doctor-content">
      <ul className="list-time">
        {availableAppointment.map((timeslot, index) => {
          const [time, timeExtra] = formatAMPM(new Date(timeslot.dateAndTime));
          const [endTime, endTimeExtra] = formatAMPM(
            new Date(timeslot.endDateAndTime)
          );

          const isPastTime = new Date(timeslot.dateAndTime) < new Date();
          return (
            <li className={`${!isPastTime ? '' : 'disable'}`} key={index}>
              <div className={`left-time ${!isPastTime ? '' : 'disable'}`}>
                {time} {timeExtra} - {endTime} {endTimeExtra}
              </div>
              <div className="right-check">
                <input
                  type="radio"
                  name="time-doctor"
                  value={timeslot._id}
                  onClick={(e) => handleAppointmentIdChange(timeslot._id)}
                  disabled={isPastTime}
                />
              </div>
            </li>
          );
        })}

        {
          availableAppointment.length === 0 && buttonName === 'Book' && (
            <div>
              <AccessTimeIcon className="mb-1 mr-2"/>
              No time
            </div>
          )
        }
      </ul>
    </div>
    <button
      className={availableAppointment.length === 0 && buttonName === 'Book' ? "disabled btn-gradient-yellow" : "btn-gradient-yellow"}
      onClick={() => handleSubmitAppointment()}
      disabled={availableAppointment.length === 0 && buttonName === 'Book'}
    >
      {buttonName}
    </button>
  </div>
);

export default TimeSelectionView;
