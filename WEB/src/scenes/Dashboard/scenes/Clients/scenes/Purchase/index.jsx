import React, { Component } from "react";
import { connect } from "react-redux";

import PurchaseScene from './scenes'

import {getPurchaseByClient} from "services/purchaseorder/actions"

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
  getPurchaseByClient: (data) => dispatch(getPurchaseByClient(data)),
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }


  componentDidMount = () => {
    this.props.getPurchaseByClient({params:{id:this.props.id}})
  };

  


  render = () => {
   
    return (
      <PurchaseScene/>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
