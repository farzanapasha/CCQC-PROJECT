import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-responsive-modal";
import Select from 'react-select'
import icon01 from "../../../../../../images/potential-01.png";
import icon02 from "../../../../../../images/non-potential-02.png";
import icon03 from "../../../../../../images/active-03.png";
import icon04 from "../../../../../../images/total-leads-04.png";
import {
  faArrowDown,
  faArrowUp,
  faPlus,
  faSearch,
} from "@fortawesome/fontawesome-free-solid";
// import "./style";
import Table from "components/ReactTable";

import Loader from "components/Loader";
import request from "helpers/request"
import apiPaths from 'apiPaths'


const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validPhoneRegex = RegExp(/\+?\d[\d -]{7}\d/g);

const mapStateToProps = (state, ownProps) => ({
  data: state.lead,
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
      openAddLead: false,
      openDeleteModal: false,
      openConvertModal:false,
      activeLeadId:"",
      activeLeadName:"",
      name: "",
      email: "",
      phone: "",
      service: "service1",
      location: "",
      source: "source1",
      status: "active",
      phonecode: "971",
      gender: "B to B",
      errors: {
        name: "",
        email: "",
        phone: "",
        service: "",
        location: "",
        source: "",
        status: "",
        phonecode: ""
      },
    };
  }


  componentDidMount = () => {
  };
  convertLeadToClient =(params)=>{
    request.post(apiPaths.lead.convertlead,params)
    .then(({ data }) => {
      this.setState({successMessage:data.data.message,
      showSuccess:false})
      this.props.FetchLead()
    }).catch(err=>{
      this.setState({errorMessage:err.data.error.message,
      showError:true})
    })
  }
  deleteLead = (params)=>{
    request.delete(apiPaths.lead.deletelead,params)
    .then(({ data }) => {
      this.setState({successMessage:data.data.message,
      showSuccess:false})
      this.props.FetchLead()
    }).catch(err=>{
      this.setState({errorMessage:err.data.error.message,
      showError:true})
    })
  }
  openDeleteModel = (id,name)=>{
    this.setState({
      openDeleteModal:true,
      activeLeadId:id,
      activeLeadName:name
    })
      }
  openConverToClientModel= (id,name)=>{
    this.setState({
      openConvertModal:true,
      activeLeadId:id,
      activeLeadName:name
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

  handelEditLead = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      console.info("Valid Form");
      let lead = {
        id:this.state.activeLeadId,
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        service: this.state.service,
        location: this.state.location,
        source: this.state.source,
        status: this.state.status,
        phonecode: this.state.phonecode,
        gender: this.state.gender
      }

      request.put(apiPaths.lead.updatelead,lead)
      .then(({ data }) => {
        this.setState({successMessage:data.data.message,
        showSuccess:false,
        openEditLead:false})
        this.props.FetchLead()
      }).catch(err=>{
        this.setState({errorMessage:err.data.error.message,
        showError:true})
      })
    } else {
      console.error("Invalid Form");
    }
  };


  handelAddLead = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      let lead = {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        service: this.state.service,
        location: this.state.location,
        source: this.state.source,
        status: this.state.status,
        phonecode: this.state.phonecode,
        gender: this.state.gender
      }

      request.post(apiPaths.lead.createlead,lead)
      .then(({ data }) => {
        this.setState({successMessage:data.data.message,
        showSuccess:false,
        openAddLead:false
      })
        this.props.FetchLead()
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

    const columns = [
      {
        Header: "Name",
        id: "name",
        accessor: d =>
            <span className="first-name-td" onClick={(e) =>this.setState({activeLeadId:d.id,
              activeLeadName:d.name,
              name: d.name,
              email: d.email,
              phone: d.phone,
              service: d.service,
              location: d.location,
              source: d.source,
              status: d.status,
              phonecode: d.phonecode,
              gender: d.gender,
            openEditLead:true}) }>{d.name}</span>
    },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter,
      },

      {
        Header: "Service",
        accessor: "service",
        Filter: SelectColumnFilter,
      },
      {
        Header: "Source",
        accessor: "source",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Location",
        accessor: "location",
        disableFilters: true,
      },
      {
        Header: "Email",
        accessor: "email",
        disableFilters: true,
      },
      {
        Header: "Edit",
        id: "edit",
        disableFilters: true,
        accessor: d =>
            <div> <i class="fas fa-edit" onClick={(e) =>this.setState({activeLeadId:d.id,
            activeLeadName:d.name,
            name: d.name,
            email: d.email,
            phone: d.phone,
            service: d.service,
            location: d.location,
            source: d.source,
            status: d.status,
            phonecode: d.phonecode,
            gender: d.gender,
          openEditLead:true}) }></i></div>
    },
      {
        Header: "Delete",
        id: "delete",
        disableFilters: true,
        accessor: d =>
            <div> <i className="far fa-trash-alt" onClick={(e) => this.openDeleteModel(d.id, d.name)}></i></div>
    },
   
    {
      Header: "Convert To Client",
      id: "convert",
      disableFilters: true,
      accessor: d =>
          <div> <i class="fas fa-share-square" onClick={(e) => this.openConverToClientModel(d.id, d.name)}></i></div>
  }
    ];

    const data = this.props.data.data

    const statusOption = [{ label: "active", value: "active" }, { label: "Potential", value: "potential" }, { label: "Non potential", value: "nonpotential" }]

    const phonecodeOption = [{ label: "971", value: "971" }]

    const serviceOption = [{ label: "AC-Maintenance and Installation", value: "AC-Maintenance and Installation" },
    { label: "Eletrical", value: "Eletrical" },
    { label: "Plumbing", value: "Plumbing" },
    { label: "MVP", value: "MVP" },
    { label: "Project", value: "Project" },
  ]

    const genderOption = [{ label: "B to B", value: "B to B" }, { label: "Individual Client", value: "Individual Client" }]


    return (
      <div className="lead-page-wrapper main">
        <div className="heading-blue-wrapper">
          <div className="blue-bg">
            <h4>Lead</h4>
            <div></div>
          </div>

          {(!this.state.openAddLead && !this.state.openEditLead) && <div className="tool-component">
            <div>
              <button onClick={(e) => this.setState({ openAddLead: true })}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Lead</span>
              </button>
            </div>
          </div>}

        </div>

        <div className="main-space">
          {(!this.state.openAddLead && !this.state.openEditLead) && <div className={this.props.data.isLoaded? "tool-component-wrapper" : "top-loader"}>
            {this.props.data.isLoaded ? <ul>
              <li>
                <div className="top-icon">
                  <img src={icon01} />
                  <span>{_.filter(this.props.data.data, { status: "potential" }).length}</span>
                </div>
                <h6>Potential</h6>
              </li>
              <li>
                <div className="top-icon">
                  <img src={icon02} />
                  <span>{_.filter(this.props.data.data, { status: "nonpotential" }).length}</span>
                </div>
                <h6>Non-Potential</h6>
              </li>
              <li>
                <div className="top-icon">
                  <img src={icon03} />
                  <span>{_.filter(this.props.data.data, { status: "active" }).length}</span>
                </div>
                <h6>Active</h6>
              </li>
              <li>
                <div className="top-icon">
                  <img src={icon04} />
                  <span>{this.props.data.data.length}</span>
                </div>
                <h6>Total Leads</h6>
              </li>
            </ul> : <Loader type={"bars"} />}

          </div>}

          {(!this.state.openAddLead && !this.state.openEditLead) && <div className="white-bg lead-page-content">
            {this.props.data.isLoaded ? <Table data={data} columns={columns} enablePagination={true}/> : <Loader type={"spinningBubbles"} />}
          </div>}

          {this.state.openAddLead &&
            <div className="add-lead-wrapper">
              <div className="head">
              <h5>Add Lead</h5>
              <i class="fas fa-times" onClick={(e)=>{
            this.setState({openAddLead:false})}}></i>
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
                  <label>Business:</label>
                  <Select
                    className="select-box"
                    name="gender"
                    value={_.find(genderOption, { value: this.state.gender })}
                    onChange={(e) => this.handleSelectChange("gender", e)}
                    options={genderOption}
                  />


                </div>
                {errors.phonecode.length > 0 && (
                  <span className="validation">{errors.ponecode}</span>
                )}
                <div className="add-lead-block">
                  <label>Phone code</label>
                  <Select
                    className="select-box"
                    name="source"
                    value={_.find(phonecodeOption, { value: this.state.phonecode })}
                    onChange={(e) => this.handleSelectChange("phonecode", e)}
                    options={phonecodeOption}
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
                </div>
                <div>
                {errors.service.length > 0 && (
                  <span className="validation">{errors.service}</span>
                )}
                <div className="add-lead-block">
                  <label>service:</label>
                  <Select
                    className="select-box"
                    name="service"
                    value={_.find(serviceOption, { value: this.state.service })}
                    onChange={(e) => this.handleSelectChange("service", e)}
                    options={serviceOption}
                  />


                </div>
                {errors.location.length > 0 && (
                  <span className="validation">{errors.location}</span>
                )}
                <div className="add-lead-block">
                  <label>Location:</label>
                  <input
                    placeholder="Location"
                    name="location"
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
                {errors.source.length > 0 && (
                  <span className="validation">{errors.source}</span>
                )}
                <div className="add-lead-block">
                  <label>Source:</label>

                  <input
                    placeholder="source"
                    name="source"
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                </div>
                </div>


                <div className="cancel-save add-lead-block">
                  <button onClick={(e) => {this.setState({openAddLead:false})
            }}>Cancel</button>
                  <button onClick={(e) => this.handelAddLead(e)}>Save</button>
                </div>
              
            </div>}


            {this.state.openEditLead &&
            <div className="add-lead-wrapper">
              <div className="head">
              <h5>Edit Lead</h5>
              <i class="fas fa-times" onClick={(e)=>{
            this.setState({openEditLead:false})}}></i>
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
                    value={this.state.name}
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                <div className="add-lead-block">
                  <label>Business:</label>
                  <Select
                    className="select-box"
                    name="gender"
                    value={_.find(genderOption, { value: this.state.gender })}
                    onChange={(e) => this.handleSelectChange("gender", e)}
                    options={genderOption}
                  />


                </div>
                {errors.phonecode.length > 0 && (
                  <span className="validation">{errors.ponecode}</span>
                )}
                <div className="add-lead-block">
                  <label>Phone code</label>
                  <Select
                    className="select-box"
                    name="source"
                    value={_.find(phonecodeOption, { value: this.state.phonecode })}
                    onChange={(e) => this.handleSelectChange("phonecode", e)}
                    options={phonecodeOption}
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
                </div>
                <div>
                {errors.service.length > 0 && (
                  <span className="validation">{errors.service}</span>
                )}
                <div className="add-lead-block">
                  <label>service:</label>
                  <Select
                    className="select-box"
                    name="service"
                    value={_.find(serviceOption, { value: this.state.service })}
                    onChange={(e) => this.handleSelectChange("service", e)}
                    options={serviceOption}
                  />


                </div>
                {errors.location.length > 0 && (
                  <span className="validation">{errors.location}</span>
                )}
                <div className="add-lead-block">
                  <label>Location:</label>
                  <input
                    placeholder="Location"
                    name="location"
                    defaultValue={this.state.location}
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
                {errors.source.length > 0 && (
                  <span className="validation">{errors.source}</span>
                )}
                <div className="add-lead-block">
                  <label>Source:</label>
                  <input
                    placeholder="source"
                    name="source"
                    defaultValue={this.state.source}
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                </div>
                </div>

                <div className="cancel-save add-lead-block">
                  <button onClick={(e) => {this.setState({openEditLead:false})
            }}>Cancel</button>
                  <button onClick={(e) => this.handelEditLead(e)}>Save</button>
                </div>
              
            </div>}
        </div>

        <Modal
          open={this.state.showSuccess}
          onClose={(e) => {
            this.setState({showSuccess:false,openDeleteModal:false,openConvertModal:false,activeLeadName:"",activeLeadId:""})}}
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
            this.setState({showError:false,openDeleteModal:false,openConvertModal:false,activeLeadName:"",activeLeadId:""})
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
          onClose={(e) => this.setState({openDeleteModal:false,activeLeadName:"",activeLeadId:""})}
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="delete-modal">
            <div className="row"><span>{"Are you sure want to delete "+this.state.activeLeadName+" ?"}</span></div>
            <div className="row"> <button onClick={(e)=>{
              this.deleteLead({params:{id:this.state.activeLeadId}})}}>yes</button> <button onClick={(e) => this.setState({openDeleteModal:false,activeLeadName:"",activeLeadId:""})}>No</button></div>
            </div>
        </Modal>

        <Modal
          open={this.state.openConvertModal}
          onClose={(e) => this.setState({openConvertModal:false,activeLeadName:"",activeLeadId:""})}
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="delete-modal">
            <div className="row"><span>{"Are you sure want to Convert "+this.state.activeLeadName+" to Client?"}</span></div>
            <div className="row"> <button onClick={(e)=>{
              this.convertLeadToClient({id:this.state.activeLeadId})}}>yes</button> <button onClick={(e) => this.setState({openConvertModal:false,activeLeadName:"",activeLeadId:""})}>No</button></div>
            </div>
        </Modal>
      </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
