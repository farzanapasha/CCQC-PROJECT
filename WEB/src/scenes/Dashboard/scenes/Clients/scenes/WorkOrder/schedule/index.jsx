import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-responsive-modal";
import Select from 'react-select'
import "./style";
import Table from "components/ReactTable";
import DatePicker from 'react-datepicker';
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
  data: state.schedule,
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
      data: [],
      activeScheduleId:"",
      "workorder_id":props.workOrderId,
      "team_id":1,
      "client_id":props.clientId,
      "status":"allocated",
      "startdate": moment().toDate(),
      "enddate":moment().toDate(),
      "description":"",
      "equipment_id":1,
      "type_id":1,
      "job_name":"",
      openEditSchedule: false,
      openAddSchedule: false,
      errors: {
        "workorder_id":"",
      "team_id": "",
      "client_id": "",
      "status": "",
      "startdate":"",
      "enddate":"",
      "description":"",
      "equipment_id":"",
      "type_id":"",
      "job_name":"",
      },
    };
  }


  componentDidMount = () => {
  };

  handleFromDate = (date) => {
    this.setState({
      startdate: date,
    });
  };

  handleToDate = (date) => {
    this.setState({
      enddate: date,
    });
  };

  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case "name":
        errors.name =
          value.length < 5
            ? "Full Name must be at least 5 characters long!"
            : "";
        break;
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid!";
        break;
      case "phone":
        errors.phone = validPhoneRegex.test(value) ? "" : "Phone is not valid!";
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };
  deleteSchedule = (params)=>{
    request.delete(apiPaths.schedule.deleteschedule,params)
    .then(({ data }) => {
      this.setState({successMessage:data.data.message,
        openDeleteModal:false,
      showSuccess:false})
      this.props.getAllWorkOrderByClient({params:{id:this.props.clientId}})
      this.props.getAllScheduleByWorkOrder({params:{id:this.props.workOrderId}})
    }).catch(err=>{
      this.setState({errorMessage:err.data.error.message,
      showError:true})
    })
  }

  handelAddSchedule = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      console.info("Valid Form");
      let schedule = {
        "workorder_id": this.props.workOrderId,
        "team_id": this.state.team_id,
        "client_id": this.props.clientId,
        "equipment_id": this.state.equipment_id,
        "type_id": this.state.type_id,
        "status": this.state.status,
        "startdate": moment(this.state.startdate).format("YYYY-MM-DD HH:mm:ss"),
        "enddate": moment(this.state.enddate).format("YYYY-MM-DD HH:mm:ss"),
        "description": this.state.description,
        "job_name": this.state.job_name
      }

      request.post(apiPaths.schedule.createschedule,schedule)
      .then(({ data }) => {
        this.setState({successMessage:data.data.message,
        showSuccess:false,
        openAddSchedule: false})
        this.props.getAllWorkOrderByClient({params:{id:this.props.clientId}})
        this.props.getAllScheduleByWorkOrder({params:{id:this.props.workOrderId}})
      }).catch(err=>{
        this.setState({errorMessage:err.data.error.message,
          showError:true})
      })
    } else {
      this.setState({errorMessage:"Please enter valid form information",
      showError:true})
    }
  };

  handelEditSchedule = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      console.info("Valid Form");
      let schedule = {
        "id":this.state.activeScheduleId,
        "workorder_id": this.props.workOrderId,
        "team_id": this.state.team_id,
        "client_id": this.props.clientId,
        "equipment_id": this.state.equipment_id,
        "type_id": this.state.type_id,
        "status": this.state.status,
        "startdate": moment(this.state.startdate).format("YYYY-MM-DD HH:mm:ss"),
        "enddate": moment(this.state.enddate).format("YYYY-MM-DD HH:mm:ss"),
        "description": this.state.description,
        "job_name": this.state.job_name
      }

      request.put(apiPaths.schedule.updateschedule,schedule)
      .then(({ data }) => {
        this.setState({successMessage:data.data.message,
        showSuccess:false,
        openEditSchedule: false})
        this.props.getAllWorkOrderByClient({params:{id:this.props.clientId}})
        this.props.getAllScheduleByWorkOrder({params:{id:this.props.workOrderId}})
      }).catch(err=>{
        this.setState({errorMessage:err.data.error.message,
          showError:true})
      })
    } else {
      this.setState({errorMessage:"Please enter valid form information",
      showError:true})
    }
  };

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };
  handleSelectChange = (name, e) => {
    this.setState({ [name]: e.value });
  }

  render = () => {
    let errors = this.state.errors;
    let teamOption = _.map(this.props.team, item => {
      return {
        label: item.name,
        value: item.id
      }
    })


    const columns = [
      {
        Header: "Team",
        accessor: "teamName",
        Cell:d =>
            <span className="first-name-td" onClick={(e) => this.setState({
              activeScheduleId: d.row.original.id,
              "workorder_id": d.row.original.workorder_id,
              "team_id": d.row.original.team_id.toString(),
              "client_id": d.row.original.client_id,
              "status": d.row.original.status,
              "startdate": moment(d.row.original.startdate).toDate(),
              "enddate": moment(d.row.original.enddate).toDate(),
              "description": d.row.original.description,
              "equipment_id": d.row.original.equipment_id,
              "type_id": d.row.original.type_id,
              "job_name": d.row.original.job_name,
              openEditSchedule: true,
              openAddSchedule:false
            })}>{ d.row.original.teamName}</span>
      },
      {
        Header: "Type",
        accessor: "typeName",
        Filter: SelectColumnFilter,
      },
      {
        Header: "Start date",
        accessor: "startdate",
        Cell: d =>
          <span>{moment(d.row.original.startdate).utcOffset(0).format("MMM DD YYYY hh:mm A")}</span>
      },
      {
        Header: "End date",
        accessor: "enddate",
        Cell: d =>
          <span>{moment(d.row.original.enddate).utcOffset(0).format("MMM DD YYYY hh:mm A")}</span>
      },
      {
        Header: "Equipment",
        accessor: "equipmentName",
      },
      {
        Header: "description",
        accessor: "description",
      },
      {
        Header: "Edit",
        accessor: "edit",
        disableFilters: true,
        Cell: d =>
          <div> <i class="fas fa-edit" onClick={(e) => this.setState({
            activeScheduleId: d.row.original.id,
            "workorder_id": d.row.original.workorder_id,
            "team_id": d.row.original.team_id.toString(),
            "client_id": d.row.original.client_id,
            "status": d.row.original.status,
            "startdate": moment(d.row.original.startdate).toDate(),
            "enddate": moment(d.row.original.enddate).toDate(),
            "description": d.row.original.description,
            "equipment_id": d.row.original.equipment_id,
            "type_id": d.row.original.type_id,
            "job_name": d.row.original.job_name,
            openEditSchedule: true,
            openAddSchedule:false
          })}></i></div>
      },
      {
        Header: "Delete",
        accessor: "delete",
        disableFilters: true,
        Cell: d =>
          <div> <i class="fas fa-trash-alt" onClick={(e) => this.setState({
            activeScheduleId: d.row.original.id,
            openDeleteModal: true
          })}></i></div>
      }

    ];
    const statusOption = [{ label: "Allocated", value: "allocated" }, { label: "In Progress", value: "in progress" }, { label: "Closed", value: "Closed" }]
    
    return (
      <div>
        { <div><button onClick={(e) => this.setState({ openAddSchedule: true,openEditSchedule: false,
 })}>Create new schedule</button> <span>{"Active work order "+this.props.workOrderIdDisplay} </span> <i class="fas fa-times" onClick={(e) => {
          this.props.closeScheduleModal()
        }}></i></div>}
        {(!this.state.openAddSchedule && !this.state.openEditSchedule)&& <div className="white-bg lead-page-content table-container">
          {this.props.data.workData.length > 0 && <Table data={this.props.data.workData} columns={columns} enablePagination={true}/>}
        </div>}

        {(this.state.openAddSchedule) &&
          <div className="add-lead-wrapper">
            <div className="head">
            <h5>Create schedule</h5>
            <i class="fas fa-times" onClick={(e) => {
          this.setState({openAddSchedule:false})
        }}></i>
        </div>
            <div className="add-lead-form">
<div>
              <div className="add-lead-block">
                <label>Team:</label>
                <Select
                  className="select-box"
                  name="team"
                  value={_.find(teamOption, { value: this.state.team_id })}
                  onChange={(e) => this.handleSelectChange("team_id", e)}
                  options={teamOption}
                />

              </div>
              <div className="add-lead-block">
                <label>Type:</label>
                <Select
                  className="select-box"
                  name="type"
                  value={_.find(this.props.worktypes, { value: this.state.type_id })}
                  onChange={(e) => this.handleSelectChange("type_id", e)}
                  options={this.props.worktypes}
                />

              </div>
              <div className="add-lead-block">
                <label>Equipment:</label>
                <Select
                  className="select-box"
                  name="equipment"
                  value={_.find(this.props.equipments, { value: this.state.equipment_id })}
                  onChange={(e) => this.handleSelectChange("equipment_id", e)}
                  options={this.props.equipments}
                />

              </div>

              <div className="add-lead-block">
                <label>Start Date:</label>
                <DatePicker
                  selected={this.state.startdate}
                  onChange={date => this.handleFromDate(date)}
                  showTimeSelect
                  dateFormat="dd-MM-yyyy hh:mm:ss"
                />
              </div>
</div>
<div>
              <div className="add-lead-block">
                <label>End Date:</label>
                <DatePicker
                  selected={this.state.enddate}
                  onChange={date => this.handleToDate(date)}
                  showTimeSelect
                  dateFormat="dd-MM-yyyy hh:mm:ss"
                />
              </div>

              {errors.description.length > 0 && (
                <span className="validation">{errors.description}</span>
              )}
              <div className="add-lead-block">
                <label>Description:</label>
                <input
                  placeholder="Description"
                  name="description"
                  onChange={(e) => this.handleChange(e)}
                ></input>
              </div>
              {errors.job_name.length > 0 && (
                <span className="validation">{errors.location}</span>
              )}
              <div className="add-lead-block">
                <label>Job Name:</label>
                <input
                  placeholder="Job Name"
                  name="job_name"
                  onChange={(e) => this.handleChange(e)}
                ></input>

              </div>
              {errors.status.length > 0 && (
                <span className="validation">{errors.status}</span>
              )}
              <div className="add-lead-block">
                <label>Status:</label>
                <Select
                  className="select-box"
                  name="status"
                  value={_.find(statusOption, { value: this.state.status })}
                  onChange={(e) => this.handleSelectChange("status", e)}
                  options={statusOption}
                />

              </div>
              </div>
              </div>
              <div className="cancel-save add-lead-block">
                <button onClick={(e) => this.setState({ openAddSchedule: false })}>Cancel</button>
                <button onClick={(e) => this.handelAddSchedule(e)}>Save</button>
              </div>
            
          </div>}

          {(this.state.openEditSchedule) &&
          <div className="add-lead-wrapper">
            <div className="head">
            <h5>Edit schedule</h5>
            <i class="fas fa-times" onClick={(e) => {
          this.setState({openEditSchedule:false})
        }}></i>
        </div>
            <div className="add-lead-form">
<div>
              <div className="add-lead-block">
                <label>Team:</label>
                <Select
                  className="select-box"
                  name="team"
                  value={_.find(teamOption, { value: this.state.team_id })}
                  onChange={(e) => this.handleSelectChange("team_id", e)}
                  options={teamOption}
                />

              </div>
              <div className="add-lead-block">
                <label>Type:</label>
                <Select
                  className="select-box"
                  name="type"
                  value={_.find(this.props.worktypes, { value: this.state.type_id })}
                  onChange={(e) => this.handleSelectChange("type_id", e)}
                  options={this.props.worktypes}
                />

              </div>
              <div className="add-lead-block">
                <label>Equipment:</label>
                <Select
                  className="select-box"
                  name="equipment"
                  value={_.find(this.props.equipments, { value: this.state.equipment_id })}
                  onChange={(e) => this.handleSelectChange("equipment_id", e)}
                  options={this.props.equipments}
                />

              </div>

              <div className="add-lead-block">
                <label>Start Date:</label>
                <DatePicker
                  selected={this.state.startdate}
                  onChange={date => this.handleFromDate(date)}
                  showTimeSelect
                  dateFormat="dd-MM-yyyy hh:mm:ss"
                />
              </div>
              </div>
              <div>

              <div className="add-lead-block">
                <label>End Date:</label>
                <DatePicker
                  selected={this.state.enddate}
                  onChange={date => this.handleToDate(date)}
                  showTimeSelect
                  dateFormat="dd-MM-yyyy hh:mm:ss"
                />
              </div>

              {errors.description.length > 0 && (
                <span className="validation">{errors.description}</span>
              )}
              <div className="add-lead-block">
                <label>Description:</label>
                <input
                  placeholder="Description"
                  name="description"
                  defaultValue={this.state.description}
                  onChange={(e) => this.handleChange(e)}
                ></input>
              </div>
              {errors.job_name.length > 0 && (
                <span className="validation">{errors.location}</span>
              )}
              <div className="add-lead-block">
                <label>Job Name:</label>
                <input
                  placeholder="Job Name"
                  name="job_name"
                  defaultValue={this.state.job_name}
                  onChange={(e) => this.handleChange(e)}
                ></input>

              </div>
              {errors.status.length > 0 && (
                <span className="validation">{errors.status}</span>
              )}
              <div className="add-lead-block">
                <label>Status:</label>
                <Select
                  className="select-box"
                  name="status"
                  value={_.find(statusOption, { value: this.state.status })}
                  onChange={(e) => this.handleSelectChange("status", e)}
                  options={statusOption}
                />

              </div>
              </div>
              </div>
              
              <div className="cancel-save add-lead-block">
                <button onClick={(e) => this.setState({ openEditSchedule: false })}>Cancel</button>
                <button onClick={(e) => this.handelEditSchedule(e)}>Save</button>
              </div>
            
          </div>}
          <Modal
          open={this.state.showSuccess}
          onClose={(e) => this.setState({showSuccess:false,openDeleteModal:false,activeScheduleId:""}) }
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="success-message"><span>{this.state.successMessage}</span></div>
        </Modal>
        <Modal
          open={this.state.showError}
          onClose={(e) =>this.setState({showError:false,openDeleteModal:false,activeScheduleId:""})}
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="error-message"><span>{this.state.errorMessage}</span></div>
        </Modal>

        <Modal
          open={this.state.openDeleteModal}
          onClose={(e) => this.setState({openDeleteModal:false,activeScheduleId:""})}
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="delete-modal">
            <div className="row"><span>{"Are you sure want to delete schedule"+this.state.activeScheduleId+" ?"}</span></div>
            <div className="row"> <button onClick={(e)=>{
              this.deleteSchedule({params:{id:this.state.activeScheduleId}})}}>yes</button> <button onClick={(e) => this.setState({openDeleteModal:false,activeScheduleId:""})}>No</button></div>
            </div>
        </Modal>
      </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
