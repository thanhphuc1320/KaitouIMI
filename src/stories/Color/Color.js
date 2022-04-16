import React from 'react';
import PropTypes from 'prop-types';
import './Color.css';

export const Color = () => {
  return (
    <div className="container">
      <div className="story-book-color primary1">2F80ED</div>
      <div className="story-book-color primary1hover">71ABFA</div>
      <div className="story-book-color light-green">80D2BD</div>
      <div className="story-book-color primary2">F7931E</div>
      <div className="story-book-color primary2hover">FAB361</div>
      <div className="story-book-color disable">DADADA</div>
    </div>
  );
};
Color.propTypes = {
  color: PropTypes.string,
};
