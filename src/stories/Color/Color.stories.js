import React from 'react';

import { Color } from './Color';

export default {
  title: 'Component/Color',
  component: Color,
};

const Template = (args) => <Color {...args} />;

export const Type = Template.bind({});
Type.args = {
  color: '',
};
