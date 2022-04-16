import React, { Component } from 'react';
import styled from "styled-components";
 
const Backdrop = (props) => {
    return (
        <Container onClick={props.click}>

        </Container>
    );
}

const Container = styled.div`
position: fixed;
width: 100%;
height: 100%;
top:0;
left:0;
background: rgba(0, 0, 0, 0.5);
z-index:400;
`


export default Backdrop;