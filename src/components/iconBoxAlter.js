import React from 'react';


export const BoxSingle = (props) => {
  const style = {
    color: props.color
  }
  return (
    <div onClick={props.onClick} name={props.name} className={`${"iconbox-single"} ${props.className}`} style={{'background': props.bg}}>
      <div name={props.name} className="box-title">
        <div name={props.name} className="circle-icon-alter" >
          <i name={props.name} className="material-icons" style={style}>{props.icon}</i>
        </div>
        <div>
          <h3 name={props.name}> {props.title}</h3>
          <p name={props.name}>{props.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

const IconBoxesAlter = () => {
  return (
    <div className="iconbox-wrapper alter">
      <div className="row">
        <div className="col-md-3 col-sm-6">
          <BoxSingle
            color="#fff"
            icon="monetization_on"
            title="9, 693"
            subtitle="Earns"
            bg="#f54a70"
          >
          </BoxSingle>
        </div>

        <div className="col-md-3 col-sm-6">
          <BoxSingle
            color="#fff"
            icon="add_shopping_cart"
            title="1, 250"
            subtitle="Sales"
            bg="#cb55e3"
          >
          </BoxSingle>
        </div>

        <div className="col-md-3 col-sm-6">
          <BoxSingle
            color="#fff"
            icon="supervisor_account"
            title="2, 324"
            subtitle="Users"
            bg="#1dc5e9"
          >
          </BoxSingle>
        </div>
        <div className="col-md-3 col-sm-6">
          <BoxSingle
            color="#fff"
            icon="remove_red_eye"
            title="1, 580"
            subtitle="Views"
            bg="#fdba2c"
          >
          </BoxSingle>
        </div>
      </div>
    </div>
  );
}

export default IconBoxesAlter;
