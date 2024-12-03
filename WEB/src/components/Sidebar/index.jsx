import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';

import './style'

const mapDispatchToProps = dispatch => ({
})

class Sidebar extends Component {
    componentWillMount = () => {
        // revoke token
    }
    state = {
        openBar: ""
    }

    handleActive = (item, location) => {
        // if(_.includes(location.href, "/solidity") && this.state.openBar!=="solidity"){
        //     this.setState({openBar:"solidity"})
        // }
        // else if(this.state.openBar==="solidity" && !_.includes(location.href, "/solidity")) {
        //     this.setState({openBar:""})
        // }
        return _.includes(location.href, item)
    }
    handleClick = (option) => {
        this.setState({
            openBar:option===this.state.openBar?"":option
        })
    }

    render = () => {
        let sidebarItems = [{name:"Home",linkTo:"/dashboard"},
        {name:"Leads",linkTo:"/leads"},
        {name:"Clients",linkTo:"/clients"},
        {name:"Members",linkTo:"/users"},
        {name:"Team",linkTo:"/team"},
        {name:"Work Order",linkTo:"/workorder"},
        {name:"Invoice",linkTo:"/invoice"},
        {name:"Payments",linkTo:"/payments"},
        // {name:"Customer Equipments",linkTo:"/equipments"},
        {name:"Demography",linkTo:"/demography"}
        ]
        return (
            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    {_.map(sidebarItems,(item,index)=>{
                        return <li key={index} >

                        <NavLink to={item.linkTo} isActive={(e) => this.handleActive(item.linkTo, location)} activeClassName="level1-active">
                            <i class="fas fa-home"></i> <span>{item.name}</span>
                        </NavLink>
                    </li>
                    })}
                </ul>
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(Sidebar)