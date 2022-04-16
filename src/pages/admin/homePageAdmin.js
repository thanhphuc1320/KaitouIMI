import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../static/css/admin.css';
import DatePicker from 'react-datepicker';

import { getAllAppointmentsCaoThang, getAppointments } from '../../store/actions/appointment.action';
import { getDoctorList } from '../../store/actions/user.action';

import DialogAddSchedule from '../../components/dialog/dialogAddSchedule';
import ico_search from '../../img/imi/ico-search-admin.png';
import ico_add_schedule from '../../img/imi/ico-add-schdule.png';

import { formatAMPM } from '../../utils';
import moment from 'moment'

export default function HomeAdmin(props) {
  const dispatch = useDispatch();
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const { allAppointments = [] } = useSelector((state) => state.appointment);
  const { doctorlist = [] } = useSelector((state) => state.user);
  const { appointments = [] } = useSelector((state) => state.appointment);

  const [appointmentDetail, setAppointmentDetail] = useState(null);
  const [listDataResult, setListDataResult] = useState([]);
  const [search, setTextSearch] = useState('');

  const [page, setPage] = useState(1);
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const pageSize = 20
  const timeNow = new Date().getHours()
  const openDialog = (event, data) => {
    setIsOpenDialog(true);
    if (data) {
      setAppointmentDetail(data);
    } else {
      setAppointmentDetail(null);
    }
  };

  const handleClose = () => {
    setIsOpenDialog(false);
  };

  const getdoctorlist = () => {
    dispatch(getDoctorList({ pageSize: pageSize, page: page, search: search }));
  }
  const [startDate, setStartDate] = useState(new Date());
  const listSchedule = [
    { key: "01AM", time: '1 AM', list: [] },
    { key: "02AM", time: '2 AM', list: [] },
    { key: "03AM", time: '3 AM', list: [] },
    { key: "04AM", time: '4 AM', list: [] },
    { key: "05AM", time: '5 AM', list: [] },
    { key: "06AM", time: '6 AM', list: [] },
    { key: "07AM", time: '7 AM', list: [] },
    { key: "08AM", time: '8 AM', list: [] },
    { key: "09AM", time: '9 AM', list: [] },
    { key: "10AM", time: '10 AM', list: [] },
    { key: "11AM", time: '11 AM', list: [] },
    { key: "12PM", time: '12 PM', list: [] },
    { key: "01PM", time: '1 PM', list: [] },
    { key: "02PM", time: '2 PM', list: [] },
    { key: "03PM", time: '3 PM', list: [] },
    { key: "04PM", time: '4 PM', list: [] },
    { key: "05PM", time: '5 PM', list: [] },
    { key: "06PM", time: '6 PM', list: [] },
    { key: "07PM", time: '7 PM', list: [] },
    { key: "08PM", time: '8 PM', list: [] },
    { key: "09PM", time: '9 PM', list: [] },
    { key: "10PM", time: '10 PM', list: [] },
    { key: "11PM", time: '11 PM', list: [] },
    { key: "00AM", time: '0 AM', list: [] },
  ]

  useEffect(() => {
    dispatch(getAllAppointmentsCaoThang({ 
      dateAndTime: startDate.setHours(0,0),
      endDateAndTime: new Date(startDate).setHours(23,59),
    }));
    getdoctorlist()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(listDataResult.length > 0) {
      getOffsetPoint()
    }
  },[listDataResult])

  const getOffsetPoint =()=> {
    const elmnt = document.getElementById("point-active");
    elmnt.scrollIntoView({block: "center"})
  }

  const addAppointment = (data) => {
     getAllAppoiment()
    if (data) {
      setIsOpenDialog(false)
    }
  }

  const searchDoctor = (event) => {
    const value = event.target.value
    setTextSearch(event.target.value) 
    dispatch(getDoctorList({ pageSize: pageSize, page: page, search: value }));
  }

  const getAllAppoiment = () => {
    dispatch(getAllAppointmentsCaoThang({ 
      dateAndTime: startDate.setHours(0,0),
      endDateAndTime: new Date(startDate).setHours(23,59),
    }));
  }
 
  useEffect(() => {
    getAllAppoiment()
  }, [startDate]);

  useEffect(() => {
    if (allAppointments.length > 0) {
      const dataAppointments = allAppointments.reduce((arr, obj) => {
        const hh = moment(obj.dateAndTime).format('hh')
        const timeA = moment(obj.dateAndTime).format('A')
        const key = `${hh}${timeA}`
        if (hh != "" && obj.status === 1) (arr[key] = arr[key] || []).push(obj)
        return arr
      }, {})
      listSchedule.forEach(item => {
        Object.keys(dataAppointments).forEach((keyData, index) => {
          if (item.key === keyData) {
            item.list = dataAppointments[keyData];
          }
        })
      });
      setListDataResult(listSchedule);
    } else {
      setListDataResult(listSchedule);
    }
  }, [allAppointments]);

  return (
    <div className="container-admin">
      <div className="left">
        <div className="mb-4 btn-add-schedule bg-btn-blue w-100" onClick={openDialog}>
          <img className="pr-4" src={ico_add_schedule} alt="" />
          <p>Add Schedule</p>
        </div>
        <div className="date-picker-admin">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            inline
          />
        </div>
        <div className="search-admin form-group mr-3 mt-3 mb-3">
          <input
            className="form-control"
            type="text"
            name="search"
            placeholder="Find doctor"
            onChange={event => searchDoctor(event)}
          />
          <img src={ico_search} alt="" />
        </div>
        <div className="schedule-doctor mt-2">
          <p>Today, 27/02/2021</p>
          <button className="mb-4">All Doctors</button>
          <div className="list-schedule-doctor">
            {
              doctorlist.map((item, index) => {
                return (
                  <div className={index == 0 ? 'border-top-unset list-doctor-admin' : 'border-top-list-doctor list-doctor-admin'}>
                    <span className={item.active ? 'status-active' : 'status-unactive'}></span>
                    <p>{item.firstName} {item.lastName}</p>
                    {
                      !item.firstName && !item.lastName && (<p>{item.email}</p>)
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      <div className="right">
        <div className="list-slot-time">
          <div className="d-flex align-items-center justify-content-center">
            <p className="mb-0 mr-3 title-right">Appointment</p>
            <p className="mb-0 sub-title">Today</p>
          </div>
          <div className="find-admin">
            <div className="search-admin form-group">
              <input
                className="form-control"
                type="text"
                name="search"
              />
              <img src={ico_search} alt="" />
            </div>
          </div>
        </div>
        <div className="schedule-content">
          <div className="grid">
            <div className="box-1">GMT +7</div>
            <div className="note-schedule">{moment(startDate).format('LL')}</div>
          </div>
         {
            listDataResult && listDataResult.map((item, index) => {
              let lenghtList = item.list;
              return (
                <div className="grid item-appoiment">
                  <div className="box-1 p-re-grid"><div id={(index+ 1) == timeNow ? "point-active" : ""} className={(index+ 1) == timeNow ? 'active-slot-time' : ''}>{item.time}</div></div>
                  <div className="box-2 border-bottom-grid">{lenghtList ? item.list.map((e, i) => {
                    const {
                      dateAndTime,
                      endDateAndTime,
                    } = e;
                    const [time, timeExtra] = formatAMPM(new Date(dateAndTime));
                    return (
                        <div className="bg-grid-content" onClick={(event) => openDialog(event, e)}>
                          <p className="mb-0">{time} {timeExtra}</p>
                          <p className="mb-0">Dr.{e.doctor?.firstName}&#160;{e.doctor?.lastName} &#160;Vs { e.patient.firstName || e.patient.lastName ? e.patient?.firstName + ' '+ e.patient?.lastName : e.patient?.email} </p>
                        </div>
      
                    )
                  }) : ' '}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      <DialogAddSchedule
        isOpenFile={isOpenDialog}
        handleClose={(e) => handleClose(e)}
        dataDetail={appointmentDetail}
        selectDate={startDate}
        addAppointment={addAppointment}
      />
    </div>
  );
}
