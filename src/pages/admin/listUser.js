import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import defaultAva from '@img/d_ava.png';
import { getPatientList, getDoctorList } from '../../store/actions/user.action';

export default function ListUser(props) {
  const role = props.role
  const [loadMore, setLoadMore] = useState(true);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [dataShow, setDataShow] = useState([]);
  const { doctorlist = [], patientlist = [] } = useSelector((state) => state.user);
  const pageSize = 20

  useEffect(() => {
    if (role === 'patient') {
      getListPatient({page: 1})
    } else {
      getListDoctor({page: 1})
    }
  }, []);

  useEffect(() => {
    if (role === 'patient') {
      setDataShow(patientlist)
    } else {
      setDataShow(doctorlist)
    }
  }, [doctorlist, patientlist]);

  const onScroll = () => {
    const list = document.getElementById('list-patient')
    if (Math.floor(list.scrollTop) + list.clientHeight === list.scrollHeight) {
      if (role === 'patient') {
        getListPatient()
      } else {
        getListDoctor()
      }
    }
  }

  const getListPatient = () => {
    dispatch(getPatientList({ pageSize: pageSize, page: page}));
    setPage(page + 1)
  }

  const getListDoctor = () => {
    dispatch(getDoctorList({ pageSize: pageSize, page: page}));
    setPage(page + 1)
  }

  return (
    <div className="list-patient" id="list-patient" onScroll={() => {onScroll()}}>
      {
        dataShow.map((item, key) => {
          return (
            <div id="list" className="container-item-right" key={key}>
              <div className="right-item-call">
                <div className="item-call-avatar">
                  <img src={item.avatarUrl ? item.avatarUrl : defaultAva}></img>
                </div>
                <div className="item-call-detail">
                  <span>{item.firstName ? item.firstName : 'User'}</span>
                  <p>32 years, Detail</p>
                </div>
                <div className="item-call-submit">
                  <p>Neurology</p>
                </div>
              </div>
            </div>
          );
        })
      }
    </div>
  )
}
