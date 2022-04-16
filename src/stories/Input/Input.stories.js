import React from 'react';
import { SIZE_INPUT, INPUT_VARIANT } from '../constants/enums';
import Input from './Input';

export default {
  title: 'Component/Input',
  component: Input,
};

const Template = (args) => <Input {...args} />;

export const sizeFirst_Name = Template.bind({});
sizeFirst_Name.args = {
  variant: INPUT_VARIANT.OUTLINED,
  size: SIZE_INPUT.FIRST_NAME,
  disabled: false,
  required: false,
  placeholder: 'First Name',
};

export const sizeType = Template.bind({});
sizeType.args = {
  variant: INPUT_VARIANT.OUTLINED,
  size: SIZE_INPUT.TYPES,
  disabled: false,
  required: false,
  placeholder: 'You can type your question',
};
