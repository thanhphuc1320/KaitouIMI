/* eslint-disable react/prefer-stateless-function */
import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Avatar, DropDownMenu, MenuItem } from 'material-ui';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import GridContainer from '../../components/grid/GridContainer';
import GridItem from '../../components/grid/GridItem';
import NottificationCenter from '../../components/notifications-center';
import { PATIENT_ROLE } from '../../constant';
import defaultAva from '../../img/d_ava.png';
//image
import ico_bell from '../../img/imi/alarm-bell-black.png';
import alarm_bell from '../../img/imi/alarm-bell.png';
import arrow_down from '../../img/imi/arrow_down.svg';
import bg_xray from '../../img/imi/bg-xray.png';
import button_next from '../../img/imi/button_next.png';
import ico_call from '../../img/imi/call-end.png';
import ico_gym from '../../img/imi/ico-gym.png';
import ico_warning from '../../img/imi/ico-warning.png';
import icon_book_appointment from '../../img/imi/icon_book_appointment.png';
import icon_create_request from '../../img/imi/icon_create_request.png';
import icon_record_Reader from '../../img/imi/icon_record_Reader.png';
import img_result from '../../img/imi/img-result.png';
import intersect_background from '../../img/imi/intersect_background.png';
import FlashRecordPage from '../../pages/flash-record/FlashRecordPage';
import CreateRequestPage from '../../pages/request/CreateRequestPage';
import SubmitProgressPage from '../../pages/submit-progress/SubmitProgressPage';
import '../../static/css/patient-dashboard.css';
import { getAppointments } from '../../store/actions/appointment.action';

import {
  convertDate,
  convertDrinkingAlcohol,
  convertFamilyDisease,
  convertIsSmoking,
  convertMilisecondToDate,
  convertSmokingYear,
  convertToDiseaseName,
  convertToStatusName,
  formatAMPM,
} from '../../utils';
import OldPatientDashboard from './oldDashboard/oldPatientDashboard';
import DetailPatientDashboard from './subcomponents/detailPatientDashboard';
import ListItem from './subcomponents/ListItem';

const styles = {
  panelTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  dropDownMenu: {
    marginLeft: 'auto',
    order: '2',
    fontSize: '14px',
    paddingTop: '8px',
  },
  dropDownItem: {
    fontSize: '14px',
  },
  userInfoTitle: {
    alignSelf: 'flex-end',
  },
};

