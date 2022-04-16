/*
 * Filename: panel.js
 * Responsible all cmponent with headding
 * and child components
 */

import React from 'react';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import classNames from 'classnames';

import GridItem from '../components/grid/GridItem';
import GridContainer from '../components/grid/GridContainer';

import '../static/css/panel.css';

// Right icon option component
const RightIconOption = props => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton>
        <i className="material-icons">more_vert</i>
      </IconButton>
    }
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    <MenuItem primaryText="Refresh" />
    <MenuItem primaryText="Help" />
    <MenuItem primaryText="Sign out" />
  </IconMenu>
);

const Panel = props => {
  const panelClass = classNames({
    'readmin-panel': true,
    righticonmenu: props.righticon,
    'body-text-center': props.center,
  });

  return (
    <div className={panelClass}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <div className="panel-heading">
            <h5 style={props.titleStyle}>
            {props.image} {props.title} <span>{props.subtitle}</span>
            </h5>
          </div>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <div className="panel-actions-wrap">{props.action}</div>
        </GridItem>
      </GridContainer>

      {props.righticon ? <RightIconOption /> : ''}
      <div className="panel-body" style={{ height: props.height + 'px' }}>
        {props.children}
      </div>
    </div>
  );
};

export default Panel;
