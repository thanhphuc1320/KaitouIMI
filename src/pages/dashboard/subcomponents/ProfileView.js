import React from 'react';
import defaultAva from '../../../img/d_ava.png';
import ListItem from './ListItem';
import {
  convertToGenderName,
  convertToLocaleDateString,
} from '../../../utils';
import { NavLink } from 'react-router-dom';

const ProfileView = ({
  patient: { firstName, lastName, gender, email, bio, dob, phone, address },
  requestId,
}) => (
  <div>
    <ul className="list-info">
      <div className="box-customer">
        <div className="info-avatar">
          <img src={defaultAva} alt='' />
        </div>
        <div className="info-name">
          <ListItem title="First Name" body={firstName || 'N/A'} />
          <ListItem title="Last Name" body={lastName || 'N/A'} />
        </div>
      </div>
      <ListItem title="Email" body={email} />
      <ListItem title="Gender" body={convertToGenderName(gender)} />
      <ListItem title="Birthday" body={convertToLocaleDateString(dob)} />
      <ListItem title="Biography" body={bio || 'N/A'} />
      <ListItem title="Phone" body={phone || 'N/A'} />
      <ListItem title="Address" body={address || 'N/A'} />
      <li className="clearfix">
        <span>Old Detail</span>
        <strong>
          <NavLink
            exact
            to={`/requests/${requestId}`}
            // activeStyle={styles.activeStyle}
          >
            <span className="material-icons" />
            Give Recommendation
          </NavLink>
        </strong>
      </li>
    </ul>
  </div>
);

export default ProfileView;
