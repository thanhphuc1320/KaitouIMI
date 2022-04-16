import React, { Component } from 'react';
import { connect } from 'react-redux';

// import MaterialTable from 'material-table';
import { bindActionCreators } from 'redux';
import DateFnsUtils from '@date-io/date-fns';
import { toast } from 'react-toastify';
import TextField from 'material-ui/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';
import Avatar from 'material-ui/Avatar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/styles';
import DialogPdfPreview from '../../../components/dialog/dialogPdfPreview';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { Redirect } from 'react-router-dom';
import defaultAva from '../../img/d_ava.png';
import Panel from '../../../components/panel';
import styles from '../../../layouts/styles/userProfileStyle';
import GridItem from '../../../components/grid/GridItem';
import GridContainer from '../../../components/grid/GridContainer';
import '../../static/css/user-profile.css';
import AdditionalInformationPanel from '../../../components/panels/additionalInformationPanel';

// Api Call
import {
  uploadPublicFileApiCall,
} from '../../../apiCalls/file.api';

// Action
import { updateUser } from '../../../store/actions/user.action';

import { isURL, isPhoneNumber } from '../../../utils';
import {
  DOCTOR_ROLE,
  PATIENT_ROLE,
  IMAGE_TYPES,
  PDF_TYPE,
  IMAGE_MODE,
  PDF_MODE,
} from '../../../constant';

const SubmitButton = styled(Button)(styles.SubmitButtonStyle);

class UpdateUserProfile extends Component {
  constructor(props) {
    super(props);
    const { user } = this.props || {};
    this.state = {
      data: {
        // Convert Props to State after calling login API
        ...user,
      },
      isRequestUploaded: false,
      linkFileToOpen: null,
      fileTypeToOpen: null,
      isUpdating: false,
      updatedStatus: false,
    };

    this.handleDateChange = this.handleDateChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Convert Props to State after calling identity API
    const { user } = nextProps || {};
    const { data, isUpdating } = this.state || {};

    if (!data.email && user.email) {
      const newData = { ...data, ...{ ...user } };
      this.setState({ ...this.state, ...{ data: newData } });
    }

    // Update state to redirect to view-profile
    if (isUpdating) {
      this.setState({
        ...this.state,
        ...{ isUpdating: false, data: user, updatedStatus: true },
      });
    }
  }

  handleDateChange(date) {
    const newData = { ...this.state.data, ...{ dob: date.valueOf() } };
    const newState = { ...this.state, ...{ data: newData } };
    this.setState(newState);
  }

  toastId = null;

  notify = () =>
    (this.toastId = toast('Uploading File..', {
      className: 'toast-container',
    }));

  dismiss = () => toast.dismiss(this.toastId);

  addAdditionalPanel() {
    const { data } = this.state || {};
    const { addedInfo } = data || [];
    const newAddedInfo = [
      ...addedInfo,
      { title: null, description: null, link: null, fileType: null },
    ];
    const newData = { ...data, ...{ addedInfo: newAddedInfo } };
    const newState = { ...this.state, ...{ data: newData } };
    this.setState(newState);
  }

  removeAdditionalPanel(index) {
    if (Number.isInteger(index) && index >= 0) {
      const { data } = this.state || {};
      const { addedInfo } = data || [];
      if (addedInfo.length > 0) {
        const newAddedInfo = [
          ...addedInfo.slice(0, index),
          ...addedInfo.slice(index + 1),
        ];
        const newData = { ...data, ...{ addedInfo: newAddedInfo } };
        const newState = { ...this.state, ...{ data: newData } };
        this.setState(newState);
      }
    }
  }

  handleOpenPdfPreview(link, type) {
    if (isURL(link) && type) {
      this.setState({
        ...this.state,
        ...{ linkFileToOpen: link, fileTypeToOpen: type },
      });
    }
  }

  onPreview(e, type) {
    if (!type && type == null) {
      return;
    }
    const { data } = this.state || {};
    let link = null;
    let fileType;

    if (type[0] === 'a') {
      const index = parseInt(type.slice(2));
      const { addedInfo } = data || [];
      const item = addedInfo[index] || {};
      link = item.link || null;
      fileType = item.fileType;
    }

    if (isURL(link) && fileType) {
      this.handleOpenPdfPreview(link, fileType);
    }
  }

  handleCloseFilePreview(e) {
    this.setState({
      ...this.state,
      ...{ linkFileToOpen: null, fileTypeToOpen: null },
    });
  }

