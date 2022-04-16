import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { NavLink, useParams } from 'react-router-dom';
import '../../../static/css/details-admin.css';
import defaultAva from '../../../img/d_ava.png';
import Input from '@material-ui/core/Input';
import SelectionField from '../../../components/dialog/components/selectionField';
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';
import upload_pic from '@img/imi/upload_pic.png';
import ico_search from '../../../img/imi/ico-search-admin.png';
import ico_alarm_bell from '../../../img/imi/alarm-bell-blue.png';
import ico_back from '../../../img/imi/ico-back-white.png';
import Avatar from 'material-ui/Avatar';
import styles from '../../../layouts/styles/userProfileStyle';
import ico_edit from '../../../img/imi/ico-edit-admin.png';
import ico_save from '../../../img/imi/ico-save.png';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import TextField from '@material-ui/core/TextField';
import Swal from 'sweetalert2';
import { makeStyles } from '@material-ui/core/styles';

import { toast } from 'react-toastify';
import {
  uploadPublicFileApiCall,
} from '../../../apiCalls/file.api';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {createUserApi, updateUser, getUserId, deleteUser } from '../../../store/actions/user.action';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    color: '#4f4f4f !important'
  },
  textField: {
    width: 200,
  },
}));

export default function AddUserAdmin(props) {
  const requestSendCreate = useSelector((state) => {
    return state;
  });
  const params = useParams();
  const classes = useStyles();
  const role = params.role;
  const uuid = params.uuid;
  const title = role === 'patient' ? 'Patient' : 'Doctor';
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(1);
  const [selectType, setSelectType] = useState(null);
  const [selectSpecialist, setSelectSpecialist] = useState(null);
  const [selectGender, setSelectGender] = useState(null);
  const { userProfile } = useSelector((state) => state.user);
  const { errorUpdateUser } = useSelector((state) => state.user)
  const [selectDay, setSelectDay] = useState (null)
  const [isDisable, setISDisable] = useState()
  const [uploadAvatar, setUploadAvatar] = useState();
  const listType = [
    { label: 'Cancer', value: 'Cancer' },
    { label: 'Heart', value: 'Heart' },
    { label: 'Liver', value: 'Liver' },
    { label: 'Blood', value: 'Blood' },
    { label: 'Nerve', value: 'Nerve' },
  ];

  const listSpecialist = [
    { label: 'Blood', value: 'Blood' }
  ];

  const listGender = [
    {label: 'Men', value: 'Men'},
    {label: 'Women', value: 'Women'},
    {label: 'Other', value: 'Other'}
  ]

  const onChangeSelectedType = (value) => {
    setSelectType(value);
  };
  const onChangeSelectedSpecialist = (value) => {
    setSelectSpecialist(value);
  };
  const onChangeSelectedGender = (value) => {
    setSelectGender(value);
  }
  const handleDateChange = (data) => {
    const value = data.target.value
    setSelectDay(value)
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
  let data = {
    role: role,
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
    gender: '',
    affiliations: '',
    title: '',
    bio: '',
    avatarUrl: ''
  }
  const [dataCreate, setDataCreate] = useState(data);
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const changeDataProfile = (event, fieldName, value) => {
    setDataCreate({ ...dataCreate, [fieldName]: event?.target.value || value });
  };

  const validateFormCreateUser = () => {
    if (dataCreate.email.length ===0) {
      window.alert('Your email is Invalid'); 
      return true
    } else {
      return false
    }
  }
  const onSubmit = async () => {
     if(!validateFormCreateUser ()){
        let dataCreatePatient = {
          role: role,
          email: dataCreate.email,
        }
        let dataCreateDoctor ={
          role: role,
          email: dataCreate.email,
        }
        if( dataCreate.address){
          dataCreatePatient.address = dataCreate.address
          dataCreateDoctor.address = dataCreate.address
        }
        if (dataCreate.firstName) {
          dataCreatePatient.firstName = dataCreate.firstName
          dataCreateDoctor.firstName = dataCreate.firstName
        }
        if(dataCreate.lastName){
          dataCreatePatient.lastName = dataCreate.lastName
          dataCreateDoctor.lastName = dataCreate.lastName
        }
        if(selectDay){
          const dob = new Date(selectDay)
          dataCreatePatient.dob = dob.valueOf()
          dataCreateDoctor.dob = dob.valueOf()
        }
        if(dataCreate.phone){
          dataCreatePatient.phone = dataCreate.phone
          dataCreateDoctor.phone = dataCreate.phone
        }
        if(dataCreate.hospitalId && role === 'doctor'){
          dataCreateDoctor.hospitalId = dataCreate.hospitalId
        }
        if(selectSpecialist && role === 'doctor'){
          dataCreateDoctor.specialist =selectSpecialist
        }
        if(selectGender && role === 'doctor'){
          dataCreateDoctor.gender = selectGender
        }
        if(dataCreate.patientNumber && role === 'patient'){
          dataCreatePatient.patientNumber =dataCreate.patientNumber
        }
        if(selectType && role === 'patient'){
          dataCreatePatient.typeOfCare = selectType
        }
        if(dataCreate?.affiliations && role === 'doctor'){
          dataCreateDoctor.affiliations = dataCreate.affiliations
        }
        if(dataCreate?.title && role === 'doctor'){
          dataCreateDoctor.title = dataCreate.title
        }
        if(dataCreate?.bio && role === 'doctor'){
          dataCreateDoctor.bio = dataCreate.bio
        }
        if(uploadAvatar){
          dataCreatePatient.avatarUrl = uploadAvatar
          dataCreateDoctor.avatarUrl = uploadAvatar
        }
        if( role === 'patient'){
          await dispatch(createUserApi(dataCreatePatient));
        }
        else{
          await dispatch(createUserApi(dataCreateDoctor));
       }
     }
  };

  useEffect(() => {
    if(requestSendCreate.user.createUserResponse){
      setDataCreate(data)
      setActiveTab(2);
    }
  }, [requestSendCreate.user.createUserResponse]);

  const backListUser = () => {
    if (role === 'patient') {
      history.push('/patient-admin');
    } else {
      history.push('/doctor-admin');
    }
  };
  const editUserAdmin = () =>{
    setISDisable(false)
  }
  const onSave = async() =>{
        let dataUpdatePatient ={
          firstName: dataCreate.firstName,
          lastName: dataCreate.lastName,
          phone: dataCreate.phone,
          address: dataCreate.address,
          patientNumber: dataCreate.patientNumber,
          typeOfCare: selectType,
          avatarUrl: uploadAvatar,
          userId:uuid
          }
        let dataUpdateDoctor ={
          firstName: dataCreate.firstName,
          lastName: dataCreate.lastName,
          phone: dataCreate.phone,
          address: dataCreate.address,
          hospitalId: dataCreate.hospitalId,
          specialist: selectSpecialist,
          gender: selectGender,
          affiliations: dataCreate?.affiliations,
          title: dataCreate?.title,                                                                                             
          bio: dataCreate?.bio,                                                                                             
          avatarUrl: uploadAvatar,
          userId: uuid
        }
        if(selectDay && selectDay !== null){
          dataUpdatePatient.dob = new Date(selectDay).getTime()
          dataUpdateDoctor.dob = new Date(selectDay).getTime()
        }
        if(role === 'patient'){
          const dataPatient = {
            userId:  uuid,
            data: dataUpdatePatient
          }
          if (!dataPatient.data.dob) {
            delete dataPatient.data.dob
            await dispatch(updateUser(dataPatient))
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              toast: true,
              title: 'Updated user profile successfully !',
              showConfirmButton: false,
              timer: 2000
            })
            setTimeout( ()=>{
              backListUser()
            }, 2000)
          }else {
            await dispatch(updateUser(dataPatient))
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  toast: true,
                  title: 'Updated user profile successfully !',
                  showConfirmButton: false,
                  timer: 2000
                })
                setTimeout( ()=>{
                  backListUser()
            }, 2000)
          }
        }else{
          const dataDoctor = {
            userId: uuid,
            data: dataUpdateDoctor
          }
          if (!dataDoctor.data.dob){
            delete dataDoctor.data.dob
            await dispatch(updateUser(dataDoctor))
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              toast: true,
              title: 'Updated user profile successfully !',
              showConfirmButton: false,
              timer: 2000
            })
            setTimeout(()=>{
              backListUser()
            }, 2000)
          }else {
            await dispatch(updateUser(dataDoctor))
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              toast: true,
              title: 'Updated user profile successfully !',
              showConfirmButton: false,
              timer: 2000
            })
            setTimeout(()=>{
              backListUser()
            }, 2000)
          }
        }
       
  }
  const getUserProfile = () => {
    dispatch(getUserId(uuid));
  }
  const pupopDelete = () =>{
      Swal.fire({
        text: 'Are you sure you want to permanently delete this user ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes',
        cancelButtonText: ' No '
      }).then((result) => {
        if (result.isConfirmed) {
          deleteUserSelected()
          Swal.fire({
              position: 'top-end',
              icon: 'success',
              toast: true,
              title: 'Delete successfully',
              showConfirmButton: false,
              timer: 2000
            })
         setTimeout ( () => {
          backListUser()
         },2000)
        }
      })
  }
  const deleteUserSelected = () =>{
    const data = {
      email: userProfile.data.email,
      userId: uuid
    }
    dispatch(deleteUser(data))
  }
  useEffect(() => {
    if (userProfile) {
      let dataTemp = {
        role: role,
        email: userProfile.data.email,
        firstName: userProfile.data.firstName,
        lastName: userProfile.data.lastName,
        phone: userProfile.data.phone,
        address: userProfile.data.address,
        hospitalId:userProfile.data.hospitalId,
        affiliations:userProfile.data?.affiliations,
        title:userProfile.data?.title,
        bio:userProfile.data?.bio,
        patientNumber: userProfile.data.patientNumber,
        dob: userProfile.data.dob

      }
      setUploadAvatar(userProfile.data.avatarUrl)
      setDataCreate(dataTemp)
      setSelectSpecialist(userProfile.data.specialist)
      setSelectGender(userProfile.data.gender)
      setSelectType(userProfile.data.typeOfCare)
      const dob = new Date(dataTemp.dob)
      setSelectDay(moment(dob).format('YYYY-MM-DD'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  useEffect(() => {
    setActiveTab(1);
    if (uuid) {
      setISDisable(true)
      getUserProfile()
    }
    setDataCreate(data)
    setUploadAvatar(data.avatarUrl)
    setSelectDay(null);
    setSelectType(null);
    setSelectSpecialist(null);
    setSelectGender(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sub-content-admin">
      <div className="header-content-admin mb-4">
        <div className="left">
          <button onClick={backListUser} className="btn-back-listPatien">
            <img src={ico_back} alt="" />
          </button>
         { !uuid ? ( <p>Add {title}</p>): ( <p>{title}’s Info</p>) }
        </div>
        <div className="right">
          <span>A new {title} was added by Admin</span>
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
                placeholder={'Find ' + title}
              />
              <img src={ico_search} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="details-admin">
        {activeTab !== 1 ? (
          <div>
            <div className="panel-body">
              <input
                name="upload-avatar"
                style={styles.FileInput}
              />
              <div className="upload-avatar-wrap">
                <div className="avatar-personal">
                  <Avatar
                    className="upload-avatar"
                    src={uploadAvatar ? uploadAvatar : defaultAva}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      height: '200px',
                      width: '200px',
                      objectFit: 'cover',
                      boxShadow: '0 10px 20px 0 rgb(0 255 245 / 50%)',
                      border: '4px solid #ffff'
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="text-sucssessfull">
              <span>{requestSendCreate.user.createUserResponse ? requestSendCreate.user.createUserResponse.firstName :'User'}</span>
              {
                role ? (<p>{requestSendCreate.user.createUserResponse ? requestSendCreate.user.createUserResponse.patientNumber :' '}</p>):(
                  <p>{requestSendCreate.user.createUserResponse ? requestSendCreate.user.createUserResponse.hospitalId :' '}</p>
                )
              }
              <p className="font-weight600">Congratulation!</p>
              <p>You was add {requestSendCreate.user.createUserResponse ? requestSendCreate.user.createUserResponse.firstName :'User'} to system!</p>
              <button className="btn-back-home-admin" onClick={backListUser}>
                Back to {title}'s List
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid-add-user">
              {
                !isDisable ? (
                  <div className="panel-body">
                <input
                  accept="image/jpeg,image/gif,image/png"
                  id="outlined-button-file-avatar-upload"
                  multiple={false}
                  type="file"
                  onChange={(e) => handleInputChange(e, 'avatar-upload')}
                  name="upload-avatar"
                  style={styles.FileInput}
                />
                <div className="upload-avatar-wrap">
                  <div className="avatar-personal">
                    <Avatar
                      disabled= {isDisable}
                      className="upload-avatar"
                      src={uploadAvatar ? uploadAvatar : defaultAva}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        height: '200px',
                        width: '200px',
                        objectFit: 'cover',
                        boxShadow: '0 10px 20px 0 rgb(0 255 245 / 50%)',
                        border: '4px solid #ffff'
                      }}
                    />
                    <img className="upload_pic_admin" src={upload_pic} alt="" />
                    <label htmlFor="outlined-button-file-avatar-upload">
                      <div className="upload-avatar-overlay">
                        <CloudUploadIcon
                          style={styles.CloudUploadIcon}
                          width={200}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
                ): (
                  <div className="panel-body">
                <input
                  name="upload-avatar"
                  style={styles.FileInput}
                />
                <div className="upload-avatar-wrap">
                  <div className="avatar-personal">
                    <Avatar
                      className="upload-avatar"
                      src={uploadAvatar ? uploadAvatar : defaultAva}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        height: '200px',
                        width: '200px',
                        objectFit: 'cover',
                        boxShadow: '0 10px 20px 0 rgb(0 255 245 / 50%)',
                        border: '4px solid #ffff'
                      }}
                    />
                  </div>
                </div>
                <p className="full-name-admin"> {dataCreate.firstName} {dataCreate.lastName}</p>
              </div>
                )
              }
              <div className="grid-item-add-user">
                <div>
                  <div className="form-group">
                    <label for="">First name</label>
                    <Input
                      disabled= {isDisable}
                      type="text"
                      className="form-control"
                      name="first_name"
                      value={dataCreate.firstName}
                      onChange={(event, field) =>
                        changeDataProfile(event, 'firstName')
                      }
                    />
                  </div>
                  <div className="form-group custom-width">
                    <label for="">Birthday</label>
                     <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <TextField
                      id="mui-pickers-date"
                      type="date"
                      value={selectDay ? selectDay : null}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      className={classes.textField}
                      onChange={(event) =>
                        handleDateChange(event)
                      }
                    />
                  </MuiPickersUtilsProvider>
                  </div>
                  {/* <div className="form-group">
                    <label for="">Address</label>
                    <Input
                      disabled ={isDisable}
                      type="text"
                      className="form-control"
                      name="address"
                      value={dataCreate.address}
                      onChange={(event, field) =>
                        changeDataProfile(event, 'address')
                      }
                    />
                  </div> */}
                  {role === 'patient' ? (
                    <div>
                      <div className="form-group" >
                        <label>Type of care</label>
                      </div>
                      <SelectionField
                        disabled ={isDisable}
                        onChange={onChangeSelectedType}
                        defaultValue={selectType}
                        data={listType}
                        placeHolder=""
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="form-group">
                        <label for="">Specialties</label>
                      </div>
                      <SelectionField
                        disabled ={isDisable}
                        onChange={onChangeSelectedSpecialist}
                        data={listSpecialist}
                        placeHolder=""
                        defaultValue= {selectSpecialist}
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label for="">Affiliations</label>
                    <Input
                      disabled ={isDisable}
                      type="text"
                      className="form-control"
                      name="affiliations"
                      value={dataCreate?.affiliations}
                      onChange={(event, field) =>
                        changeDataProfile(event, 'affiliations')
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label for="">Title</label>
                    <Input
                      disabled ={isDisable}
                      type="text"
                      className="form-control"
                      name="title"
                      value={dataCreate?.title}
                      onChange={(event, field) =>
                        changeDataProfile(event, 'title')
                      }
                    />
                  </div>
       
                </div>
                <div className="">
                  <div className="form-group">
                    <label for="">Last name</label>
                    <Input
                      disabled ={isDisable}
                      type="text"
                      className="form-control"
                      name="last_name"
                      value={dataCreate.lastName}
                      onChange={(event, field) =>
                        changeDataProfile(event, 'lastName')
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label for="">Email <span style={{color:'#FC2D2C'}}>(*)</span> {
                      requestSendCreate?.error.CREATE_USER_FAILED === "USER_EXISTS_ALREADY" ? <span className="error-admin">This email already exists on the system!</span>: null
                    } 
                    { dataCreate.email && dataCreate.email.length >0 && !validateEmail(dataCreate.email) ? <span className="error-admin">(Please enter a valid email address (test@imi.ai))</span>: null}
                    </label>
                    <Input
                      disabled ={uuid && true}
                      type="text"
                      className="form-control"
                      name="last_name"
                      value={dataCreate.email}
                      onChange={(event, field) =>
                        changeDataProfile(event, 'email')
                      }
                    />
                  </div>
                  {/* <div className="form-group">
                    <label for="">Phone Number </label>
                    <Input
                      disabled ={isDisable}
                      type="text"
                      className="form-control"
                      name="phone-number"
                      value={dataCreate.phone}
                      onChange={(event, field) =>
                        changeDataProfile(event, 'phone')
                      }
                    />
                  </div> */}
                  {role === 'patient' ? (
                    <div className="form-group">
                      <label for="">Patient ID</label>
                      <Input
                        disabled ={isDisable}
                        type="text"
                        className="form-control"
                        name="patient-id"
                        value={dataCreate.patientNumber}
                        onChange={(event, field) =>
                          changeDataProfile(event, 'patientNumber')
                        }
                      />
                    </div>
                  ) : (
                    // <div className="form-group">
                    //   <label for="">Hospital ID</label>
                    //   <Input
                    //     disabled ={isDisable}
                    //     type="text"
                    //     className="form-control"
                    //     name="hospital-id"
                    //     value={dataCreate.hospitalId}
                    //     onChange={(event, field) =>
                    //       changeDataProfile(event, 'hospitalId')
                    //     }
                    //   />
                    // </div>
                    null
                  )}
                  <div>
                      <div className="form-group">
                        <label for="">Gender</label>
                      </div>
                      <SelectionField
                        disabled ={isDisable}
                        onChange={onChangeSelectedGender}
                        data={listGender}
                        placeHolder=""
                        defaultValue= {selectGender}
                      />
                  </div>

                  <div className="form-group">
                    <label for="">Biography</label>
                    <Input
                      disabled ={isDisable}
                      type="text"
                      className="form-control"
                      name="bio"
                      value={dataCreate?.bio}
                      onChange={(event, field) =>
                        changeDataProfile(event, 'bio')
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            
           {
             !uuid ? (
              <div style={{ textAlign: 'center', marginTop:100 }}>
              {
                requestSendCreate?.error.CREATE_USER_FAILED === "USER_EXISTS_ALREADY" ? <span className="d-block mb-2 error-admin">This information already exists on the system!</span>: null
              }
                <button className="btn-back-home-admin" onClick={onSubmit}>
                  Submit
                </button>
              </div>
             ):(
              <div style={{ textAlign: 'center', marginTop:100 }}>
                 {
                   isDisable ? (
                  <div>
                     <button className="btn-edit-robot-admin" onClick={editUserAdmin}><img className="pr-4" src={ico_edit} alt="" /> Edit {title}'s Info</button>
                     <button className="btn-delete-robot-admin" onClick={pupopDelete}> <DeleteOutlinedIcon/> Delete</button>
                  </div>
                   ):(
                    <button className="btn-edit-robot-admin" onClick={onSave}><img className="pr-2" src={ico_save} alt="" /> Save</button>
                   )
                 }
              </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
