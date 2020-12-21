import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axios } from '../core/axios';
import NumberFormat from 'react-number-format';

import { useDispatch } from 'react-redux';
import { add } from '../reducers/chartSlice';

import './css/Home.css';
import Banner from './images/Banner.jpg';

export default function Home() {
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();
    const date_options = {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };

    useEffect(() => {
        axios.post('/products/retrieve')
            .then(res => setProducts(res.data))
            .catch(err => console.log(err.response.data));
    }, []);

    return (
        <React.Fragment>
            <div className="home__background">
                <img src={Banner} alt="Sidebar" />
            </div>
            <div className="products__container">
                {products.length > 0 && products.map(
                    (x, i) => {
                        return ( 
                            <div className="product__card" key={i}>
                                <img src={x.images[0].url} alt="Prodotto" key={i} />
                                <div className="product__card__info">
                                    <h1>
                                        <Link to={"/product/" + x._id}>{x.title}</Link>
                                    </h1>
                                    <span>Venduto da: <strong>{x.owner.firstname} {x.owner.lastname}</strong></span>
                                    <span>
                                        Prezzo:
                                        <span className={x.discounted ? "product__card__price strike" : "product__card__price strong"}>
                                            <NumberFormat 
                                                value={x.price} 
                                                displayType={'text'} 
                                                allowLeadingZeros={true} 
                                                allowNegative={false} 
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                renderText={value => <span>{value} €</span>}
                                            />
                                        </span>
                                        {x.discounted && 
                                            <React.Fragment>
                                                <span className="product__card__price strong">
                                                    <NumberFormat 
                                                        value={x.discounted_price} 
                                                        displayType={'text'} 
                                                        allowLeadingZeros={true} 
                                                        allowNegative={false} 
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                        thousandSeparator={'.'}
                                                        decimalSeparator={','}
                                                        renderText={value => <span>{value} €</span>}
                                                    />
                                                </span>
                                                <div className="product__card__discount">
                                                    Scontato fino a <strong>{new Date(x.discount_end).toLocaleDateString('it', date_options)}</strong>.
                                                </div>
                                            </React.Fragment>
                                        }
                                    </span>

                                    <span>Scorte disponibili: <strong>{x.units}</strong> unità</span>
                                </div>
                                <div className="product__card__button__container">
                                    <input 
                                        type="number"
                                        min={1}
                                        placeholder="Q.tà"
                                        className="product__card__quantity"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => dispatch(add(x._id))}
                                    >
                                        Aggiungi al carrello
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </React.Fragment>
    )
}