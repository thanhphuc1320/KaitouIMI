import React from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
};

export const UserTypeRadio = props => (
  <div>
    <RadioButtonGroup 
      name={props.name} 
      defaultSelected="patient">
      <RadioButton
        name="patient"
        value="patient"
        label="Patient"
        onChange={props.onPatientChange}
        style={styles.radioButton}
      />
      <RadioButton
        name="doctor"
        value="doctor"
        label="Doctor"
        onChange={props.onDoctorChange}
        style={styles.radioButton}
      />
    </RadioButtonGroup>
  </div>
);

export default UserTypeRadio;