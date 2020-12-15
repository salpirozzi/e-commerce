import React, { useState/*, useEffect*/ } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { axios } from '../core/axios';

import AddIcon from '@material-ui/icons/Add';
import TitleIcon from '@material-ui/icons/Title';
import EuroIcon from '@material-ui/icons/Euro';
import ShowChartIcon from '@material-ui/icons/ShowChart';

import ProductViewer from './ProductViewer';

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
    const [files, uploadFile] = useState([]);

    /*const [uploadedImages, setUploadedImages] = useState([]);
    useEffect(() => {
        axios.post('/images/retrieve')
        .then(res => setUploadedImages(res.data))
        .catch(err => console.log(err.response.data));
    }, []);*/

    const addImage = (img) => {
        if(img === null)return false;

        let reader = new FileReader();
        reader.onloadend = () => {
            if(images.includes(reader.result))return toast.error("Immagine già caricata.");
            uploadImage(images => [...images, reader.result]);
        } 
        reader.readAsDataURL(img);
        uploadFile(files => [...files, img]);
    }
    const onSubmit = (values) => {
        let data = new FormData();

        files.map((x, i) => data.append(i, x));
        data.append("title", values.title);
        data.append("price", values.price);
        data.append("units", values.units);

        axios.post("/products/add", data)
            //.then(res => console.log(res.data))
            //.catch(err => toast.error(err.response.data));
    }
    const formik = useFormik({ 
        initialValues: {title: "", price: "", units: "", img: null},
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
                        accept=".png, .jpg, .jpeg"
                    />
                </div>
                {formik.errors.title && <div className="form__input__error">{formik.errors.title}</div>}

                <span>Informazioni</span>
                <div className={formik.errors.price || formik.errors.units ? "form__input__group error" : "form__input__group"}>
                    <EuroIcon />
                    <input 
                        name="price"
                        id="price"
                        type="number" 
                        placeholder="Prezzo"
                        value={formik.values.price}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        autoComplete="off"
                        accept=".png, .jpg, .jpeg"
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
                        accept=".png, .jpg, .jpeg"
                    />
                </div>
                {formik.errors.price && <div className="form__input__error">{formik.errors.price}</div>}
                {formik.errors.units && <div className="form__input__error">{formik.errors.units}</div>}

                <span>Immagini</span>
                <div>
                    Clicca sul tasto <strong>+</strong> per aggiungere l'immagine selezionata.
                </div>
                <div className={formik.errors.img ? "form__input__group error" : "form__input__group"}>
                    <button className="product__image__button" type="button" onClick={() => addImage(formik.values.img)}>
                        <AddIcon />
                    </button>
                    <label htmlFor="img">
                        {formik.values.img !== null ? formik.values.img.name : "Aggiungi un'immagine"}
                    </label>
                    <input 
                        name="img"
                        id="img"
                        type="file" 
                        placeholder="Nome prodotto"
                        onBlur={formik.handleBlur}
                        onChange={e => formik.setFieldValue("img", e.currentTarget.files[0])}
                        autoComplete="off"
                        accept=".png, .jpg, .jpeg"
                        style={{display: 'none'}}
                    />
                </div>
                {formik.errors.img && <div className="form__input__error">{formik.errors.img}</div>}

                {images.length > 0 && <ProductViewer images={images} />}

                {/*uploadedImages.length > 0 && uploadedImages.map((x, i) => {

                    let img = new Buffer(x.data.data);
                    var rawData = img.toString('base64');
                    return <img src={`data:image/jpeg;base64,${rawData}`} alt="Prodotto" key={i} />
                })*/}

                <button className="form__button" type="submit" disabled={!formik.dirty}>Pubblica</button>
            </form>
        </div>
    );
}