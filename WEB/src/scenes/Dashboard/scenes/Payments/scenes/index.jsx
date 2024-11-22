import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-responsive-modal";
import Select from 'react-select'
import Table from "components/ReactTable";
import DatePicker from 'react-datepicker';
import moment from "moment"
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import numeral from 'numeral'
import { Link } from 'react-router-dom';


import {
    faArrowDown,
    faArrowUp,
    faPlus,
    faSearch,
  } from "@fortawesome/fontawesome-free-solid";



import Loader from "components/Loader";
import request from "helpers/request"
import apiPaths from 'apiPaths'

// $(".button-collapse").sideNav();

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validPhoneRegex = RegExp(/\+?\d[\d -]{8,12}\d/g);

const mapStateToProps = (state, ownProps) => ({
  data: state.payment,
  invoice: state.invoice,
  client: state.client,
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
      activePaymentId:"",
        "status":"",
        "amount":"",
        "recive_date":moment().toDate(),
        "memo":"",
        "invoice_id":"",
        "client_id":"",
        "paymode":"cash",
      openEditPayment: false,
      openAddPayment: false,
      errors: {
        "status":"",
        "amount":"",
        "memo":"",
        "invoice_id":"",
        "client_id":"",
        "paymode":"",
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
      recive_date: date,
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
  deletePayment = (params)=>{
    request.delete(apiPaths.invoice.deleteinvoice,params)
    .then(({ data }) => {
      this.setState({successMessage:data.data.message,
      showSuccess:false})
      this.props.getAllWorkOrder()
      this.props.getAllPayment()
    }).catch(err=>{
      this.setState({errorMessage:err.data.error.message,
      showError:true})
    })
  }

  handelAddPayment = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      console.info("Valid Form");
      let payment = {
        "invoice_id": this.state.invoice_id,
        "client_id": this.state.client_id,
        "amount":this.state.amount,
        "memo":this.state.memo,
        "paymode":this.state.paymode,
        "recive_date": moment(this.state.recive_date).format("YYYY-MM-DD HH:mm:ss")
            }

      request.post(apiPaths.payment.createpayment,payment)
      .then(({ data }) => {
        this.setState({successMessage:data.data.message,
        showSuccess:false,
        openAddPayment: false})
        this.props.getAllInvoice()
        this.props.getAllPayment()
      }).catch(err=>{
        this.setState({errorMessage:err.data.error.message,
          showError:true})
      })
    } else {
      this.setState({errorMessage:"Please enter valid form information",
      showError:true})
    }
  };

  handelEditPayment = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      console.info("Valid Form");
      let payment = {
        "id":this.state.activePaymentId,
          "invoice_id": this.state.invoice_id,
          "client_id": this.state.client_id,
          "amount":this.state.amount,
          "memo":this.state.memo,
          "paymode":this.state.paymode,
          "recive_date":moment(this.state.recive_date).format("YYYY-MM-DD HH:mm:ss")
      }

      request.put(apiPaths.payment.updatepayment,payment)
      .then(({ data }) => {
        this.setState({successMessage:data.data.message,
        showSuccess:false,
        openEditPayment: false})
        this.props.getAllInvoice()
        this.props.getAllPayment()
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
        Header: "Payment Id",
        accessor: "id",
        Cell: d =>
        <Link 
                to={{
                  pathname: '/clients',
                  state: {
                    item: d.row.original,
                    from:"payment"
                  }
                }} >
                  {d.row.original.idDisplay}
                  </Link>
        // <div><span className="first-name-td" onClick={(e) => {
        //       this.setState({
        //       activePaymentId: d.id,
        //       "status":d.status,
        //       "amount":d.amount,
        //       "recive_date":moment(d.recive_date).toDate(),
        //       "type":d.type,
        //       "invoice_id":d.invoice_id,
        //       "client_id":d.client_id,
        //       "paymode":d.paymode,
        //       openEditPayment: true,
        //       openAddPayment: false
  
        //     })}}>{ d.idDisplay}</span></div>
      },
      {
        Header: "Invoice Id",
        accessor: "invoice_id",
        Cell: d =>
            <span>{d.row.original.invoice_idDisplay}</span>
      },
      {
        Header: "Pay Mode",
        accessor: "paymode",
        disableFilters: true,
      },
      {
        Header: "Memo",
        accessor: "memo",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell:d=><span>{"AED "+numeral(d.row.original.amount).format('0,0.00')}</span>
      },
      {
        Header: "Received On",
        accessor:"recive_date",
        Cell: d =>
          <span>{moment(d.row.original.recive_date).format("MMM DD YYYY hh:mm A")}</span>
      }, 
      // {
      //   Header: "Edit",
      //   id: "edit",
      //   disableFilters: true,
      //   accessor: d =>
      //     <div><i class="fas fa-edit" onClick={(e) => {
      //       this.setState({
      //       activePaymentId: d.id,
      //       "status":d.status,
      //       "amount":d.amount,
      //       "recive_date":moment(d.recive_date).toDate(),
      //       "type":d.type,
      //       "invoice_id":d.invoice_id,
      //       "client_id":d.client_id,
      //       "paymode":d.paymode,
      //       openEditPayment: true,
      //       openAddPayment: false

      //       })}}></i></div>
      // },
      // {
      //   Header: "Delete",
      //   id: "delete",
      //   disableFilters: true,
      //   accessor: d =>
      //     <div> <i class="fas fa-trash-alt" onClick={(e) => this.setState({
      //       activePaymentId: d.id,
      //       activePaymentIdDisplay:d.idDisplay,
      //       openDeleteModal: true
      //     })}></i></div>
      // }
    ];

let InvoiceOption =_.map(_.filter(this.props.invoice.data,{client_id:this.state.client_id}),item=>{
    return { label: item.idDisplay, value: item.id }
    
})
let ClientOption = _.map(this.props.client.data,item=>{
    return { label: item.name, value: item.id }
    
})
const paymodeOption = [{ label: "Cash", value: "cash" },{ label: "Check", value: "check" },{ label: "Credit card", value: "credit card" },{ label: "Other", value: "other" }]

    return (
        <div className="lead-page-wrapper main">
        <div className="heading-blue-wrapper">
          <div className="blue-bg">
            <h4>Payment</h4>
            <div></div>
          </div>

          {!this.state.openAddPayment && <div className="tool-component d-none">

            <div>
              <button onClick={(e) => this.setState({ openAddPayment: true,openEditPayment: false
 })}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Create Payment</span>
              </button>
            </div>

          </div>}

        </div>
      <div className="main-space">
        {(!this.state.openAddPayment && !this.state.openEditPayment)&& <div className="white-bg lead-page-content table-container">
          {<Table data={this.props.data.data} columns={columns} enablePagination={true}/>}
        </div>}

        {(this.state.openAddPayment) &&
          <div className="add-lead-wrapper">
            <div className="head">
            <h5>Create Payment</h5>
            <i class="fas fa-times" onClick={(e) => {
          this.setState({openAddPayment:false})
        }}></i>
        </div>
            <div className="add-lead-form">

<div>
            <div className="add-lead-block">
                <label>Client:</label>
                <Select
                  className="select-box"
                  name="client_id"
                  value={_.find(ClientOption, { value: this.state.client_id })}
                  onChange={(e) => this.handleSelectChange("client_id", e)}
                  options={ClientOption}
                />
              </div>
              {this.state.client_id!==""&&

              <div className="add-lead-block">
                <label>Invoice:</label>
                <Select
                  className="select-box"
                  name="invoice_id"
                  value={_.find(InvoiceOption, { value: this.state.invoice_id })}
                  onChange={(e) => this.handleSelectChange("invoice_id", e)}
                  options={InvoiceOption}
                />
              </div>}
              <div className="add-lead-block">
                <label>Amount:</label>
                <input
                  placeholder="Amount"
                  name="amount"
                  onChange={(e) => this.handleChange(e)}
                ></input>

              </div>
              <div className="add-lead-block">
                <label>Paymode:</label>
                <Select
                  className="select-box"
                  name="paymode"
                  value={_.find(paymodeOption, { value: this.state.paymode })}
                  onChange={(e) => this.handleSelectChange("paymode", e)}
                  options={paymodeOption}
                />

              </div>
             </div>
             
             <div>
              <div className="add-lead-block">
                <label>memo:</label>
                <input
                  placeholder="memo"
                  name="memo"
                  onChange={(e) => this.handleChange(e)}
                ></input>

              </div>
              <div className="add-lead-block">
                <label>Received Date:</label>
                <DatePicker
                  selected={this.state.recive_date}
                  onChange={date => this.handleToDate(date)}
                  showTimeSelect
                  dateFormat="dd-MM-yyyy hh:mm:ss"
                />
              </div>
             </div>
              </div>


              <div className="cancel-save add-lead-block">
                <button onClick={(e) => this.setState({ openAddPayment: false })}>Cancel</button>
                <button onClick={(e) => this.handelAddPayment(e)}>Save</button>
              </div>
           
          </div>}

          {(this.state.openEditPayment) &&
          <div className="add-lead-wrapper">
            <div className="head">
            <h5>Edit Payment</h5>
            <i class="fas fa-times" onClick={(e) => {
          this.setState({openEditPayment:false})
        }}></i>
        </div>
            <div className="add-lead-form">

            {/* <div className="add-lead-block">
                <label>Client:</label>
                <Select
                  className="select-box"
                  name="client_id"
                  value={_.find(ClientOption, { value: this.state.client_id })}
                  onChange={(e) => this.handleSelectChange("client_id", e)}
                  options={ClientOption}
                />
              </div>
            <div className="add-lead-block">
                <label>Invoice:</label>
                <Select
                  className="select-box"
                  name="invoice_id"
                  value={_.find(InvoiceOption, { value: this.state.invoice_id })}
                  onChange={(e) => this.handleSelectChange("invoice_id", e)}
                  options={InvoiceOption}
                />
              </div> */}

              <div>
              <div className="add-lead-block">
                <label>Amount:</label>
                <input
                  placeholder="Amount"
                  name="amount"
                  onChange={(e) => this.handleChange(e)}
                ></input>

              </div>
              <div className="add-lead-block">
                <label>Paymode:</label>
                <Select
                  className="select-box"
                  name="paymode"
                  value={_.find(paymodeOption, { value: this.state.paymode })}
                  onChange={(e) => this.handleSelectChange("paymode", e)}
                  options={paymodeOption}
                />

              </div>
              <div className="add-lead-block">
                <label>memo:</label>
                <input
                  placeholder="memo"
                  name="memo"
                  onChange={(e) => this.handleChange(e)}
                ></input>

              </div>
              </div>
              
              <div>
              <div className="add-lead-block">
                <label>Received Date:</label>
                <DatePicker
                  selected={this.state.recive_date}
                  onChange={date => this.handleToDate(date)}
                  showTimeSelect
                  dateFormat="dd-MM-yyyy hh:mm:ss"
                />
              </div>
             </div>
             
              </div>

              <div className="cancel-save add-lead-block">
                <button onClick={(e) => this.setState({ openEditPayment: false })}>Cancel</button>
                <button onClick={(e) => this.handelEditPayment(e)}>Save</button>
              </div>
            
          </div>}

          <Modal
          open={this.state.showSuccess}
          onClose={(e) => this.setState({showSuccess:false,openDeleteModal:false,activePaymentId:""}) }
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
          onClose={(e) =>this.setState({showError:false,openDeleteModal:false,activePaymentId:""})}
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
          onClose={(e) => this.setState({openDeleteModal:false,activePaymentId:""})}
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="delete-modal">
            <div className="row"><span>{"Are you sure want to delete schedule"+this.state.activePaymentId+" ?"}</span></div>
            <div className="row"> <button onClick={(e)=>{
              this.deletePayment({params:{id:this.state.activePaymentId}})}}>yes</button> <button onClick={(e) => this.setState({openDeleteModal:false,activePaymentId:""})}>No</button></div>
            </div>
        </Modal>
      </div>
      </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);