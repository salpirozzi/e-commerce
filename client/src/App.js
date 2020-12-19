import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import AddProduct from './components/AddProduct';
import Home from './components/Home';

import { useSelector, useDispatch } from 'react-redux';
import { getUser, update, logout } from './reducers/userSlice';
import { PublicRoute, UserRoute } from './components/routers-rules';

import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
    const user = useSelector(getUser);
    const dispatch = useDispatch();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let token = localStorage.token;
        async function checkUser() {
            if(token && user === null)
            { 
                const decoded = jwt_decode(token);
                const id = decoded.id;
                const current_time = Date.now() / 1000; 

                if(decoded.exp < current_time) return dispatch(logout());
                await dispatch(update(id));
            }
            setLoaded(true);
        }
        checkUser();
    }, [user, dispatch]);

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
                {loaded === true && <Switch>
                    <Route exact path="/" component={Home} />
                    <PublicRoute exact path='/login' component={Login} />
                    <PublicRoute exact path='/register' component={Register} />
                    <UserRoute exact path='/add' component={AddProduct} />
                </Switch>}
            </div>
        </Router>
    );
} 