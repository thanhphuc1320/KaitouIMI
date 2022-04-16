import React from 'react';

const ListItem = ({ title, body, style }) => (
  <li className="clearfix" style={style}>
    <span>{title}</span>
    <strong>{body}</strong>
  </li>
);

export default ListItem;
