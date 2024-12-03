import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-responsive-modal";
import Select from 'react-select'

import {
  faArrowDown,
  faArrowUp,
  faPlus,
  faSearch,
} from "@fortawesome/fontawesome-free-solid";
import "./style";
import Table from "components/ReactTable";

import {getAllTeam } from "services/team/actions";
import {getAllUser } from "services/user/actions";


import Loader from "components/Loader";
import TeamScene from './scenes'

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
  getAllTeam: () => dispatch(getAllTeam()),
  getAllUser:()=>dispatch(getAllUser())
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    this.props.getAllTeam();
    this.props.getAllUser()
  };

  render = () => {
    return (
     <TeamScene FetchTeam={(e)=>this.props.getAllTeam()}/>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
