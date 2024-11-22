import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import "./style";

import { getAllLead} from "services/lead/actions";

import LeadScene from './scenes'

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
  getAllLead: () => dispatch(getAllLead())
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {  
    };
  }


  componentDidMount = () => {
    this.props.getAllLead();
  };


  render = () => {
    return (
      <LeadScene FetchLead={(e)=>this.props.getAllLead()}/>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
