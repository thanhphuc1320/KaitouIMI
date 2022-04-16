import React from 'react';
import * as Styled from './styled';

import Navbar from './navbar';

const Health = () => {
  return (
    <div>
      <Styled.Header>
        <div className="content-header">
          <div className="container">
            <Navbar />
          </div>
          <div class="health"></div>
        </div>
      </Styled.Header>
    </div>
  );
};

export default Health;
