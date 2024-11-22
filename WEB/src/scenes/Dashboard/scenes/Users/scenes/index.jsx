import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-responsive-modal";
import {
  faPlus,
} from "@fortawesome/fontawesome-free-solid";
import Select from 'react-select'
import Table from "components/ReactTable";

import Loader from "components/Loader";
import request from "helpers/request"
import apiPaths from 'apiPaths'


const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validPhoneRegex = RegExp(/\+?\d[\d -]{8,12}\d/g);

const mapStateToProps = (state, ownProps) => ({
  data: state.user,
  role:state.role
});

const mapDispatchToProps = (dispatch) => ({
});

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

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
      openAddUser: false,
      openEditUser: false,
      openDeleteModal: false,
      activeUserId:"",
      activeUserName:"",
      name: "",
      email: "",
      phone: "",
      gender: "male",
      role_id: "",
      errors: {
      name: "",
      email: "",
      phone: "",
      gender:"",
      role_id: "",
      },
    };
  }
  componentDidMount = () => {
  };

  deleteUser = (params)=>{
    request.delete(apiPaths.user.deleteuser,params)
    .then(({ data }) => {
      this.setState({successMessage:data.data.message,
      showSuccess:false})
      this.props.FetchUser()
    }).catch(err=>{
      this.setState({errorMessage:err.data.error.message,
      showError:true})
    })
  }

  openDeleteModel = (id,name)=>{
this.setState({
  openDeleteModal:true,
  activeUserId:id,
  activeUserName:name
})
  }

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

  handelEditUser = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      let user = {
        id:this.state.activeUserId,
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        gender: this.state.gender,
        role_id: this.state.role_id,
      }
      request.put(apiPaths.user.updateuser,user)
      .then(({ data }) => {
        this.setState({successMessage:data.data.message,
        showSuccess:false,
        openEditUser: false})
        this.props.FetchUser()
      }).catch(err=>{
        this.setState({errorMessage:err.data.error.message,
        showError:true})
      })
    } else {
      console.error("Invalid Form");
    }
  };

  handelAddUser = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      let user = {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        gender: this.state.gender,
        role_id: this.state.role_id,
      }
      request.post(apiPaths.user.createuser,user)
      .then(({ data }) => {
        this.setState({successMessage:data.data.message,
        showSuccess:false,
        openAddUser: false})
        this.props.FetchUser()
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
    let data = this.props.data.data
    const columns = [
      {
        Header: "Name",
        accessor: "name",
        Cell: d =>
            <span className="first-name-td" onClick={(e) =>this.setState({activeUserId:d.row.original.id,
              activeUserName:d.row.original.name,
              name: d.row.original.name,
              email: d.row.original.email,
              phone: d.row.original.phone,
              gender: d.row.original.gender,
              role_id: d.row.original.role_id,
            openEditUser:true}) }>{d.row.original.name}</span>
    },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Gender",
        accessor: "gender",
        disableFilters: true,
      },
      {
        Header: "Role",
        accessor: "role",
        disableFilters: true,
      },
      {
        Header: "Edit",
        accessor: "edit",
        disableFilters: true,
        Cell: d =>
            <div> <i class="fas fa-edit" onClick={(e) =>this.setState({activeUserId:d.row.original.id,
            activeUserName:d.row.original.name,
            name: d.row.original.name,
            email: d.row.original.email,
            phone: d.row.original.phone,
            gender: d.row.original.gender,
            role_id: d.row.original.role_id,
          openEditUser:true}) }></i></div>
    },
      {
        Header: "Delete",
        accessor: "delete",
        disableFilters: true,
        Cell: d =>
            <div> <i className="far fa-trash-alt" onClick={(e) => this.openDeleteModel(d.row.original.id, d.row.original.name)}></i></div>
    }
    ];
     const genderOption = [{ label: "male", value: "male" }, { label: "female", value: "female" }]
    let roleOption = _.map(this.props.role.data,item=>{
      return {
        label:item.name,
        value: item.id
      }
    })
      return (
        <div className="client-page-wrapper main">
          <div className="heading-blue-wrapper">
            <div className="blue-bg">
              <h4>Members</h4>
              <div></div>
            </div>
            {(!this.state.openAddUser && !this.state.openEditUser) &&<div className="tool-component">
            <div>
              <button onClick={(e) => this.setState({ openAddUser: true })}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add User</span>
              </button>
            </div>
          </div>}
          </div>
  
          <div className="main-space table-container">
          {(!this.state.openAddUser && !this.state.openEditUser) && <div className="white-bg lead-page-content">
      {this.props.data.isLoaded ? <Table data={data} columns={columns} enablePagination={true}/> : !this.state.openAddUser&&<Loader type={"spinningBubbles"} />} </div>}

          {this.state.openAddUser&&
            <div className="add-lead-wrapper clients">
              <div className="head">
              <h5>Add User</h5>
              <i class="fas fa-times" onClick={(e)=>{
            this.setState({openAddUser:false})}}></i>
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
                  <label>Gender:</label>
                  <Select
                    className="select-box"
                    name="gender"
                    value={_.find(genderOption, { value: this.state.gender })}
                    onChange={(e) => this.handleSelectChange("gender", e)}
                    options={genderOption}
                  />

                </div>
                {errors.phone.length > 0 && (
                  <span className="validation">{errors.phone}</span>
                )}
                <div className="add-lead-block">
                  <label>Phone:</label>
                  <input
                    placeholder="Phone"
                    name="phone"
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                </div>
                <div>
                {errors.email.length > 0 && (
                  <span className="validation">{errors.email}</span>
                )}
                <div className="add-lead-block">
                  <label>Email:</label>
                  <input
                    placeholder="Email"
                    name="email"
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                <div className="add-lead-block">
                  <label>Role:</label>
                  <Select
                    className="select-box"
                    name="role_id"
                    value={_.find(roleOption, { value: this.state.role_id })}
                    onChange={(e) => this.handleSelectChange("role_id", e)}
                    options={roleOption}
                  />
                </div>
                </div>
                </div>
                <div className="cancel-save add-lead-block">
                  <button onClick={(e) => this.setState({ openAddUser: false })}>Cancel</button>
                  <button onClick={(e) => this.handelAddUser(e)}>Save</button>
                </div>
            </div>}

            {this.state.openEditUser&&
            <div className="add-lead-wrapper clients">
              <div className="head">
              <h5>Edit User</h5>
              <i class="fas fa-times" onClick={(e)=>{
            this.setState({openEditUser:false})}}></i>
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
                  <label>Gender:</label>
                  <Select
                    className="select-box"
                    name="gender"
                    value={_.find(genderOption, { value: this.state.gender })}
                    onChange={(e) => this.handleSelectChange("gender", e)}
                    options={genderOption}
                  />

                </div>
                {errors.phone.length > 0 && (
                  <span className="validation">{errors.phone}</span>
                )}
                <div className="add-lead-block">
                  <label>Phone:</label>
                  <input
                    placeholder="Phone"
                    name="phone"
                    defaultValue={this.state.phone}
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                </div>
                <div>
                {errors.email.length > 0 && (
                  <span className="validation">{errors.email}</span>
                )}
                <div className="add-lead-block">
                  <label>Email:</label>
                  <input
                    placeholder="Email"
                    name="email"
                    defaultValue={this.state.email}
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                <div className="add-lead-block">
                  <label>Role:</label>
                  <Select
                    className="select-box"
                    name="role_id"
                    value={_.find(roleOption, { value: this.state.role_id })}
                    onChange={(e) => this.handleSelectChange("role_id", e)}
                    options={roleOption}
                  />
                </div>
                </div>
</div>
                <div className="cancel-save add-lead-block">
                  <button onClick={(e) => this.setState({ openEditUser: false })}>Cancel</button>
                  <button onClick={(e) => this.handelEditUser(e)}>Save</button>
                </div>
              
            </div>}
        </div>
        <Modal
          open={this.state.showSuccess}
          onClose={(e) => {
            this.setState({showSuccess:false,openDeleteModal:false,activeUserName:"",activeUserId:""})}}
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
          onClose={(e) => {
            this.setState({showError:false,openDeleteModal:false,activeUserName:"",activeUserId:""})
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

        <Modal
          open={this.state.openDeleteModal}
          onClose={(e) => this.setState({openDeleteModal:false,activeUserName:"",activeUserId:""})}
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="delete-modal">
            <div className="row"><span>{"Are you sure want to delete "+this.state.activeUserName+" ?"}</span></div>
            <div className="row"> <button onClick={(e)=>{
              this.deleteUser({params:{id:this.state.activeUserId}})}}>yes</button> <button onClick={(e) => this.setState({openDeleteModal:false,activeUserName:"",activeUserId:""})}>No</button></div>
            </div>
        </Modal>
        </div>
      );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
