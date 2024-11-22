import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-responsive-modal";
import Select from 'react-select'
import Table from "components/ReactTable";
import moment from "moment"



import Loader from "components/Loader";
import request from "helpers/request"
import apiPaths from 'apiPaths'

// $(".button-collapse").sideNav();

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validPhoneRegex = RegExp(/\+?\d[\d -]{8,12}\d/g);

const mapStateToProps = (state, ownProps) => ({
  data:state.qrcode
});

const mapDispatchToProps = (dispatch) => ({
});

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }


  componentDidMount = () => {
  };


  render = () => {

    const columns = [
      {
        Header: "Serial No",
        accessor: "serial_no",
    },
      {
        Header: "Model",
        accessor: "model_no",
      },

      {
        Header: "Equipment",
        accessor: "equipmentName",
      },
      {
        Header: "Team",
        accessor: "teamName",
      },
      {
        Header: "Work Order",
        accessor: "workorder_id",
        Cell: d =>
            <span>{d.row.original.workorder_idDisplay}</span>
      },
      {
        Header: "Description",
        accessor: "description",
      }, {
        Header: "Date",
        accessor: "dateandtime",
        Cell: d =>
          <span>{moment(d.row.original.dateandtime).format("MMM DD YYYY hh:mm A")}</span>
      }]
    return (
      <div className="add-lead-wrapper clients">
              <div className="add-lead-form table-100">
              <Table data={this.props.data.clientData} columns={columns} enablePagination={true}/>
            </div>
      </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
