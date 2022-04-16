import React from 'react';
import PropTypes from 'prop-types';
import './button.css';
import CircularProgress from '@material-ui/core/CircularProgress';

const SIZES = ['timeline', 'primary', 'back', 'next', 'play'];

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  colorIMI,
  backgroundColor,
  size,
  label,
  disabled,
  completed,
  loading,
  ...props
}) => {
  let internalLabel = size === 'primary' ? label : '';
  let internalLoading = loading;

  const isTimeline = size === 'timeline';

  if (isTimeline) {
    internalLabel = completed ? '' : 1;
    disabled = false;
    internalLoading = false;
  }

  const wrapperLabelClasses = [
    'storybook-button',
    `storybook-button--${size}`,
    `storybook-button--${colorIMI}`,
  ];

  if (isTimeline && completed) {
    wrapperLabelClasses.push('storybook-button--completed');
  }

  const classes = {
    wrapperLabel: wrapperLabelClasses.join(' '),
  };

  return (
    <div className="wrapStep">
      <Loading show={internalLoading} size={size} />
      <div disabled={disabled} className={classes.wrapperLabel} {...props}>
        {internalLabel}
      </div>
      <LineCompleted completed={completed} size={size} />
    </div>
  );
};

function LineCompleted({ completed = false, size = '' }) {
  const classes = {
    true: 'lineBlue',
    false: 'lineGray',
  };

  if (size !== 'timeline') {
    return null;
  }

  return <div className={classes[String(completed)]} />;
}

function Loading({ show = false, size = '' }) {
  if (!show || size !== 'primary') return null;
  return <CircularProgress className="isLoadingProgress" />;
}

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  colorIMI: PropTypes.oneOf(['primary1', 'primary2']),
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(SIZES),
  /**
   * Button contents
   */
  label: PropTypes.string,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  completed: PropTypes.bool,
  loading: PropTypes.bool,
};

Button.defaultProps = {
  backgroundColor: null,
  size: 'primary',
  onClick: undefined,
  disabled: false,
  colorIMI: 'primary1',
};
