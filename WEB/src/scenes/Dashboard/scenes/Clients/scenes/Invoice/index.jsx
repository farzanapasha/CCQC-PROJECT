import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import InvoiceScene from './scenes'

import {getAllInvoiceByClient} from 'services/invoice/actions'
import {getAllWorkOrderByClient} from 'services/workorder/actions'
import { getAllPaymentByInvoice } from "services/payment/actions";


const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
  getAllInvoiceByClient:(data)=>dispatch(getAllInvoiceByClient(data)),
  getAllWorkOrderByClient:(data)=>dispatch(getAllWorkOrderByClient(data)),
  getAllPaymentByInvoice: (data) => dispatch(getAllPaymentByInvoice(data))

});



class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }


  componentDidMount = () => {
    this.props.getAllInvoiceByClient({params: {id:this.props.id}})
    this.props.getAllWorkOrderByClient({params: {id:this.props.id}})
  };

  

  render = () => {
    return (<InvoiceScene 
      clientId = {this.props.id}
      getAllWorkOrderByClient={(params)=>this.props.getAllWorkOrderByClient(params)}
      getAllInvoiceByClient={(params)=>this.props.getAllInvoiceByClient(params)}
      getAllPaymentByInvoice={(params)=>this.props.getAllPaymentByInvoice(params)}
      /> );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
