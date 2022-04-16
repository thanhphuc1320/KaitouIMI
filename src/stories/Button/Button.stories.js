import React from 'react';

import { Button } from './Button';

export default {
  title: 'Component/Button',
  component: Button,
};
const Template = (args) => {
  return <Button {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'Button',
  disabled: false,
  colorIMI: 'primary1',
  size: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
  colorIMI: 'primary2',
  disabled: false,
  size: 'primary',
};

export const Back = Template.bind({});
Back.args = {
  label: '',
  colorIMI: 'primary1',
  size: 'back',
  disabled: false,
};

export const Next = Template.bind({});
Next.args = {
  label: '',
  colorIMI: 'primary1',
  size: 'next',
  disabled: false,
};

export const Play = Template.bind({});
Play.args = {
  label: '',
  colorIMI: 'primary1',
  size: 'play',
  disabled: false,
};

export const TimeLine = Template.bind({});
TimeLine.args = {
  size: 'timeline',
  label: '1',
  completed: true,
};
