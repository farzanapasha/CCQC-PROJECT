import React, { Component } from 'react';
import { connect } from 'react-redux';
import "./style";
import DatePicker from 'react-datepicker';



const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = dispatch => ({

});

class CustomInput extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <i onClick={this.props.onClick} aria-hidden="true" className="fa fa-calendar"></i>
        <input onClick={this.props.onClick} className="dateInput" value={this.props.value} type="text" />
      </div>
    )
  }
}

class DateRange extends Component {


  componentWillMount = () => {

  }

  componentWillReceiveProps = (nextProps) => {
  }



  render = () => {
    return (
      <div className="col-12 ">
        <div className="row Speed-date">
          <div className="col-sm-12 col-md-12 col-lg-4" >
            <div className='date-container'>
              <DatePicker
                customInput={<CustomInput />}
                selected={this.props.FromDate}
                dateFormat="dd-MM-yyyy"
                selectsStart
                startDate={this.props.FromDate}
                endDate={this.props.ToDate}
                onChange={this.props.handleFromDate}
                className='date'
              />
            </div>
          </div>
          <label>To</label>
          <div className="col-sm-12 col-md-12 col-lg-4" >
            <div className='date-container'>
              <DatePicker
                customInput={<CustomInput />}
                selected={this.props.ToDate}
                dateFormat="dd-MM-yyyy"
                selectsEnd
                onChange={this.props.handleToDate}
                startDate={this.props.FromDate}
                endDate={this.props.ToDate}
                className='date'
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateRange);
