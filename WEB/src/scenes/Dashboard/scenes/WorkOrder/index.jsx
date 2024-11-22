import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import "./style";

import WorkorderScene from './scenes'

import { getAllEquipment} from "services/equipment/actions";
import { getAllScheduleType } from "services/scheduletype/actions";
import { getAllTeam } from "services/team/actions";
import { getAllWorkorderStatus } from "services/workorderstatus/actions";
import {getAllItem} from "services/item/actions"


const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
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
    this.props.getAllEquipment()
    this.props.getAllScheduleType()
    this.props.getAllTeam()
    this.props.getAllWorkorderStatus()
    this.props.getAllItem()
  };

  render = () => {

    return (
      <WorkorderScene />
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
