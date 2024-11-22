import React, { Component, useState, useLayoutEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import HomeScene from "./scenes"
import {getAllTeam } from "services/team/actions";
import {getTodaysAppoinment,getTopInsights } from "services/dashboard/actions";



const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
  getAllTeam: () => dispatch(getAllTeam()),
  getTodaysAppoinment:()=>dispatch(getTodaysAppoinment()),
  getTopInsights:()=>dispatch(getTopInsights())

});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    this.props.getAllTeam()
    this.props.getTodaysAppoinment()
    this.props.getTopInsights()
  };
  render = () => {
    return (
      <HomeScene />
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
