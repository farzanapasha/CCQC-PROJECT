import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import "./style";

import {getAllInvoice} from "services/invoice/actions";
import {getAllClient} from "services/client/actions";
import {getAllWorkOrder} from "services/workorder/actions";
import {getAllItem} from "services/item/actions"


import InvoiceScene from './scenes'



const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
  getAllInvoice: () => dispatch(getAllInvoice()),
  getAllClient:()=>dispatch(getAllClient()),
  getAllWorkOrder:()=>dispatch(getAllWorkOrder()),
  getAllItem:()=>dispatch(getAllItem())
});


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  componentDidMount = () => {
    this.props.getAllInvoice();
    this.props.getAllWorkOrder();
    this.props.getAllClient();
    this.props.getAllItem();
  };

  render = () => {
    return (
      <InvoiceScene getAllInvoice={(e)=>this.props.getAllInvoice()}
      getAllWorkOrder={(e)=>this.props.getAllWorkOrder()}/>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
