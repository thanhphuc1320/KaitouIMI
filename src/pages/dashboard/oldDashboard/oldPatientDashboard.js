/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
// import MaterialTable from 'material-table';
import { Link, Redirect } from 'react-router-dom';
import Panel from '../../../components/panel';
import InfoIcon from '@material-ui/icons/Info';
import MaterialTable from '../../../components/material-tables/src';
import { MaterialTableStyle } from './clientDashboardStyle';

import {
  convertToDiseaseName,
  convertDate,
  convertToStatusName,
  convertMilisecondToDateForPatient,
  // notifyOcrComplete,
  formatAMPM,
} from '../../../utils';

import { ENV } from '../../../constant';
import messaging from '../../../firebase';

class OldPatientDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRow: null,
      requestsMode: '0',
      ocrCompleteId: null,
    };
  }

  onRowClick(e, selectedRow) {
    this.setState({ ...this.state, ...{ selectedRow } });
  }

  switchRequestsMode(e) {
    const name = e.target.getAttribute('name');
    this.setState({ ...this.state, ...{ requestsMode: name } });
  }

  render() {
    const { user: { requests = [] } = {}, dashboardTitle } = this.props || {};
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
    let filteredRequestsToReview;

    if (Array.isArray(requests) === false) {
      filteredRequestsToReview = requests || [];
      const dataAllRequest = [];
      for (const item in filteredRequestsToReview) {
        filteredRequestsToReview[item].forEach((itemRequest) => {
          dataAllRequest.push(itemRequest);
        });
      }
      filteredRequestsToReview = dataAllRequest;
    } else {
      filteredRequestsToReview = requests || [];
    }

    // FIX_ME: find the way more efficient
    const restructuredRequests = [];
    // Sorting based on createdAt
    filteredRequestsToReview.sort(
      (itemA, itemB) =>
        convertDate(itemB.createdAt) - convertDate(itemA.createdAt)
    );
    // Re structure object for table
    let i = 1;
    filteredRequestsToReview.map((req) => {
      const { type, createdAt, status, _id, user, bloodTest } = req;
      const newRequest = {
        id: i,
        createdAt:
          formatAMPM(createdAt) +
            ' - ' +
            convertMilisecondToDateForPatient(createdAt, 'string') || '',
        type: convertToDiseaseName(type) || '',
        _id,
        status: convertToStatusName(status),
        patientEmail: user ? user.email : 'N/A',
        statusOCR: bloodTest[0].ocrDetect,
      };
      restructuredRequests.push(newRequest);
      i += 1;
    });

    if (messaging)
      messaging.onMessage((payload) => {
        const { notification } = payload;
        if (notification && notification.channel === `${ENV}:OCR:COMPLETE`) {
          // notifyOcrComplete();
          this.setState({
            ...this.state,
            ...{ ocrCompleteId: notification.requesstId },
          });
        }
      });

    if (this.state.ocrCompleteId)
      return <Redirect to={`/requests/${this.state.ocrCompleteId}`} />;
    return selectedRow ? (
      <div>
        {selectedRow.type === 'Flash Record Reader' &&
          this.props.role !== 'doctor' && (
            <Redirect to={`/test-result/${selectedRow._id}`} />
          )}
        {selectedRow.type !== 'Flash Record Reader' &&
          this.props.role !== 'doctor' && (
            <Redirect to={`/requests/${selectedRow._id}`} />
          )}
        {selectedRow.type === 'Flash Record Reader' &&
          this.props.role === 'doctor' && (
            <Redirect to={`/request-detail-doctor/${selectedRow._id}`} />
          )}
      </div>
    ) : (
      <div>
        <div className="activities-table">
          <div style={{ maxWidth: '100%' }} className="col-md-12" />
          <h1> {dashboardTitle} </h1>
          <Panel righticon={false}>
            <MaterialTable
              style={MaterialTableStyle}
              columns={[
                { title: 'ID', field: 'id' },
                { title: 'Disease', field: 'type' },
                {
                  title: 'Status',
                  field: 'status',
                  render: (rowData) => (
                    <td className="status">
                      {this.props.role !== 'doctor'
                        ? rowData.status
                        : rowData.statusOCR === 'Processing'
                        ? 'Approved'
                        : 'Completed'}
                    </td>
                  ),
                },
                {
                  title: '',
                  render: (rowData) => (
                    <td className="selectRow">
                      {rowData.type === 'Flash Record Reader' ? (
                        <Link to={`/test-result/${rowData._id}`}>
                          <InfoIcon />{' '}
                        </Link>
                      ) : (
                        <Link to={`/requests/${rowData._id}`}>
                          <InfoIcon />{' '}
                        </Link>
                      )}
                    </td>
                  ),
                },
                {
                  title: '',
                  field: '',
                  render: (rowData) => (
                    <td className="createdAt">{rowData.createdAt}</td>
                  ),
                },
              ]}
              onRowClick={(e, selectedRow) => this.onRowClick(e, selectedRow)}
              data={restructuredRequests}
              title=""
              options={{
                paging: false,
                search: false,
                header: false,
                toolbar: false,
                showTitle: false,
              }}
            />
          </Panel>
        </div>
      </div>
    );
  }
}

export default OldPatientDashboard;
