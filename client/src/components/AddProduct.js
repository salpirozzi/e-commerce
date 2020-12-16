import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { axios } from '../core/axios';

import TitleIcon from '@material-ui/icons/Title';
import EuroIcon from '@material-ui/icons/Euro';
import ShowChartIcon from '@material-ui/icons/ShowChart';

import ProductViewer from './ProductViewer';

import NumberFormat from 'react-number-format';

import './css/Form.css';
import './css/AddProduct.css';

import { toast } from 'react-toastify';

const FILE_SIZE = '200000'; //200 KB - unità di misura: BYTE
const SUPPORTED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];

const ProductSchema = yup.object().shape({
    title: yup.string()
        .required("Inserisci un nome prodotto.")
        .min(5, "Il titolo dev'essere lungo almeno 5 caratteri."),
    img: yup.mixed() 
        .required("Inserisci una foto.")
        .test('fileSize', "File troppo grande. (max 200 kb)", value => value.size <= FILE_SIZE) 
        .test('fileType', "Estensione non supportata. (.png .jpg .jpeg)", value => SUPPORTED_FORMATS.includes(value.type))
});

export default function AddProduct() {

    const [images, uploadImage] = useState([]);
    const [imgContainer, setImgContainer] = useState();
    const history = useHistory();

    const deleteImage = () => {
        let index = images.indexOf(imgContainer);
        images.splice(index, 1);
        let next = (index === images.length) ? index - 1 : index;
        setImgContainer(images[next]);
        if(!images.length) formik.setFieldValue("img", null);
    }
    const addImage = (img) => {
        if(img === null)return false;

        let reader = new FileReader();
        reader.onloadend = () => {
            const obj = {
                url: reader.result, 
                file: img
            };
            if(images.some(x => x.url === obj.url))return toast.error("Immagine già caricata.");
            uploadImage(images => [...images, obj]);
            formik.setFieldValue("img", img);
        } 
        reader.readAsDataURL(img);
    }
    const onSubmit = (values) => {
        let data = new FormData();

        images.map((x, i) => data.append(i, x.file));
        data.append("title", values.title);
        data.append("price", values.price);
        data.append("units", values.units);

        axios.post("/products/add", data)
            .then(() => {
                toast.info("Prodotto pubblicato!");
                history.push('/');
                formik.resetForm({});
            })
            .catch(err => toast.error(err.response.data));
    }
    const formik = useFormik({ 
        initialValues: {title: "", price: 0, units: 1, img: null},
        validationSchema: ProductSchema,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: values => onSubmit(values)
    });

    return (
        <div className="form__container">
            <h1>Aggiungi prodotto</h1>
            <form onSubmit={formik.handleSubmit}>

                <span>Nome</span>
                <div className={formik.errors.title ? "form__input__group error" : "form__input__group"}>
                    <TitleIcon />
                    <input 
                        name="title"
                        id="title"
                        type="text" 
                        placeholder="Nome prodotto"
                        value={formik.values.title}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        autoComplete="off"
                    />
                </div>
                {formik.errors.title && <div className="form__input__error">{formik.errors.title}</div>}

                <span>Informazioni</span>
                <div className={formik.errors.price || formik.errors.units ? "form__input__group error" : "form__input__group"}>
                    <EuroIcon />
                    <NumberFormat 
                        value={formik.values.price} 
                        allowLeadingZeros={true} 
                        allowNegative={false} 
                        decimalScale={2}
                        fixedDecimalScale={true}
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        displayType={'input'}
                        isNumericString={true}
                        allowEmptyFormatting={true}
                    />
                    <ShowChartIcon />
                    <input 
                        name="units"
                        id="units"
                        type="number" 
                        placeholder="Unità disponibili"
                        value={formik.values.units}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        autoComplete="off"
                        min={1}
                    />
                </div>
                {formik.errors.price && <div className="form__input__error">{formik.errors.price}</div>}
                {formik.errors.units && <div className="form__input__error">{formik.errors.units}</div>}

                <span>Immagini</span>
                <div className={formik.errors.img ? "form__input__group error" : "form__input__group"}>
                    <label htmlFor="img">
                        {formik.values.img !== null ? formik.values.img.name : "Aggiungi un'immagine"}
                    </label>
                    <input 
                        name="img"
                        id="img"
                        type="file" 
                        placeholder="Nome prodotto"
                        onBlur={formik.handleBlur}
                        onChange={e => addImage(e.currentTarget.files[0])}
                        autoComplete="off"
                        accept=".png, .jpg, .jpeg"
                        style={{display: 'none'}}
                    />
                </div>
                {formik.errors.img && <div className="form__input__error">{formik.errors.img}</div>}

                {images.length > 0 && <ProductViewer images={images} imgContainer={imgContainer || images[0]} setImgContainer={setImgContainer} deleteImage={deleteImage} />}

                <button className="form__button" type="submit" disabled={!formik.dirty || formik.isSubmitting}>Pubblica</button>
            </form>
        </div>
    );
}