import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MenuIcon from '@material-ui/icons/Menu';

import { useSelector, useDispatch } from 'react-redux';
import { getUser, logout } from '../reducers/userSlice';

import { toast } from 'react-toastify';

import './css/Header.css';

export default function Header() {
    const data = useSelector(getUser);
    const dispatch = useDispatch();
    const history = useHistory();
    const [dropdown, showDropdown] = useState(false);

    const exit = () => {
        if(data.user === null)return false;
        
        dispatch(logout());
        history.push("/login");
        toast.info("Logout effettuato!");
    }

    return (
        <div className="header">
            <div className="header__left">
                <MenuIcon />
                <Link to="/">
                    <img src="https://upload.wikimedia.org/wikipedia/donate/thumb/f/fd/Amazon-logo-white.svg/1200px-Amazon-logo-white.svg.png" alt="Logo" />
                </Link>
            </div>
            <div className="header__center">
                <input type="text" placeholder="Cerca il tuo prodotto..." />
                <SearchIcon />
            </div>
            <div className="header__right">
                <div className="header__right__item">
                    <span className="header__right__item__top">Benvenuto</span>
                    <Link className="header__right__item__bottom" to="/login">
                        <AccountCircleIcon /> {data.user !== null ? data.user.firstname : "Utente"}
                    </Link>
                </div>
                <div className="header__right__item" onMouseLeave={() => showDropdown(false)}>
                    <span className="header__right__item__top chart">0</span>
                    <Link className="header__right__item__bottom" to="/chart" onMouseOver={() => showDropdown(true)}>
                        <ShoppingCartIcon />
                    </Link>
                    {dropdown === true && <span className="header__item__dropdown left">
                        <ul>
                            <li><Link to="/add">I tuoi prodotti</Link></li>
                        </ul>
                    </span>}
                </div>
                <button className="header__right__button" onClick={() => exit()}> 
                    <ExitToAppIcon /> 
                </button>
            </div>
        </div>
    );
}