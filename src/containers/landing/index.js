import './../styles.css';

import React from 'react';

import LandingHeader from './elements/header';
import QuizContainer from './elements/quiz';
import ContentContainer from './elements/content';
import Footer from './elements/footer';

const LandingContainer = () => {
  return (
    <div id="home-page">
      <LandingHeader />
      <QuizContainer/>
      <ContentContainer/>
      <Footer/>
    </div>
  );
};

export default LandingContainer;
