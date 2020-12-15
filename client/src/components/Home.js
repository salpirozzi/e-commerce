import React, { useEffect, useState } from 'react';
import { axios } from '../core/axios';

import './css/AddProduct.css';

export default function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.post('/products/retrieve')
        .then(res => setProducts(res.data))
        .catch(err => console.log(err.response.data));
    }, []);

    return (
        <div className="products__container">
            {products.length > 0 && products.map((x, i) => {
                let img = new Buffer(x.images[0].data.data);
                var rawData = img.toString('base64');
                return ( 
                    <div className="product__card">
                        <img src={`data:image/jpeg;base64,${rawData}`} alt="Prodotto" key={i} />
                        <div className="product__card__info">
                            <h1>{x.title}</h1>
                            <span>Venduto da: <strong>{x.owner.firstname} {x.owner.lastname}</strong></span>
                            <span>Prezzo di vendita: <strong>{x.price}</strong></span>
                            <span>Scorte disponibili: <strong>{x.units}</strong></span>
                        </div>
                        <button type="button">Aggiungi al carrello</button>
                    </div>
                )
            })}
        </div>
    )
}