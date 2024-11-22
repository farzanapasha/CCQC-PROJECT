import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-responsive-modal";
import Select from 'react-select'
import Table from "components/ReactTable";
import moment from "moment"


import Loader from "components/Loader";


const mapStateToProps = (state, ownProps) => ({
  data:state.purchaseorder
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
     
    };
  }

  componentDidMount = () => {
  };

  
  render = () => {
   const columns = [
      {
        Header: "Work Order",
        accessor: "workorder_id",
        Cell: d =>
            <span>{d.row.original.workorder_idDisplay}</span>
      },
      {
        Header: "Name",
        accessor: "itemName",
      },

      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Cost",
        accessor: "cost",
      },
      {
        Header: "Tax",
        accessor: "tax",
      },
      {
        Header: "Description",
        accessor: "description",
      }, {
        Header: "Created Date",
        accessor: "datecreated",
        Cell: d =>
          <span>{moment(d.row.original.datecreated).format("MMM DD YYYY HH:mm")}</span>
      },{
        Header: "Attachments",
        accessor: "attachments",
        Cell: d =>
        <div className="eye-icon" onClick={(e)=>this.setState({attachments:d.row.original.attachments,showFiles:true})}><i class="fas fa-eye"></i><span>view files</span></div>
      },]
    
    return (
      <div className="add-lead-wrapper clients">
            <div className="add-lead-form table-100">
              <Table data={this.props.data.clientData} columns={columns} enablePagination={true}/>
            </div>
             
        <Modal
          open={this.state.showFiles}
          onClose={(e) => {
            this.setState({showFiles:false})
            }}
          center
          classNames={{
            overlay: "modal-overlay",
            modal: "modal-modal",
            closeButton: "modal-closebutton",
          }}
        >
          <div className="purchaseimage">{_.map(this.state.attachments,item=>{
            return <img src={item.filePath} alt="purchase image"></img>
          })}</div>
        </Modal>
            </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