export default function PatientDashboard(props) {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(props.activeTab || -1);
  const [dateChoose, setDateChoose] = useState(new Date());
  // Similar to ComponentDidMount, setActiveTab to -1 based on props
  const user = useSelector((state) => state.user);
  const { appointments } = useSelector((state) => state.appointment) || [];
  const filteredUser = { ...user };
  const [filteredUserFilter, setFilteredUser] = useState(filteredUser);
  const request = useSelector((state) => state.request);
  const [startDate] = useState(new Date());
  let upcomingAppointmentList = [];
  let previousAppointmentList = [];
  const dataAllRequest = []

  useEffect(() => {
    dispatch(getAppointments({ patient: user._id }));
    setFilteredUser({ ...filteredUser});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, request]);

  useEffect(() => {
    handleChangeDate(dateChoose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  // Sort by date
  appointments
    .sort((a, b) => new Date(a.dateAndTime) - new Date(b.dateAndTime))
    .map((appointment) => {
      if (new Date(appointment.dateAndTime) > startDate)
        upcomingAppointmentList.push(appointment);
      else previousAppointmentList.push(appointment);
    });

  const filteredRequests = {};
  const {
    avatarUrl = defaultAva,
    firstName,
    lastName,
    requests = [],
    email = '',
    role,
    address,
    dob,
  } = user;
  if (role === PATIENT_ROLE && requests && requests.length) {
    filteredRequests['0'] = requests.filter(
      (request) =>
        (request.status === 0 || !request.status) &&
        moment(request.createdAt).format('DD/MM/YYYY') ===
          moment(dateChoose).format('DD/MM/YYYY')
    );
    filteredRequests['1'] = requests.filter((request) => request.status === 1);
    filteredRequests['2'] = requests.filter((request) => request.status === 2);
    filteredUser.requests = filteredRequests;
  }

  if (requests) {
    filteredRequests[0] = requests.filter(
      (request) => request.status === 0 || !request.status
    );
    filteredRequests[1] = requests.filter((request) => request.status === 1);
    filteredRequests[2] = requests.filter((request) => request.status === 2);
  }

  /*
    Status:
    - 0: Waiting
    - 1: In Progress
    - 2: Completed
    - 3: Rejected
    - 4: Claimed
  */
  let i = 1;
  const filteredRequestsToReview = filteredRequests[2] || [];
  const restructuredRequests = [];
  filteredRequestsToReview
    .sort((a, b) => convertDate(b.createdAt) - convertDate(a.createdAt))
    .map((req) => {
      const { type, createdAt, status, _id } = req;
      const newRequest = {
        id: i,
        createdAt: convertMilisecondToDate(createdAt, 'string') || '',
        type: convertToDiseaseName(type) || '',
        _id,
        status: convertToStatusName(status),
        patientEmail: email,
      };
      restructuredRequests.push(newRequest);
      i += 1;
    });
  const goToAppointmentPage = (e) => {
    props.history.push('/appointment');
  };

  const handleChangeDate = (event) => {
    const filterUser = filteredUser.requests;
      for(const item in filterUser){
        filterUser[item].forEach(itemRequest => {
          dataAllRequest.push(itemRequest)
        })
      }
      const dataTemp = dataAllRequest.filter((item) => {
        return (
          moment(item.createdAt).format('DD/MM/YYYY') ===
          moment(event).format('DD/MM/YYYY')
        );
      });
      filteredUser.requests = dataTemp;
    setFilteredUser({ ...filteredUser });
    setDateChoose(event);
  };

  const getBirthday = () => {
    return moment().year() - moment(dob).year();
  };

  return (
    <div className="patient-home-page">
      {activeTab !== 0 && activeTab !== 1 && activeTab !== 5 && activeTab !== 6? (
        <div className="patient-home-content">
          <div className="topAppointment">
            <div className="leftTop">
              <h2>Home</h2>
            </div>
            <div className="rightTop">
              <NottificationCenter />
              <NavLink to="/update-profile" className="avatar">
                <img src={avatarUrl} alt='' />
                {/* <img src={avatarUrl}alt='' /> */}
              </NavLink>
            </div>
          </div>
          <div className="patient-home-content--content">
            <div className="baner">
              <div className="header-new-patient">
                <div className="left-header">
                  <div className="baner-image">
                    <div className="child-baner-image">
                      <p className="baner-content-hello">
                        Hi,
                        {firstName || lastName ? (
                          <span>
                            {' '}
                            {firstName} {lastName}
                          </span>
                        ) : (
                          <span> {email}</span>
                        )}
                        !
                        <br />
                        <p className="baner-content-hello today">
                          How are you today?{' '}
                        </p>
                      </p>
                      <img src={intersect_background} alt='' />
                    </div>
                    <div className="baner-content">
                      <img src={alarm_bell} alt='' />
                      {
                        upcomingAppointmentList.length > 0 ? (
                          <p>
                            {upcomingAppointmentList.map((appointment, index) => {
                              const bookingDate = new Date(
                                appointment.dateAndTime
                              ).toLocaleString('default', { month: 'short', day: 'numeric' });
                              const [bookingTime] = formatAMPM(
                                appointment.dateAndTime
                              );
                              const res = bookingDate.split(" ");
                              if (index === 0) {
                                return (
                                  <p key={index}>You have an appointment with Doctor {appointment.doctor.firstName ? appointment.doctor.firstName : ''} at {bookingTime} {res[0]} {res[1]}</p>
                                );
                              }
                            })}
                          </p>
                        ) : ( <p>You do not have any appointments today</p>)
                      }
                    </div>
                  </div>
                  <div className="slider-content">
                    <div className="pr-3">
                      <div className="item-slide">
                        <GridContainer>
                          <GridItem xs={6} onClick={() => setActiveTab(-1)}>
                            <img
                              alt=''
                              src={img_result}
                              className="image-slide"
                              onClick={() => setActiveTab(-1)}
                            />
                          </GridItem>
                          <GridItem xs={6} onClick={() => setActiveTab(-1)}>
                            <div className="text-center mt-4">
                              <p className="title m-0">Medical Test</p>
                              <img src={button_next} className="icon-next" alt='' />
                            </div>
                          </GridItem>
                        </GridContainer>
                      </div>
                    </div>
                    <div className="medical-history-slide pr-3">
                      <div className="item-slide">
                        <GridContainer>
                          <GridItem xs={6} onClick={() => setActiveTab(5)}>
                            <img
                              src={bg_xray}
                              alt=''
                              className="image-slide"
                              onClick={() => setActiveTab(5)}
                            />
                          </GridItem>
                          <GridItem xs={6} onClick={() => setActiveTab(5)}>
                            <div className="text-center mt-4">
                              <p className="title m-0">Medical History</p>
                              <img src={button_next} className="icon-next" alt='' />
                            </div>
                          </GridItem>
                        </GridContainer>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-profile">
                  <div className="info">
                    <p className="avatar">
                      <Avatar
                        className="upload-avatar"
                        src={avatarUrl}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          height: '200px',
                          width: '200px',
                          objectFit: 'cover',
                        }}
                      />
                    </p>
                    <h2 className="full-name m-0">
                      {firstName} {lastName}
                    </h2>
                    <p className="info">
                      {getBirthday()} years, {address}
                    </p>
                  </div>
                </div>
              </div>
              <div className="container-bottom">
                <div className="activities-container">
                  <div className="medical-history">
                    <div className="title-home clearfix">
                      <h2>Activities</h2>
                      <p className="date-picker-actives d-flex">
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <DatePicker
                            id="activities-date-picker"
                            disableToolbar
                            variant="inline"
                            format="DD/MM/YYYY"
                            value={dateChoose}
                            onChange={handleChangeDate}
                          />
                        </MuiPickersUtilsProvider>
                        <img
                          src={arrow_down}
                          alt=''
                          onClick={() =>
                            document
                              .getElementById('activities-date-picker')
                              .click()
                          }
                        />
                      </p>
                    </div>
                    <div className="">
                      <OldPatientDashboard user={filteredUserFilter} />
                    </div>
                  </div>
                </div>
                <div className="select-container">
                  <div className="medical-history-selection">
                    <button
                      className={
                        activeTab === 0
                          ? 'btn-gradient-yellow'
                          : 'gradient-blue'
                      }
                      onClick={() => setActiveTab(0)}
                    >
                      <p>Smart Record Reader</p>
                      <img src={icon_record_Reader} className="icon-absolute" alt='' />
                    </button>
                    <button
                      className={
                        activeTab === 1
                          ? 'btn-gradient-yellow'
                          : 'gradient-blue'
                      }
                      onClick={() => setActiveTab(1)}
                    >
                      <p> Create Request</p>
                      <img
                        src={icon_create_request}
                        className="icon-absolute"
                        alt=''
                      />
                    </button>
                    <button
                      className="gradient-blue"
                      onClick={(e) => goToAppointmentPage(e)}
                    >
                      <p> Ask Question</p>
                      <img
                        src={icon_book_appointment}
                        className="icon-absolute"
                        alt=''
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="patient-full-page">
          <div className="topAppointment">
            <div className="leftTop">
              {activeTab === 0 ? (
                <h2 className="color-appoiment-h2">
                  <a onClick={() => setActiveTab(-1)}>Home</a> Smart Record
                  Reader
                </h2>
              ) : (activeTab === 5 || activeTab === 6) ? (
                <h2>
                  <a onClick={() => setActiveTab(-1)}>Home</a>
                </h2>
              ) : (
                <h2 className="color-appoiment-h2">
                  <a onClick={() => setActiveTab(-1)}>Home</a> Create Request
                </h2>
              )}
            </div>
            <div className="rightTop">
              <a href="#">
                <img src={ico_bell} alt='' />
                <span className="count">3</span>
              </a>
              <a href="#" className="avatar">
                <img src={avatarUrl} alt='' />
              </a>
            </div>
          </div>
          {activeTab === 0 && <FlashRecordPage onSetActiveTab={setActiveTab} />}
          {activeTab === 1 && <CreateRequestPage onUploaded={setActiveTab} />}
          {activeTab === 3 && <SubmitProgressPage />}
          {activeTab === 5 && (
            <DetailPatientDashboard
              history={props.history}
              onSetActiveTab={setActiveTab}
            />
          )}
        </div>
      )}
    </div>
  );
}

const HomePage = ({ medical, restructuredRequests }) => {
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={6}>
        <div className="medical-history">
          <div className="title-home clearfix">
            <h2>Medical History</h2>
            <p>10 May 2020</p>
          </div>
          <div className="box-info-customer">
            <MedicalHistory medical={medical} />
          </div>
        </div>

        {restructuredRequests && restructuredRequests.length > 0 && (
          <TestResultsPanel requests={restructuredRequests} />
        )}
      </GridItem>
      <GridItem xs={12} sm={12} md={6}>
        <div className="reminders">
          <div className="title-home title-home-remind clearfix">
            <h2>Reminders</h2>
            <p className="alarm">
              <span>(2 news)</span>
            </p>
          </div>
          <div className="list-play-gym clearfix">
            <ul className="">
              <li className="clearfix">
                <div className="left-gym">
                  <p className="image">
                    <img src={ico_gym} alt='' />
                  </p>
                  <p>Remember to exercise twice every day.</p>
                </div>
                <div className="right-gym">2m</div>
              </li>
              <li className="clearfix">
                <div className="left-gym">
                  <p className="image">
                    <img src={ico_warning} alt='' />
                  </p>
                  <p>Please have your blood test in two weeks!</p>
                </div>
                <div className="right-gym">2m</div>
              </li>
              <li className="clearfix">
                <div className="left-gym">
                  <p className="image">
                    <img src={ico_gym} alt='' />
                  </p>
                  <p>Remember to exercise twice every day.</p>
                </div>
                <div className="right-gym">2m</div>
              </li>
            </ul>
          </div>
        </div>
        {restructuredRequests && restructuredRequests.length > 0 && (
          <ActivitiesPanel requests={restructuredRequests} />
        )}
      </GridItem>
    </GridContainer>
  );
};

