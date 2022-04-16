import React from 'react';
import PropTypes from 'prop-types';
import './Image.css';
import img_default from '../../../img/imi/ico-img-default.png';
import img_remove from '../../../img/imi/ico-remove.png';
import ico_check from '../../../img/imi/ico-check-green.png';

export const CardImg = ({ completed }) => {
  return (
    <div className="card-image">
      <div className="image-upload">
        <img src={img_default} />
      </div>
      <div className="detail-img">
        <p>img 002.png</p>
        {!completed && (
          <div className="card-img-process">
            <div className="card-uploaded"></div>
          </div>
        )}
        <div className="gr-icon-card">
          {completed && (
            <>
              <img src={ico_check} />
              <img className="card-icon-remove" src={img_remove} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

CardImg.protoTypes = {
  completed: PropTypes.bool,
};

CardImg.defaultProps = {
  completed: false,
};
