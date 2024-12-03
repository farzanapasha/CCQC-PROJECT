import React from 'react';
import Loading from 'react-loading';
import './style'

const Loader = ({ type, delay }) => {
    return (
        <div className="centered">
            <Loading type={type} color='#00509e' delay={delay} />
        </div>
    )
}
export default Loader;