  validateDataToSubmit() {
    const { data } = this.state;
    const newAddedInfo = [];
    const {
      gender,
      avatarUrl,
      avatarType,
      firstName,
      lastName,
      bio,
      addedInfo,
      dob,
      phone,
      address,
      role,
      credential,
    } = data;
    let dataToSubmit = {};
    const addedInfoLength = (addedInfo || []).length;

    for (let i = 0; i < addedInfoLength; i++) {
      const item = addedInfo[i];

      if ((item.title && item.description) || item.link) {
        newAddedInfo.push(item);
      }
    }

    if (avatarUrl && _.isString(avatarUrl))
      dataToSubmit['avatarUrl'] = avatarUrl;

    if (avatarType && _.isString(avatarType))
      dataToSubmit['avatarType'] = avatarType;

    if (avatarType && _.isString(avatarType))
      dataToSubmit['avatarType'] = avatarType;

    if (firstName && _.isString(firstName))
      dataToSubmit['firstName'] = firstName;

    if (lastName && _.isString(lastName)) dataToSubmit['lastName'] = lastName;

    if (bio && _.isString(bio)) dataToSubmit['bio'] = bio;

    if (credential && _.isString(credential))
      dataToSubmit['credential'] = credential;

    if (dob) dataToSubmit['dob'] = dob;

    if (role === 'patient' && phone && phone.length > 0) {
      if (isPhoneNumber(phone)) dataToSubmit['phone'] = phone;
    }

    if (address && _.isString(address)) dataToSubmit['address'] = address;
    dataToSubmit['addedInfo'] = newAddedInfo;
    dataToSubmit.gender = gender

    return {
      userId: data._id,
      data: dataToSubmit,
    };
  }

  onSubmit() {
    const dataToSubmit = this.validateDataToSubmit();
    if (dataToSubmit) {
      this.props.updateUser(dataToSubmit);
      this.setState({ ...this.state, ...{ isUpdating: true } });
    }
  }

  onSubmitAvatar() {
    const dataToSubmit = this.validateDataToSubmit();
    if (dataToSubmit) {
      this.props.updateUser(dataToSubmit);
      this.setState({ ...this.state });
    }
  }

  handleInputChange(e, type) {
    // FIX_ME: validate to allow only one file
    const { files } = e.target || [];
    const { data } = this.state;
    this.notify();
    if (files.length === 1) {
      // this.props.uploadFile(selectorFiles[0]);
      const file = files[0];
      const fileType = file['type'];
      const uploadingData = {
        file,
        patientId: data._id,
        fileTestType: 'public',
      };
      uploadPublicFileApiCall(uploadingData).then((res) => {
        const { status, data } = res;
        const fileUrl = data[0].fileUrl || {};
        if (status === 200 && fileUrl.length > 0) {
          toast.update(this.toastId, {
            render: 'Uploaded',
            type: toast.TYPE.INFO,
            className: 'update-toast-container',
            progressClassName: 'update-progress-bar',
            autoClose: 1000,
          });

          // Avatar Upload
          const { data } = this.state || {};
          let newData;

          if (type === 'avatar-upload') {
            newData = {
              ...data,
              ...{ avatarUrl: fileUrl, avatarType: fileType },
            };
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
            newData = { ...data, ...{ addedInfo: newAddedInfo } };
          }

          this.setState({ ...this.state, ...{ data: newData } }, () => {
            this.onSubmitAvatar();
          });
        }
      });
    }
  }

  onTextChange(e) {
    const { name, value = '' } = e.target;
    const newData = { ...this.state.data };

    switch (name) {
      case 'first-name':
        newData.firstName = value;
        break;

      case 'last-name':
        newData.lastName = value;
        break;

      case 'bio':
        newData.bio = value;
        break;

      case 'phone':
        newData.phone = value;
        break;

      case 'address':
        newData.address = value;
        break;

      case 'credential':
        newData.credential = value;
        break;
      default:
        break;
    }

    const newState = { ...this.state, ...{ data: newData } };
    this.setState(newState);
  }

  onAdditionalInformationChange(e) {
    const { name, value } = e.target;
    const type = name[0];
    const index = parseInt(name.slice(2));
    const { data } = this.state || {};
    const { addedInfo } = data || [];

    let newInformation;
    if (type === 't')
      newInformation = { ...addedInfo[index], ...{ title: value } };

    if (type === 'd')
      newInformation = { ...addedInfo[index], ...{ description: value } };

    const newAddedInfo = [
      ...addedInfo.slice(0, index),
      newInformation,
      ...addedInfo.slice(index + 1),
    ];
    const newData = { ...data, ...{ addedInfo: newAddedInfo } };
    const newState = { ...this.state, ...{ data: newData } };

    this.setState(newState);
  }

  handleSelectionChange = (event, index, value) => {
    const { data } = this.state || {};
    const newData = { ...data, ...{ gender: value} };
    const newState = { ...this.state, ...{ data: newData } };
    this.setState(newState);
  };

