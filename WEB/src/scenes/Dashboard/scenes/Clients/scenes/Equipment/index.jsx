import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import  EquipmentScene from './scenes'

import {getQRCodeByClient} from 'services/qrcode/actions'

import "./style";


const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
  
  getQRCodeByClient:(data)=>dispatch(getQRCodeByClient(data))
});


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }


  componentDidMount = () => {
    this.props.getQRCodeByClient({params:{id:this.props.id}})
  };



  render = () => {
    return (
     <EquipmentScene />
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
