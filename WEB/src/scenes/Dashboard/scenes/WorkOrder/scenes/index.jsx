import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowDown,
  faArrowUp,
  faPlus,
  faSearch,
} from "@fortawesome/fontawesome-free-solid";

import {getAllWorkOrder} from "services/workorder/actions";
import {getAllClient} from "services/client/actions";
import {getAllScheduleByWorkOrder} from "services/schedule/actions"
import {getAllInvoiceByWorkOrder} from "services/invoice/actions"


import Workorder from './workorder'
import Schedule from './schedule'
import Invoice from './invoice'


const validPhoneRegex = RegExp(/\+?\d[\d -]{8,12}\d/g);

const mapStateToProps = (state, ownProps) => ({
  equipments: state.equipment,
  schedule: state.schedule,
  worktypes: state.scheduletype,
  team: state.team
});

const mapDispatchToProps = (dispatch) => ({
  getAllWorkOrder: () => dispatch(getAllWorkOrder()),
  getAllClient:()=>dispatch(getAllClient()),
  getAllScheduleByWorkOrder:(data)=>dispatch(getAllScheduleByWorkOrder(data)),
  getAllInvoiceByWorkOrder:(data)=>dispatch(getAllInvoiceByWorkOrder(data))

});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openScheduleModel:false,
      openInvoiceModel:false,
      openAddWorkOrder:false,
      activeWorkorderId:"",
      activeClientID:"",
      activeWorkorderIdDisplay: "",
    };
  }


  componentDidMount = () => {
    this.props.getAllWorkOrder();
    this.props.getAllClient();
  };

  render = () => {

    return (
      <div className="lead-page-wrapper main">
        <div className="heading-blue-wrapper">
          <div className="blue-bg">
            <h4>Work Order</h4>
            <div></div>
          </div>
          {!this.state.openAddWorkOrder && <div className="tool-component d-none">
            <div>
              <button onClick={(e) => this.setState({ openAddWorkOrder: true })}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Create Work order</span>
              </button>
            </div>
          </div>}
        </div>

        <div className="main-space">
        {(!this.state.openScheduleModel && !this.state.openInvoiceModel)&& <Workorder
         clientId = {this.state.activeClientID}
         openAddWorkOrder={this.state.openAddWorkOrder}
         closeAddWorkorder = {(e)=>this.setState({openAddWorkOrder:false})}
         getAllWorkOrder={(e)=>this.props.getAllWorkOrder()}
         getAllScheduleByWorkOrder={(params)=>this.props.getAllScheduleByWorkOrder(params)}
         getAllInvoiceByWorkOrder={(params)=>this.props.getAllInvoiceByWorkOrder(params)}
         openScheduleModel={(id,idDisplay,client_id) => this.setState({ activeWorkorderId: id,activeWorkorderIdDisplay:idDisplay, openScheduleModel: true,activeClientID:client_id })}
         openInvoiceModel={(id,idDisplay,client_id) => this.setState({ activeWorkorderId: id,activeWorkorderIdDisplay:idDisplay, openInvoiceModel: true,activeClientID:client_id })}
         />}
          {this.state.openScheduleModel&& <Schedule 
          workOrderId={this.state.activeWorkorderId}
          workOrderIdDisplay={this.state.activeWorkorderIdDisplay}
          clientId = {this.state.activeClientID}
          equipments={this.props.equipments.data}
          worktypes={this.props.worktypes.data}
          team={this.props.team.data}
          getAllWorkOrder={()=>this.props.getAllWorkOrder()}
         getAllScheduleByWorkOrder={(params)=>this.props.getAllScheduleByWorkOrder(params)}
          closeScheduleModal={(e)=>this.setState({openScheduleModel:false})}
          />}
          {this.state.openInvoiceModel && <Invoice 
          workOrderId={this.state.activeWorkorderId}
          workOrderIdDisplay={this.state.activeWorkorderIdDisplay}
          clientId = {this.state.activeClientID}
          getAllWorkOrder={()=>this.props.getAllWorkOrder()}
          getAllInvoiceByWorkOrder={(params)=>this.props.getAllInvoiceByWorkOrder(params)}
          closeInvoiceModal={(e)=>this.setState({openInvoiceModel:false})}
          />}  
      </div>
      </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
