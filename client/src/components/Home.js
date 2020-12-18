import React, { useEffect, useState } from 'react';
import { axios } from '../core/axios';
import NumberFormat from 'react-number-format';

import { useDispatch } from 'react-redux';
import { add } from '../reducers/chartSlice';

import './css/AddProduct.css';

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
            <div className="products__sidebar">
                <img src="https://images-eu.ssl-images-amazon.com/images/G/29/EU-Customer-engagement/WelcomePageNewDesktop/1-Col-LG_PrimeBanner_IT_1500x500_UPDATE.jpg" alt="Sidebar" />
            </div>
            <div className="products__container">
                {products.length > 0 && products.map(
                    (x, i) => {
                        let img = x.images[0].data;
                        let type = x.images[0].type;
                        return ( 
                            <div className="product__card" key={i}>
                                <img src={`data:${type};base64,${img}`} alt="Prodotto" key={i} />
                                <div className="product__card__info">
                                    <h1>{x.title}</h1>
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