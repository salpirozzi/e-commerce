import React from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import './css/Slider.css';

export default function ProductViewer({ images, imgContainer, setImgContainer, deleteImage }) {
    
    return (
        <div className="product__slider">
            <div className="product__slider__images">
            {
                images.map(
                    (img, i) => {
                    return (
                        <button type="button" onMouseOver={() => setImgContainer(img)} key={i}>
                            <img src={img.url} alt="Foto" key={i} />
                        </button>
                    )}
                )
            }
            </div>
            <div className="product__slider__container">
                {deleteImage !== null && <span className="product__slider__container__remove">
                    <button type="button" onClick={() => deleteImage()}>
                        <DeleteIcon />
                    </button>
                </span>}

                <img src={imgContainer.url} alt="Foto" />
            </div>
        </div>
    )
}