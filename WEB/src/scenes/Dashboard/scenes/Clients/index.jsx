import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-responsive-modal";
import {
  faPlus,
} from "@fortawesome/fontawesome-free-solid";
import Select from 'react-select'
import "./style";



import {getAllClient} from "services/client/actions";
import { getAllEquipment} from "services/equipment/actions";
import { getAllScheduleType } from "services/scheduletype/actions";
import { getAllTeam } from "services/team/actions";
import { getAllWorkorderStatus } from "services/workorderstatus/actions";
import {getAllItem} from "services/item/actions"

import ClientScene from './scenes'

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
  getAllClient: () => dispatch(getAllClient()),
  getAllEquipment:()=>dispatch(getAllEquipment()),
  getAllScheduleType:()=>dispatch(getAllScheduleType()),
  getAllTeam:()=>dispatch(getAllTeam()),
  getAllWorkorderStatus:()=>dispatch(getAllWorkorderStatus()),
  getAllItem:()=>dispatch(getAllItem())
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
 
  componentDidMount = () => {
    this.props.getAllClient();
    this.props.getAllEquipment()
    this.props.getAllScheduleType()
    this.props.getAllTeam()
    this.props.getAllWorkorderStatus()
    this.props.getAllItem()
  };

  render = () => {
    return (
    <ClientScene FetchClient={(e)=>this.props.getAllClient() } locationProps = {this.props.location.state} />
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
