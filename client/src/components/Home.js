import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axios } from '../core/axios';
import NumberFormat from 'react-number-format';

import { useDispatch, useSelector } from 'react-redux';
import { add } from '../reducers/chartSlice';
import { getUser } from '../reducers/userSlice';

import './css/Home.css';
import Banner from './images/Banner.jpg';

export default function Home() {
    const [quantity, setQuantity] = useState(1);
    const [products, setProducts] = useState([]);
    const user = useSelector(getUser);
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
                        let title = x.title.slice(0, 20) + "...";
                        return ( 
                            <div className="product__card" key={i}>
                                <img src={x.images[0].url} alt="Prodotto" key={i} />
                                <div className="product__card__info">
                                    <h1>
                                        <Link to={"/product/" + x._id}>{title}</Link>
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
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.currentTarget.value)}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => dispatch(
                                            add({
                                                item: x._id, 
                                                amount: parseInt(quantity),
                                                owner: user.id
                                            })
                                        )}
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