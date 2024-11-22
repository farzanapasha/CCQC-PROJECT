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



import {getAllUser} from "services/user/actions";
import {getAllRole} from "services/role/actions";


import UserScene from './scenes'

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
  getAllUser: () => dispatch(getAllUser()),
  getAllRole:()=>dispatch(getAllRole()),
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
 
  componentDidMount = () => {
    this.props.getAllUser();
    this.props.getAllRole()
  };

  render = () => {
    return (
    <UserScene FetchUser={(e)=>this.props.getAllUser()} />
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
