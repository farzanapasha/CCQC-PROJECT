import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style";

import { getAllWorkOrderByClient } from "services/workorder/actions";
import { getAllScheduleByWorkOrder } from "services/schedule/actions";
import { getAllInvoiceByWorkOrder } from "services/invoice/actions";



import Schedule from "./schedule"
import Invoice from "./invoice"
import Workorder from "./workorder"

const mapStateToProps = (state, ownProps) => ({
  equipments: state.equipment,
  schedule: state.schedule,
  worktypes: state.scheduletype,
  team: state.team
});

const mapDispatchToProps = (dispatch) => ({
  getAllWorkOrderByClient: (data) => dispatch(getAllWorkOrderByClient(data)),
  getAllScheduleByWorkOrder: (data) => dispatch(getAllScheduleByWorkOrder(data)),
  getAllInvoiceByWorkOrder: (data) => dispatch(getAllInvoiceByWorkOrder(data)),
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      openAddWorkOrder: false,
      openScheduleModel: false,
      openInvoiceModel: false,
      activeWorkorderId: "",
      activeWorkorderIdDisplay: "",
      description: "",
      location: null,
      status_id: 1,
      type: "type1",
      errors: {
        description: "",
        location: "",
        status_id: "",
        type: "",
      },
    };
  }


  componentDidMount = () => {
    this.props.getAllWorkOrderByClient({ params: { id: this.props.id } });
    if(this.props.locationProps!==null){   
      if(this.props.locationProps.from==="home"){                 
      this.setState({
      openScheduleModel:true,
        activeWorkorderId:this.props.locationProps.item.workOrderId,
        activeWorkorderIdDisplay:this.props.locationProps.item.workOrderIdDisplay,
        },()=>{
          this.props.getAllScheduleByWorkOrder({
            params: { id:this.props.locationProps.item.workOrderId },
          });
        })
      }
    }  
  };




  render = () => {
    return (
      <div >
        {(!this.state.openScheduleModel && !this.state.openInvoiceModel) && <Workorder
          clientId={this.props.id}
          getAllWorkOrderByClient={(params) => this.props.getAllWorkOrderByClient(params)}
          getAllScheduleByWorkOrder={(params) => this.props.getAllScheduleByWorkOrder(params)}
          getAllInvoiceByWorkOrder={(params) => this.props.getAllInvoiceByWorkOrder(params)}
          openScheduleModel={(id,idDisplay) => this.setState({ activeWorkorderId: id,activeWorkorderIdDisplay:idDisplay, openScheduleModel: true })}
          openInvoiceModel={(id,idDisplay) => this.setState({ activeWorkorderId: id,activeWorkorderIdDisplay:idDisplay, openInvoiceModel: true })}
        />}
        {this.state.openScheduleModel && <Schedule
          workOrderId={this.state.activeWorkorderId}
          workOrderIdDisplay={this.state.activeWorkorderIdDisplay}
          clientId={this.props.id}
          equipments={this.props.equipments.data}
          worktypes={this.props.worktypes.data}
          team={this.props.team.data}
          getAllWorkOrderByClient={(params) => this.props.getAllWorkOrderByClient(params)}
          getAllScheduleByWorkOrder={(params) => this.props.getAllScheduleByWorkOrder(params)}
          closeScheduleModal={(e) => this.setState({ openScheduleModel: false })}
        />}
        {this.state.openInvoiceModel && <Invoice
          workOrderId={this.state.activeWorkorderId}
          workOrderIdDisplay={this.state.activeWorkorderIdDisplay}
          clientId={this.props.id}
          getAllWorkOrderByClient={(params) => this.props.getAllWorkOrderByClient(params)}
          getAllInvoiceByWorkOrder={(params) => this.props.getAllInvoiceByWorkOrder(params)}
          closeInvoiceModal={(e) => this.setState({ openInvoiceModel: false })}
        />}
      </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
