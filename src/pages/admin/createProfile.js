import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import GridItem from '../../components/grid/GridItem';
import GridContainer from '../../components/grid/GridContainer';
import Panel from '../../components/panel';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import styles from '../../layouts/styles/userProfileStyle';
import { createUserApi } from '../../store/actions/user.action';
import Swal from 'sweetalert2';

export default function CreateProfile(props) {
  const requestSendCreate = useSelector((state) => {
    return state;
  });
  let data = {
    role: props.onRole,
    gender: '' ,
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    address: '',
  }
  const [dataCreate, setDataCreate] = useState(data);
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateFormCreateUser = () => {
    if (dataCreate.email.length ===0) {
      window.alert('Your email is Invalid'); 
      return true
    } else if (!validateEmail(dataCreate.email)) {
      window.alert('Please enter a valid email address'); 
      return true
    } else if (dataCreate.gender.length === 0) {
      window.alert('Your gender is Invalid'); 
      return true
    } else if (dataCreate.firstName.length === 0) {
      window.alert('Your firstName is Invalid'); 
      return true
    } else if (dataCreate.lastName.length === 0) {
      window.alert('Your lastName is Invalid'); 
      return true
    } else if (dataCreate.phone.length === 0) {
      window.alert('Your phone is Invalid'); 
      return true
    } else if (dataCreate.address.length === 0) {
      window.alert('Your address is Invalid'); 
      return true
    } else if (dataCreate.dob.length === 0) {
      window.alert('Your birthday is Invalid'); 
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    if(isSubmit){
      if(requestSendCreate.error.CREATE_USER_FAILED === "USER_EXISTS_ALREADY")
      {
        Swal.fire({
          title: 'User is Exist Already',
          position: 'center',
          showConfirmButton: true,
          timer: 3000,
          icon: 'error',
          timerProgressBar: true,
        })
      }
      if(requestSendCreate.user.createUserResponse) {
          Swal.fire({
            title: 'Create Successfully! A mail send to your mail',
            position: 'center',
            showConfirmButton: true,
            timer: 3000,
            icon: 'success',
            timerProgressBar: true,
          })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestSendCreate, isSubmit])

  const onSubmit = async ()  =>{
    setIsSubmit(true)
    if(!validateFormCreateUser()){
      const date = new Date(dataCreate.dob)
      let dataPrams = dataCreate
      dataPrams.dob = date.valueOf()
      await dispatch(createUserApi(dataCreate));
      setDataCreate(data);
    }else{
      Swal.fire({
        title: 'Please check your information again',
        position: 'center',
        showConfirmButton: true,
        timer: 3000,
        icon: 'warning',
        timerProgressBar: true,
      })
    }
  }
  const changeDataProfile = (event, fieldName, value) => {
    setIsSubmit(false)
    setDataCreate({ ...dataCreate, [fieldName]: event?.target.value || value});
  };
  return (
    <div className="mt-4 container">
       <GridItem xs={12} sm={12} md={9}>
          <Panel title={ data.role === 'doctor'? 'User Profile Doctor':'User Profile Patient'} >
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <TextField
                 style={{
                    marginBottom: '20px',
                    width: '80%',
                  }}
                  required
                  name="email"
                  value={dataCreate.email}
                  type="email"
                  color="secondary"
                  label="Email"
                  placeholder="Email"
                  onChange={(event, field) =>
                    changeDataProfile(event, 'email')
                  }
                />
                <br />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <TextField
                  style={{
                    marginBottom: '20px',
                    width: '80%'
                  }}
                  required
                  name="first-name"
                  color="secondary"
                  floatingLabelText="First Name"
                  label="First Name"
                  value={dataCreate.firstName}
                  placeholder="First Name"
                  onChange={(event, field) =>
                    changeDataProfile(event, 'firstName')
                  }
                />
                <br />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <TextField
                style={{
                    marginBottom: '20px',
                    width: '80%'
                  }}
                  required
                  name="last-name"
                  color="secondary"
                  floatingLabelText="Last Name"
                  label="Last Name"
                  value={dataCreate.lastName}
                  placeholder="Last Name"
                  onChange={(event, field) =>
                    changeDataProfile(event, 'lastName')
                  }
                />
                <br />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <TextField
                 style={{
                    marginBottom: '20px',
                    width: '80%'
                  }}
                  required
                  name="phone"
                  type="number"
                  color="secondary"
                  floatingLabelText="Phone (10 digits)"
                  label="Phone (10 digits)"
                  value={dataCreate.phone}
                  placeholder="Phone (10 digits)"
                  onChange={(event, field) =>
                    changeDataProfile(event, 'phone')
                  }
                />
                <br />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <TextField
                  style={{
                    marginBottom: '20px',
                    width: '80%'
                  }}
                  required
                  name="address"
                  color="secondary"
                  label="Standard secondary"
                  label="Address"
                  value={dataCreate.address}
                  placeholder="Address"
                  onChange={(event, field) =>
                    changeDataProfile(event, 'address')
                  }
                />
                <br />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <TextField
                  style={{
                    marginBottom: '20px',
                    width: '80%'
                  }}
                  required
                  name="date"
                  color="secondary"
                  label="Birthday"
                  type="date"
                  value={dataCreate.dob}
                  onChange={(event, field, value) =>
                    changeDataProfile(event, 'dob', value)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <SelectField
                    required
                    name="gender"
                    color="secondary"
                    floatingLabelText="Gender"
                    value={dataCreate.gender}
                    onChange={(event, field, value) =>
                        changeDataProfile(event, 'gender', value)
                      }
                    menuItemStyle={styles.SelectItemStyle}
                  >
                    <MenuItem value={'Male'} primaryText="Male" />
                    <MenuItem value={'Female'} primaryText="Female" />
                    <MenuItem value={'Other'} primaryText="Other" />
                  </SelectField>
                </GridItem>
            </GridContainer>
          </Panel>
        </GridItem>
        <GridItem xs={3} sm={3} md={3}>
          <div className="btn-create-profile mb-4" onClick={() => onSubmit()}>
                Create Profile
        </div>
        </GridItem>
    </div>
  );
}
