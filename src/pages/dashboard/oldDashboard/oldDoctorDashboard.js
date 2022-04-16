import React, { Component } from 'react';
import { connect } from 'react-redux';
// import MaterialTable from 'material-table';
import { bindActionCreators } from 'redux';

import { Redirect } from 'react-router-dom';
import CheckIcon from '@material-ui/icons/CheckCircleOutlined';

import { BoxSingle } from '../../../components/iconBoxAlter';

import {
  getRequests,
  updateRequest,
} from '../../../store/actions/request.action';
import Panel from '../../../components/panel';

import '../../../static/css/doctor-dashboard.css';
import MaterialTable from '../../../components/material-tables/src';
import { MaterialTableStyle } from './clientDashboardStyle';

import {
  convertToDiseaseName,
  convertDate,
  convertToStatusName,
  convertMilisecondToDate,
} from '../../../utils';

const styles = {
  tableStatus: {
    background: 'rgb(35, 200, 170)',
    padding: '2px 6px',
    borderRadius: '3px',
    color: 'white',
  },
  RadioGroup: {
    display: 'flex',
    flexFlow: 'row',
  },
  CheckIcon: {
    color: 'rgb(35, 200, 170)',
    margin: '10px',
  },
  CancelIcon: {
    color: 'rgb(244, 67, 54)',
    margin: '10px',
  },
};

class DoctorDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRow: null,
      requestsMode: '0',
    };
  }

  componentDidMount() {
    const {
      user: { token, role },
    } = this.props || {};
    if (token && role === 'doctor') {
      // const requestModeInfo = { token, page: 0, limit: PAGE_LIMIT }
      this.props.getRequests({ token });
    }
  }

  onRowClick(e, selectedRow) {
    this.setState({ ...this.state, ...{ selectedRow } });
  }

  changeRequestStatus(e, requestId, status, mode) {
    e.stopPropagation();
    // Change from 0 to 1
    if (status === 1 && mode === 1) {
      const request = {
        requestId,
        data: {
          status,
          mode,
        },
      };
      this.props.updateRequest(request);
    }
  }

  switchRequestsMode(e) {
    const name = e.target.getAttribute('name');
    this.setState({ ...this.state, ...{ requestsMode: name } });
  }

  render() {
    const {
      user: { requestsToReview },
      dashboardTitle,
    } = this.props || {};
    const { requestsMode, selectedRow } = this.state;
    // Get requests from user object based on mode
    /*
      Status:
      - 0: Waiting
      - 1: In Progress
      - 2: Completed
      - 3: Rejected
      - 4: Claimed
    */

    const filteredRequestsToReview = requestsToReview[requestsMode] || [];

    // FIX_ME: find the way more efficient
    const restructuredRequests = [];
    // Sorting based on createdAt
    filteredRequestsToReview.sort(
      (itemA, itemB) =>
        convertDate(itemB.createdAt) - convertDate(itemA.createdAt)
    );
    // Re structure object for table
    let i = 1;
    filteredRequestsToReview.map((request) => {
      const { type, createdAt, status, _id, user } = request;
      const newRequest = {
        id: i,
        createdAt: convertMilisecondToDate(createdAt, 'string') || '',
        type: convertToDiseaseName(type) || '',
        _id,
        status: convertToStatusName(status || 0),
        patientEmail: user ? user.email : 'N/A',
      };
      restructuredRequests.push(newRequest);
      i += 1;
      return restructuredRequests;
    });

    return (
      requestsToReview &&
      requestsToReview.length && (
        <div>
          {selectedRow ? (
            <Redirect to={`/requests/${selectedRow._id}`} />
          ) : (
            <div className="request-page">
              <div style={{ maxWidth: '100%' }} className="col-md-12" />
              <h1> {dashboardTitle} </h1>
              <Panel title="Most recent Requests" righticon={false}>
                <div className="iconbox-wrapper alter">
                  <div className="row">
                    <div className="col-md-3 col-sm-6">
                      <BoxSingle
                        className="iconbox-single-0"
                        color="#fff"
                        icon="supervisor_account"
                        subtitle="Waiting Requests"
                        bg={requestsMode === '0' ? '#1dc5e9' : '#c6c6c6'}
                        name="0"
                        onClick={(e) => this.switchRequestsMode(e)}
                        title={(requestsToReview['0'] || []).length}
                      />
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <BoxSingle
                        color="#fff"
                        icon="supervisor_account"
                        className="iconbox-single-1"
                        subtitle="Pending Requests"
                        bg={requestsMode === '1' ? '#fdba2c' : '#c6c6c6'}
                        name="1"
                        onClick={(e) => this.switchRequestsMode(e)}
                        title={(requestsToReview['1'] || []).length}
                      />
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <BoxSingle
                        color="#fff"
                        icon="supervisor_account"
                        subtitle="Completed Requests"
                        bg={requestsMode === '2' ? '#cb55e3' : '#c6c6c6'}
                        name="2"
                        onClick={(e) => this.switchRequestsMode(e)}
                        title={(requestsToReview['2'] || []).length}
                        className="iconbox-single-2"
                      />
                    </div>
                  </div>
                </div>
                <MaterialTable
                  style={MaterialTableStyle}
                  columns={[
                    { title: 'ID', field: 'id' },
                    { title: 'Disease', field: 'type' },
                    { title: 'Patient', field: 'patientEmail' },
                    {
                      title: 'Status',
                      field: 'status',
                      render: (rowData) => (
                        <td style={styles.tableStatus}>{rowData.status}</td>
                      ),
                    },
                    { title: 'Created Date', field: 'createdAt' },
                    {
                      title: '',
                      render: (rowData) => (
                        <td>
                          {rowData.status === 'Waiting' && (
                            <span style={styles.CheckIcon}>
                              <CheckIcon
                                onClick={(e) =>
                                  this.changeRequestStatus(e, rowData._id, 1, 1)
                                }
                              />
                            </span>
                          )}
                          {/* <span onClick={(e) => this.changeRequestStatus(e)} style={styles.CancelIcon}><CancelIcon /></span> */}
                        </td>
                      ),
                    },
                  ]}
                  onRowClick={(evt, selectedRow) =>
                    this.onRowClick(evt, selectedRow)
                  }
                  data={restructuredRequests}
                  title=""
                  options={{
                    sorting: true,
                    rowStyle: (rowData) => ({
                      backgroundColor:
                        selectedRow &&
                        selectedRow.tableData.id === rowData.tableData.id
                          ? '#EEE'
                          : '#FFF',
                    }),
                  }}
                />
              </Panel>
            </div>
          )}
        </div>
      )
    );
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({ getRequests, updateRequest }, dispatch);
}

export default connect(null, matchDispatchToProps)(DoctorDashboard);
