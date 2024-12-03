import React, { Component, useState, useLayoutEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import Calendar from "components/RcCalendar";
import { Link } from 'react-router-dom';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltRight,
  faCalendarAlt,
  faClock,
} from "@fortawesome/fontawesome-free-solid";
import DateRange from "components/DateRange";
import request from "helpers/request"
import apiPaths from 'apiPaths'


import Select from "react-select";

import Loader from "components/Loader";

const mapStateToProps = (state, ownProps) => ({
  team: state.team,
  dashboard: state.dashboard
});

const mapDispatchToProps = (dispatch) => ({
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      selectedTeam: "1",
      activeCalendar: "Yesterday",
      countdata: {
        leadCount: "-",
        totalLeads: "-",
        workorderCount: "-"
      }
    };
  }

  componentDidMount = () => {
    // this.props.getData();
  };

  changeDate = (date) => {
    request.get(apiPaths.dashboard.getdatecount, { params: { startDate: date[0], endDate: date[1] } }).then(countdata => {
      this.setState({ countdata: countdata.data.data })
    })

    this.setState({
      date: date
    });
  };

  render = () => {
    const teamOptions = _.map(this.props.team.data, item => {
      return { label: item.name, value: item.id }
    })
    return (
      <div className="home-design-wrapper">
        <div className="box box-01">
          <div className="heading-appointment">
            <h4>Today's Appointment</h4>
            <p>Showed 5 items</p>
          </div>

          {/* <Select
            options={teamOptions}
            onChange={(e) => this.setState({ selectedTeam: e })}
            value={this.state.selectedTeam}
            className="team-select"
          /> */}

          <ul className="appointment-tab">
            {_.map(teamOptions, (item, index) => {
              return <li key={index} className={this.state.selectedTeam === item.value ? "active" : ""} onClick={(e) => this.setState({ selectedTeam: item.value })}>{item.label}</li>
            })}
          </ul>

          <ul className="meeting-list">
            {_.map(_.filter(this.props.dashboard.data,{teamId:_.toNumber(this.state.selectedTeam)}), (item, i) => {
              return (<li key={i}>
                <div>
              <h6>{item.clientName}</h6>
                  <p>{item.jobName}</p>
                </div>
                <ul>
                  <li>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>Today</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faClock} />
                    <span>{moment(item.startDate).utcOffset(0).format('hh:mm A')} to {moment(item.endDate).utcOffset(0).format('hh:mm A')}</span>
                  </li>
                </ul>
                <ul>
                  <li>Work Order</li>
              <li>{item.workOrderIdDisplay}</li>
                </ul>
                <p>
                <Link 
                to={{
                  pathname: '/clients',
                  state: {
                    item: item,
                    from:"home"
                  }
                }} >
                  <FontAwesomeIcon icon={faLongArrowAltRight} />
                  </Link>
                </p>
              </li>)
            })}
          </ul>
        </div>

        <div className="box fixed-right">
          <div className="box-02">
            <div>
              <p>{this.props.dashboard.insightsData.totalWorkorder}</p>
              <h6>Total Work Order</h6>
            </div>
            <div>
              <p>{this.props.dashboard.insightsData.unScheduledWorkorder}</p>
              <h6>New Work Orders</h6>
            </div>
            <div>
              <p>{this.props.dashboard.insightsData.totalInvoice}</p>
              <h6>Total Invoice</h6>
            </div>
            <div>
              <p>{this.props.dashboard.insightsData.paidInvoice}</p>
              <h6>Paid Invoice</h6>
            </div>
          </div>
          <div className="box-03">
            <div className="calendar"><Calendar
              date={this.state.date}
              onChange={date => this.changeDate(date)} />
            </div>
            <ul className="total-items">
              <li>
                Total work added: <span>{this.state.countdata.workorderCount}</span>
              </li>
              <li>
                Total lead added: <span>{this.state.countdata.leadCount}</span>
              </li>
              <li>
                Gross lead added: <span>{this.state.countdata.totalLeads}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );

    // const { data } = this.state
    // const { isLoaded } = this.props.data
    // if (isLoaded) {
    //     if (data.length > 0) {
    //         return (
    //             <div className="upload-tab">

    //             </div>
    //         )
    //     }
    //     return <div className="data-empty">No Data Found</div>
    // }
    // return <Loader type={"spinningBubbles"} />
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
