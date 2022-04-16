import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './styles/dialog-pdf-preview.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GridItem from '../../components/grid/GridItem';
import GridContainer from '../../components/grid/GridContainer';
import ico_add_schedule from '../../img/imi/ico-add-schdule.png';
import ico_edit from '../../img/imi/ico-edit-admin.png';
import SelectionField from './components/selectionField';
import SelectionAdd from './components/selectionAdd';
import ico_save from '../../img/imi/ico-save.png';

import { getDoctorList, getPatientList } from '../../store/actions/user.action';
import { createAppointment, updateAppointment } from '../../store/actions/appointment.action'

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

import { makeStyles } from '@material-ui/core/styles';

import {
  getAppointments,
} from '../../store/actions/appointment.action';

import moment from 'moment'

import { formatAMPM } from '../../utils';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function DialogApoitment({isOpenFile,handleClose,dataDetail,selectDate, addAppointment}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [startDate] = useState(new Date());
  const { doctorlist = [] } = useSelector((state) => state.user);
  const { patientlist = [] } = useSelector((state) => state.user);
  const { appointments = [] } = useSelector((state) => state.appointment);
  const { updatedAppointment = null } = useSelector((state) => state.appointment);
  const {isFetching = {}} = useSelector((state) => state.loading);
  let upcomingAppointmentList = [];
  appointments.sort(
    (a, b) => new Date(a.dateAndTime) - new Date(b.dateAndTime))
    .map((appointment) => {
      if (new Date(appointment.dateAndTime) > startDate)
        upcomingAppointmentList.push(appointment);
  })

  const [page, setPage] = useState(1);
  const pageSize = 20
  const [activeTab, setActiveTab] = useState(false);
  const [selectType, setSelectType] = useState();
  const [selectedPatient, setSelectedPatient] = useState(dataDetail ? dataDetail.patient : null);
  const [selectedDoctor, setSelectedDoctor] = useState(dataDetail ? dataDetail.doctor : null);
  const [valueTime, setValueTime] = useState(dataDetail ? dataDetail.patient : null);
  const [selectTimme, setSelectTimme] = useState(dataDetail ? dataDetail : null);
  const [appointmentId, setAppointmentId] = useState(null)
  const [showEdit, setShowEdit] = useState(false);


  const listType = [
    { label: 'Cancer', value: 'Cancer' },
    { label: 'Heart', value: 'Heart' },
    { label: 'Liver', value: 'Liver' },
    { label: 'Blood', value: 'Blood' },
    { label: 'Nerve', value: 'Nerve' },
  ];
 
  const getdoctorlist = (value) => {
    let params = {
      pageSize: pageSize,
      page: page
    }
    if (value) {
      params.search = value
    }
    dispatch(getDoctorList(params));
  }
  const getpatientlist = (value) => {
    let params = {
      pageSize: pageSize,
      page: page
    }
    if (value) {
      params.search = value
    }
    dispatch(getPatientList(params));
  }

  const onChangeSelectedType = (value) => {
    setSelectType(value)
  };
  const onChangeSelectedDoctor = (event, data)=>{
    setSelectedDoctor(data)
  }
  const onChangeSelectedPatient = (event, data)=>{
    setSelectedPatient(data)
  }
  const updateAppointmentAdmin = async() => {
    if (selectedPatient && selectType && selectTimme && !dataDetail) {
      const data = await dispatch(createAppointment({ 
        appointmentId: selectTimme?._id || '',
        dateAndTime: selectTimme.dateAndTime,
        endDateAndTime: selectTimme.endDateAndTime,
        patientId: selectedPatient._id,
        typeOfAppointment: selectType,
        mode: 4,
       }));
      addAppointment();
      setSelectType('')
      if (!data.code) {
        setActiveTab(true);
      }
      if (doctorlist.length > 0) {
        setSelectedDoctor(doctorlist[0]) 
      }
      if (patientlist.length > 0) {
        setSelectedPatient(patientlist[0])
      }
    } else if (selectedPatient && selectType && selectTimme && dataDetail) {
      const data = await dispatch(updateAppointment({ 
        appointmentId: appointmentId,
        dateAndTime: selectTimme.dateAndTime,
        endDateAndTime: selectTimme.endDateAndTime,
        patientId: selectedPatient._id,
        typeOfAppointment: selectType,
        newAppointmentId: selectTimme._id,
        mode: 4
       }));
      if (!data.code) {
        setActiveTab(false);
      }
      if (doctorlist.length > 0) {
        setSelectedDoctor(doctorlist[0])
      }
      if (patientlist.length > 0) {
        setSelectedPatient(patientlist[0])
      }
    }
  };
  const backToHome = () => {
   if(!isFetching){
    setActiveTab(false);
    handleClose();
   }
  };
  const editAppointment = () =>{
    setShowEdit(true)
  }
  const cancelEdit = () =>{
    handleClose();
    setShowEdit(false)
  }
  
  const handleChangeTime = (event) => {
    setSelectTimme(event.target.value)
  }

  const onInputChangeTextPatient = (value) => {
    getpatientlist(value)
  }

  const onInputChangeTextDoctor = (value) => {
    getdoctorlist(value)
  }

  useEffect(() => {
    if (updatedAppointment) {
      addAppointment(true)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedAppointment])

  useEffect(() => {
    getdoctorlist()
    getpatientlist()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   if (doctorlist.length > 0) {
  //     setSelectedDoctor(doctorlist[0])
  //   }
  //   if (patientlist.length > 0) {
  //     setSelectedPatient(patientlist[0])
  //   }
  //   //eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [doctorlist, patientlist])

  useEffect(() => {
    if (selectedDoctor) {
      dispatch(
        getAppointments({
          dateAndTime: selectDate.setHours(0,0),
          endDateAndTime: new Date(selectDate).setHours(23,59),
          doctor: selectedDoctor?._id || ''
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoctor]);

  useEffect(() => {
    const dataTemp = appointments.map(appointment => {
      if ((new Date(appointment.dateAndTime) > startDate && appointment.status !== 1) || (dataDetail && appointment._id === dataDetail._id)) {
        return appointment
      }
    })

    dataTemp.sort(
      (a, b) => new Date(a.dateAndTime) - new Date(b.dateAndTime))

    if (dataDetail) {
      const index = dataTemp.findIndex(item => item._id === dataDetail._id)
      if (index !== -1) {
        setSelectTimme(dataTemp[index])
      }
    } else {
      setSelectTimme(dataTemp.length > 0 ? dataTemp[0] : null)
    }
  }, [appointments])

  useEffect(() => {
    if (dataDetail) {
      setSelectedPatient(dataDetail.patient)
      setSelectedDoctor(dataDetail.doctor)
      setSelectTimme(dataDetail)
      setValueTime(dataDetail)
      setAppointmentId(dataDetail._id)
      setSelectType(dataDetail.typeOfAppointment)
    } else {
      setSelectedPatient(null)
      setSelectedDoctor(null)
      setSelectTimme(null)
      setValueTime(null)
      setSelectType('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDetail]);

  useEffect(() => {
    if (isOpenFile) {
      setShowEdit(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenFile])

  return (
    <div className="dialog-schedule">
      <Dialog
        open={isOpenFile}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className="dddd"
      >
        <DialogTitle className="title-dialog" id="form-dialog-title">
          {dataDetail ? <p>Appointment Detail</p> : <p>Add Appointment</p>}
        </DialogTitle>
        <div className="border-bottom-title"></div>
        {activeTab && !dataDetail ? (
          <div className="messges-add-appointment p-2">
            <div className="text-messges">
              <p className="mb-0 font-weight600">Congratulation!</p>
              <span className="font-weight-normal">
                Your appointment was added to system.
              </span>
            </div>
            <button className="btn-back-home-admin" onClick={backToHome}>
              Back to Dasboard
            </button>
          </div>
        ) : (
          <div>
            <DialogContent>
              <DialogContentText>
                <div className="d-flex justify-content-between mt-2">
                  <div className="sub-title-schedule mb-0">
                    <p className="m-0"> {moment(selectDate).format('LL')}</p>
                    <p className="time-zone m-0">Time zone</p>
                  </div>

                  <div className="sub-title-schedule mb-0">
                    <p className="time-zone m-0">Time</p>
                    <FormControl className={classes.formControl}>
                      <Select
                        onChange={(event) => handleChangeTime(event)}
                        value={selectTimme}
                        disabled= {!showEdit && dataDetail}
                      >
                       {
                          appointments.length > 0 ? (appointments.map((appointment, index) => {
                            const {
                              status,
                              dateAndTime,
                              endDateAndTime,
                            } = appointment;
                            const [time, timeExtra] = formatAMPM(new Date(dateAndTime));
                            const [endTime, endTimeExtra] = formatAMPM(
                              new Date(endDateAndTime)
                            );
                            return ((status!== 1 && new Date(appointment.dateAndTime) > startDate) || (dataDetail && appointment._id === dataDetail._id))
                              && <MenuItem style={{fontFamily:'Nunito',fontSize:'18px'}}  value={appointment} key={index} >{time} {timeExtra} - {endTime} {endTimeExtra}</MenuItem >
                          })) : (<MenuItem style={{fontFamily:'Nunito',fontSize:'18px'}} value=""><em>No Time</em></MenuItem >)
                        }
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </DialogContentText>
              <GridContainer xs={12}>
                <GridItem xs={12}>
                  <SelectionField
                    disabled= {!showEdit && dataDetail}
                    onChange={onChangeSelectedType}
                    data={listType}
                    defaultValue={selectType}
                    placeHolder={'Type Of Appointment'}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <SelectionAdd
                    disabled= {!showEdit && dataDetail}
                    placeHolder={'Choose Patient'}
                    role="patient"
                    listPatient={patientlist}
                    changeSelectedPatient={onChangeSelectedPatient}
                    selectedUser={selectedPatient ? selectedPatient : null}
                    dataDetail={dataDetail}
                    onInputChangeTextPatient={onInputChangeTextPatient}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <SelectionAdd
                    disabled= {!showEdit && dataDetail || showEdit && dataDetail}
                    placeHolder={'Choose Doctor'}
                    role="doctor"
                    listDoctor ={doctorlist}
                    changeSelectedDoctor={onChangeSelectedDoctor}
                    selectedUser={selectedDoctor ? selectedDoctor : null}
                    dataDetail={dataDetail}
                    onInputChangeTextDoctor={onInputChangeTextDoctor}
                  />
                </GridItem>
              </GridContainer>
            </DialogContent>
            <DialogActions className="mb-4">
              {
                !dataDetail && (
                  <div>
                  <Button onClick={handleClose} className="btn-cancel-schedule">
                    Cancel
                  </Button>
                  <div
                    className="btn-add-schedule bg-btn-yellow btn-add-schedule-width"
                    onClick={updateAppointmentAdmin}
                  >
                    <img className="pr-4" src={ico_add_schedule} alt="" />
                    <p>Add Appointment</p>
                  </div>
                </div>
                )
              }
              {dataDetail && !showEdit && (
                <div
                  className="btn-add-schedule bg-btn-blue btn-add-schedule-width"
                  onClick={editAppointment}
                >
                  <img className="pr-4" src={ico_edit} alt="" />
                  <p>Edit Appointment</p>
                </div>
              )}

              {
               dataDetail && showEdit && (
                  <div>
                    <Button onClick={cancelEdit} className="btn-cancel-schedule">
                      Cancel
                    </Button>
                    <div
                      className="btn-add-schedule bg-btn-blue btn-add-schedule-width"
                      onClick={updateAppointmentAdmin}
                    >
                      <img className="pr-4" src={ico_save} alt="" />
                      <p>Save Edits</p>
                    </div>
                  </div>
                )
              }
            </DialogActions>
          </div>
        )}
      </Dialog>
    </div>
  );
}
