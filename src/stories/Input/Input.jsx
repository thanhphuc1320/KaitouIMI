import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import MuiTextField from '@material-ui/core/TextField';

import { SIZE_INPUT, INPUT_VARIANT } from '../constants/enums';
import styles from './InputStyle';

const Input = ({
  classes,
  className,
  variant,
  size,
  disabled,
  placeholder,
  onChange,
  required,
  ...props
}) => {
  let internalPlaceholder = placeholder;
  let internalDisabled = disabled;

  if (required) {
    switch (size) {
      case SIZE_INPUT.FIRST_NAME:
        internalPlaceholder = 'First Name is Required';
        break;
      case SIZE_INPUT.TYPES:
        internalPlaceholder = 'Please complete this step ';
        break;
    }
  }

  if (disabled && size === SIZE_INPUT.TYPES) {
    internalDisabled = false;
  }
  return (
    <MuiTextField
      className={classNames({
        [classes.root]: true,
        [className]: Boolean(className),
        [classes.firstName]: size === SIZE_INPUT.FIRST_NAME,
        [classes.sizeType]: size === SIZE_INPUT.TYPES,
        [classes.required]: required && size === SIZE_INPUT.FIRST_NAME,
        [classes.requiredType]: required && size === SIZE_INPUT.TYPES,
      })}
      variant={variant}
      required={required}
      size={size}
      disabled={internalDisabled}
      onChange={onChange}
      placeholder={internalPlaceholder}
      {...props}
    />
  );
};

Input.defaultProps = {
  variant: INPUT_VARIANT.OUTLINED,
  size: SIZE_INPUT.FIRST_NAME,
  disabled: false,
  required: false,
};
Input.propTypes = {
  classes: PropTypes.object.isRequired,
  variant: PropTypes.oneOf(Object.values(INPUT_VARIANT)),
  size: PropTypes.oneOf(Object.values(SIZE_INPUT)),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

export default withStyles(styles)(Input);
