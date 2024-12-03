import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import './style'
import { destroySession } from 'services/login/actions';

const mapDispatchToProps = dispatch => ({
    destroySession: () => dispatch(destroySession()),
})

class Logout extends Component {
    componentWillMount = () => {
        this.props.destroySession()
    }
    render = () => {
        return (
            <div className="logout-main">
                <div className="logout">
                    <div className="col-md-6 text-center">
                        <h1>Sign In to portal</h1>
                        <p>This workspace requires you to sign in with your Account.</p>
                        <div class="btn-group">
                            <button type="button" className="btn btn-blue"><i class="fas fa-sign-in-alt"></i></button>
                            <Link to={"/"}  className="btn btn-primary">Sign In</Link>
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}

export default connect(null, mapDispatchToProps)(Logout)