const MedicalHistory = ({
  medical: {
    bloodType,
    userHeight,
    userWeight,
    isSmoking,
    smokingYear,
    drinkingAlcohol,
    familyCancer,
    familyCancerType,
    familyHighBlood,
    familyHighCholesterol,
    familyDiabetes,
  },
}) => (
  <ul className="list-info">
    <ListItem title="Blood" body={bloodType || 'N/A'} />
    <ListItem title="Height" body={userHeight || 'N/A'} />
    <ListItem title="Weight" body={userWeight || 'N/A'} />
    <ListItem title="Smoking" body={convertIsSmoking(isSmoking)} />
    <ListItem title="Smoking for" body={convertSmokingYear(smokingYear)} />
    <ListItem title="Drinking" body={convertDrinkingAlcohol(drinkingAlcohol)} />
    <ListItem
      title="Family has cancer"
      body={convertFamilyDisease(familyCancer)}
    />
    <ListItem title="Cancer Type" body={familyCancerType || 'N/A'} />
    <ListItem
      title="Family has high blood"
      body={convertFamilyDisease(familyHighBlood)}
    />
    <ListItem
      title="Family has high Cholesterol"
      body={convertFamilyDisease(familyHighCholesterol)}
    />
    <ListItem
      title="Family has diabetes"
      body={convertFamilyDisease(familyDiabetes)}
    />
  </ul>
);

