import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUser } from '../../reducers/userSlice';

export const PublicRoute = ({ component: Component, ...rest }) => {
    const data = useSelector(getUser);
    
    if(data.user !== null)return (<Redirect to="/" />);
    
    return (<Route {...rest} render={props => <Component {...props} />} />); 
}

export const UserRoute = ({ component: Component, ...rest }) => {
    const data = useSelector(getUser);

    if(data.user === null)return (<Redirect to="/" />);
    
    return (<Route {...rest} render={props => <Component {...props} />} />); 
}