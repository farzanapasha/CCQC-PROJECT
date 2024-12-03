import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import "./style";

import {getAllInvoice} from "services/invoice/actions";
import {getAllClient} from "services/client/actions";
import {getAllPayment} from "services/payment/actions";
import {getAllItem} from "services/item/actions"


import InvoiceScene from './scenes'



const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
  getAllInvoice: () => dispatch(getAllInvoice()),
  getAllClient:()=>dispatch(getAllClient()),
  getAllPayment:()=>dispatch(getAllPayment()),
});


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  componentDidMount = () => {
    this.props.getAllInvoice();
    this.props.getAllPayment();
    this.props.getAllClient();
  };

  render = () => {
    return (
      <InvoiceScene getAllInvoice={(e)=>this.props.getAllInvoice()}
      getAllPayment={(e)=>this.props.getAllPayment()}/>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
