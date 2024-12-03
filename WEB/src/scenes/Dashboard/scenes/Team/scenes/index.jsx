import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-responsive-modal";
import Select from 'react-select'
import request from "helpers/request"
import apiPaths from 'apiPaths'

import {
  faArrowDown,
  faArrowUp,
  faPlus,
  faSearch,
} from "@fortawesome/fontawesome-free-solid";
// import "./style";
import Table from "components/ReactTable";

import {getAllTeam } from "services/team/actions";

import Loader from "components/Loader";

const mapStateToProps = (state, ownProps) => ({
  data: state.team,
  user:state.user
});

const mapDispatchToProps = (dispatch) => ({
  getAllTeam: () => dispatch(getAllTeam()),
  switchMessage:()=>dispatch(switchMessage()),
  switchErrorMessage:()=>dispatch(switchErrorMessage()),
  createTeam: (data) => dispatch(createTean(data)),
});


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      openAddTeam: false,
      name: "",
      description: "",
      members: [],
      errors: {
        name: "",
      description: "",
      members: [],
      },
    };
  }


  componentDidMount = () => {
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
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };

  handelEditTeam = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      let team = {
        id:this.state.activeTeamId,
        name: this.state.name,
        description: this.state.description,
        members: _.map(this.state.members,"value")
      }
      if(team.members.length>0){
      request.put(apiPaths.team.updateteam,team)
      .then(({ data }) => {
        this.setState({successMessage:data.data.message,
        showSuccess:false,
        openEditTeam: false})
        this.props.FetchTeam()
      }).catch(err=>{
        this.setState({errorMessage:err.data.error.message,
        showError:true})
      })}
      else{
        this.setState({errorMessage:"please select members for team",
          showError:true})
      }
    } else {
      this.setState({errorMessage:"please enter valid form data",
      showError:true})
    }
  };

  handelAddTeam = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      console.info("Valid Form");
      let team = {
        name: this.state.name,
        description: this.state.description,
        members: _.map(this.state.members,"value")
      }
      if(team.members.length>0){
      request.post(apiPaths.team.createteam,team)
      .then(({ data }) => {
        this.setState({successMessage:data.data.message,
        showSuccess:false,
        openAddTeam: false })
        this.props.FetchTeam()
      }).catch(err=>{
        this.setState({errorMessage:err.data.error.message,
        showError:true})
      })}
      else{
        this.setState({errorMessage:"please select members for team",
          showError:true})
      }
    } else {
      this.setState({errorMessage:"please enter valid form data",
      showError:true})
    }
  };

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };
  handleSelectChange = (name, e) => {
    this.setState({ [name]: e });
  }

  render = () => {
    let errors = this.state.errors;

    const columns = [
      {
        Header: "Name",
        accessor: "name",
        Cell: d =>
            <span className="first-name-td" onClick={(e) =>this.setState({activeTeamId:d.row.original.id,
              activeTeamName:d.row.original.name,
              name: d.row.original.name,
              description: d.row.original.description,
              members: _.map(d.row.original.members,item=>{
                return {label:item.name,
                value:item.userId}
              }),
            openEditTeam:true}) }>{d.row.original.name}</span>
      },
      {
        Header: "Description",
        accessor: "description",
      },{
        Header: "Members",
        accessor: "members",
        disableFilters: true,
        Cell: d =>
            <div>{_.map(d.row.original.members,(item,i)=>{
              return <label key={i}>{item.name}</label>
            })}</div>
    },
    {
      Header: "Edit",
      accessor: "edit",
      disableFilters: true,
      Cell: d =>
          <div> <i class="fas fa-edit" onClick={(e) =>this.setState({activeTeamId:d.row.original.id,
          activeTeamName:d.row.original.name,
          name: d.row.original.name,
          description: d.row.original.description,
          members: _.map(d.row.original.members,item=>{
            return {label:item.name,
            value:item.userId}
          }),
        openEditTeam:true}) }></i></div>
  },
    ];

    let data = this.props.data.data

    let userOption = _.map(this.props.user.data,item=>{
      return {label:item.name,value:item.id}
    })


    return (
      <div className="lead-page-wrapper main">
        <div className="heading-blue-wrapper">
          <div className="blue-bg">
            <h4>Teams</h4>
            <div></div>
          </div>

          {(!this.state.openAddTeam && !this.state.openEditTeam) && <div className="tool-component">
            {/* <div>
              <FontAwesomeIcon icon={faSearch} />
              <input type="text" placeholder="search-lead" />
            </div> */}

            <div>
              <button onClick={(e) => this.setState({ openAddTeam: true })}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Create Team</span>
              </button>
            </div>
          </div>}

        </div>

        <div className="main-space">

          {(!this.state.openAddTeam && !this.state.openEditTeam) && <div className="white-bg lead-page-content table-container">
            {this.props.data.isLoaded ? <Table data={data} columns={columns} enablePagination={true} /> : <Loader type={"spinningBubbles"} />}
          </div>}

          {this.state.openAddTeam &&
            <div className="add-lead-wrapper">
              <div className="head">
              <h5>Create Team</h5>
              <i class="fas fa-times" onClick={(e)=>{
            this.setState({openAddTeam:false})}}></i>
            </div>
              <div className="add-lead-form">
                <div>
                {errors.name.length > 0 && (
                  <span className="validation">{errors.name}</span>
                )}
                <div className="add-lead-block">
                  <label>Name:</label>
                  <span className={"validation"}>*</span>
                  <input
                    placeholder="Name"
                    name="name"
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                <div className="add-lead-block">
                  <label>members:</label>
                  <Select
                    className="select-box"
                    name="members"
                    isMulti
                    value={this.state.members}
                    onChange={(e) => this.handleSelectChange("members", e)}
                    options={userOption}
                  />
                </div>
                </div>
                <div>
                {errors.description.length > 0 && (
                  <span className="validation">{errors.source}</span>
                )}
                <div className="add-lead-block">
                  <label>Description:</label>
                  <input
                    placeholder="description"
                    name="description"
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                </div>
                </div>
                <div className="cancel-save add-lead-block">
                  <button onClick={(e) => this.setState({ openAddTeam: false })}>Cancel</button>
                  <button onClick={(e) => this.handelAddTeam(e)}>Save</button>
                </div>
              
            </div>}

            {this.state.openEditTeam &&
            <div className="add-lead-wrapper">
              <div className="head">
              <h5>Create Team</h5>
              <i class="fas fa-times" onClick={(e)=>{
            this.setState({openEditTeam:false})}}></i>
            </div>
              <div className="add-lead-form">
                <div>
                {errors.name.length > 0 && (
                  <span className="validation">{errors.name}</span>
                )}
                <div className="add-lead-block">
                  <label>Name:</label>
                  <span className={"validation"}>*</span>
                  <input
                    placeholder="Name"
                    name="name"
                    defaultValue={this.state.name}
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                <div className="add-lead-block">
                  <label>members:</label>
                  <Select
                    className="select-box"
                    name="members"
                    isMulti
                    value={this.state.members}
                    onChange={(e) => this.handleSelectChange("members", e)}
                    options={userOption}
                  />
                </div>
                </div>
                <div>
                {errors.description.length > 0 && (
                  <span className="validation">{errors.source}</span>
                )}
                <div className="add-lead-block">
                  <label>Description:</label>
                  <input
                    placeholder="description"
                    name="description"
                    defaultValue={this.state.description}
                    onChange={(e) => this.handleChange(e)}
                  ></input>
</div>
                </div>
                </div>
                <div className="cancel-save add-lead-block">
                  <button onClick={(e) => this.setState({ openEditTeam: false })}>Cancel</button>
                  <button onClick={(e) => this.handelEditTeam(e)}>Save</button>
                </div>
              
            </div>}
        </div>

        <Modal
          open={this.state.showSuccess}
          onClose={(e) => {this.setState({showSuccess:false})}}
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
          onClose={(e) => {this.setState({showError:false})
            }}
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="error-message"><span>{this.state.errorMessage}</span></div>
        </Modal>
      </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
