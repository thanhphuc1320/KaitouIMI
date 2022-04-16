import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

/**
 * With the `maxHeight` property set, the Select Field will be scrollable
 * if the number of items causes the height to exceed this limit.
 */
export default class SelecFieldLong extends Component {
  state = {
    value: 10,
  };

  handleChange = (event, index, value) => {
    this.setState({ value });
  };

  render() {
    const { optionsList } = this.props;
    return (
      <SelectField
        value={this.state.value}
        onChange={this.handleChange}
        maxHeight={200}
      >
        {optionsList.map((option) => (
          <MenuItem
            clasName="form-control"
            key={option._id}
            value={option._id}
            primaryText={`${option.firstName} ${option.lastName}`}
          />
        ))}
      </SelectField>
    );
  }
}
