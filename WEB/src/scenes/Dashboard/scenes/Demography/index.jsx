import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import Calendar from "react-calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/fontawesome-free-solid";
import "./style";
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

import Loader from "components/Loader";
import request from "./../../../../helpers/request"

// $(".button-collapse").sideNav();

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

class Home extends Component {
  state = {
    location: []
  };
  componentDidMount = () => {
    request.get("/api/getallteamlocation")
      .then(({ data }) => {
        this.setState({location: data.data})
      }).catch(err=>{
        
      })
  };

  render = () => {

const position = [25.2048, 55.2708]
return (
  <div className="home-design-wrapper">
    <div className="map-wrapper">
   <div className="map-container">
  <Map center={position} zoom={10} attributionControl={false}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      // url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    {_.map(this.state.location,item=>{
      return (<Marker position={[item.latitude,item.longitude]}>
        <Popup>{item.name}</Popup>
      </Marker>)
    })}
  </Map>
  </div>
  </div>
  </div>
)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
