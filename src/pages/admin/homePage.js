import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

import ico_user from '@img/imi/ico-user.png';
import ico_doctor from '@img/imi/ico-ad-doctor.png';
import ico_calendar from '@img/imi/ico-ad-calendar.png';
import ico_search from '@img/imi/ico-search.png';
import logo from '@img/imi/img-hospital.png';
import defaultAva from '@img/d_ava.png';

import '../../static/css/admin-dashboard.css';
import AdminAppoiment from './apppointment';
import ListUser from './listUser';
import CreateProfile from './createProfile';
import CreateAppoiment from './createAppoiment';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabadmin"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function AdminHomepage(props) {
  const [activeTab, setActiveTab] = useState(props.activeTab || -1);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [sidebar, setSidebar] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const activeTabSidebar = (index) => {
    console.log('index: ', index);
    setActiveTab(-1);
    setSidebar(index);
  }

  return (
    <div className="admin-homepage">
      <div className="admin-left">
        <div className="admin-logo">
          <div className="logo-img">
            <img src={logo}></img>
          </div>
        </div>
        <div className="admin-container-sidebar">
          <div className="admin-sidebar-nav">
            <div className="sidebar-nav-custom">
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
              >
                <Tab
                  label="Patients"
                  icon={<img src={ico_user} alt="" />}
                  {...a11yProps(0)}
                  onClick={() => activeTabSidebar(0)}
                ></Tab>
                <Tab
                  label="Doctors"
                  icon={<img src={ico_doctor} alt="" />}
                  {...a11yProps(1)}
                  onClick={() => activeTabSidebar(1)}
                />
                <Tab
                  label="Appointments"
                  icon={<img src={ico_calendar} alt="" />}
                  {...a11yProps(2)}
                  onClick={() => activeTabSidebar(2)}
                />
              </Tabs>
            </div>
          </div>
          <div className="sidebar-container bt-0">
            <button onClick={() => setActiveTab(1)}>Add Patient</button>
            <button onClick={() => setActiveTab(2)}>Add Doctor</button>
            <button onClick={() => setActiveTab(3)}>Add Appointment</button>
          </div>
        </div>
      </div>
      <div className="admin-right d-flex">
        {activeTab !== 1 && activeTab !== 2 && activeTab !== 3 ? (
          <div style={{height: '100%'}}>
            <div className="admin-right-header">
              <div className="header-left-container">
                <div
                  style={{
                    color: '#4266FF',
                    'font-size': '24px',
                    'font-weight': '800',
                  }}
                >
                  {sidebar === 0 ? 'Patient list' : (sidebar === 1 ? 'Doctor list' : 'Appointment list')}
                </div>
                <div className="header-left-nav">
                  <div className="admin-header-nav active">All</div>
                  <div className="admin-header-nav">Neurology</div>
                  <div className="admin-header-nav">Internal medicine</div>
                  <div className="admin-header-nav">Surgecy</div>
                  <div className="admin-header-nav">Obstetrics </div>
                </div>
              </div>
              <div className="header-right-container">
                <input />
                <img src={ico_search} />
              </div>
            </div>
            <div className="admin-right-container">
              <TabPanel value={value} index={0}>
                <ListUser role={'patient'}/>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <ListUser role={'doctor'}/>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <AdminAppoiment />
              </TabPanel>
            </div>
          </div>
        ) : (
          <div>
            {activeTab === 1 && <CreateProfile onRole={'patient'} />}
            {activeTab === 2 && <CreateProfile onRole={'doctor'} />}
            {activeTab === 3 && <CreateAppoiment/>}
          </div>
        )}
      </div>
    </div>
  );
}
