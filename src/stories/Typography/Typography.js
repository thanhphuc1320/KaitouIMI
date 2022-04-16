import React from 'react';
import PropTypes from 'prop-types';
import './typography.css';

export const Typography = () => {
  return (
    <>
      <h1 className="h1">Heading Level 1 Bold/ 50pt</h1>
      <h2 className="h2">Heading Level 2 - Bold/ 36pt</h2>
      <h3 className="h3">Heading Level 3 - Regular/24 pt</h3>
      <p className="subtitle">Subtitle - Regular/22 pt</p>
      <p className="description">Descriptions - Regular/ 18 pt</p>
      <p className="label">Label - Regular/ 14 pt</p>
      <p className="text-list">Text list - Regular / 20pt</p>
    </>
  );
};

Typography.prototype = {
  colorIMI: PropTypes.string,
};
