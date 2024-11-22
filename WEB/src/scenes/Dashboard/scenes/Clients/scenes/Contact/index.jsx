import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-responsive-modal";
import Select from 'react-select'

import "./style";


import Loader from "components/Loader";
import request from "helpers/request"
import apiPaths from 'apiPaths'

// $(".button-collapse").sideNav();

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validPhoneRegex = RegExp(/\+?\d[\d -]{8,12}\d/g);

const mapStateToProps = (state, ownProps) => ({
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
      name: props.data.name,
      email: props.data.email,
      phone: props.data.phone,
      service: props.data.service,
      location: props.data.location,
      source: props.data.source,
      status: props.data.status,
      phonecode: props.data.phonecode,
      gender: props.data.gender,
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
        id:this.props.id,
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
        showSuccess:false})
        this.props.FetchClient()
      }).catch(err=>{
        this.setState({errorMessage:err.data.error.message,
        showError:true})
      })
    } else {
      console.error("Invalid Form");
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

    const statusOption = [{ label: "active", value: "active" }, { label: "Potential", value: "potential" }, { label: "Non potential", value: "nonpotential" }]

    const phonecodeOption = [{ label: "971", value: "971" }]
    const serviceOption = [{ label: "AC-Maintenance and Installation", value: "AC-Maintenance and Installation" },
     { label: "Eletrical", value: "Eletrical" },
     { label: "Plumbing", value: "Plumbing" },
     { label: "MVP", value: "MVP" }]

    const genderOption = [{ label: "B to B", value: "B to B" }, { label: "Individual Client", value: "Individual Client" }]



    return (
      <div className="add-lead-wrapper clients">
        <div className="head">
              <h5>Contact Info</h5>
              </div>
              <div className="add-lead-form">

                <div>
               
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
                    defaultValue={this.state.phone}
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
                    defaultValue={this.state.email}
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
                    defaultValue={this.state.location}
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
                    defaultValue={this.state.source}
                    onChange={(e) => this.handleChange(e)}
                  ></input>

                </div>
                {errors.source.length > 0 && (
                  <span className="validation">{errors.source}</span>
                )}

                </div>

                </div>
                
                <div className="cancel-save add-lead-block">
                  <button onClick={(e) => this.handelEditClient(e)}>Save</button>
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
            </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
