import {
  GET_ALL_APPOINTMENTS_DATE_IN_FUTURE_SUCCESSFULLY,
} from '../../constant';

export default function (appointmentDateInFuture = { appointmentDates: [] }, action) {
  const { type, payload } = action;
  const { appointmentDates } = appointmentDateInFuture;
  switch (type) {
    case GET_ALL_APPOINTMENTS_DATE_IN_FUTURE_SUCCESSFULLY:
      return {
        ...appointmentDateInFuture,
        ...{ appointmentDates: [...appointmentDates, payload] },
      };
    default:
      return appointmentDateInFuture;
  }
}
