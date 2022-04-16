import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';

import ico_search from '../../img/imi/ico-search-admin.png';
import ico_alarm_bell from '../../img/imi/alarm-bell-blue.png';
import ico_add_schedule from '../../img/imi/ico-add-schdule.png';
import defaultAva from '../../img/d_ava.png';
import '../../static/css/listAdmin.css';

import { useHistory } from 'react-router-dom';
import { getPatientList } from '../../store/actions/user.action';

export default function PatientAdmin(props) {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [dataShow, setDataShow] = useState([]);
  const { patientlist = [] } = useSelector((state) => state.user);
  const { isFetching = {} } = useSelector((state) => state.loading);
  const pageSize = 18;
  const [search, setTextSearch] = useState('');
  const yearNow = new Date().getFullYear();

  const addPatient = () => {
    history.push('/patient-admin/patient');
  };
  useEffect(() => {
    getListPatient({ page: 1 });
  }, []);

  useEffect(() => {
    setDataShow(patientlist);
  }, [patientlist]);

  const onScroll = () => {
    const list = document.getElementById('list-patient');
    if (Math.floor(list.scrollTop) + list.clientHeight === list.scrollHeight) {
      getListPatient();
    }
  };
  const fetchDropdownOptions = (value) => {
    setPage(1);
    dispatch(getPatientList({ pageSize: pageSize, page: 1, search: value }));
  };
  const debounceDropDown = useCallback(
    debounce((nextValue) => fetchDropdownOptions(nextValue), 1000),
    []
  );

  const searchPatient = (event) => {
    const value = event.target.value;
    setTextSearch(value);
    debounceDropDown(value);
  };

  const getListPatient = () => {
    dispatch(
      getPatientList({ pageSize: pageSize, page: page, search: search })
    );
    setPage(page + 1);
  };
  const editDetailPatient = (e, value) => {
    if (!isFetching) {
      history.push(`/patient-admin/patient/${value._id}`);
    }
  };
  const countAge = (dayOfBirth) => {
    let getYear = new Date(dayOfBirth).getFullYear();
    return yearNow - getYear;
  };

  return (
    <div>
      <div className="sub-content-admin">
        <div className="header-content-admin mb-4">
          <div className="left">
            <p>Patient List </p>
            <button onClick={addPatient} className="btn-add-listPatient">
              Add Patient
              <img className="ml-5" src={ico_add_schedule} alt="" />
            </button>
          </div>
          <div className="right">
            <span>A new Patient was added by Admin</span>
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
                  placeholder="Find Patient"
                  onChange={(event) => searchPatient(event)}
                />
                <img src={ico_search} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div
          className="content-list"
          id="list-patient"
          onScroll={() => {
            onScroll();
          }}
        >
          {dataShow.length > 0 ? (
            <div className="list-admin">
              {dataShow.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="item-grid"
                    onClick={(e) => editDetailPatient(e, item)}
                  >
                    <a>
                      <img
                        src={item.avatarUrl ? item.avatarUrl : defaultAva}
                        alt=""
                      />
                    </a>
                    <div className="p-2">
                      <h3>{item.firstName ? item.firstName : 'Anonymous'}</h3>
                      <p>
                        {item.dob
                          ? countAge(item.dob) + ' ' + 'years'
                          : 'No Birthday'}
                      </p>
                    </div>
                    <div className="detail">
                      <div
                        className="sub-detail"
                        style={{
                          width: '180px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.patientNumber ? item.patientNumber : item.email}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="center">
              <h4>No data</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
