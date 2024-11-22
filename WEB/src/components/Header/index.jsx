import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Logo from "../../../images/logo-trans.png";
import "./style";

import { loadState } from 'helpers/localstorage';


const mapStateToProps = (state, ownProps) => ({
  user:state.login
});

const mapDispatchToProps = (dispatch) => ({});

class Header extends Component {
  state = {
    profileClicked: false,
  };

  handleProfileClick = () => {
    if (!this.state.profileClicked) {
      document.addEventListener("click", this.handleProfileOutsideClick, false);
    } else {
      document.removeEventListener(
        "click",
        this.handleProfileOutsideClick,
        false
      );
    }

    this.setState((prevState) => ({
      profileClicked: !prevState.profileClicked,
    }));
  };

  handleProfileOutsideClick = (e) => {
    if (this.profile && this.profile.contains(e.target)) {
      return;
    }
    this.handleProfileClick();
  };

  render = () => {
    let session = loadState()
    return (
      <header>
        <div className="header-left">
          <Link to="/" className="company-name">
            LOGO
          </Link>
          <i
            className="fas fa-bars"
            data-toggle="collapse"
            data-target="#wrapper"
            aria-expanded="false"
            aria-controls="#wrapper"
          >
            {" "}
          </i>
        </div>
        <div
          className="profile"
          ref={(profile) => {
            this.profile = profile;
          }}
          onClick={(e) => this.handleProfileClick()}
        >
          <div className="profile-img">
            
          </div>
          <div className="profile-name">
            <span className="d-block">{session.session.user.name}</span>
          </div>
          <div className="dropdown">
            <button className="dropbtn">
              <i className="fa fa-caret-down"></i>
            </button>
            {this.state.profileClicked && (
              <div className="dropdown-content">
                <Link to="/dashboard">Home</Link>
                <Link to="/admin">Password</Link>
                <Link to="/logout">Logout</Link>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
