import {
  CREATE_APPOINTMENT_SUCCESSFULLY,
  GET_APPOINTMENTS_SUCCESSFULLY,
  BOOK_APPOINTMENT_SUCCESSFULLY,
  UPDATE_APPOINTMENT_SUCCESSFULLY,
  CANCEL_APPOINTMENT_SUCCESSFULLY,
  GET_ALL_APPOINTMENTS_SUCCESSFULLY,
  GET_ALL_APPOINTMENTS_CAO_THANG_SUCCESSFULLY,
  RECORD_APPOINTMENT
} from '../../constant';

export default function (appointment = { appointments: [], hasRecord: false }, action) {
  const { type, payload } = action;
  const { appointments } = appointment;
  switch (type) {
    case CREATE_APPOINTMENT_SUCCESSFULLY:
      return {
        ...appointment,
        ...{ appointments: [...appointments, payload] },
      };
    case GET_APPOINTMENTS_SUCCESSFULLY: {
      return {
        ...appointment,
        ...{
          appointments: [...payload],
          updatedAppointmentId: null,
          canceledAppointmentId: null,
        },
      };
    }

    case BOOK_APPOINTMENT_SUCCESSFULLY:
      return {
        ...appointment,
        createAppointment: payload
      };
    case CANCEL_APPOINTMENT_SUCCESSFULLY: {
      const { appointmentId } = payload;
      const newAppointments = appointments.filter(
        (appointment) => appointment._id !== appointmentId
      );
      return {
        ...appointment,
        ...{
          appointments: newAppointments,
          updatedAppointmentId: null,
          canceledAppointmentId: appointmentId,
        },
      };
    }
    case UPDATE_APPOINTMENT_SUCCESSFULLY: {
      // const index = appointments.findIndex((item) => item._id === payload._id);
      // const newAppointments = [
      //   ...appointments.slice(0, index),
      //   payload,
      //   ...appointments.slice(index + 1),
      // ];
      return {
        ...appointment,
        updatedAppointment: payload,
        ...{ updatedAppointmentId: payload._id },
      };
    }
    case GET_ALL_APPOINTMENTS_SUCCESSFULLY: {
      const appointments = payload.map((result) => result._id);
      return {
        ...appointment,
        ...{
          appointments,
          updatedAppointmentId: null,
          canceledAppointmentId: null,
        },
      };
    }
    case GET_ALL_APPOINTMENTS_CAO_THANG_SUCCESSFULLY: {
      const allAppointments = payload
      return {
        ...appointment,
        ...{
          allAppointments,
          updatedAppointmentId: null,
          canceledAppointmentId: null,
        },
      };
    }
    case RECORD_APPOINTMENT: {
      return {
        ...appointment,
        ...{
          hasRecord: payload
        },
      };
    }
    default:
      return appointment;
  }
}
