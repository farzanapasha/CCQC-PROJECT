import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import Select from "react-select";
import "./style";
import Table from "components/ReactTable";
import Modal from "react-responsive-modal";
import request from "helpers/request";
import apiPaths from "apiPaths";
import moment from "moment"


import Loader from "components/Loader";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validPhoneRegex = RegExp(/\+?\d[\d -]{8,12}\d/g);

const mapStateToProps = (state, ownProps) => ({
  data: state.workorder,
  workorderstatus: state.workorderstatus,
  client: state.client
});

const mapDispatchToProps = (dispatch) => ({});

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
    console.log("workkkkkloc",props.client.data,props.clientId)
    this.state = {
      data: [],
      openAddWorkOrder: false,
      successMessage: "",
      showSuccess: false,
      description: "",
      location: _.get(_.find(props.client.data,item=>item.id==props.clientId),"location",""),
      status_id: 1,
      type: "",
      errors: {
        description: "",
        location: "",
        status_id: "",
        type: "",
      },
    };
  }

  componentDidMount = () => {};

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

  deleteWorkorder = (params) => {
    request
      .delete(apiPaths.workorder.deleteworkorder, params)
      .then(({ data }) => {
        this.setState({ successMessage: data.data.message, 
          openDeleteModal:false,
          showSuccess: false });
        this.props.getAllWorkOrderByClient({
          params: { id: this.props.clientId },
        });
      })
      .catch((err) => {
        this.setState({
          errorMessage: err.data.error.message,
          showError: true,
        });
      });
  };

  handelAddWorkOrder = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      console.info("Valid Form");
      let workorder = {
        client_id: this.props.clientId,
        description: this.state.description,
        location: this.state.location,
        status_id: this.state.status_id,
        type: this.state.type,
      };
      request
        .post(apiPaths.workorder.createworkorder, workorder)
        .then(({ data }) => {
          this.setState({
            successMessage: data.data.message,
            showSuccess: false,
            openAddWorkOrder: false
          });
          this.props.getAllWorkOrderByClient({
            params: { id: this.props.clientId },
          });
        })
        .catch((err) => {
          this.setState({
            errorMessage: err.data.error.message,
            showError: true,
          });
        });
    } else {
      this.setState({
        errorMessage: "Please enter valid form information",
        showError: true,
      });
    }
  };

  handelEditWorkOrder = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      console.info("Valid Form");
      let workorder = {
        id: this.state.activeWorkorderId,
        client_id: this.props.clientId,
        description: this.state.description,
        location: this.state.location,
        status_id: this.state.status_id,
        type: this.state.type,
      };
      request
        .put(apiPaths.workorder.updateworkorder, workorder)
        .then(({ data }) => {
          this.setState({
            successMessage: data.data.message,
            showSuccess: false,
            openEditWorkOrder: false
          });
          this.props.getAllWorkOrderByClient({
            params: { id: this.props.clientId },
          });
        })
        .catch((err) => {
          this.setState({
            errorMessage: err.data.error.message,
            showError: true,
          });
        });
    } else {
      this.setState({
        errorMessage: "Please enter valid form information",
        showError: true,
      });
    }
  };

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };
  handleSelectChange = (name, e) => {
    this.setState({ [name]: e.value });
  };

  render = () => {
    let errors = this.state.errors;
    let data = this.props.data.clientData;
    const typeOption = [
      { label: "type1", value: "type1" },
      { label: "type2", value: "type2" },
    ];

    const columns = [
      {
        Header: "Work Order id",
        accessor: "workOrderIdDisplay",
        Cell: d =>
            <span className="first-name-td" onClick={(e) =>
              this.setState({
                activeWorkorderId: d.row.original.workOrderId,
                description: d.row.original.description,
                location: d.row.original.location,
                status_id: d.row.original.status_id,
                type: d.row.original.type,
                openEditWorkOrder: true,
              })
            }>{d.row.original.workOrderIdDisplay}</span>
      },
      {
        Header: "Created On",
        accessor: "createdon",
        Cell: d =>
        <span>{moment(d.row.original.createdon).format("MMM DD YYYY hh:mm A")}</span>
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Status",
        accessor: "statusName",
        Filter: SelectColumnFilter,
      },
      {
        Header: "Schedule",
        accessor: "schedule",
        disableFilters: true,
        Cell: (d) => (
          <div
            onClick={(e) => {
              this.props.openScheduleModel(d.row.original.workOrderId,d.row.original.workOrderIdDisplay);
              this.props.getAllScheduleByWorkOrder({
                params: { id: d.row.original.workOrderId },
              });
            }}
          >
            {d.row.original.schedule.length <= 0 ? (
              <div className="schedule-color">
                <i className="fas fa-history"></i>
                <span>create schedule</span>
              </div>
            ):<label className="schedule-color">{d.row.original.schedule[0].teamName}</label>}
          </div>
        ),
      },
      {
        Header: "Create Invoice",
        accessor: "create invoice",
        disableFilters: true,
        Cell: (d) => (
          <div
            onClick={(e) => {
              this.props.openInvoiceModel(d.row.original.workOrderId,d.row.original.workOrderIdDisplay);
              this.props.getAllInvoiceByWorkOrder({
                params: { id: d.row.original.workOrderId },
              });
            }}
          >
            {d.row.original.invoice.length <= 0 ? (
              <div className="schedule-color">
                <i className="fas fa-history"></i>
                <span>create Invoice</span>
              </div>
            ):<label className="schedule-color">{d.row.original.invoice[0].invoice_idDisplay}</label>}
          </div>
        ),
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Edit",
        accessor: "edit",
        disableFilters: true,
        Cell: (d) => (
          <div>
            {" "}
            <i
              class="fas fa-edit"
              onClick={(e) =>
                this.setState({
                  activeWorkorderId: d.row.original.workOrderId,
                  description: d.row.original.description,
                  location: d.row.original.location,
                  status_id: d.row.original.status_id,
                  type: d.row.original.type,
                  openEditWorkOrder: true,
                })
              }
            ></i>
          </div>
        ),
      },
      {
        Header: "Delete",
        accessor: "delete",
        disableFilters: true,
        Cell: (d) => (
          <div>
            {" "}
            <i
              class="fas fa-trash-alt"
              onClick={(e) =>
                this.setState({
                  activeWorkorderId: d.row.original.workOrderId,
                  activeWorkorderIdDisplay:d.row.original.workOrderIdDisplay,
                  openDeleteModal: true,
                })
              }
            ></i>
          </div>
        ),
      },
    ];
    return (
      <div>
        <div className="create-work-order">
          <button onClick={(e) => this.setState({ openAddWorkOrder: true })}>
            Create Workorder
          </button>
        </div>
        {!this.state.openAddWorkOrder && !this.state.openEditWorkOrder && (
          <div className="white-bg lead-page-content table-container mt-0">
            {this.props.data.isClientLoaded ? (
              <Table data={data} columns={columns} enablePagination={true} />
            ) : (
              <Loader type={"spinningBubbles"} />
            )}
          </div>
        )}

        {/* {this.state.openAddWorkOrder && (
          <div className="add-lead-wrapper">
            <div className="head">
              <h5>Create Workorder</h5>
              <i
                class="fas fa-times"
                onClick={(e) => {
                  this.setState({ openAddWorkOrder: false });
                }}
              ></i>
            </div>
            <div className="add-lead-form">
              <div>
                <div className="add-lead-block">
                  <label>Type:</label>
                  <Select
                    className="select-box"
                    name="type"
                    value={_.find(typeOption, { value: this.state.type })}
                    onChange={(e) => this.handleSelectChange("type", e)}
                    options={typeOption}
                  />
                </div>

                <div className="add-lead-block">
                  <label>Description:</label>
                  <input
                    placeholder="Description"
                    name="description"
                    onChange={(e) => this.handleChange(e)}
                  ></input>
                </div>
                {errors.description.length > 0 && (
                  <span className="validation">{errors.description}</span>
                )}
              </div>

              <div>
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
                    name="status_id"
                    value={_.find(this.props.workorderstatus.data, {
                      value: this.state.status_id,
                    })}
                    onChange={(e) => this.handleSelectChange("status_id", e)}
                    options={this.props.workorderstatus.data}
                  />
                </div>

                {errors.status_id.length > 0 && (
                  <span className="validation">{errors.status_id}</span>
                )}
              </div>
              
            </div>

            <div className="cancel-save add-lead-block">
              <button
                onClick={(e) => this.setState({ openAddWorkOrder: false })}
              >
                Cancel
              </button>
              <button onClick={(e) => this.handelAddWorkOrder(e)}>Save</button>
            </div>
          </div>
        )} */}

        {this.state.openEditWorkOrder && (
          <div className="add-lead-wrapper">
            <div className="head">
              <h5>Edit Workorder</h5>
              <i
                class="fas fa-times"
                onClick={(e) => {
                  this.setState({ openEditWorkOrder: false });
                }}
              ></i>
            </div>
            <div className="add-lead-form">

              <div>
              <div className="add-lead-block">
                <label>Status:</label>
                <Select
                  className="select-box"
                  name="status_id"
                  value={_.find(this.props.workorderstatus.data, {
                    value: this.state.status_id,
                  })}
                  onChange={(e) => this.handleSelectChange("status_id", e)}
                  options={this.props.workorderstatus.data}
                />
              </div>
              {/* <div className="add-lead-block">
                <label>Type:</label>
                <Select
                  className="select-box"
                  name="type"
                  value={_.find(typeOption, { value: this.state.type })}
                  onChange={(e) => this.handleSelectChange("type", e)}
                  options={typeOption}
                />
              </div>

              
              <div className="add-lead-block">
                <label>Description:</label>
                <input
                  placeholder="Description"
                  name="description"
                  defaultValue={this.state.description}
                  onChange={(e) => this.handleChange(e)}
                ></input>
              </div> */}
             
</div>
<div>
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
       </div>     
            </div>

            <div className="cancel-save add-lead-block">
              <button
                onClick={(e) => this.setState({ openEditWorkOrder: false })}
              >
                Cancel
              </button>
              <button onClick={(e) => this.handelEditWorkOrder(e)}>Save</button>
            </div>
          </div>
        )}

        <Modal
          open={this.state.showSuccess}
          onClose={(e) =>
            this.setState({ showSuccess: false, openDeleteModal: false })
          }
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="success-message">
            <span>{this.state.successMessage}</span>
          </div>
        </Modal>
        <Modal
          open={this.state.showError}
          onClose={(e) =>
            this.setState({ showError: false, openDeleteModal: false })
          }
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="error-message">
            <span>{this.state.errorMessage}</span>
          </div>
        </Modal>
        <Modal
          open={this.state.openDeleteModal}
          onClose={(e) =>
            this.setState({ openDeleteModal: false, activeWorkorderId: "" })
          }
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="delete-modal">
            <div className="row">
              <span>
                {"Are you sure want to delete " +
                  this.state.activeWorkorderIdDisplay +
                  " ?"}
              </span>
            </div>
            <div className="row">
              {" "}
              <button
                onClick={(e) => {
                  this.deleteWorkorder({
                    params: { id: this.state.activeWorkorderId },
                  });
                }}
              >
                yes
              </button>{" "}
              <button
                onClick={(e) =>
                  this.setState({
                    openDeleteModal: false,
                    activeWorkorderId: "",
                  })
                }
              >
                No
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          open={this.state.openAddWorkOrder}
          onClose={(e) =>
            this.setState({ openAddWorkOrder: false})
          }
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="delete-modal">
            <div className="row">
              <span>
                {"Are you sure want to create Work Order?"}
              </span>
            </div>
            <div className="row">
              {" "}
              <button
                onClick={(e) => this.handelAddWorkOrder(e)}
              >
                yes
              </button>{" "}
              <button
                onClick={(e) => this.setState({ openAddWorkOrder: false })}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
