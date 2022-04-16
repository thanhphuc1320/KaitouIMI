import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';
import { toast } from 'react-toastify';

import {
  uploadPublicFileApiCall,
} from '../../../apiCalls/file.api';
import { updateAdminRobot, getAdminRobot } from '../../../store/actions/robot.action';

import styles from '../../../layouts/styles/userProfileStyle';
import Avatar from 'material-ui/Avatar';
import defaultAva from '../../../img/d_ava.png';
import Input from '@material-ui/core/Input';
import ico_edit from '../../../img/imi/ico-edit-admin.png';
import ico_save from '../../../img/imi/ico-save.png';

import ico_search from '../../../img/imi/ico-search-admin.png';
import ico_alarm_bell from '../../../img/imi/alarm-bell-blue.png';
import ico_back from '../../../img/imi/ico-back-white.png';

export default function EditRobotAdmin(props) {
  const dispatch = useDispatch();
  const params = useParams();
  const [activeTab, setActiveTab] = useState(false); 
  const [uploadAvatar, setUploadAvatar] = useState();
  const [dataDetailRobot, setDataDetailRobot] = useState(); 
  const { adminRobots = [] } = useSelector((state) => state.robot);

  const history = useHistory();

  const backListRobot = () => {
    history.push('/robot-admin');
  };

  const editRobotAdmin = ()=>{
    setActiveTab(true);
  }

  const updateRobotAdmin = () => {
    const data = {
      _id: params.uuid,
      name: dataDetailRobot.name,
      location: dataDetailRobot.location
      }
    if (uploadAvatar) {
      data.image = uploadAvatar
    }
    if (dataDetailRobot.name && dataDetailRobot.location) {
      dispatch(updateAdminRobot(data))
      history.push('/robot-admin');
    }
  }

  const changeinfoRobot = (event, field) => {
    setDataDetailRobot({
      ...dataDetailRobot,
      [field]: event.target.value
    })
  }

  let data = {
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    address: '',
    patientNumber: '',
    hospitalId: '',
    typeOfCare: '',
    specialist: '',
    avatarUrl: defaultAva
  }
  let toastId = null;
  const notify = () =>
    (toastId = toast('Uploading File..', {
    className: 'toast-container',
  }));

  const handleInputChange = (e, type) => {
    const { files } = e.target || [];
    const dataUpload = {...data}
    notify()
    if (files.length === 1) {
      const file = files[0];
      const fileType = file['type'];
      const uploadingData = {
        file,
        patientId: dataUpload._id,
        fileTestType: 'public',
      };
      uploadPublicFileApiCall(uploadingData).then((res) => {
        const { status } = res;
        const dataResult = res.data
        const fileUrl = dataResult[0].fileUrl || {};
        if (status === 200 && fileUrl.length > 0) {
          toast.update(toastId, {
            render: 'Uploaded',
            type: toast.TYPE.INFO,
            className: 'update-toast-container',
            progressClassName: 'update-progress-bar',
            autoClose: 1000,
          });
          // Avatar Upload
          let dataUploadImg;
          if (type === 'avatar-upload') {
            dataUploadImg = { avatarUrl: fileUrl, avatarType: fileType }
          }
          // Update link of additional Information
          if (type[0] === 'u') {
            const addedInfo = data.addedInfo || [];
            const index = parseInt(type.slice(2));
            const newInformation = {
              ...addedInfo[index],
              ...{ link: fileUrl, fileType },
            };
            const newAddedInfo = [
              ...addedInfo.slice(0, index),
              newInformation,
              ...addedInfo.slice(index + 1),
            ];
            dataUploadImg = { addedInfo: newAddedInfo };
          }
          setUploadAvatar(dataUploadImg.avatarUrl)
        }
      });
    }
  }

  useEffect (() =>{
    if (adminRobots) {
      setDataDetailRobot(adminRobots)
      setUploadAvatar(adminRobots?.image || null)
    }
  }, [adminRobots])

  useEffect (() =>{
    setActiveTab(false)
    dispatch(getAdminRobot({id: params.uuid}))
  }, [])
  return (
    <div className="sub-content-admin center">
      <div className="header-content-admin mb-4">
        <div className="left">
          <button className="btn-back-listPatien" onClick={backListRobot}>
            <img src={ico_back} alt="" />
          </button>
         { !activeTab? <p>Edit Robot’s info</p>:<p>Robot’s info</p>}
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
          onChange={(e) => handleInputChange(e, 'avatar-upload')}
          name="upload-avatar"
          style={styles.FileInput}
          disabled={!activeTab}
        />
        <div className="upload-avatar-wrap">
          <div className="avatar-personal custom-width-cloud">
            <Avatar
              className="upload-avatar"
              src={uploadAvatar ? uploadAvatar:defaultAva}
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
              value={dataDetailRobot?.name || ''}
              disabled={!activeTab}
              onChange={(value, data) => changeinfoRobot(value, 'name')}
            />
          </div>
          <div className="form-group">
            <label for="">Location</label>
            <Input
              disabled={!activeTab}
              type="text"
              className="form-control"
              name="address"
              value={dataDetailRobot?.location || ''}
              onChange={(value) => changeinfoRobot(value, 'location')}
            />
          </div>
        </div>
      </div>
      {
        !activeTab ? (
          <div style={{ textAlign: 'center' }}>
            <button className="btn-back-home-admin mr-5" onClick={backListRobot}>Cancel</button>
            <button className="btn-edit-robot-admin" onClick={editRobotAdmin}><img className="pr-4" src={ico_save} alt="" /> Edit Robot’s Info</button>
        </div>
        ): (
        <div>
          <div style={{ textAlign: 'center' }}>
            <button className="btn-edit-robot-admin" onClick={updateRobotAdmin}><img className="pr-4" src={ico_edit} alt="" /> Save</button>
          </div>
        </div>
        )
      }
    </div>
  );
}
