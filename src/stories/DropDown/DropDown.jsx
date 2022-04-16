import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import MuiSelect from '@material-ui/core/Select';

import { SIZE_SELECT } from '../constants/enums';
import styles from './DropDownStyle';

const Select = ({
  classes,
  className,
  size,
  disabled,
  onChange,
  children,
  defaultValue,
  value,
}) => {
  console.log(value);
  return (
    <MuiSelect
      className={classNames({
        [classes.root]: true,
        [className]: Boolean(className),
        [classes.default]: size === SIZE_SELECT.DEFAULT,
      })}
      size={size}
      disabled={disabled}
      onChange={onChange}
      defaultValue={defaultValue}
      value={value}
    >
      {children}
    </MuiSelect>
  );
};

Select.defaultProps = {
  size: SIZE_SELECT.DEFAULT,
  disabled: false,
};

Select.propTypes = {
  classes: PropTypes.object.isRequired,
  size: PropTypes.oneOf(Object.values(SIZE_SELECT)),
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
  defaultValue: [PropTypes.string, PropTypes.number],
  value: PropTypes.any,
};

export default withStyles(styles)(Select);
