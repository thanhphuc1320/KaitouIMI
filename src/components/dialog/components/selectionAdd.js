import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Menu, Typography } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import ico_search from '../../../img/imi/ico-search-admin.png';
import ico_add from '../../../img/imi/ico-add-yellow.png';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

export default function SelectionAddPatient(props) {
  const history = useHistory()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dataCallback, setDataCallback] = useState();
  const [state, setState] = useState();
  const [stateDoctor, setStateDoctor] = useState();
  let listFormatDoctor = [];
  let listFormatPatient = [];

  React.useEffect(() => {
    if (props.defaultValue) {
      const finder = selectedDoctor;
      setState(finder);
    }
  }, [props.defaultValue]);

  useEffect(() => {
    if (props?.defaultValueDoctor) {
      setStateDoctor(props?.defaultValueDoctor);
    }
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (index) => () => {
    handleClose();
  };
  if (props.listDoctor) {
    props.listDoctor.map((item, index) => {
      return listFormatDoctor.push(item);
      return null;
    });
  }
  if (props.listPatient) {
    props.listPatient.map((item, index) => {
      return listFormatPatient.push(item);
      return null;
    });
  }
  const addDoctor = () => {
    history.push('/doctor-admin')
  };
  const addPatient = () => {
    history.push('/patient-admin')
  };
  if (dataCallback) {
    props.parentCallback(dataCallback);
  }
  const getOptionLabel = (option) => {
    if (option.firstName || option.lastName) {
      return option?.firstName + ' ' + option?.lastName;
    } else {
      return option.email;
    }
  };

  const nameUser = (data) => {
    if (!data.email || data.email.lenght === 0) {
      return 'Email Default';
    } else if (!data?.firstName && !data?.lastName) {
      return data.email;
    } else if (data.firstName.lenght > 0 && data.lastName.lenght === 0) {
      return data.firstName;
    } else if (data.firstName.lenght === 0 && data.lastName.lenght > 0) {
      return data.lastName;
    } else {
      return data.firstName + ' ' + data.lastName;
    }
  };

  const onInputChangeTextDoctor = (event, value) => {
    props.onInputChangeTextDoctor(value)
  }

  const onInputChangeTextPatient = (event, value) => {
    props.onInputChangeTextPatient(value)
  }

  return (
    <div style={{ borderBottom: '1px solid #ddd', marginBottom: 16 }}>
      <Typography
        style={{ fontSize: '18px', color: '#828282', fontWeight: '100',fontFamily:'Nunito' }}
      >
        {props.placeHolder}
      </Typography>
      <Button
        style={{
          borderRadius: 'unset',
          justifyContent: 'space-between',
          padding: '0px',
          fontFamily:'Nunito',
          fontSize:'18px'
        }}
        fullWidth
        aria-controls="select-dropdown-custom"
        aria-haspopup="true"
        onClick={handleClick}
        disabled={props.disabled}
      >
        { 
          props.selectedUser ? nameUser(props.selectedUser) : <span></span>
        }
        <KeyboardArrowDown htmlColor="#828282" />
      </Button>
      <Menu
        id="select-dropdown-custom"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.role === 'patient' ? (
          <div className="selection-dialog-patient">
            <div className="find-dialog-patient form-group mt-2 mb-2">
              <Autocomplete
                id="combo-box-demo"
                onChange={(event, value) =>
                  props.changeSelectedPatient(event, value)
                }
                onInputChange={onInputChangeTextPatient}
                options={listFormatPatient}
                getOptionLabel={(option) => getOptionLabel(option)}
                value={props.selectedDoctor}
                renderInput={(params) => (
                  <div
                    ref={params.InputProps.ref}
                    className="find-dialog-patient form-group mt-2 mb-2"
                  >
                    <input
                      className="form-control"
                      type="text"
                      style={{fontSize:14, fontFamily:'Open Sans',color: '#828282'}}
                      {...params.inputProps}
                    />
                    <img src={ico_search} alt="" />
                  </div>
                )}
              />
            </div>
            <p className="mt-4" style={{fontFamily: 'Open Sans'}}>No Information</p>
            <div className="p-2 cursor-pointer mb-4 color-btn-add-patient" onClick={addPatient}>
              <img className="mr-2" src={ico_add} alt="" />
              Add Patient
            </div>
          </div>
        ) : (
          <div className="selection-dialog-patient">
            <div className="find-dialog-patient form-group mt-2 mb-2">
              <Autocomplete
                onChange={(event, value) =>
                  props.changeSelectedDoctor(event, value)
                }
                id="combo-box-demo"
                onInputChange={onInputChangeTextDoctor}
                options={listFormatDoctor}
                getOptionLabel={(option) => getOptionLabel(option)}
                value={props.selectedDoctor}
                renderInput={(params) => (
                  <div
                    ref={params.InputProps.ref}
                    className="find-dialog-patient form-group mt-2 mb-2"
                  >
                    <input
                      className="form-control"
                      type="text"
                      {...params.inputProps}
                    />
                    <img src={ico_search} alt="" />
                  </div>
                )}
              />
            </div>
            <p className="mt-4" style={{fontFamily: 'Open Sans'}}>No Information</p>
            <div
              className="p-2 cursor-pointer mb-4 color-btn-add-patient"
              onClick={addDoctor}
            >
              <img className="mr-2" src={ico_add} alt="" />
              Add Doctor
            </div>
          </div>
        )}
      </Menu>
    </div>
  );
}
