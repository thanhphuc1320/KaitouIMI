import React from 'react';

import { Typography } from './Typography';

export default {
  title: 'Component/Typography',
  component: Typography,
};

const Template = (args) => <Typography {...args} />;

export const Type = Template.bind({});
Type.args = {
  colorIMI: '#000000',
};
