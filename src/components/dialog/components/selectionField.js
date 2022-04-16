import React, { useState } from 'react';
import { Button, Menu, MenuItem, Typography } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';

export default function SelectionField(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [state, setState] = useState();
  // const [disabled, setDisabled] =useState();

  React.useEffect(()=>{
      if (props.defaultValue) {
        const finder = props.data.find(i=>i.value === props.defaultValue)
          setState(finder?.label)
      }
  },[props.defaultValue])
 
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (index) => () => {
    handleClose();
    const currentSelect = props.data[index];
    setState(currentSelect?.label);
    props.onChange && props.onChange(currentSelect.value);
   
  };
  return (
          
    <div style={{borderBottom: '1px solid #ddd',marginBottom:16}}>
      <Typography style={{fontSize: '18px',color:'#828282', fontWeight:'100', fontFamily:'Nunito'}}>{props.placeHolder}</Typography>
      <Button
        style={{
          borderRadius: "unset",
          justifyContent: 'space-between',
          padding:'0px',
          fontFamily:'Nunito',
          fontSize:'18px',
          height: '31px'
        }}
        fullWidth
        aria-controls="select-dropdown-custom"
        aria-haspopup="true"
        onClick={handleClick}
        disabled={props.disabled}
      >
        <span>{props.defaultValue}</span> <KeyboardArrowDown htmlColor="#828282" />
      </Button>
      <Menu
        id="select-dropdown-custom"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        value
      >
        {props.data?.map((item, idx) => (
          <MenuItem style={{borderBottom: '1px solid #ddd', width:'258px', fontFamily:' Open Sans', fontSize:14}}  selected={item.value === props.value} key={idx} onClick={handleChange(idx)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