  render() {
    const {
      linkFileToOpen,
      updatedStatus,
      fileTypeToOpen,
      data = {},
    } = this.state;
    const { email, role } = data || 'N/A';
    const addedInfo = data.addedInfo || [];
    const {
      firstName,
      lastName,
      bio,
      dob,
      phone,
      address,
      credential,
      gender = null,
      avatarUrl = defaultAva,
    } = data || '';

    let fileModeToOpen;

    if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
    else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;

    const isOpenFile =
      isURL(linkFileToOpen) &&
      fileModeToOpen &&
      [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);

    return updatedStatus ? (
      <Redirect to="/preference" />
    ) : (
      <div className="container pT20">
        <GridContainer>
          <GridItem xs={12} sm={12} md={3}>
            <Panel
              title="Profile Upload"
              height="280"
              titleStyle={styles.UploadAvatarPanelTitle}
            >
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
                <div className="upload-avatar-overlay-wrap">
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
              {/* <ToastContainer
                position={toast.POSITION.BOTTOM_LEFT}
                hideProgressBar={true}
              /> */}
            </Panel>
          </GridItem>
          <GridItem xs={12} sm={12} md={9}>
            {/* <div className="col-md-8"> */}
            <Panel title="Update User Profile">
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    disabled
                    value={email}
                    floatingLabelText="Email"
                    floatingLabelFixed={true}
                  />
                  <br />
                </GridItem>

                <GridItem xs={12} sm={12} md={6}>
                  {role === DOCTOR_ROLE && (
                    <TextField
                      floatingLabelText="Credential"
                      name="credential"
                      onChange={(e) => this.onTextChange(e)}
                      value={credential}
                    />
                  )}
                  <br />
                </GridItem>

                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    floatingLabelText="First Name"
                    name="first-name"
                    onChange={(e) => this.onTextChange(e)}
                    value={firstName}
                  />
                  <br />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    floatingLabelText="Last Name"
                    name="last-name"
                    onChange={(e) => this.onTextChange(e)}
                    value={lastName}
                  />
                  <br />
                </GridItem>
                {role === 'patient' && (
                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      floatingLabelText="Phone (10 digits)"
                      name="phone"
                      onChange={(e) => this.onTextChange(e)}
                      value={phone}
                    />
                    <br />
                  </GridItem>
                )}
                {role === 'patient' && (
                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      floatingLabelText="Address"
                      name="address"
                      onChange={(e) => this.onTextChange(e)}
                      value={address}
                    />
                    <br />
                  </GridItem>
                )}
                <GridItem xs={12} sm={12} md={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableFuture = {true}
                      format="MM.dd.yyyy"
                      margin="normal"
                      id="mui-pickers-date"
                      label="Birth Day (MM.dd.yyyy)"
                      value={dob}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      onChange={this.handleDateChange}
                    />
                  </MuiPickersUtilsProvider>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <SelectField
                    floatingLabelText="Gender"
                    value={gender}
                    onChange={this.handleSelectionChange}
                    menuItemStyle={styles.SelectItemStyle}
                  >
                    <MenuItem value={'Male'} primaryText="Male" />
                    <MenuItem value={'Female'} primaryText="Female" />
                    <MenuItem value={'Other'} primaryText="Other" />
                  </SelectField>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  {/* <InputLabel style={{ color: "#AAAAAA" }}>About me</InputLabel> */}
                  <TextField
                    value={bio}
                    hintText="Type your biography"
                    floatingLabelText="Biography"
                    onChange={(e) => this.onTextChange(e)}
                    multiLine={true}
                    rows={4}
                    fullWidth={true}
                    name="bio"
                  />
                  <br />
                </GridItem>
              </GridContainer>
            </Panel>
          </GridItem>
        </GridContainer>

        {addedInfo.length > 0 &&
          addedInfo.map((inputValue, key) => {
            return (
              <AdditionalInformationPanel
                isDisplayUpload={true}
                inputValue={inputValue}
                onChange={(e) => this.onAdditionalInformationChange(e)}
                keyValue={key}
                removePanel={(e) => this.removeAdditionalPanel(key)}
                onUploadChange={(e) => this.handleInputChange(e, `u-${key}`)}
                onPreview={(e) => this.onPreview(e, `a-${key}`)}
                isDisplayRemoveButton={true}
              />
            );
          })}

        <div style={styles.SubmitButtonWrap}>
          {role === PATIENT_ROLE && (
            <FloatingActionButton
              style={styles.FloatingActionButton}
              onClick={() => this.addAdditionalPanel()}
              className="create-additional-info"
            >
              <ContentAdd />
            </FloatingActionButton>
          )}
          <SubmitButton
            className="create-request-submit-button"
            onClick={() => this.onSubmit()}
          >
            Update Profile
          </SubmitButton>
        </div>

        <DialogPdfPreview
          fileModeToOpen={fileModeToOpen}
          isOpenFile={isOpenFile}
          file={linkFileToOpen}
          handleCloseFilePreview={(e) => this.handleCloseFilePreview(e)}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({ updateUser }, dispatch);
}

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(UpdateUserProfile);
