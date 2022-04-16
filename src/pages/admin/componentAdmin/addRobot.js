import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';
import styles from '../../../layouts/styles/userProfileStyle';
import Avatar from 'material-ui/Avatar';
import defaultAva from '../../../img/d_ava.png';
import Input from '@material-ui/core/Input';

import ico_search from '../../../img/imi/ico-search-admin.png';
import ico_alarm_bell from '../../../img/imi/alarm-bell-blue.png';
import ico_back from '../../../img/imi/ico-back-white.png';

export default function AddRobotAdmin(props) {
  const history = useHistory();
  const backListRobot = () => {
    history.push('/robot-admin');
  };
  const onChangeSelected = (value) => {
    console.log(value);
  };

  return (
    <div className="sub-content-admin center">
      <div className="header-content-admin mb-4">
        <div className="left">
          <button className="btn-back-listPatien" onClick={backListRobot}>
            <img src={ico_back} alt="" />
          </button>
          <p>Add Robot</p>
        </div>
        <div className="right">
          <span>A new Robot was added by Admin</span>
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
                placeholder="Find Robot"
              />
              <img src={ico_search} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="panel-body">
        <input
          accept="image/jpeg,image/gif,image/png"
          id="outlined-button-file-avatar-upload"
          multiple={false}
          type="file"
          onChange={(e) => this.handleInputChange(e, 'avatar-upload')}
          name="upload-avatar"
          style={styles.FileInput}
        />
        <div className="upload-avatar-wrap">
          <div className="avatar-personal custom-width-cloud">
            <Avatar
              className="upload-avatar"
              src={defaultAva}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                height: '120px',
                width: '120px',
                objectFit: 'cover',
                boxShadow: '0 10px 20px 0 rgb(0 255 245 / 50%)',
                border: '4px solid #ffff'
              }}
            />
            <label htmlFor="outlined-button-file-avatar-upload">
              <div className="upload-avatar-overlay">
                <CloudUploadIcon style={styles.CloudUploadIcon} width={200} />
              </div>
            </label>
          </div>
        </div>
      </div>
      <div className="d-flex details-admin justify-content-center mt-2">
        <div className="grid-add-robot">
          <div className="form-group">
            <Input
              type="text"
              className="form-control"
              name="first_name"
              value="Robot Name"
            />
          </div>
          <div className="form-group">
            <label for="">ID Number</label>
            <Input
              type="text"
              className="form-control"
              name="ID_Number"
              value="R12345-6789-0000"
            />
          </div>
          <div className="form-group">
            <label for="">Location</label>
            <Input
              type="text"
              className="form-control"
              name="address"
              value="1st Floor"
            />
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button className="btn-back-home-admin">Submit</button>
      </div>
    </div>
  );
}
