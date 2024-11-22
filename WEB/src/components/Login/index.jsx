import React, { Component } from "react";
import { connect } from "react-redux";
import { store } from "store";
import "./style";
import _isEmpty from "lodash/isEmpty";
import queryString from "query-string";
import Loader from "components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";

import { login, destroySessionOnInvalidToken } from "services/login/actions";
import { loadState } from 'helpers/localstorage';


const mapStateToProps = (state, ownProps) => ({
  user: state.login.user,
  error: state.login.errormessage,
});

const mapDispatchToProps = (dispatch) => ({
  login: (data) => dispatch(login(data)),
});
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    }
  }
  componentDidMount = () => {
    let session = loadState()
    if (session && session.session.isAuth === true) {
      this.props.history.push("/dashboard");
    }
  }
  static getDerivedStateFromProps = (nextProps, state) => {
    let session = loadState()
    if (session && session.session.isAuth === true) {
      nextProps.history.push("/dashboard");
    }
    return null;
  };
  render = () => {
    return (
      <div className="login-page-wrapper">
        <div className="login-left">
          <div className="heading-mobile">
            <h5>Welcome to</h5>
            <h2>Eletec</h2>
          </div>
          <section>
            <div>
              <FontAwesomeIcon icon={faUser} />
              <input type="text" placeholder="Username" value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
            </div>
            <div>
              <FontAwesomeIcon icon={faKey} />
              <input type="password" placeholder="Password" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} />
            </div>
            <span className="validation">{this.props.error}</span>
            <div>
              <button
                className="login-loader"
                onClick={(e) => {
                  this.props.login({ email: this.state.email, password: this.state.password });
                }}
              >
                Login
              </button>
            </div>
          </section>
        </div>

        <div className="login-right">
          <h5>Welcome to</h5>
          <h2>Eletec</h2>
        </div>
      </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
