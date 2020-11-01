import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'

import { paths } from '../config/constants'
import { getConnectedUser, getJwt } from '../helpers/userdata'
export let isAuthenticated = true;

export default function RouterWrapper({
    component: Component,
    isPrivate,
    ...rest
}) {
    isAuthenticated = getConnectedUser() && getJwt();
    //console.log("isAuthenticated : "+isAuthenticated)
    //Route is private and user is not logged in
    if (isPrivate && !isAuthenticated) {
        return <Redirect to={paths.LOGIN} />
    }
    //Route is private and user is logged in
    if (!isPrivate && isAuthenticated) {
        return <Redirect to={paths.DASHBOARD} />
    }

    return <Route {...rest} component={Component} />;


}
RouterWrapper.prototype = {
    isPrivate: PropTypes.bool,
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired
};

RouterWrapper.defaultProps = {
    isPrivate: false
};