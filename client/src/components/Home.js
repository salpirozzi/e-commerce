import React, { useEffect, useState } from 'react';
import { axios } from '../core/axios';
import NumberFormat from 'react-number-format';
import { getPriceDiscounted } from './useful/Price';

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
            .then(res => {
                res.data.filter(x => x.discount >= 5).map(x => {
                    let start = new Date(x.discount_start).valueOf();
                    let end = new Date(x.discount_end).valueOf();
                    let today = new Date().valueOf();
                    if(today >= start && today <= end) {
                        x["discounted"] = true;
                        x["discounted_price"] = getPriceDiscounted(x.price, x.discount);                 
                    }
                    return 1;
                })
                setProducts(res.data);
            })
            .catch(err => console.log(err.response.data));
    }, []);

    return (
        <div className="products__container">
                    
            {products.length > 0 && products.map((x, i) => {
                let img = new Buffer(x.images[0].data.data);
                var rawData = img.toString('base64');
                return ( 
                    <div className="product__card" key={i}>
                        <img src={`data:image/jpeg;base64,${rawData}`} alt="Prodotto" key={i} />
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
                                {x.discounted && <React.Fragment>
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
                                </React.Fragment>}

                            </span>

                            <span>Scorte disponibili: <strong>{x.units}</strong> unità</span>
                        </div>
                        <button type="button" onClick={() => dispatch(add(x._id))}>Aggiungi al carrello</button>
                    </div>
                )
            })}
        </div>
    )
}