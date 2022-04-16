import React from 'react';
import { CardVideo } from './Video';

export default {
  title: 'Component/Card/Video',
  component: CardVideo,
};

const Template = (args) => {
  return <CardVideo {...args} />;
};
export const CardVio = Template.bind({});
CardVio.args = {
  completed: false,
  active: false,
};
