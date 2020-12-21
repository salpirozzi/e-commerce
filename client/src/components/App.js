import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import Header from './Header';
import Login from './Login';
import Register from './Register';
import AddProduct from './AddProduct';
import Home from './Home';
import Product from './Product';

import { useSelector, useDispatch } from 'react-redux';
import { getUser, update, logout } from '../reducers/userSlice';
import { PublicRoute, UserRoute } from './routers-rules';

import './css/App.css';

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

                if(decoded.exp < current_time) return await dispatch(logout());
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
                {loaded === true && 
                    <React.Fragment>
                        <Header />
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/product/:id" component={Product} />
                            <PublicRoute exact path='/login' component={Login} />
                            <PublicRoute exact path='/register' component={Register} />
                            <UserRoute exact path='/add' component={AddProduct} />
                        </Switch>
                    </React.Fragment>
                }
            </div>
        </Router>
    );
} 