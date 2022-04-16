/* eslint-diasble (react/jsx-filename-extension) */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import MaterialTable from 'material-table';
import { Avatar } from 'material-ui';
import Panel from './panel';

import defaultAva from '@img/d_ava.png';
import ico_bell from '@img/imi/alarm-bell-black.png';
import ico_search from '@img/imi/ico-search.png';
import icon_create_request from '@img/imi/icon_create_request.png';
import icon_record_Reader from '@img/imi/icon_record_Reader.png';
import icon_book_appointment from '@img/imi/icon_book_appointment.png';
import ico_delete from '../../../img/imi/button_delete.png';
export default function MedicalHistory() {
  const user = useSelector((state) => state.user);
  const { avatarUrl = defaultAva, firstName, lastName, address, dob } = user;
  useEffect(() => {
    // TODO: [PATIENT] fetch appointments by doctor
  }, []);

  const getBirthday = () => {
    return moment().year() - moment(dob).year();
  };
  const MaterialTableStyle = {
    boxShadow: 'none',
  };
  const infoUser = [
    {
      name: 'Blood',
      detail: 'O+',
    },
    {
      name: 'Height',
      detail: '165cm',
    },
    {
      name: 'Weight',
      detail: '60kg',
    },
    {
        name: 'WeiSmokeght',
        detail: 'No',
      },
      {
        name: 'Smoking for',
        detail: 'No',
      },
      {
        name: 'Drinking',
        detail: 'No',
      },
      {
        name: 'Family has cancer',
        detail: 'No info',
      },
      {
        name: 'Type of cancer',
        detail: 'No info',
      }
  ];
  return (
    <div className="appointment-new">
      <div className="patient-home-page">
      <div className="patient-home-content">
        <div className="topAppointment">
          <div className="leftTop">
            <h2>
              <span className="customSpan">Home</span>
            </h2>
          </div>
          <div className="rightTop">
            <a href="#!">
              <img src={ico_search} alt="" />
            </a>
            <a href="#!" className="mr-2 ml-2">
              <img src={ico_bell} alt="" />
              <span className="count">3</span>
            </a>
            <NavLink to="/update-profile" className="avatar">
              <img src={avatarUrl ? avatarUrl : defaultAva} alt='' />
            </NavLink>
          </div>
        </div>
        <div className="patient-home-content--content">
          <div className="baner m-5">
            <div className="container-bottom">
              <div className="activities-container">
                <p className="title">Medical History</p>
                <div className="activities-table position-relative">
                  <img className="button-delete" src={ico_delete} alt='' />
                  <div style={{ maxWidth: '100%' }} className="col-md-12" />
                  <Panel righticon={false}>
                    <MaterialTable
                      style={MaterialTableStyle}
                      columns={[
                        { title: 'name', field: 'name', cellStyle: {
                          color: '#797979'
                        }},
                        { title: 'detail', field: 'detail' ,cellStyle: {
                          color: '#01628D'
                        }},
                      ]}
                      data={infoUser}
                      // onRowClick={(e, selectedRow) =>
                      //   this.onRowClick(e, selectedRow)
                      // }
                      title=""
                        options={{
                          paging: false,
                          search: false,
                          header: false,
                          toolbar: false,
                          showTitle: false
                        }}
                    />
                  </Panel>
                </div>
              </div>
              <div className="select-container ml-5">
                <div className="header-new-patient">
                  <div className="box-profile mb-5">
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
                <div className="medical-history-selection">
                  <button className="gradient-blue">
                    <p>Smart Record Reader</p>
                    <img
                      src={icon_record_Reader}
                      className="icon-absolute"
                      alt=""
                    />
                  </button>
                  <button className="gradient-blue">
                    <p> Create Request</p>
                    <img
                      src={icon_create_request}
                      className="icon-absolute"
                      alt=""
                    />
                  </button>
                  <button className="gradient-blue">
                    <p> Ask Question</p>
                    <img
                      src={icon_book_appointment}
                      className="icon-absolute"
                      alt=""
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
