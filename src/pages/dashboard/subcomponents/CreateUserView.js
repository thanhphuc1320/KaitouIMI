import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Swal from 'sweetalert2';

import { createUserApi } from '../../../store/actions/user.action';
import { PATIENT_ROLE, DOCTOR_ROLE } from '../../../constant';

const CreateUserView = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(DOCTOR_ROLE);
  const [numOfRequest, setNumOfRequest] = useState(user.numOfCreateUserRequest);

  useEffect(() => {
    if (user.numOfCreateUserRequest !== numOfRequest) {
      setNumOfRequest(user.numOfCreateUserRequest);

      const alertContent = {
        title: 'Create User Successfully',
        icon: 'success',
      };

      if (user.createUserResponse.code) {
        // Error
        const { errors } = user.createUserResponse;
        alertContent.title = 'Oops!';
        alertContent.icon = 'error';
        alertContent.html = `<div>${Object.keys(errors)
          .map((e) => `<p>${errors[e].readableMsg || errors[e].msg}</p>`)
          .join('')}</div>`;
      }

      Swal.fire(alertContent);
    }
  }, [user]);

  const handleSubmit = (event) => {
    // TODO: handle submit form
    event.preventDefault();
    dispatch(createUserApi({ email, role }));
  };

  const RadioButton = (
    <Radio color="primary" onChange={(evt) => setRole(evt.target.value)} />
  );

  return (
    <form className="vertical-alignment" onSubmit={handleSubmit}>
      <FormControl component="fieldset">
        <TextField
          floatingLabelText="Email"
          type="email"
          onChange={(evt) => setEmail(evt.target.value)}
        />
        <RadioGroup defaultValue={DOCTOR_ROLE} aria-label="role" name="role">
          <FormControlLabel
            value={DOCTOR_ROLE}
            control={RadioButton}
            label="Doctor"
          />
          <FormControlLabel
            value={PATIENT_ROLE}
            control={RadioButton}
            label="Patient"
          />
        </RadioGroup>
        <RaisedButton type="submit" primary label="Create" />
      </FormControl>
    </form>
  );
};

export default CreateUserView;