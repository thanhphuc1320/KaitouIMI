import React, { useEffect, useState, useCallback  } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from "lodash";
import ico_search from '../../img/imi/ico-search-admin.png';
import ico_alarm_bell from '../../img/imi/alarm-bell-blue.png';
import ico_add_schedule from '../../img/imi/ico-add-schdule.png';
import defaultAva from '../../img/d_ava.png';
import '../../static/css/listAdmin.css';
import { getDoctorList } from '../../store/actions/user.action';
import { useHistory } from 'react-router-dom';

export default function DoctorAdmin(props) {
  const history = useHistory();
  const { doctorlist = [] } = useSelector((state) => state.user);
  const {isFetching = {}} = useSelector((state) => state.loading);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [dataShow, setDataShow] = useState([]);
  const pageSize = 18;
  const [search, setTextSearch] = useState('');
  const yearNow = new Date().getFullYear()

  const editDetailDoctor = (e, value) => {
    if (!isFetching) {
      history.push(`/doctor-admin/doctor/${value._id}`);
    }
  };
  const addDoctor = () => {
    history.push('/doctor-admin/doctor');
  };
  useEffect(() => {
    getdoctorlist({ page: 1 });
  }, []);

  useEffect(() => {
    setDataShow(doctorlist);
  }, [doctorlist]);

  const onScroll = () => {
    const list = document.getElementById('list-doctor');
    if (Math.floor(list.scrollTop) + list.clientHeight === list.scrollHeight) {
      getdoctorlist();
    }
  };
  const fetchDropdownOptions =(key) =>{
    setPage(1);
    dispatch(getDoctorList({ pageSize: pageSize, page: 1 , search: key}));
  }
  const debounceDropDown = useCallback(debounce((nextValue) => fetchDropdownOptions(nextValue), 1000), [])

  const searchDoctor =(event) =>{
    const value = event.target.value
    setTextSearch(value)
    debounceDropDown(value);
  }
  
  const getdoctorlist = () => {
    dispatch(getDoctorList({ pageSize: pageSize, page: page}));
    setPage(page + 1);

  }
  const countAge = (dayOfBirth) =>{
    let getYear = new Date(dayOfBirth).getFullYear()
    return yearNow - getYear    
  }
  
  return (
    <div className="sub-content-admin">
      <div className="header-content-admin mb-4">
        <div className="left">
          <p>Doctor List </p>
          <button className="btn-add-listPatient" onClick={addDoctor}>
            Add Doctor <img className="ml-5" src={ico_add_schedule} alt="" />
          </button>
        </div>
        <div className="right">
          <span>A new Doctor was added by Admin</span>
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
                placeholder="Find doctor"
                onChange ={ event => searchDoctor(event)}
              />
              <img src={ico_search} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="content-list" id="list-doctor"onScroll={() => {onScroll();}}>
        {dataShow.length> 0 ? (
          <div
            className="list-admin"
          >
            {dataShow.map((item, index) => {
              return (
                <div
                  key={index}
                  className="item-grid"
                  onClick={(e) => editDetailDoctor(e, item)}
                >
                  <a>
                    <img
                      src={item.avatarUrl ? item.avatarUrl : defaultAva}
                      alt=""
                    />
                  </a>
                  <div className="p-2">
                    <h3>{item.firstName ? item.firstName : 'Anonymous'}</h3>
                   
                    <p>{item.dob ? countAge(item.dob) +' '+ 'years' : 'No Birthday'}</p>
                  </div>
                  <div className="detail">{item.hospitalId ? item.hospitalId :'No Hospital ID'}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="center"><h4>No data</h4></div>
        )}
      </div>
    </div>
  );
}
