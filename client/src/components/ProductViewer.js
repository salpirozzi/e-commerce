import React, { useState } from 'react';
import './css/AddProduct.css';

export default function ProductViewer({ images }) {
    const [imgContainer, setImgContainer] = useState(null);

    return (
        <div className="product__slider">
            <div className="product__slider__images">
            {
                images.map(
                    (img, i) => 
                    <button type="button" onClick={() => setImgContainer(img)} key={i}>
                        <img src={img} alt="Foto" key={i} />
                    </button>
                )
            }
            </div>
            {imgContainer === null && <img src={images[0]} alt="Foto" />}
            {imgContainer !== null && <img src={imgContainer} alt="Foto" />}
        </div>
    )
}