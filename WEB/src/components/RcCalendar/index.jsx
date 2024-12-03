import React, { Component } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./style";

 
class MyApp extends Component {
  
 
  render() {
    return (
        <Calendar
        className={"home-calendar"}
          onChange={this.props.onChange}
          value={this.props.date}
          selectRange
        />
    );
  }
}
export default MyApp