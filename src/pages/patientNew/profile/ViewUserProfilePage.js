import React, { Component } from 'react';
import { connect } from 'react-redux';

// import MaterialTable from 'material-table';
import { bindActionCreators } from 'redux';
import EditIcon from '@material-ui/icons/EditOutlined';
import Avatar from 'material-ui/Avatar';
import Button from '@material-ui/core/Button';
import Divider from 'material-ui/Divider';
import { Link} from 'react-router-dom';
import defaultAva from '../../../img/d_ava.png';
import Panel from '../../../components/panel';
import { convertMilisecondToDate, convertToGenderName } from '../../../utils';

// import CustomShapeBarChart from '../charts/customShapeBarChart.js';
import GridItem from '../../../components/grid/GridItem';
import GridContainer from '../../../components/grid/GridContainer';
import '../../../static/css/user-profile.css';

import { updateUser } from '../../../store/actions/user.action';
import { DOCTOR_ROLE, PATIENT_ROLE, TOKEN_KEY } from '../../../constant';
import { attemptLogout } from '../../../store/actions/auth.action';

const { REACT_APP_LOGIN_PAGE } = process.env;
class ViewUserProfile extends Component {
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.props.attemptLogout();
    window.location.href = REACT_APP_LOGIN_PAGE;
  }
  render() {
    const styles = {
      MarginRight10: {
        marginRight: '10px',
      },
    };
    const { user } = this.props || {};
    const {
      email,
      firstName,
      lastName,
      bio,
      dob,
      gender,
      credential,
      role,
      phone,
      address,
      avatarUrl = defaultAva,
      addedInfo = [],
    } = user || 'N/A';

    const isDisplayAddedInfo = addedInfo.length > 0;

    return (
      <div className="container pT20">
        <GridContainer>
          <GridItem xs={12} sm={12} md={3}>
            <Panel
              title="Profile Upload"
              height="280"
              titleStyle={styles.UploadAvatarPanelTitle}
            >
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
                </div>
              </div>
            </Panel>
          </GridItem>
          <GridItem xs={12} sm={12} md={9}>
            {/* <div className="col-md-8"> */}
            <Panel
              title="View User Profile"
              action={
                <div className="d-flex">
                  <Link to="/update-profile">
                    <Button
                      style={styles.MarginRight10}
                      variant="outlined"
                      component="span"
                    >
                      <EditIcon style={styles.MarginRight10} />
                      Update Profile
                    </Button>
                  </Link>
                  <Link  onClick={() => this.logout()}>
                    <Button
                      style={styles.MarginRight10}
                      variant="outlined"
                      component="span"
                    >
                      <i className="material-icons sign-out mr-2">power_settings_new</i>
                      Sign out
                    </Button>
                  </Link>
                </div>
              }
            >
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <div className="review-item">
                    <ul className="list-unstyled">
                      <li>
                        <span>Email:</span> {email}
                      </li>
                      <li>
                        <span>First Name:</span> {firstName}
                      </li>
                      <li>
                        <span>Last Name:</span> {lastName}
                      </li>

                      {role === DOCTOR_ROLE && (
                        <li>
                          <span>Credential:</span> {credential}
                        </li>
                      )}
                      <li>
                        <span>Gender:</span> {gender}
                      </li>
                      <li>
                        <span>Birthday:</span> {convertMilisecondToDate(dob)}
                      </li>
                      <li>
                        <span>Biography:</span> {bio}
                      </li>
                      {role === PATIENT_ROLE && (
                        <li>
                          <span>Phone:</span> {phone}
                        </li>
                      )}
                      {role === PATIENT_ROLE && (
                        <li>
                          <span>Address:</span> {address}
                        </li>
                      )}
                    </ul>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  {isDisplayAddedInfo &&
                    addedInfo.map(info => (
                      <div className="review-item">
                        <h6>Additional Information</h6>
                        <Divider />
                        <ul className="list-unstyled">
                          <li>
                            <span>Title:</span> {info.title || 'N/A'}
                          </li>
                          <li>
                            <span>Description:</span>{' '}
                            {info.description || 'N/A'}
                          </li>
                          {info.link && (
                            <li>
                              <span>Link:</span>{' '}
                              <a href={info.link}>View link</a>
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                </GridItem>
              </GridContainer>
            </Panel>
          </GridItem>
        </GridContainer>
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
  return bindActionCreators({ updateUser, attemptLogout }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ViewUserProfile);
