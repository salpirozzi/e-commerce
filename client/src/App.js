import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import AddProduct from './components/AddProduct';

import { useSelector, useDispatch } from 'react-redux';
import { getUser, update, logout } from './reducers/userSlice';
import { PublicRoute } from './components/routers-rules';

import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
    const data = useSelector(getUser);
    const dispatch = useDispatch();

    useEffect(() => {
        let token = localStorage.token;
        if(token && data.user === null)
        {
            let decoded = jwt_decode(token);
            const id = decoded.id;
            const current_time = Date.now() / 1000; 

            if(decoded.exp < current_time) return dispatch(logout());
            dispatch(update(id));
        }
    }, [data, dispatch]);

    return (
        <Router>
            <div className="App">
                <ToastContainer
                    position="bottom-center"
                    autoClose={3000}
                    newestOnTop={true}
                    draggable={true}
                />
                <Header />
                <AddProduct />
                <Switch>
                    <PublicRoute exact path='/login' component={Login} />
                    <PublicRoute exact path='/register' component={Register} />
                </Switch>
            </div>
        </Router>
    );
} 