const DatePickerCustom = ({
  dateOptions,
  selectedDateValue,
  setSelectedDateValue,
}) => {
  return (
    <DropDownMenu
      style={styles.dropDownMenu}
      value={selectedDateValue}
      onChange={(e, index, value) => setSelectedDateValue(value)}
    >
      {dateOptions.map((date) => (
        <MenuItem
          value={date.value}
          primaryText={date.dateString}
          style={styles.dropDownItem}
        />
      ))}
    </DropDownMenu>
  );
};

const ActivitiesPanel = ({ requests }) => {
  const mostRecentDate = requests ? requests[0].createdAt : '';
  const [selectedDateValue, setSelectedDateValue] = useState(
    new Date(mostRecentDate).valueOf()
  );

  // TODO: find a better way to do this
  const dates = requests.map((request) => request.createdAt);
  const distinctDates = [...new Set(dates)];

  const dateOptions = [];
  distinctDates.map((date) => {
    dateOptions.push({
      value: new Date(date).valueOf(),
      dateString: date,
    });
  });

  const filteredRequests = requests.filter(
    (request) => new Date(request.createdAt).valueOf() === selectedDateValue
  );

  return (
    <div className="activities">
      <div className="title-home clearfix" style={styles.panelTitle}>
        <h2 style={styles.userInfoTitle}>Activities</h2>
        <DatePickerCustom
          dateOptions={dateOptions}
          selectedDateValue={selectedDateValue}
          setSelectedDateValue={setSelectedDateValue}
        />
      </div>
      <div className="box-info-customer box-info-blood">
        <ul className="list-activities">
          {filteredRequests &&
            filteredRequests.length > 0 &&
            filteredRequests.map((request) => (
              <li className="clearfix">
                <Link to={`requests/${request._id}`}>
                  <div className="left-activities">
                    <p>
                      <img src={ico_call} alt='' />
                    </p>
                    <p className="image">Waiting Request</p>
                  </div>
                  <div className="right-activities">
                    {convertMilisecondToDate(request.createdAt)}
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

const TestResultsPanel = ({ requests }) => {
  const mostRecentDate = requests ? requests[0].createdAt : '';
  const typeSet = new Set();
  const [selectedTestOption, setSelectedTestOption] = useState(0);
  const [selectedDateValue, setSelectedDateValue] = useState(
    new Date(mostRecentDate).valueOf()
  );

  if (requests) {
    requests.map((r) => typeSet.add(r.type));
    const types = Array.from(typeSet);
    const filteredRequests = requests.filter(
      (r) =>
        r.type === types[selectedTestOption] &&
        new Date(r.createdAt).valueOf() === selectedDateValue
    );
    if (filteredRequests.length > 0) {
    }
  }

  // TODO: find a better way to do this
  const dates = requests.map((request) => request.createdAt);
  const distinctDates = [...new Set(dates)];

  const dateOptions = [];
  distinctDates.map((date) => {
    dateOptions.push({
      value: new Date(date).valueOf(),
      dateString: date,
    });
  });

  return (
    <div className="medical-history">
      <div className="title-home clearfix" style={styles.panelTitle}>
        <DropDownMenu
          value={selectedTestOption}
          onChange={(e, index, value) => {
            setSelectedTestOption(value);
          }}
        >
          {Array.from(typeSet).map((opt, index) => (
            <MenuItem value={index} primaryText={opt} />
          ))}
        </DropDownMenu>
        <DatePicker
          dateOptions={dateOptions}
          selectedDateValue={selectedDateValue}
          setSelectedDateValue={setSelectedDateValue}
        />
      </div>

      <div className="box-info-customer box-info-blood">
        <img src={img_result} alt='' />
      </div>
    </div>
  );
};
