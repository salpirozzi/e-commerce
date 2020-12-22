import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { axios } from '../core/axios';
import { useDispatch, useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';

import { add, getItems } from '../reducers/chartSlice';
import ProductViewer from './ProductViewer';
import { categoryList } from './useful/Categories';

import './css/Product.css';

export default function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [imgContainer, setImgContainer] = useState();
    const dispatch = useDispatch();
    const items = useSelector(getItems);
    const hasItem = (id) => items.findIndex(x => x.item === id);

    const date_options = {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };

    useEffect(() => {
        axios.post('/products/get', {id: id})
            .then(res => setProduct(res.data))
            .catch(err => console.log(err.response.data));
    }, [id])

    return (
        <div className="product__container">
            {product !== null && 
                <React.Fragment>
                    <div className="product__gallery">
                        <ProductViewer images={product.images} imgContainer={imgContainer || product.images[0]} setImgContainer={setImgContainer} deleteImage={null} />
                    </div>
                    <div className="product__column">
                        <h3>{product.title}</h3>
                        <span className="product__column__details">
                            <p>Prodotto di <strong>{product.owner.firstname} {product.owner.lastname}</strong></p>
                            <p>Pubblicato nella categoria <strong>{categoryList[product.category]}</strong></p>
                        </span>
                        <div className="product__column__separator" />
                        <span>
                            Prezzo:
                            <span className={product.discounted ? "product__card__price strike" : "product__card__price strong"}>
                                <NumberFormat 
                                    value={product.price} 
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
                            {product.discounted && 
                                <React.Fragment>
                                    <span className="product__card__price strong">
                                        <NumberFormat 
                                            value={product.discounted_price} 
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
                                        Scontato fino a <strong>{new Date(product.discount_end).toLocaleDateString('it', date_options)}</strong>.
                                    </div>
                                </React.Fragment>
                            }
                        </span>
                        <div className="product__container__button">
                            <select 
                                type="number"
                                min={1}
                                placeholder="Q.tà"
                                onChange={(e) => setQuantity(e.currentTarget.value)}
                                disabled={hasItem(product._id) !== -1}
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                            </select>
                            <button 
                                type="button" 
                                onClick={() => dispatch(
                                    add({
                                        item: product._id, 
                                        amount: parseInt(quantity)
                                    })
                                )}
                                disabled={hasItem(product._id) !== -1}
                            >
                                Aggiungi al carrello
                            </button>
                        </div>
                    </div>
                </React.Fragment>
            }
        </div>
    )
}