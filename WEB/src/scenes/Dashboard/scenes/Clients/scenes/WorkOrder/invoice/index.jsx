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
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import Loader from "components/Loader";
import request from "helpers/request"
import apiPaths from 'apiPaths'
import numeral from 'numeral'


import { getAllPaymentByInvoice } from "services/payment/actions";


import Payment from './Payment'

// $(".button-collapse").sideNav();

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validPhoneRegex = RegExp(/\+?\d[\d -]{8,12}\d/g);

const mapStateToProps = (state, ownProps) => ({
  data: state.invoice,
  item: state.item,
  client:state.client

});

const mapDispatchToProps = (dispatch) => ({
  getAllPaymentByInvoice: (data) => dispatch(getAllPaymentByInvoice(data))
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
      activeInvoiceId: "",
      activeInvoiceIdDisplay: "",
      "status": "draft",
      subTotal:0,
      calculatedDiscount:0,
      calculatedTax:0,
      rate:0,
      tax:5,
      discount:0,
      "item": [],
      "workorder_id": "",
      "client_id": "",
      openEditInvoice: false,
      openAddInvoice: false,
      openPaymentModel: false,
      errors: {
        "name": "",
        "status": "",
        "rate": "",
        "tax": "",
        "item": [],
        "workorder_id": "",
        "client_id": "",
        "description": "",
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
  deleteInvoice = (params) => {
    request.delete(apiPaths.invoice.deleteinvoice, params)
      .then(({ data }) => {
        this.setState({
          openDeleteModal:false,
          successMessage: data.data.message,
          showSuccess: false
        })
        this.props.getAllWorkOrderByClient({ params: { id: this.props.clientId } })
        this.props.getAllInvoiceByWorkOrder({ params: { id: this.props.workOrderId } })
      }).catch(err => {
        this.setState({
          errorMessage: err.data.error.message,
          showError: true
        })
      })
  }

  DownloadInvoice = () => {
    request.get(apiPaths.invoice.downloadinvoicebuffer, { params: { id: this.state.activeInvoiceId } })
      .then(({ data }) => {
        const buffer = Buffer.from(data['data'])
        const blob = new Blob([buffer], { type: 'application/pdf' })
        saveAs(blob, 'Invoice ' + this.state.activeInvoiceIdDisplay + '-' + new Date().getTime() + '.pdf')
      }).catch(err => {
        this.setState({
          errorMessage: "something went wrong try again later",
          showError: true
        })
      })
  }

  handelAddItem = (e) => {
    let item = this.state.item
    item.push({
      "item_id": this.state.item_id,
      "id": uuidv4(),
      "quantity": this.state.quantity,
      "amount": this.state.amount
    })
    let rate =this.state.rate
    let subTotal=this.state.subTotal
    let calculatedDiscount=this.state.calculatedDiscount
    let calculatedTax=this.state.calculatedTax

    subTotal = _.sum(_.map(item,i=>{
      return i.quantity*i.amount
            }))
    calculatedDiscount=subTotal*_.sumBy(this.state.discount,'value')/100
    calculatedTax = subTotal*this.state.tax/100
    rate = subTotal+calculatedTax-calculatedDiscount

    this.setState({ item: item, ShowAddItem: false,
      subTotal:_.round(subTotal,2),
      calculatedDiscount:_.round(calculatedDiscount,2),
      calculatedTax:_.round(calculatedTax,2),
      rate:_.round(rate,2) })
  }

  deleteItem = (id) => {
    let item = _.reject(this.state.item, { id: id })
    let rate =this.state.rate
    let subTotal=this.state.subTotal
    let calculatedDiscount=this.state.calculatedDiscount
    let calculatedTax=this.state.calculatedTax

    subTotal = _.sum(_.map(item,i=>{
      return i.quantity*i.amount
            }))
    calculatedDiscount=subTotal*_.sumBy(this.state.discount,'value')/100
    calculatedTax = subTotal*this.state.tax/100
    rate = subTotal+calculatedTax-calculatedDiscount

    this.setState({ item: item, ShowAddItem: false,
      subTotal:_.round(subTotal,2),
      calculatedDiscount:_.round(calculatedDiscount,2),
      calculatedTax:_.round(calculatedTax,2),
      rate:_.round(rate,2) })

  }

  handelAddInvoice = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      console.info("Valid Form");
      let invoice = {
        "workorder_id": this.props.workOrderId,
        "client_id": this.props.clientId,
        "status": this.state.status,
        "rate": _.round(this.state.rate,2),
        "tax": _.round(this.state.tax,2),
        "discount":_.round(_.sumBy(this.state.discount,"value"),2),
        "item": this.state.item,
      }

      request.post(apiPaths.invoice.createinvoice, invoice)
        .then(({ data }) => {
          this.setState({
            successMessage: data.data.message,
            showSuccess: false,
            openAddInvoice: false
          })
          this.props.getAllWorkOrderByClient({ params: { id: this.props.clientId } })
          this.props.getAllInvoiceByWorkOrder({ params: { id: this.props.workOrderId } })
        }).catch(err => {
          this.setState({
            errorMessage: err.data.error.message,
            showError: true
          })
        })
    } else {
      this.setState({
        errorMessage: "Please enter valid form information",
        showError: true
      })
    }
  };

  handelEditInvoice = (event) => {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      console.info("Valid Form");
      let invoice = {
        "id": this.state.activeInvoiceId,
        "workorder_id": this.props.workOrderId,
        "client_id": this.props.clientId,
        "discount":_.sumBy(this.state.discount,"value"),
        "status": this.state.status,
        "rate": this.state.rate,
        "tax": this.state.tax,
        "item": this.state.item,
      }

      request.put(apiPaths.invoice.updateinvoice, invoice)
        .then(({ data }) => {
          this.setState({
            successMessage: data.data.message,
            showSuccess: false,
            openEditInvoice: false
          })
          this.props.getAllWorkOrderByClient({ params: { id: this.props.clientId } })
          this.props.getAllInvoiceByWorkOrder({ params: { id: this.props.workOrderId } })
        }).catch(err => {
          this.setState({
            errorMessage: err.data.error.message,
            showError: true
          })
        })
    } else {
      this.setState({
        errorMessage: "Please enter valid form information",
        showError: true
      })
    }
  };

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  handleSelectDiscount = (name, e) => {
    let item = this.state.item
    item = _.reject(item,i=>{
      return _.includes([
        "Discount-05%",
        "Discount-10%",
     "Discount-15%",
       "Discount-20%",
        "Discount-25%",
        "Discount BUNIYAN - 20%",
         "Discount SAAD - 30%",
        "Discount ESSAD - 30%",
        "ESAAD Member Discount",
        "Less Discount"],_.find(this.props.item.data,{value:i.item_id}).label)
    })
    _.map(e,i=>{
      item.push({
        "item_id": _.find(this.props.item.data, { label: i.label }).value,
        "id": uuidv4(),
        "quantity": 1,
        "amount": 0
      })
    })
    let subTotal=this.state.subTotal
      let calculatedDiscount=this.state.calculatedDiscount
      let calculatedTax=this.state.calculatedTax
      let rate=this.state.rate

      subTotal = _.sum(_.map(this.state.item,item=>{
 return item.quantity*item.amount
       }))
       calculatedDiscount=subTotal*_.sumBy(e,"value")/100
       calculatedTax = subTotal*this.state.tax/100
       rate = subTotal+calculatedTax-calculatedDiscount
     
    this.setState({ [name]: e,item:item ,
      subTotal:_.round(subTotal,2),
      calculatedDiscount:_.round(calculatedDiscount,2),
      calculatedTax:_.round(calculatedTax,2),
      rate:_.round(rate,2)});
  }

  handleSelectChange = (name, e) => {
    let rate =this.state.rate
    let subTotal=this.state.subTotal
    let calculatedDiscount=this.state.calculatedDiscount
    let calculatedTax=this.state.calculatedTax
    if(name==="tax"){
      subTotal = _.sum(_.map(this.state.item,item=>{
        return item.quantity*item.amount
              }))
      calculatedDiscount=subTotal*_.sumBy(this.state.discount,"value")/100
      calculatedTax = subTotal*e.value/100
      rate = subTotal+calculatedTax-calculatedDiscount
    }
    this.setState({ [name]: e.value,
      subTotal:_.round(subTotal,2),
      calculatedDiscount:_.round(calculatedDiscount,2),
      calculatedTax:_.round(calculatedTax,2),
      rate:_.round(rate,2)});
  }

  render = () => {
    let errors = this.state.errors;
    let discountsList = [
      "Discount-05%",
      "Discount-10%",
   "Discount-15%",
     "Discount-20%",
      "Discount-25%",
      "Discount BUNIYAN - 20%",
       "Discount SAAD - 30%",
      "Discount ESSAD - 30%",
      "ESAAD Member Discount",
    "Less Discount"]

    let discountOption = [ {
      "label": "Discount-05%",
      "value": 5
    },
    {
      "label": "Discount-10%",
      "value": 10
    },
    {
      "label": "Discount-15%",
      "value": 15
    },
    {
      "label": "Discount-20%",
      "value": 20
    },
    {
      "label": "Discount-25%",
      "value": 25
    },
    {
      "label": "Discount BUNIYAN - 20%",
      "value": 20
    },
    {
      "label": "Discount SAAD - 30%",
      "value": 30
    },
    {
      "label": "Discount ESSAD - 30%",
      "value": 30
    },{
      "label": "ESAAD Member Discount",
      "value": 10
    }, {
      "label": "Less Discount",
      "value": 5
    },]
    const columns = [
      {
        Header: "Invoice Id",
        accessor: "id",
        Cell: d =>
          <span className="first-name-td" onClick={(e) => {

            let item = _.map(d.row.original.items, i => {
              return {
                id: uuidv4(),
                "item_id": i.itemId,
                "quantity": i.itemQuantity,
                "amount": i.itemAmount
              }
            })
            let subTotal =_.sum(_.map(item,i=>{
              return i.quantity*i.amount
                    }))
            let calculatedDiscount=subTotal* _.toNumber(d.row.original.discount)/100
            let calculatedTax = subTotal* _.toNumber(d.row.original.tax)/100

            this.setState({
              activeInvoiceId: d.row.original.id,
              "status": d.row.original.status,
              isStatusDisabled:d.row.original.status==='paid'?true:false,
              "rate": d.row.original.rate,
              "tax": _.toNumber(d.row.original.tax),
              "discount": _.compact(_.map(item,i=>{
                if(_.includes(discountsList,_.find(this.props.item.data,{value:i.item_id}).label)){
return _.find(discountOption,{label:_.find(this.props.item.data,{value:i.item_id}).label})
                }
                else{
                  return null
                }
              })),
              "item": item,
              openEditInvoice: true,
              openAddInvoice: false,
              subTotal :subTotal,
              calculatedDiscount:calculatedDiscount,
              calculatedTax : calculatedTax,

            })
          }}>{d.row.original.idDisplay}</span>
      },
      {
        Header: "Created On",
        accessor: "createdon",
        Cell: d =>
        <span>{moment(d.row.original.createdon).format("MMM DD YYYY hh:mm A")}</span>
      },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter,
      },

      {
        Header: "Workorder Id",
        accessor: "workorder_id",
        disableFilters: true,
        Cell: d =>
          <span>{d.row.original.workorder_idDisplay}</span>
      },
      {
        Header: "Payment",
        accessor: "paymentIds",
        disableFilters: true,
        Cell: d =>
          <div
            onClick={(e) => {
              this.setState({ openPaymentModel: true,
                 activeInvoiceId: d.row.original.id,
                  activeInvoiceIdDisplay: d.row.original.idDisplay,
                 })
              this.props.getAllPaymentByInvoice({
                params: { id: d.row.original.id },
              });
            }}
          >
            {d.row.original.paymentIds.length <= 0 ? (
              <div className="schedule-color">
                <i className="fas fa-history"></i>
                <span>create payment</span>
              </div>
            ):<label className="schedule-color">{d.row.original.paymentIds[0].idDisplay}</label>}
          </div>
      },
      {
        Header: "Rate",
        accessor: "rate",
        disableFilters: true,
        Cell:d=><span>{"AED "+numeral(d.row.original.rate).format('0,0.00')}</span>
      },
      {
        Header: "Tax",
        accessor: "tax",
        disableFilters: true,
        Cell:d=><span>{d.row.original.tax}%</span>
      },
      {
        Header: "Discount",
        accessor: "discount",
        disableFilters: true,
        Cell:d=><span>{d.row.original.discount}%</span>
      },
      {
        Header: "Paid",
        accessor: "paiedAmount",
        disableFilters: true,
        Cell:d=><span>{"AED "+numeral(d.row.original.paiedAmount).format('0,0.00')}</span>
      },
      {
        Header: "Pending Amount",
        accessor: "pendingAmount",
        disableFilters: true,
        Cell:d=><span>{"AED "+numeral(d.row.original.pendingAmount).format('0,0.00')}</span>

      },
      {
        Header: "Edit",
        accessor: "edit",
        disableFilters: true,
        Cell: d =>
          <div> <i class="fas fa-edit" onClick={(e) => {

            let item = _.map(d.row.original.items, i => {
              return {
                id: uuidv4(),
                "item_id": i.itemId,
                "quantity": i.itemQuantity,
                "amount": i.itemAmount
              }
            })
            let subTotal =_.sum(_.map(item,i=>{
              return i.quantity*i.amount
                    }))
            let calculatedDiscount=subTotal* _.toNumber(d.row.original.discount)/100
            let calculatedTax = subTotal* _.toNumber(d.row.original.tax)/100
            this.setState({
              activeInvoiceId: d.row.original.id,
              "status": d.row.original.status,
              isStatusDisabled:d.row.original.status==='paid'?true:false,
              "rate": d.row.original.rate,
              "tax":  _.toNumber(d.row.original.tax),
              "discount": _.compact(_.map(item,i=>{
                if(_.includes(discountsList,_.find(this.props.item.data,{value:i.item_id}).label)){
return _.find(discountOption,{label:_.find(this.props.item.data,{value:i.item_id}).label})
                }
                else{
                  return null
                }
              })),
              "item": item,
              openEditInvoice: true,
              openAddInvoice: false,
              subTotal :subTotal,
              calculatedDiscount:calculatedDiscount,
              calculatedTax : calculatedTax,

            })
          }}></i></div>
      },
      {
        Header: "Delete",
        accessor: "delete",
        disableFilters: true,
        Cell: d =>
          <div> <i class="fas fa-trash-alt" onClick={(e) => this.setState({
            activeInvoiceId: d.row.original.id,
            activeInvoiceIdDisplay: d.row.original.idDisplay,
            openDeleteModal: true
          })}></i></div>
      },
      {
        Header: "Download",
        accessor: "download",
        disableFilters: true,
        Cell: d =>
          <div> <i className="fas fa-download" onClick={(e) => this.setState({
            activeInvoiceId: d.row.original.id,
            activeInvoiceIdDisplay: d.row.original.idDisplay
          }, () => {
            this.DownloadInvoice()
          })}></i></div>
      }
    ];
    let itemColumns = [
      {
        Header: "Item",
        accessor: "item_id",
        disableFilters: true,
        Cell: d =>
          <span>{_.find(this.props.item.data, { value: d.row.original.item_id }).label}</span>
      }, {
        Header: "Quantity",
        accessor: "quantity",
        disableFilters: true
      }, {
        Header: "Amount",
        accessor: "amount",
        disableFilters: true,
        Cell:d=><span>{"AED "+numeral(d.row.original.amount).format('0,0.00')}</span>
      },
      {
        Header: "sub Total",
        accessor: "sub Total",
        disableFilters: true,
        Cell:d=><span>{"AED "+numeral((d.row.original.amount*d.row.original.quantity)).format('0,0.00')}</span>
      },
      {
        Header: "Tax",
        accessor: "Tax",
        disableFilters: true,
        Cell:d=><span>{"AED "+numeral(((d.row.original.amount*d.row.original.quantity)*this.state.tax/100)).format('0,0.00')}</span>
      },
      {
        Header: "Grand Total",
        accessor: "Grand Total",
        disableFilters: true,
        Cell:d=><span>{"AED "+numeral((((d.amount*d.quantity)*this.state.tax/100)+(d.row.original.amount*d.row.original.quantity))).format('0,0.00')}</span>
      },

       {
        Header: "Delete",
        accessor: "delete_item",
        disableFilters: true,
        Cell: d =>
          <div> {!_.includes(discountsList,_.find(this.props.item.data, { value: d.row.original.item_id }).label)&&<i class="fas fa-trash-alt" onClick={(e) => this.deleteItem(d.row.original.id)}></i>}</div>
      }]
    const statusOption = [{ label: "Draft", value: "draft" },
    { label: "UnPaid", value: "unpaid" },
    { label: "Partialy Paid", value: "partialy paid" },
    { label: "Paid", value: "paid" }]
    let taxOption = [{ label: "5%", value: 5 },
    { label: "10%", value: 10 }]
   
    if (!this.state.openPaymentModel) {
      return (
        <div>
          {<div><button onClick={(e) => this.setState({
            openAddInvoice: true, openEditInvoice: false,item:[],
            tax:5,discount:[],rate:0,subTotal:0,calculatedDiscount:0,calculatedTax:0
          })}>Create new Invoice</button> <span>{"Active work order " + this.props.workOrderIdDisplay} </span> <i class="fas fa-times" onClick={(e) => {
            this.props.closeInvoiceModal()
          }}></i></div>}
          {(!this.state.openAddInvoice && !this.state.openEditInvoice) && <div className="white-bg lead-page-content table-container">
            {this.props.data.workData.length > 0 && <Table data={this.props.data.workData} columns={columns} enablePagination={true} />}
          </div>}

          {(this.state.openAddInvoice) &&
            <div className="add-lead-wrapper">
              <div className="head">
                <h5>Create Invoice</h5>
                <i class="fas fa-times" onClick={(e) => {
                  this.setState({ openAddInvoice: false })
                }}></i>
              </div>
              <div className="add-lead-form">

                <div>
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

                </div>
                <div>
                <div className="invoice-name">
                  <span>Name: {_.find(this.props.client.data,item=>{
      return item.id==this.props.clientId
    }).name}</span>  
                </div>
                <div className="invoice-name">
                    <span>Location: {_.find(this.props.client.data,item=>{
      return item.id==this.props.clientId
    }).location}</span>
                    </div>
              </div>
              </div>

              <div>
                <button onClick={(e) => this.setState({ ShowAddItem: true })}>Add item</button>
              </div>

              {this.state.item.length > 0 && <div>
                <Table data={this.state.item} columns={itemColumns}
                  enablePagination={false} />
              </div>}

              <div className="total-amount-splitted">
                <div >
                  <div>
                    <label>Tax:</label>
                    <Select
                      className="select-box"
                      name="tax"
                      value={_.find(taxOption, { value: this.state.tax })}
                      onChange={(e) => this.handleSelectChange("tax", e)}
                      options={taxOption}
                    />
                  </div>
                  <div >
                    <label>Discount:</label>
                    <Select
                      className="select-box"
                      name="discount"
                      isMulti
                      value={this.state.discount }
                      onChange={(e) => this.handleSelectDiscount("discount", e)}
                      options={discountOption}
                    />
                  </div>
                </div>
                <ul>
                  <li>
                    <span>Subtotal</span>
                    <span>{"AED " + numeral(this.state.subTotal).format('0,0.00')}</span>
                  </li>
                  <li>
                      <span>Discount</span>
                      <span>{"AED " + numeral(this.state.calculatedDiscount).format('0,0.00')}</span>
                    </li>
                  <li>
                    <span>Tax</span>
                    <span>{"AED " + numeral(this.state.calculatedTax).format('0,0.00')}</span>
                  </li>

                  <li>
                    <span>Total</span>
                    <span>{"AED " + numeral(this.state.rate).format('0,0.00')}</span>
                  </li>
                </ul>
              </div>

              <div className="cancel-save add-lead-block">
                <button onClick={(e) => this.setState({ openAddInvoice: false })}>Cancel</button>
                <button onClick={(e) => this.handelAddInvoice(e)}>Save</button>
              </div>

            </div>}

          {(this.state.openEditInvoice) &&
            <div className="add-lead-wrapper">
              <div className="head">
                <h5>Edit Invoice</h5>
                <i class="fas fa-times" onClick={(e) => {
                  this.setState({ openEditInvoice: false })
                }}></i>
              </div>
              <div className="add-lead-form">
                <div>
                  <div className="add-lead-block">
                    <label>Status:</label>
                    <Select
                      className="select-box"
                      name="status"
                      isDisabled={this.state.isStatusDisabled}
                      value={_.find(statusOption, { value: this.state.status })}
                      onChange={(e) => this.handleSelectChange("status", e)}
                      options={statusOption}
                    />
                  </div>
                  {errors.status.length > 0 && (
                    <span className="validation">{errors.status}</span>
                  )}

                </div>
                <div>
                <div className="invoice-name">
                  <span>Name: {_.find(this.props.client.data,item=>{
      return item.id==this.props.clientId
    }).name}</span>  
                </div>
                <div className="invoice-name">
                    <span>Location: {_.find(this.props.client.data,item=>{
      return item.id==this.props.clientId
    }).location}</span>
                    </div>
              </div>
              </div>

              <div>
                <button disabled={this.state.isStatusDisabled} onClick={(e) => this.setState({ ShowAddItem: true })}>Add item</button>
              </div>

              {this.state.item.length > 0 && <div>
                <Table data={this.state.item} columns={itemColumns}
                  enablePagination={false} />
              </div>}
              <div className="total-amount-splitted">
                <div >
                  <div>
                    <label>Tax:</label>
                    <Select
                      className="select-box"
                      name="tax"
                      value={_.find(taxOption, { value: this.state.tax })}
                      onChange={(e) => this.handleSelectChange("tax", e)}
                      options={taxOption}
                    />
                  </div>
                  <div >
                    <label>Discount:</label>
                    <Select
                      className="select-box"
                      name="discount"
                      isMulti
                      value={this.state.discount }
                      onChange={(e) => this.handleSelectDiscount("discount", e)}
                      options={discountOption}
                    />
                  </div>
                </div>
                <ul>
                  <li>
                    <span>Subtotal</span>
                    <span>{"AED " + numeral(this.state.subTotal).format('0,0.00')}</span>
                  </li>
                  <li>
                      <span>Discount</span>
                      <span>{"AED " + numeral(this.state.calculatedDiscount).format('0,0.00')}</span>
                    </li>
                  <li>
                    <span>Tax</span>
                    <span>{"AED " + numeral(this.state.calculatedTax).format('0,0.00')}</span>
                  </li>

                  <li>
                    <span>Total</span>
                    <span>{"AED " + numeral(this.state.rate).format('0,0.00')}</span>
                  </li>
                </ul>
              </div>

              <div className="cancel-save add-lead-block">
                <button onClick={(e) => this.setState({ openEditInvoice: false })}>Cancel</button>
                <button disabled={this.state.isStatusDisabled} onClick={(e) => this.handelEditInvoice(e)}>Save</button>
              </div>
            </div>}

          <Modal
            open={this.state.ShowAddItem}
            onClose={(e) => this.setState({ ShowAddItem: false })}
            center
            classNames={{
              overlay: "modal-overlay",
              modal: "modal-modal",
              closeButton: "modal-closebutton",
            }}
          >
            <div className="add-lead-form d-block">
                <div className="add-lead-block w-100">
                  <label>Item:</label>
                  <Select
                    className="select-box"
                    name="item_id"
                    value={_.find(this.props.item.data, { value: this.state.item_id })}
                    onChange={(e) => this.handleSelectChange("item_id", e)}
                    options={_.filter(this.props.item.data,item=>{
                      return !_.includes(discountsList,item.label)
                    })}
                  />
                </div>

              <div className="add-lead-block">
                <label>Quantity:</label>
                <input
                className="d-block quantity-border"
                  type="number"
                  min="0"
                  placeholder="Quantity"
                  name="quantity"
                  onChange={(e) => this.handleChange(e)}
                ></input>

              </div>
              <div className="add-lead-block ">
                <label>Amount:</label>
                <input
                className="d-block quantity-border"
                  type="number"
                  min="0"
                  placeholder="Amount"
                  name="amount"
                  onChange={(e) => this.handleChange(e)}
                ></input>

              </div>
            </div>

            <div className="cancel-save add-lead-block">
              <button onClick={(e) => this.handelAddItem(e)}>Add</button>
            </div>


          </Modal>

          <Modal
            open={this.state.showSuccess}
            onClose={(e) => this.setState({ showSuccess: false, openDeleteModal: false, activeInvoiceId: "" })}
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
            onClose={(e) => this.setState({ showError: false, openDeleteModal: false, activeInvoiceId: "" })}
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
            onClose={(e) => this.setState({ openDeleteModal: false, activeInvoiceId: "" })}
            center
            classNames={{
              overlay: "modal-overlay",
              modal: "modal-modal",
              closeButton: "modal-closebutton",
            }}
          >
            <div className="delete-modal">
              <div className="row"><span>{"Are you sure want to delete " + this.state.activeInvoiceIdDisplay + " ?"}</span></div>
              <div className="row"> <button onClick={(e) => {
                this.deleteInvoice({ params: { id: this.state.activeInvoiceId } })
              }}>yes</button> <button onClick={(e) => this.setState({ openDeleteModal: false, activeInvoiceId: "" })}>No</button></div>
            </div>
          </Modal>
        </div>
      );
    }
    else {
      return (<Payment clientId={this.props.clientId}
        invoiceId={this.state.activeInvoiceId}
        workOrderId={this.props.workOrderId}
        invoiceIdDisplay={this.state.activeInvoiceIdDisplay}
        getAllPaymentByInvoice={this.props.getAllPaymentByInvoice}
        closePaymentModal={(e) => this.setState({ openPaymentModel: false })}
        getAllInvoiceByWorkOrder={this.props.getAllInvoiceByWorkOrder} 
        paid={_.find(this.props.data.workData,{id:this.state.activeInvoiceId}).paiedAmount}
        pending={_.find(this.props.data.workData,{id:this.state.activeInvoiceId}).pendingAmount}/>)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
