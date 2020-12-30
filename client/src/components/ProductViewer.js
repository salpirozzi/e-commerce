import React, { useState } from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import './css/Slider.css';

export default function ProductViewer({ images, imgContainer, setImgContainer, deleteImage }) {

    const [bgPosition, setBgPosition] = useState('0% 0%');
    const zoomImage = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = (e.pageX - left) / width * 100;
        const y = (e.pageY - top) / height * 100;
        setBgPosition(`${x}% ${y}%`);
    }

    return (
        <div className="product__slider">
            <div className="product__slider__images">
            {
                images.map(
                    (img, i) => 
                        <button type="button" onMouseOver={() => setImgContainer(img)} key={i}>
                            <img src={img.url} alt="Foto" key={i} />
                        </button>
                )
            }
            </div>
            <div className="product__slider__container">
                {deleteImage !== null && 
                    <span className="product__slider__container__remove">
                        <button type="button" onClick={() => deleteImage()}>
                            <DeleteIcon />
                        </button>
                    </span>
                }
                <figure className="product__slider__figure" onMouseMove={(e) => zoomImage(e)} style={{'backgroundImage': `url(${imgContainer.url})`, 'backgroundPosition': bgPosition}}>
                    <img src={imgContainer.url} alt="Immagine" />
                </figure>
            </div>
        </div>
    )
}