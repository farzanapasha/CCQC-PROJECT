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
import Contact from './Contact'
import WorkOrder from './WorkOrder'
import Invoice from './Invoice'
import Payment from './Payment'
import Equipment from './Equipment'
import Purchase from './Purchase'

import Loader from "components/Loader";
import request from "helpers/request"
import apiPaths from 'apiPaths'


const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validPhoneRegex = RegExp(/\+?\d[\d -]{7}\d/g);

const mapStateToProps = (state, ownProps) => ({
  data: state.client,
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
      isClientOpen:false,
      activeClientTab:"contact",
      openAddClient: false,
      openDeleteModal: false,
      activeClientId:"",
      activeClientName:"",
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
    if(this.props.locationProps!==null){
      if(this.props.locationProps.from==="home"){
        this.setState({
          isClientOpen:true,
        activeClientId:this.props.locationProps.item.clientId,
        activeClientName:this.props.locationProps.item.clientName,
        activeClientTab:"workorder",
        locationPassed:true
          })
      } 
      else if(this.props.locationProps.from==="workorder"){
        this.setState({
        isClientOpen:true,
        activeClientId:this.props.locationProps.item.clientId,
        activeClientName:this.props.locationProps.item.clientName,
        activeClientTab:"workorder",
        locationPassed:true
          })
      }
      else if(this.props.locationProps.from==="invoice"){
       this.setState({
        activeClientTab:"invoice",
        isClientOpen:true,
        activeClientId:this.props.locationProps.item.client_id,
        activeClientName:this.props.locationProps.item.clientName,
        locationPassed:true
       })
      }   
      else if(this.props.locationProps.from==="payment"){
        this.setState({
         activeClientTab:"payment",
         isClientOpen:true,
         activeClientId:this.props.locationProps.item.client_id,
         activeClientName:this.props.locationProps.item.clientName,
         locationPassed:true
        })
       }                    
    }  
  };

  deleteClient = (params)=>{
    request.delete(apiPaths.client.deleteclient,params)
    .then(({ data }) => {
      this.setState({successMessage:data.data.message,
        openDeleteModal:false,
      showSuccess:false})
      this.props.FetchClient()
    }).catch(err=>{
      this.setState({errorMessage:err.data.error.message,
      showError:true})
    })
  }

  openDeleteModel = (id,name)=>{
this.setState({
  openDeleteModal:true,
  activeClientId:id,
  activeClientName:name
})
  }
  openClientModel = (id,name)=>{
    this.setState({
      isClientOpen:true,
      activeClientId:id,
      activeClientName:name
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

  handelEditClient = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      console.info("Valid Form");
      let client = {
        id:this.state.activeClientId,
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
      request.put(apiPaths.client.updateclient,client)
      .then(({ data }) => {
        this.setState({successMessage:data.data.message,
        showSuccess:false,openEditClient: false})
        this.props.FetchClient()
      }).catch(err=>{
        this.setState({errorMessage:err.data.error.message,
        showError:true})
      })
    } else {
      console.error("Invalid Form");
    }
  };

  handelAddClient = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      let client = {
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
      request.post(apiPaths.client.createclient,client)
      .then(({ data }) => {
        this.setState({successMessage:data.data.message,
        showSuccess:false,openAddClient: false})
        this.props.FetchClient()
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
    console.log("state",this.state)
    let errors = this.state.errors;
    let data = this.props.data.data
    const columns = [
      {
        Header: "Name",
        accessor: "name",
        Cell: d =><span className="first-name-td" onClick={(e) => this.openClientModel(d.row.original.id, d.row.original.name)}>{d.row.original.name}</span>
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
        width: 230
      },
      {
        Header: "Edit",
        accessor: "edit",
        disableFilters: true,
        Cell: d =>
            <div> <i class="fas fa-edit" onClick={(e) =>this.setState({activeClientId:d.row.original.id,
            activeClientName:d.row.original.name,
            name: d.row.original.name,
            email: d.row.original.email,
            phone: d.row.original.phone,
            service: d.row.original.service,
            location: d.row.original.location,
            source: d.row.original.source,
            status: d.row.original.status,
            phonecode: d.row.original.phonecode,
            gender: d.row.original.gender,
          openEditClient:true}) }></i></div>
    },
      {
        Header: "Delete",
        accessor: "delete",
        disableFilters: true,
        Cell: d =>
            <div> <i className="far fa-trash-alt" onClick={(e) => this.openDeleteModel(d.row.original.id, d.row.original.name)}></i></div>
    }
    ];
    const statusOption = [{ label: "active", value: "active" }, { label: "Potential", value: "potential" }, { label: "Non potential", value: "nonpotential" }]

    const phonecodeOption = [{ label: "971", value: "971" }]

    const serviceOption = [{ label: "AC-Maintenance and Installation", value: "AC-Maintenance and Installation" },
    { label: "Eletrical", value: "Eletrical" },
    { label: "Plumbing", value: "Plumbing" },
    { label: "MVP", value: "MVP" },
    { label: "Project", value: "Project" }]

    const genderOption = [{ label: "B to B", value: "B to B" }, { label: "Individual Client", value: "Individual Client" }]
    
    const clientTabs = [{label:"Contact Info",value:"contact"},{label:"Work Order",value:"workorder"},{label:"Equipment Log",value:"equipmentlog"},{label:"Purchase Order",value:"purchaseorder"},{label:"Invoice",value:"invoice"},{label:"Payment",value:"payment"}]

    if(!this.state.isClientOpen){
      return (
        <div className="client-page-wrapper main">
          <div className="heading-blue-wrapper">
            <div className="blue-bg">
              <h4>client</h4>
              <div></div>
            </div>
            {(!this.state.openAddClient && !this.state.openEditClient) &&<div className="tool-component">
            <div>
              <button onClick={(e) => this.setState({ openAddClient: true })}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Client</span>
              </button>
            </div>
          </div>}
          </div>
  
          <div className="main-space table-container">
          {(!this.state.openAddClient && !this.state.openEditClient) && <div className="white-bg lead-page-content">
      {this.props.data.isLoaded ? <Table data={data} columns={columns} enablePagination={true}/> : !this.state.openAddClient&&<Loader type={"spinningBubbles"} />} </div>}

          {this.state.openAddClient&&
            <div className="add-lead-wrapper clients">
              <div className="head">
              <h5>Add Client</h5>
              <i class="fas fa-times" onClick={(e)=>{
            this.setState({openAddClient:false})}}></i>
</div>

              <div className="add-lead-form">
                
                <div>
                <div className="add-lead-block">
                  <label>Name:</label>
                  <span className={"validation"}>*</span>
                  <input
                    placeholder="Name"
                    name="name"
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                {errors.name.length > 0 && (
                  <span className="validation">{errors.name}</span>
                )}

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
                {errors.phonecode.length > 0 && (
                  <span className="validation">{errors.ponecode}</span>
                )}
                

                <div className="add-lead-block">
                  <label>Phone:</label>
                  <input
                    placeholder="Phone"
                    name="phone"
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                {errors.phone.length > 0 && (
                  <span className="validation">{errors.phone}</span>
                )}


                <div className="add-lead-block">
                  <label>Email:</label>
                  <input
                    placeholder="Email"
                    name="email"
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                {errors.email.length > 0 && (
                  <span className="validation">{errors.email}</span>
                )}
</div>

<div>
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
                {errors.service.length > 0 && (
                  <span className="validation">{errors.service}</span>
                )}


                <div className="add-lead-block">
                  <label>Location:</label>
                  <input
                    placeholder="Location"
                    name="location"
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                {errors.location.length > 0 && (
                  <span className="validation">{errors.location}</span>
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
                {errors.status.length > 0 && (
                  <span className="validation">{errors.status}</span>
                )}


                <div className="add-lead-block">
                  <label>Source:</label>

                  <input
                    placeholder="source"
                    name="source"
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                {errors.source.length > 0 && (
                  <span className="validation">{errors.source}</span>
                )}
                
                </div>
</div>

                <div className="cancel-save add-lead-block">
                  <button onClick={(e) => this.setState({ openAddClient: false })}>Cancel</button>
                  <button onClick={(e) => this.handelAddClient(e)}>Save</button>
                </div>
              
            </div>}

            {this.state.openEditClient&&
            <div className="add-lead-wrapper clients">
              <div className="head">
              <h5>Edit Client</h5>
              <i class="fas fa-times" onClick={(e)=>{
            this.setState({openEditClient:false})}}></i>
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
                  <button onClick={(e) => this.setState({ openEditClient: false })}>Cancel</button>
                  <button onClick={(e) => this.handelEditClient(e)}>Save</button>
                </div>
              
            </div>}
        </div>
        <Modal
          open={this.state.showSuccess}
          onClose={(e) => {
            this.setState({showSuccess:false,openDeleteModal:false,activeClientName:"",activeClientId:""})}}
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
            this.setState({showError:false,openDeleteModal:false,activeClientName:"",activeClientId:""})
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
          onClose={(e) => this.setState({openDeleteModal:false,activeClientName:"",activeClientId:""})}
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="delete-modal">
            <div className="row"><span>{"Are you sure want to delete "+this.state.activeClientName+" ?"}</span></div>
            <div className="row"> <button onClick={(e)=>{
              this.deleteClient({params:{id:this.state.activeClientId}})}}>yes</button> <button onClick={(e) => this.setState({openDeleteModal:false,activeClientName:"",activeClientId:""})}>No</button></div>
            </div>
        </Modal>
        </div>
      );
    }
else{
    return (
      <div className="client-page-wrapper main">
        <div className="heading-blue-wrapper">
          <div className="blue-bg">
            <h4>{this.state.activeClientName}</h4>
            <div></div>
          </div>
          <div className="tool-component">
            <div>
              <button onClick={(e) => this.setState({ isClientOpen: false, activeClientName:"",activeClientId:"",activeClientTab:"contact" })}>
                <span>Back to Clients</span>
              </button>
            </div>
          </div>

        </div>

        <div className="main-space table-container">
          <ul className="tab mt-4">
          {_.map(clientTabs,(item,i)=>{
            return <li key={i} className={item.value===this.state.activeClientTab?"active":""}
            onClick={(e)=>this.setState({activeClientTab:item.value,locationPassed:false})}>{item.label}</li>
          })}
          </ul>
          {
            this.state.activeClientTab==="contact"&& <Contact FetchClient={(e)=>this.props.FetchClient()}
            id={this.state.activeClientId} 
            data={_.find(this.props.data.data,{id:this.state.activeClientId})}/>
          }
           {
            this.state.activeClientTab==="workorder"&& <WorkOrder id={this.state.activeClientId} locationProps={this.state.locationPassed?this.props.locationProps:{}}/>
          }
           {
            this.state.activeClientTab==="invoice"&& <Invoice id={this.state.activeClientId}/>
          }
           {
            this.state.activeClientTab==="payment"&& <Payment id={this.state.activeClientId}/>
          }
          {
            this.state.activeClientTab==="equipmentlog"&& <Equipment id={this.state.activeClientId}/>
          }
           {
            this.state.activeClientTab==="purchaseorder"&& <Purchase id={this.state.activeClientId}/>
          }
        </div>
      </div>
    );
  }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
