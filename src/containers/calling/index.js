import React from 'react';
import Calling from './calling';
import { CallingProvider } from './use-calling';

const CallingContainer = () => {
  return (
    <CallingProvider>
      <Calling />
    </CallingProvider>
  );
};

export default CallingContainer;
