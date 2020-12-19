import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { axios } from '../core/axios';

import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MenuIcon from '@material-ui/icons/Menu';

import { useSelector, useDispatch } from 'react-redux';
import { getUser, logout } from '../reducers/userSlice';
import { getCount } from '../reducers/chartSlice';

import { toast } from 'react-toastify';

import './css/Header.css';
import Logo from './images/Logo.png';

export default function Header() {
    const user = useSelector(getUser);
    const chart = useSelector(getCount);
    const dispatch = useDispatch();
    const history = useHistory();
    
    const [dropdown, showDropdown] = useState(false);
    const [foundedProducts, setFoundedProducts] = useState([]);

    const exit = () => {
        if(user === null)return false;
        
        dispatch(logout());
        history.push("/login");
        toast.info("Logout effettuato!");
    }

    const search = (value) => {
        if(value.length < 3)return setFoundedProducts([]);

        axios.post("/products/search", {
            name: value
        })
        .then(res => setFoundedProducts(res.data))
        .catch(err => toast.error(err.response.data));
    }

    return (
        
        <div className="header">
            <div className="header__left">
                <MenuIcon />
                <Link to="/">
                    <img src={Logo} alt="Logo" />
                </Link>
            </div>
            <div className="header__center">
                <input 
                    type="text" 
                    placeholder="Cerca il tuo prodotto..."
                    onChange={(e) => search(e.currentTarget.value)}
                    onMouseOver={(e) => search(e.currentTarget.value)}
                />
                {foundedProducts.length > 0 && 
                    <div className="header__input__list" onMouseLeave={() => setFoundedProducts([])}>
                        <ul>
                            {foundedProducts.map(
                                (x, i) => 
                                <li key={i}>
                                    <Link to={`/product/${x._id}`} key={i}>
                                        {x.title}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                }
                <SearchIcon />
            </div>
            <div className="header__right">
                <div className="header__right__item">
                    <span className="header__right__item__top">
                        Benvenuto
                    </span>
                    <Link className="header__right__item__bottom" to="/login">
                        <AccountCircleIcon /> {user !== null ? user.firstname : "Utente"}
                    </Link>
                </div>
                <div className="header__right__item" onMouseLeave={() => showDropdown(false)}>
                    <span className="header__right__item__top chart">
                        {chart}
                    </span>
                    <Link className="header__right__item__bottom" to="/chart" onMouseOver={() => showDropdown(true)}>
                        <ShoppingCartIcon />
                    </Link>
                    {dropdown === true && 
                        <div className="header__item__dropdown">
                            <span className="header__item__dropdown__content">
                                <ul>
                                    <li>
                                        <Link to="/add">Vendi prodotto</Link>
                                    </li>
                                </ul>
                            </span>
                        </div>
                    }
                </div>
                <button className="header__right__button" onClick={() => exit()}> 
                    <ExitToAppIcon /> 
                </button>
            </div>
        </div>
    );
}