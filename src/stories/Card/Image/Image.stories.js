import React from 'react';
import { CardImg } from './Image';

export default {
  title: 'Component/Card/Image',
  component: CardImg,
};

const Template = (args) => {
  return <CardImg {...args} />;
};

export const CardImage = Template.bind({});
CardImage.args = {
  completed: false,
};
