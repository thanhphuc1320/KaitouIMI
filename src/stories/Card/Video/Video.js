import React from 'react';
import PropTypes from 'prop-types';
import './Video.css';
import ico_video from '../../../img/imi/ico-video-record.png';

export const CardVideo = ({ active, completed }) => {
  let videoProgressClass = '';

  if (completed || active) {
    videoProgressClass = `video-progress--${active ? 'active' : 'video'}`;
  }

  return (
    <div className="card-video">
      <div className="video-upload">
        <img src={ico_video} alt={ico_video} />
      </div>
      <div className="video-progress">
        <div className={videoProgressClass} />
      </div>
    </div>
  );
};

CardVideo.propTypes = {
  completed: PropTypes.bool,
  active: PropTypes.bool,
};

CardVideo.defaultProps = {
  completed: false,
  active: false,
};
