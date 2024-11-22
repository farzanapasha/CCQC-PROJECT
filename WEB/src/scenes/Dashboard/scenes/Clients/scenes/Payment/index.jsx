import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import InvoiceScene from './scenes'

import {getAllInvoiceByClient} from 'services/invoice/actions'
import {getAllPaymentByClient} from 'services/payment/actions'

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
  getAllInvoiceByClient:(data)=>dispatch(getAllInvoiceByClient(data)),
  getAllPaymentByClient:(data)=>dispatch(getAllPaymentByClient(data))
});



class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }


  componentDidMount = () => {
    this.props.getAllInvoiceByClient({params: {id:this.props.id}})
    this.props.getAllPaymentByClient({params: {id:this.props.id}})

  };

  

  render = () => {
    return (<InvoiceScene 
      clientId = {this.props.id}
      getAllPaymentByClient={(params)=>this.props.getAllPaymentByClient(params)}
      getAllInvoiceByClient={(params)=>this.props.getAllInvoiceByClient(params)}/>    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
